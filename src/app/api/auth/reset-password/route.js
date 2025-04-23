import { NextResponse } from 'next/server';
import db from '@/db/client';
import bcrypt from 'bcrypt';

export async function POST(req) {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json({ message: 'Токен и новый пароль обязательны' }, { status: 400 });
    }

    try {
        const userRes = await db.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [token]
        );

        if (!userRes.rows.length) {
            return NextResponse.json({ message: 'Неверный или устаревший токен' }, { status: 400 });
        }

        const user = userRes.rows[0];

        const hashed = await bcrypt.hash(password, 10);

        await db.query(
            'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2',
            [hashed, token]
        );

        return NextResponse.json({ message: 'Пароль успешно обновлён' });
    } catch (err) {
        console.error('Ошибка сброса пароля:', err);
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}
