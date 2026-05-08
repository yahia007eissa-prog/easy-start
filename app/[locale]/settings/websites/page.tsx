'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { WebsitesEditor } from '@/components/websites/WebsitesEditor';
import { LogoutButton } from '@/components/admin/LogoutButton';

export default function WebsitesPage() {
  return (
    <div className="w-full max-w-4xl">
      <div className="admin-page-bar">
        <span className="admin-page-badge">🔐 وضع الأدمن</span>
        <LogoutButton />
      </div>
      <PageHeader
        titleKey="navWebsiteRefs"
        subtitleKey="websiteRefsSub"
        backHref="/"
      />
      <div className="easy-content">
        <div className="easy-screen active">
          <div className="easy-card">
            <WebsitesEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
