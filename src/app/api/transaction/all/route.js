import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import db from '@/db/client'

export async function GET(req) {
  try {
    // Логирование заголовков запроса
    const authHeader = req.headers.get('authorization')
    console.log('Authorization header:', authHeader) // Логирование заголовков

    // Проверка наличия заголовка и правильности формата
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Token is missing or incorrect format') // Логирование ошибки
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Извлечение токена из заголовка
    const token = authHeader.split(' ')[1]
    console.log('Token:', token) // Логирование токена

    // Проверка длины токена
    if (token.length < 10) {
      console.error('Token is too short:', token) // Логирование ошибки
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Верификация токена и извлечение данных пользователя
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded) // Логирование расшифрованного токена
    const userId = decoded.userId || decoded.id

    // Получение всех транзакций пользователя
    const result = await db.query(
      `
      SELECT id, category, date, comment, amount, type
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC
      `,
      [userId]
    )

    // Логирование результата запроса
    console.log('Query result:', result.rows)

    // Ответ с транзакциями
    return NextResponse.json({ transactions: result.rows }, { status: 200 })
  } catch (error) {
    console.error('Ошибка при получении транзакций:', error) // Логирование ошибки
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
