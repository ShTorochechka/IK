// app/api/register/route.js
import { NextResponse } from 'next/server';
import db from '@/db/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { name, email, password, avatar } = await request.json();

    // Проверка полей
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Все поля обязательны кроме аватара' }, { status: 400 });
    }

    // Проверка на существующего пользователя
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 409 });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarValue = avatar || null;

    // Сохраняем пользователя
    const result = await db.query(
      `INSERT INTO users (name, email, password, avatar)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar`,
      [name, email, hashedPassword, avatarValue]
    );

    const user = result.rows[0];

    // Генерация JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ user, token }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
