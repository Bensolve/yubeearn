import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, amount, userId } = await request.json();

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        metadata: {
          userId,
        },
      }),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
      });
    } else {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
 } catch {
  return NextResponse.json({ error: 'Server error' }, { status: 500 });
}
}