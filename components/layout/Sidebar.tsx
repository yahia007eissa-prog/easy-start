'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Icons as SVG components
const DashboardIcon = () => (
  <svg className="easy-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
  </svg>
);

const PlusIcon = () => (
  <svg className="easy-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
);

const ProjectsIcon = () => (
  <svg className="easy-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
  </svg>
);

const PriceIcon = () => (
  <svg className="easy-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
  </svg>
);

const SupplierIcon = () => (
  <svg className="easy-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z"/>
  </svg>
);

const ReportsIcon = () => (
  <svg className="easy-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="easy-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
  </svg>
);

interface NavItem {
  href: string;
  icon: React.ReactNode;
  labelKey: string;
  section?: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: <DashboardIcon />, labelKey: 'navDashboard', section: 'navMain' },
  { href: '/new-study', icon: <PlusIcon />, labelKey: 'navNewStudy', section: 'navMain' },
  { href: '/projects', icon: <ProjectsIcon />, labelKey: 'navMyProjects', section: 'navMain' },
];

const infoItems: NavItem[] = [
  { href: '/prices', icon: <PriceIcon />, labelKey: 'navMaterialPrices' },
  { href: '/suppliers', icon: <SupplierIcon />, labelKey: 'navSuppliers' },
  { href: '/reports', icon: <ReportsIcon />, labelKey: 'navReports' },
];

const settingsItems: NavItem[] = [
  {
    href: "/settings/prompts",
    icon: <SettingsIcon />,
    labelKey: "navSystemPrompts",
  },
  {
    href: "/settings/pricing",
    icon: <SettingsIcon />,
    labelKey: "navSystemPricing",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const t = useTranslations('easyStart');
  const locale = useLocale();
  const pathname = usePathname();
  const isRTL = locale === 'ar';

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === `/${locale}`;
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, index: number) => (
    <Link
      key={item.href + index}
      href={item.href}
      className={`easy-nav-item ${isActive(item.href) ? 'active' : ''}`}
    >
      {item.icon}
      {t(item.labelKey)}
    </Link>
  );

  // Mobile sidebar
  const mobileSidebar = isMobile && (
    <>
      <div
        className={`easy-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`easy-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="easy-logo">
          <div className="flex items-center justify-between">
            <div>
              <div className="easy-logo-text">{t('logo')}</div>
              <div className="easy-logo-en">{t('logoSub')}</div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <nav className="easy-nav">
          <div className="easy-nav-section">{t('navMain')}</div>
          {navItems.map(renderNavItem)}

          <div className="easy-nav-section" style={{ marginTop: '6px' }}>
            {t('navInfo')}
          </div>
          {infoItems.map(renderNavItem)}

          <div className="easy-nav-section" style={{ marginTop: '6px' }}>
            {t('navSettings')}
          </div>
          {settingsItems.map(renderNavItem)}
        </nav>

        <div className="easy-sidebar-bottom">
          <div className="mb-3">
            <LanguageSwitcher />
          </div>
          <div className="easy-user-card">
            <div className="easy-avatar">{isRTL ? 'م' : 'M'}</div>
            <div>
              <div className="easy-user-name">{t('userName')}</div>
              <div className="easy-user-plan">{t('userPlan')}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  // Desktop sidebar
  const desktopSidebar = !isMobile && (
    <aside className="easy-sidebar">
      <div className="easy-logo">
        <div className="easy-logo-text">{t('logo')}</div>
        <div className="easy-logo-en">{t('logoSub')}</div>
      </div>

      <nav className="easy-nav">
        <div className="easy-nav-section">{t('navMain')}</div>
        {navItems.map(renderNavItem)}

        <div className="easy-nav-section" style={{ marginTop: '6px' }}>
          {t('navInfo')}
        </div>
        {infoItems.map(renderNavItem)}

        <div className="easy-nav-section" style={{ marginTop: '6px' }}>
          {t('navSettings')}
        </div>
        {settingsItems.map(renderNavItem)}
      </nav>

      <div className="easy-sidebar-bottom">
        <div className="mb-3">
          <LanguageSwitcher />
        </div>
        <div className="easy-user-card">
          <div className="easy-avatar">{isRTL ? 'م' : 'M'}</div>
          <div>
            <div className="easy-user-name">{t('userName')}</div>
            <div className="easy-user-plan">{t('userPlan')}</div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}

      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md hover:bg-slate-50"
        >
          <MenuIcon />
        </button>
      )}
    </>
  );
}