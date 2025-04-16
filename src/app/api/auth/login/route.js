import { NextResponse } from 'next/server';
import db from '@/db/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // Получаем данные из запроса
    const { email, password } = await request.json();

    // Проверка на обязательные поля
    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    // Проверка: существует ли пользователь с таким email
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length === 0) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    const user = existingUser.rows[0];

    // Сравниваем введённый пароль с хэшированным паролем из базы
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    // Создание JWT токена (если нужно для сессии)


    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('USER ID:', user.id);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('TOKEN:', token);

    // Возвращаем успешный ответ с данными пользователя и токеном
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
      token,
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
