import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/db/client';
export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const body = await req.json();
    const { type, amount, date, comment, category } = body;

    if (!type || !amount || !date || !comment) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: 'Некорректная сумма' }, { status: 400 });
    }

    const isValidDate = !isNaN(Date.parse(date));
    if (!isValidDate) {
      return NextResponse.json({ message: 'Неверный формат даты. Ожидается YYYY-MM-DD' }, { status: 400 });
    }

    const [year, month, day] = date.split('-');
    const formattedDateForDb = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const formattedDateForApp = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;

    let transactionCategory = category || 'Деньги';

    const currentDate = new Date(formattedDateForDb);
    if (isNaN(currentDate.getTime())) {
      return NextResponse.json({ message: 'Некорректная дата' }, { status: 400 });
    }

    const userExists = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (!userExists.rows.length) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    await db.query(
      'INSERT INTO transactions (user_id, type, amount, date, comment, category) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, type, amount, formattedDateForDb, comment, transactionCategory]
    );

    const balanceQuery = type === 'income' ? 
      'UPDATE users SET balance = balance + $1 WHERE id = $2' : 
      'UPDATE users SET balance = balance - $1 WHERE id = $2';
    
    await db.query(balanceQuery, [amount, userId]);

    return NextResponse.json({
      message: 'Transaction created successfully',
      transaction: { type, amount, date: formattedDateForApp, comment, category: transactionCategory },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

