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

    // Получение 3 самых популярных категорий по сумме расходов (type = 'expense') и количеству транзакций
    const result = await db.query(
      `
      SELECT category, SUM(amount) AS total, COUNT(*) AS count
      FROM transactions
      WHERE user_id = $1 AND type = 'expense'
      GROUP BY category
      ORDER BY total DESC
      LIMIT 3
      `,
      [userId]
    )

    // Логирование результата запроса
    console.log('Query result:', result.rows)

    // Ответ с данными категорий
    return NextResponse.json({ categories: result.rows }, { status: 200 })
  } catch (error) {
    console.error('Ошибка при получении топ категорий:', error) // Логирование ошибки
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
