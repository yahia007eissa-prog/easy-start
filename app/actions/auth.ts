'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = (formData.get('username') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null)?.trim() ?? '';
  const from = (formData.get('from') as string | null) ?? '/';

  const validUser = process.env.ADMIN_USERNAME ?? '';
  const validPass = process.env.ADMIN_PASSWORD ?? '';
  const secret    = process.env.ADMIN_SESSION_SECRET ?? '';

  if (!secret) {
    return { error: 'ADMIN_SESSION_SECRET غير مضبوط في متغيرات البيئة' };
  }

  if (username !== validUser || password !== validPass) {
    return { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  });

  redirect(from);
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect('/');
}
