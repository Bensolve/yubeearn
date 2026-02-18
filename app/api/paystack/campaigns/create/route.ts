import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { creatorId, title, description, videoUrl, targetWatchHours, price } =
      await request.json();

    // Validation
    if (!creatorId || !title || !videoUrl || !targetWatchHours) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create campaign document
    const campaignRef = await addDoc(collection(db, 'campaigns'), {
      creatorId,
      title,
      description,
      videoUrl,
      targetWatchHours,
      currentWatchHours: 0,
      price,
      status: 'pending_payment',
      createdAt: Timestamp.now(),
      completionCount: 0,
      maxLimit: targetWatchHours, // Each hour = 1 completion
    });

    return NextResponse.json({
      success: true,
      campaignId: campaignRef.id,
      message: 'Campaign created successfully',
    });
  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}