import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, increment } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { reference, userId } = await request.json();

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

   if (!data.status || data.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not verified' }, { status: 400 });
    }

    // Payment successful - add points to user
    const amount = data.data.amount / 100; // Convert from kobo to naira
    const userRef = doc(db, 'users', userId);

    // Check if user exists
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing user
      await setDoc(
        userRef,
        {
          points: increment(amount),
          lastPayment: new Date(),
        },
        { merge: true }
      );
    } else {
      // Create new user document
      await setDoc(userRef, {
        points: amount,
        email: data.data.customer.email,
        createdAt: new Date(),
        lastPayment: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Points added successfully',
      points: amount,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}