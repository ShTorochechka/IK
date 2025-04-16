import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/db/client';

export async function DELETE(request) {
  try {
    // Получаем id из URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const transactionId = pathParts[pathParts.length - 1];
    
    if (!transactionId) {
      return NextResponse.json(
        { message: 'Transaction ID is required' }, 
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    // Проверяем, что транзакция принадлежит пользователю
    const checkResult = await db.query(
      'SELECT user_id, amount, type FROM transactions WHERE id = $1',
      [transactionId]
    );

    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== userId) {
      return NextResponse.json(
        { message: 'Transaction not found or access denied' }, 
        { status: 404 }
      );
    }

    // Определяем сумму для корректировки баланса
    const transaction = checkResult.rows[0];
    const amountToUpdate = transaction.type === 'income' 
      ? -transaction.amount 
      : transaction.amount;

    // Начинаем транзакцию
    await db.query('BEGIN');

    try {
      // Обновляем баланс
      await db.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [amountToUpdate, userId]
      );

      // Удаляем транзакцию
      await db.query(
        'DELETE FROM transactions WHERE id = $1',
        [transactionId]
      );

      // Фиксируем транзакцию
      await db.query('COMMIT');

      return NextResponse.json({ 
        success: true,
        message: 'Transaction deleted successfully'
      });

    } catch (error) {
      // Откатываем транзакцию при ошибке
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { 
        message: 'Server error',
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}