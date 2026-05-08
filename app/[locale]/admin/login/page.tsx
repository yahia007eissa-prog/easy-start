'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction, type LoginState } from '@/app/actions/auth';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/';

  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-login-icon">🔐</span>
          <h1 className="admin-login-title">لوحة الإدارة</h1>
          <p className="admin-login-sub">هذه الصفحة محمية — للمالك فقط</p>
        </div>

        <form action={action} className="admin-login-form">
          <input type="hidden" name="from" value={from} />

          <div className="admin-login-field">
            <label className="admin-login-label">اسم المستخدم</label>
            <input
              name="username"
              type="text"
              className="admin-login-input"
              placeholder="أدخل اسم المستخدم"
              autoComplete="username"
              required
              dir="ltr"
            />
          </div>

          <div className="admin-login-field">
            <label className="admin-login-label">كلمة المرور</label>
            <input
              name="password"
              type="password"
              className="admin-login-input"
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              required
              dir="ltr"
            />
          </div>

          {state?.error && (
            <p className="admin-login-error">⚠️ {state.error}</p>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={pending}
          >
            {pending ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
