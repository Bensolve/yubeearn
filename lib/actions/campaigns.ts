'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Task } from '@/types';

// ============================================
// FETCH REAL YOUTUBE DURATION (no API key!)
// Uses oEmbed + duration parsing
// ============================================
async function fetchYouTubeDuration(youtubeId: string): Promise<number> {
  try {
    // Fetch the YouTube page and extract duration from meta tags
    const res = await fetch(`https://www.youtube.com/watch?v=${youtubeId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = await res.text();

    // Extract duration from YouTube page meta (format: PT#M#S or PT#S)
    const match = html.match(/"lengthSeconds":"(\d+)"/);
    if (match) {
      const seconds = parseInt(match[1]);
      const minutes = Math.ceil(seconds / 60);
      console.log('[Campaigns] Video duration:', minutes, 'minutes');
      return minutes;
    }

    // Fallback: 5 minutes
    return 5;
  } catch (error) {
    console.error('[Campaigns] Duration fetch error:', error);
    return 5; // Default 5 min if fetch fails
  }
}

// ============================================
// CREATE CAMPAIGN + DEDUCT CREATOR BALANCE
// ============================================
export async function createCampaignAction(
  creatorId: string,
  videoUrl: string,
  youtubeId: string,
  videoTitle: string,
  rewardAmount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Check duplicate
    const existing = await getDocs(
      query(
        collection(db, 'campaigns'),
        where('youtubeId', '==', youtubeId),
        where('creatorId', '==', creatorId)
      )
    );
    if (!existing.empty) {
      return { success: false, error: 'You already have a campaign for this video' };
    }

    // 2. Check creator balance
    const userDoc = await getDoc(doc(db, 'users', creatorId));
    if (!userDoc.exists()) return { success: false, error: 'User not found' };
    const balance = userDoc.data().balance || 0;
    if (balance < rewardAmount) {
      return { success: false, error: `Insufficient balance. You have GHS ${balance} but need GHS ${rewardAmount}` };
    }

    // 3. ✅ Fetch REAL video duration
    const videoDuration = await fetchYouTubeDuration(youtubeId);

    const userEarning = Math.round(rewardAmount * 0.85);
    const platformCommission = Math.round(rewardAmount * 0.15);

    // 4. Save campaign with real duration
    await addDoc(collection(db, 'campaigns'), {
      creatorId,
      videoUrl,
      youtubeId,
      videoTitle,
      videoDuration, // ✅ Real duration in minutes
      rewardAmount,
      userEarning,
      platformCommission,
      status: 'active',
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      totalCompletions: 0,
      totalSpent: 0,
    });

    // 5. Deduct balance from creator
    await updateDoc(doc(db, 'users', creatorId), {
      balance: increment(-rewardAmount),
    });

    // 6. Revalidate pages so data updates immediately
    revalidatePath('/dashboard/creator');
    revalidatePath('/dashboard/earner/tasks');

    console.log('[Campaigns] Created campaign, duration:', videoDuration, 'min, deducted GHS', rewardAmount);
    return { success: true };
  } catch (error) {
    console.error('[Campaigns] Create error:', error);
    return { success: false, error: 'Failed to create campaign' };
  }
}

// ============================================
// COMPLETE TASK — earner claims reward
// ============================================
export async function completeTaskAction(
  userId: string,
  campaignId: string,
  reward: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Check not already completed
    const completionQuery = await getDocs(
      query(
        collection(db, 'completions'),
        where('userId', '==', userId),
        where('campaignId', '==', campaignId)
      )
    );
    if (!completionQuery.empty) {
      return { success: false, error: 'You already completed this task' };
    }

    // 2. Get campaign
    const campaignDoc = await getDoc(doc(db, 'campaigns', campaignId));
    if (!campaignDoc.exists()) return { success: false, error: 'Campaign not found' };
    const campaign = campaignDoc.data();

    const earnerReward = campaign.userEarning || reward;
    const platformFee = campaign.platformCommission || Math.round(reward * 0.15);
    const creatorCost = campaign.rewardAmount || reward;

    // 3. Save completion record
    await addDoc(collection(db, 'completions'), {
      userId,
      campaignId,
      creatorId: campaign.creatorId,
      userEarning: earnerReward,
      platformCommission: platformFee,
      creatorSpent: creatorCost,
      completedAt: Timestamp.now(),
      status: 'completed',
    });

    // 4. Update earner balance + history
    await updateDoc(doc(db, 'users', userId), {
      balance: increment(earnerReward),
      totalEarned: increment(earnerReward),
      completedTasks: arrayUnion(campaignId),
      earningsHistory: arrayUnion({
        id: `${campaignId}-${Date.now()}`,
        taskTitle: campaign.videoTitle,
        amount: earnerReward,
        date: new Date().toISOString(),
        status: 'completed',
      }),
    });

    // 5. Update campaign stats
    await updateDoc(doc(db, 'campaigns', campaignId), {
      totalCompletions: increment(1),
      totalSpent: increment(creatorCost),
    });

    // 6. Save transaction record
    await addDoc(collection(db, 'transactions'), {
      userId,
      amount: earnerReward,
      type: 'task_completion',
      direction: 'in',
      description: `Earned: ${campaign.videoTitle}`,
      campaignId,
      status: 'completed',
      createdAt: Timestamp.now(),
    });

    revalidatePath('/dashboard/earner');
    revalidatePath('/dashboard/earner/tasks');

    console.log('[Tasks] Completed task, earned GHS', earnerReward);
    return { success: true };
  } catch (error) {
    console.error('[Tasks] Complete error:', error);
    return { success: false, error: 'Failed to claim reward' };
  }
}

// ============================================
// GET ACTIVE CAMPAIGNS — earner task list
// ============================================
export async function getActiveCampaignsAction(): Promise<Task[]> {
  try {
    const now = new Date();
    const snapshot = await getDocs(
      query(collection(db, 'campaigns'), where('status', '==', 'active'))
    );

    const tasks: Task[] = snapshot.docs
      .map((d) => {
        const data = d.data();
        if (data.expiresAt && data.expiresAt.toDate() < now) return null;
        return {
          id: d.id,
          title: data.videoTitle,
          description: `Watch this video and earn GHS ${data.userEarning}`,
          // ✅ Use real duration from Firebase, fallback to 5
          duration: data.videoDuration || 5,
          completions: data.totalCompletions || 0,
          reward: data.userEarning,
          youtubeUrl: data.videoUrl,
        };
      })
      .filter((t): t is Task => t !== null);

    console.log('[Campaigns] Fetched', tasks.length, 'active campaigns');
    return tasks;
  } catch (error) {
    console.error('[Campaigns] Fetch error:', error);
    return [];
  }
}

// ============================================
// GET CREATOR CAMPAIGNS
// ============================================
export async function getCreatorCampaignsAction(creatorId: string) {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'campaigns'), where('creatorId', '==', creatorId))
    );

    return snapshot.docs.map((d) => {
      const data = d.data();
      const duration = data.videoDuration || 5;
      return {
        id: d.id,
        videoTitle: data.videoTitle,
        youtubeUrl: data.videoUrl,
        youtubeId: data.youtubeId,
        status: data.status,
        completions: data.totalCompletions || 0,
        // ✅ Use real duration for watch hours calculation
        watchHours: Number(((data.totalCompletions || 0) * duration / 60).toFixed(1)),
        spent: data.totalSpent || 0,
        daysLeft: Math.max(
          0,
          Math.ceil((data.expiresAt.toDate().getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        ),
        rewardAmount: data.rewardAmount,
      };
    });
  } catch (error) {
    console.error('[Campaigns] Creator fetch error:', error);
    return [];
  }
}