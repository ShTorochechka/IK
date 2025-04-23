import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/db/client';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const result = await db.query('SELECT balance FROM users WHERE id = $1', [userId]);
    const balance = result.rows[0]?.balance || 0;

    return NextResponse.json({ balance });

  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    const { amount } = await req.json();

    await db.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2',
      [amount, userId]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating balance:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
