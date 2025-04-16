// src/app/api/user/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/db/client';

export async function GET(request) {
  try {
    // Получаем заголовок Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Отсутствует токен' }, { status: 401 });
    }

    // Извлекаем токен
    const token = authHeader.split(' ')[1];

    // Проверяем и декодируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Получаем userId из токена
    const userId = decoded.userId || decoded.id; // поддержка обеих структур

    // Находим пользователя по ID
    const result = await db.query(
      'SELECT id, name, email, avatar FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Возвращаем найденного пользователя
    return NextResponse.json({ user: result.rows[0] }, { status: 200 });

  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return NextResponse.json({ error: 'Неверный или просроченный токен' }, { status: 401 });
  }
}
