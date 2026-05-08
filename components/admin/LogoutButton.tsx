'use client';

import { useTranslations } from 'next-intl';
import { logoutAction } from '@/app/actions/auth';

export function LogoutButton() {
  const t = useTranslations('admin');
  return (
    <form action={logoutAction}>
      <button type="submit" className="admin-logout-btn">
        🚪 {t('logout')}
      </button>
    </form>
  );
}

export function AdminPageBar() {
  const t = useTranslations('admin');
  return (
    <div className="admin-page-bar">
      <span className="admin-page-badge">🔐 {t('adminMode')}</span>
      <LogoutButton />
    </div>
  );
}
