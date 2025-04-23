import { NextResponse } from 'next/server';
import db from '@/db/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ message: 'Пожалуйста, укажите email' }, { status: 400 });
    }

    try {
        const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (!userRes.rows.length) {
            return NextResponse.json({ message: 'Пользователь с таким email не найден' }, { status: 404 });
        }

        const user = userRes.rows[0];

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000);

        await db.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [token, expires, email]
        );

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Сброс пароля',
            text: `Привет! Для сброса пароля перейдите по следующей ссылке: ${resetLink}`,
        };

        try {
            await transporter.sendMail(mailOptions);
            return NextResponse.json({ message: 'Ссылка для сброса пароля отправлена на ваш email' });
        } catch (err) {
            console.error('Ошибка при отправке email:', err);
            return NextResponse.json({ message: 'Ошибка при отправке email' }, { status: 500 });
        }

    } catch (err) {
        console.error('Ошибка при работе с базой данных:', err);
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}
