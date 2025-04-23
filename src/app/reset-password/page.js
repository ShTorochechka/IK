'use client';

import { Suspense } from 'react';
import ResetPasswordPage from '@/components/resetPasswordPage/ResetPasswordPage';

export default function resetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage/>
    </Suspense>
  );
}
