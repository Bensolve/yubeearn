'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import type { Task } from '@/types';

// ============================================
// CREATE CAMPAIGN (Creator saves to Firebase)
// ============================================
export async function createCampaignAction(
  creatorId: string,
  videoUrl: string,
  youtubeId: string,
  videoTitle: string,
  rewardAmount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Check: no duplicate campaign for same video by same creator
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

    const userEarning = rewardAmount * 0.85;       // Earner gets 85%
    const platformCommission = rewardAmount * 0.15; // Platform gets 15%

    // 2. Save campaign to Firestore
    await addDoc(collection(db, 'campaigns'), {
      creatorId,
      videoUrl,
      youtubeId,
      videoTitle,
      rewardAmount,
      userEarning,
      platformCommission,
      status: 'active',
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      ),
      totalCompletions: 0,
      totalSpent: 0,
    });

    console.log('[Campaigns] Created campaign for:', videoTitle);
    return { success: true };
  } catch (error) {
    console.error('[Campaigns] Create error:', error);
    return { success: false, error: 'Failed to create campaign' };
  }
}

// ============================================
// GET ALL ACTIVE CAMPAIGNS (Earner task list)
// ============================================
export async function getActiveCampaignsAction(): Promise<Task[]> {
  try {
    const now = Timestamp.now();

    const snapshot = await getDocs(
      query(
        collection(db, 'campaigns'),
        where('status', '==', 'active')
      )
    );

    const tasks: Task[] = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        // Filter out expired campaigns
        if (data.expiresAt && data.expiresAt.toDate() < now.toDate()) {
          return null;
        }

        return {
          id: doc.id,
          title: data.videoTitle,
          description: `Watch this video and earn GHS ${data.userEarning}`,
          duration: 5, // Default 5 min watch time
          completions: data.totalCompletions || 0,
          reward: data.userEarning,   // Earner gets 85% (e.g. GHS 85)
          youtubeUrl: data.videoUrl,
        };
      })
      .filter((task): task is Task => task !== null);

    console.log('[Campaigns] Fetched', tasks.length, 'active campaigns');
    return tasks;
  } catch (error) {
    console.error('[Campaigns] Fetch error:', error);
    return [];
  }
}

// ============================================
// GET CREATOR'S CAMPAIGNS
// ============================================
export async function getCreatorCampaignsAction(creatorId: string) {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'campaigns'),
        where('creatorId', '==', creatorId)
      )
    );

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        videoTitle: data.videoTitle,
        youtubeUrl: data.videoUrl,
        youtubeId: data.youtubeId,
        status: data.status,
        completions: data.totalCompletions || 0,
        watchHours: ((data.totalCompletions || 0) * 5) / 60, // 5 min each
        spent: data.totalSpent || 0,
        daysLeft: Math.max(
          0,
          Math.ceil(
            (data.expiresAt.toDate().getTime() - Date.now()) /
              (24 * 60 * 60 * 1000)
          )
        ),
        rewardAmount: data.rewardAmount,
      };
    });
  } catch (error) {
    console.error('[Campaigns] Fetch creator campaigns error:', error);
    return [];
  }
}