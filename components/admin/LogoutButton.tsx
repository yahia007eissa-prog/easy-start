'use client';

import { logoutAction } from '@/app/actions/auth';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="admin-logout-btn">
        🚪 خروج
      </button>
    </form>
  );
}
