import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import db from '@/db/client'

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization')
    console.log('Authorization header:', authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Token is missing or incorrect format')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    console.log('Token:', token)

    if (token.length < 10) {
      console.error('Token is too short:', token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded)
    const userId = decoded.userId || decoded.id

    const result = await db.query(
      `
      SELECT id, category, date, comment, amount, type
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC
      `,
      [userId]
    )

    console.log('Query result:', result.rows)

    return NextResponse.json({ transactions: result.rows }, { status: 200 })
  } catch (error) {
    console.error('Ошибка при получении транзакций:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
