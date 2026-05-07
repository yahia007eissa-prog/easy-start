'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { generateStudy, type StudyFormData } from '@/app/actions/study';
import { downloadStudyHtml } from '@/lib/html/studyDownload';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { PromptEditor } from '@/components/prompts/PromptEditor';
import { PricingEditor } from '@/components/pricing/PricingEditor';

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

type Screen = 'dashboard' | 'new' | 'prompts' | 'pricing';
type StudyType = 'realEstate' | 'medical' | 'agricultural' | 'industrial';
type MethodType = 'fast' | 'full';

interface Project {
  id: string;
  nameKey: string;
  metaKey: string;
  costKey: string;
  status: ProjectStatus;
  icon: 'hosp' | 'res' | 'com' | 'agr';
}

interface PriceItem {
  name: string;
  nameKey: string;
  unitKey: string;
  value: string;
  change: number;
}

// Sample data - these will be populated from translations
const sampleProjects: Project[] = [
  {
    id: '1',
    nameKey: 'sampleProjects.project1.name',
    metaKey: 'sampleProjects.project1.meta',
    costKey: 'sampleProjects.project1.cost',
    status: 'done',
    icon: 'hosp',
  },
  {
    id: '2',
    nameKey: 'sampleProjects.project2.name',
    metaKey: 'sampleProjects.project2.meta',
    costKey: 'sampleProjects.project2.cost',
    status: 'prog',
    icon: 'res',
  },
  {
    id: '3',
    nameKey: 'sampleProjects.project3.name',
    metaKey: 'sampleProjects.project3.meta',
    costKey: 'sampleProjects.project3.cost',
    status: 'new',
    icon: 'com',
  },
  {
    id: '4',
    nameKey: 'sampleProjects.project4.name',
    metaKey: 'sampleProjects.project4.meta',
    costKey: 'sampleProjects.project4.cost',
    status: 'done',
    icon: 'agr',
  },
];

const samplePrices: PriceItem[] = [
  { name: 'Rebar', nameKey: 'prices.rebar', unitKey: 'prices.rebarUnit', value: '28,500', change: 2.1 },
  { name: 'Cement', nameKey: 'prices.cement', unitKey: 'prices.cementUnit', value: '3,200', change: -0.5 },
  { name: 'Brick', nameKey: 'prices.brick', unitKey: 'prices.brickUnit', value: '6,800', change: 1.3 },
  { name: 'Sand', nameKey: 'prices.sand', unitKey: 'prices.sandUnit', value: '420', change: -0.2 },
  { name: 'Dollar', nameKey: 'prices.dollar', unitKey: 'prices.dollarUnit', value: '48.75', change: 0.3 },
];

type ProjectStatus = 'done' | 'prog' | 'new';

interface EasyStartProps {
  defaultValues?: Record<string, string>;
}

export function EasyStart({ defaultValues }: EasyStartProps = {}) {
  const t = useTranslations('easyStart');
  const locale = useLocale() as 'en' | 'ar';
  const isRTL = locale === 'ar';

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudyType, setSelectedStudyType] = useState<StudyType>(
    (defaultValues?.studyType as StudyType) || 'realEstate'
  );
  const [selectedMethod, setSelectedMethod] = useState<MethodType>(
    (defaultValues?.method as MethodType) || 'full'
  );
  const [activeTab, setActiveTab] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Form state for step 2 - uses defaultValues if provided
  const [formData, setFormData] = useState({
    projectName: defaultValues?.projectName || "",
    projectTypeDetailed: defaultValues?.projectTypeDetailed || "residential",
    landArea: defaultValues?.landArea || "",
    constructionArea: defaultValues?.constructionArea || "",
    floorsCount: defaultValues?.floorsCount || "",
    basement: defaultValues?.basement || "none",
    location: defaultValues?.location || "",
    finishingLevel: defaultValues?.finishingLevel || "medium",
    description: defaultValues?.description || "",
  });

  // Detect mobile viewport
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

  // Close sidebar when clicking overlay
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'new') {
      setActiveScreen('new');
      setCurrentStep(1);
    } else if (nav === 'prompts') {
      setActiveScreen('prompts');
    } else if (nav === 'pricing') {
      setActiveScreen('pricing');
    } else {
      setActiveScreen('dashboard');
    }
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setActiveScreen('dashboard');
    setActiveNav('dashboard');
    setCurrentStep(1);
    setIsGenerating(false);
    setGenerationError(null);
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleGenerateStudy = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      // Send all form data dynamically (common + category-specific fields)
      const studyFormData: StudyFormData = {
        projectName: formData.projectName,
        studyType: selectedStudyType,
        method: selectedMethod,
        location: formData.location,
        // Spread all form fields dynamically
        ...Object.fromEntries(
          Object.entries(formData).filter(([, v]) => v !== '' && v !== undefined)
        ),
      };

      console.log('[EasyStart] Sending study generation request:', studyFormData);

      const response = await generateStudy(studyFormData);

      console.log('[EasyStart] Received response:', {
        success: response.success,
        hasStudyText: !!response.studyText,
        studyTextLength: response.studyText?.length,
        studyTextPreview: response.studyText?.substring(0, 200),
        projectName: response.projectName,
        error: response.error,
        debug: response.debug,
      });

      if (!response.success || !response.studyText) {
        throw new Error(response.error || t('generationError'));
      }

      // Use the project name from response, fallback to form data
      const projectName = response.projectName || formData.projectName || 'Unnamed_Project';
      console.log('[EasyStart] Using project name:', projectName);

      // Generate HTML document with category template
      await downloadStudyHtml(
        response.studyText,
        projectName,
        { prompt: response.prompt, category: selectedStudyType }
      );

    } catch (error) {
      console.error('[EasyStart] Generation error:', error);
      setGenerationError(
        error instanceof Error ? error.message : t('generationError')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepLabel = () => {
    const titles = [
      t('step1Title'),
      t('step2Title'),
      t('step3Title'),
    ];
    return t('step', { current: currentStep, total: 3, title: titles[currentStep - 1] });
  };

  const getPageTitle = () => {
    if (activeScreen === 'dashboard') {
      return t('dashboardTitle');
    }
    return t('newStudyTitle');
  };

  const getPageSubtitle = () => {
    if (activeScreen === 'dashboard') {
      return t('dashboardSub', { count: 3 });
    }
    return t('newStudySub', { current: currentStep, total: 3 });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="easy-sidebar-overlay visible" onClick={closeSidebar} />
      )}

      {/* SIDEBAR - Outside main container for proper fixed positioning */}
      {isMobile && (
        <aside className={`easy-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="easy-logo">
            <div className="flex items-center justify-between">
              <div>
                <div className="easy-logo-text">{t("logo")}</div>
                <div className="easy-logo-en">{t("logoSub")}</div>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <nav className="easy-nav">
            <div className="easy-nav-section">{t("navMain")}</div>

            <button
              className={`easy-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("dashboard")}
            >
              <DashboardIcon />
              {t("navDashboard")}
            </button>

            <button
              className={`easy-nav-item ${activeNav === "new" ? "active" : ""}`}
              onClick={() => handleNavClick("new")}
            >
              <PlusIcon />
              {t("navNewStudy")}
            </button>

            <button className="easy-nav-item" onClick={() => {}}>
              <ProjectsIcon />
              {t("navMyProjects")}
            </button>

            <div className="easy-nav-section" style={{ marginTop: "6px" }}>
              {t("navInfo")}
            </div>

            <button className="easy-nav-item" onClick={() => {}}>
              <PriceIcon />
              {t("navMaterialPrices")}
            </button>

            <button className="easy-nav-item" onClick={() => {}}>
              <SupplierIcon />
              {t("navSuppliers")}
            </button>

            <button className="easy-nav-item" onClick={() => {}}>
              <ReportsIcon />
              {t("navReports")}
            </button>

            <div className="easy-nav-section" style={{ marginTop: "6px" }}>
              {t("navSettings")}
            </div>

            <button
              className={`easy-nav-item ${activeNav === "prompts" ? "active" : ""}`}
              onClick={() => handleNavClick("prompts")}
            >
              <SettingsIcon />
              {t("navSystemPrompts")}
            </button>

            <button
              className={`easy-nav-item ${activeNav === "pricing" ? "active" : ""}`}
              onClick={() => handleNavClick("pricing")}
            >
              <PriceIcon />
              {t("navPricingSettings")}
            </button>
          </nav>

          <div className="easy-sidebar-bottom">
            <div className="mb-3">
              <LanguageSwitcher />
            </div>
            <div className="easy-user-card">
              <div className="easy-avatar">{isRTL ? "م" : "M"}</div>
              <div>
                <div className="easy-user-name">{t("userName")}</div>
                <div className="easy-user-plan">{t("userPlan")}</div>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div className="">
        {/* SIDEBAR - Desktop only */}
        {!isMobile && (
          <aside className="easy-sidebar">
            <div className="easy-logo">
              <div className="easy-logo-text">{t("logo")}</div>
              <div className="easy-logo-en">{t("logoSub")}</div>
            </div>

            <nav className="easy-nav">
              <div className="easy-nav-section">{t("navMain")}</div>

              <button
                className={`easy-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
                onClick={() => handleNavClick("dashboard")}
              >
                <DashboardIcon />
                {t("navDashboard")}
              </button>

              <button
                className={`easy-nav-item ${activeNav === "new" ? "active" : ""}`}
                onClick={() => handleNavClick("new")}
              >
                <PlusIcon />
                {t("navNewStudy")}
              </button>

              <button className="easy-nav-item" onClick={() => {}}>
                <ProjectsIcon />
                {t("navMyProjects")}
              </button>

              <div className="easy-nav-section" style={{ marginTop: "6px" }}>
                {t("navInfo")}
              </div>

              <button className="easy-nav-item" onClick={() => {}}>
                <PriceIcon />
                {t("navMaterialPrices")}
              </button>

              <button className="easy-nav-item" onClick={() => {}}>
                <SupplierIcon />
                {t("navSuppliers")}
              </button>

              <button className="easy-nav-item" onClick={() => {}}>
                <ReportsIcon />
                {t("navReports")}
              </button>

              <div className="easy-nav-section" style={{ marginTop: "6px" }}>
                {t("navSettings")}
              </div>

              <button
                className={`easy-nav-item ${activeNav === "prompts" ? "active" : ""}`}
                onClick={() => handleNavClick("prompts")}
              >
                <SettingsIcon />
                {t("navSystemPrompts")}
              </button>

              <button
                className={`easy-nav-item ${activeNav === "pricing" ? "active" : ""}`}
                onClick={() => handleNavClick("pricing")}
              >
                <PriceIcon />
                {t("navPricingSettings")}
              </button>
            </nav>

            <div className="easy-sidebar-bottom">
              <div className="mb-3">
                <LanguageSwitcher />
              </div>
              <div className="easy-user-card">
                <div className="easy-avatar">{isRTL ? "م" : "M"}</div>
                <div>
                  <div className="easy-user-name">{t("userName")}</div>
                  <div className="easy-user-plan">{t("userPlan")}</div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN */}
        <main className="easy-main">
          <div className="easy-topbar">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <MenuIcon />
                </button>
              )}
              <div>
                <div className="easy-page-title">{getPageTitle()}</div>
                <div className="easy-page-sub">{getPageSubtitle()}</div>
              </div>
            </div>
            <div className="easy-topbar-actions">
              <button className="easy-btn-secondary" onClick={() => {}}>
                {t("exportPdf")}
              </button>
              <button
                className="easy-btn-primary"
                onClick={() => handleNavClick("new")}
              >
                <PlusIcon />
                {t("navNewStudy")}
              </button>
            </div>
          </div>

          <div className="easy-content">
            {/* DASHBOARD SCREEN */}
            <div
              className={`easy-screen ${activeScreen === "dashboard" ? "active" : ""}`}
            >
              {/* KPI Cards */}
              <div className="easy-kpi-row">
                <div className="easy-kpi">
                  <div className="easy-kpi-val">12</div>
                  <div className="easy-kpi-lbl">{t("kpiTotal")}</div>
                  <span className="easy-kpi-tag easy-tag-green">
                    {t("kpiNewThisMonth", { count: 3 })}
                  </span>
                </div>
                <div className="easy-kpi">
                  <div className="easy-kpi-val">3</div>
                  <div className="easy-kpi-lbl">{t("kpiInProgress")}</div>
                  <span className="easy-kpi-tag easy-tag-amber">
                    {t("kpiInProgressLabel")}
                  </span>
                </div>
                <div className="easy-kpi">
                  <div className="easy-kpi-val">2.4 م</div>
                  <div className="easy-kpi-lbl">{t("kpiTotalValue")}</div>
                  <span className="easy-kpi-tag easy-tag-blue">
                    {t("kpiCurrency")}
                  </span>
                </div>
                <div className="easy-kpi">
                  <div className="easy-kpi-val">8</div>
                  <div className="easy-kpi-lbl">{t("kpiSuppliers")}</div>
                  <span className="easy-kpi-tag easy-tag-green">
                    {t("kpiActive")}
                  </span>
                </div>
              </div>

              {/* Recent Studies Section */}
              <div className="easy-section-head">
                <div className="easy-section-title">{t("recentStudies")}</div>
                <div className="easy-section-link">{t("viewAll")}</div>
              </div>

              <div className="easy-proj-list">
                {sampleProjects.map((project) => (
                  <div key={project.id} className="easy-proj-card">
                    <div className={`easy-proj-icon easy-ic-${project.icon}`}>
                      {project.icon === "hosp" && "🏥"}
                      {project.icon === "res" && "🏗️"}
                      {project.icon === "com" && "🏖️"}
                      {project.icon === "agr" && "🌿"}
                    </div>
                    <div className="easy-proj-info">
                      <div className="easy-proj-name">{t(project.nameKey)}</div>
                      <div className="easy-proj-meta">{t(project.metaKey)}</div>
                    </div>
                    <div className="easy-proj-right">
                      <div className="easy-proj-cost">{t(project.costKey)}</div>
                      <span
                        className={`easy-proj-status easy-st-${project.status}`}
                      >
                        {project.status === "done"
                          ? t("kpiActive")
                          : project.status === "prog"
                            ? t("kpiInProgressLabel")
                            : t("kpiNewThisMonth", { count: "" })
                                .replace("+", "")
                                .trim()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Material Prices Section */}
              <div className="easy-section-head">
                <div className="easy-section-title">{t("materialPrices")}</div>
                <div className="easy-section-link">{t("refresh")}</div>
              </div>

              <div className="easy-price-ticker">
                <div className="easy-ticker-row">
                  {samplePrices.map((item, index) => (
                    <div key={index} className="easy-ticker-item">
                      <span className="easy-ticker-name">
                        {t(item.nameKey)}
                      </span>
                      <span className="easy-ticker-val">
                        {item.value} {t(item.unitKey)}
                      </span>
                      <span
                        className={
                          item.change > 0
                            ? "easy-ticker-up"
                            : "easy-ticker-down"
                        }
                      >
                        {item.change > 0 ? "▲" : "▼"} {Math.abs(item.change)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NEW STUDY SCREEN */}
            <div
              className={`easy-screen ${activeScreen === "new" ? "active" : ""}`}
            >
              <div className="easy-new-study-wrap">
                {/* Progress Bar */}
                <div className="easy-progress-bar-wrap">
                  <div
                    className="easy-progress-bar"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>

                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div>
                    <div className="easy-step-label">
                      <span className="easy-step-dot" />
                      {t("step", {
                        current: 1,
                        total: 3,
                        title: t("step1Title"),
                      })}
                    </div>

                    <div
                      className="easy-section-title"
                      style={{ marginBottom: "10px" }}
                    >
                      {t("projectType")}
                    </div>
                    <div
                      className="easy-study-types"
                      style={{ marginBottom: "16px" }}
                    >
                      <button
                        className={`easy-stype ${selectedStudyType === "realEstate" ? "sel" : ""}`}
                        onClick={() => setSelectedStudyType("realEstate")}
                      >
                        <div className="easy-stype-icon">🏢</div>
                        <div className="easy-stype-name">
                          {t("studyTypes.realEstate")}
                        </div>
                        <div className="easy-stype-desc">
                          {t("studyTypes.realEstateDesc")}
                        </div>
                      </button>
                      <button
                        className={`easy-stype ${selectedStudyType === "medical" ? "sel" : ""}`}
                        onClick={() => setSelectedStudyType("medical")}
                      >
                        <div className="easy-stype-icon">🏥</div>
                        <div className="easy-stype-name">
                          {t("studyTypes.medical")}
                        </div>
                        <div className="easy-stype-desc">
                          {t("studyTypes.medicalDesc")}
                        </div>
                      </button>
                      <button
                        className={`easy-stype ${selectedStudyType === "agricultural" ? "sel" : ""}`}
                        onClick={() => setSelectedStudyType("agricultural")}
                      >
                        <div className="easy-stype-icon">🌾</div>
                        <div className="easy-stype-name">
                          {t("studyTypes.agricultural")}
                        </div>
                        <div className="easy-stype-desc">
                          {t("studyTypes.agriculturalDesc")}
                        </div>
                      </button>
                      <button
                        className={`easy-stype ${selectedStudyType === "industrial" ? "sel" : ""}`}
                        onClick={() => setSelectedStudyType("industrial")}
                      >
                        <div className="easy-stype-icon">🏭</div>
                        <div className="easy-stype-name">
                          {t("studyTypes.industrial")}
                        </div>
                        <div className="easy-stype-desc">
                          {t("studyTypes.industrialDesc")}
                        </div>
                      </button>
                    </div>

                    <div
                      className="easy-section-title"
                      style={{ marginBottom: "10px" }}
                    >
                      {t("accuracyMethod")}
                    </div>
                    <div className="easy-method-row">
                      <button
                        className={`easy-method-card ${selectedMethod === "fast" ? "selected" : ""}`}
                        onClick={() => setSelectedMethod("fast")}
                      >
                        <span className="easy-method-badge easy-badge-fast">
                          ⚡ {t("methodFast")}
                        </span>
                        <div className="easy-method-title">
                          {t("methodFastTitle")}
                        </div>
                        <div className="easy-method-desc">
                          {t("methodFastDesc")}
                        </div>
                      </button>
                      <button
                        className={`easy-method-card ${selectedMethod === "full" ? "selected" : ""}`}
                        onClick={() => setSelectedMethod("full")}
                      >
                        <span className="easy-method-badge easy-badge-full">
                          ✦ {t("methodFull")}
                        </span>
                        <div className="easy-method-title">
                          {t("methodFullTitle")}
                        </div>
                        <div className="easy-method-desc">
                          {t("methodFullDesc")}
                        </div>
                      </button>
                    </div>

                    <div className="easy-btn-row">
                      <button className="easy-btn-primary" onClick={handleNext}>
                        {t("next")}
                      </button>
                      <button
                        className="easy-btn-secondary"
                        onClick={handleCancel}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div>
                    <div className="easy-step-label">
                      <span className="easy-step-dot" />
                      {t("step", {
                        current: 2,
                        total: 3,
                        title: t("step2Title"),
                      })}
                    </div>

                    <div className="easy-form-row">
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("projectName")}
                        </label>
                        <input
                          type="text"
                          className="easy-form-input"
                          placeholder={t("projectNamePlaceholder")}
                          value={formData.projectName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              projectName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("projectTypeDetailed")}
                        </label>
                        <select
                          className="easy-form-input"
                          value={formData.projectTypeDetailed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              projectTypeDetailed: e.target.value,
                            })
                          }
                        >
                          <option value="residential">
                            {t("projectTypes.residential")}
                          </option>
                          <option value="commercial">
                            {t("projectTypes.commercial")}
                          </option>
                          <option value="administrative">
                            {t("projectTypes.administrative")}
                          </option>
                          <option value="medical">
                            {t("projectTypes.medical")}
                          </option>
                          <option value="hotel">
                            {t("projectTypes.hotel")}
                          </option>
                          <option value="tourist">
                            {t("projectTypes.tourist")}
                          </option>
                          <option value="mixed">
                            {t("projectTypes.mixed")}
                          </option>
                          <option value="agricultural">
                            {t("projectTypes.agricultural")}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="easy-form-row">
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("landArea")}
                        </label>
                        <input
                          type="text"
                          className="easy-form-input"
                          placeholder={t("landAreaPlaceholder")}
                          value={formData.landArea}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              landArea: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("constructionArea")}
                        </label>
                        <input
                          type="text"
                          className="easy-form-input"
                          placeholder={t("constructionAreaPlaceholder")}
                          value={formData.constructionArea}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              constructionArea: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="easy-form-row">
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("floorsCount")}
                        </label>
                        <input
                          type="text"
                          className="easy-form-input"
                          placeholder={t("floorsPlaceholder")}
                          value={formData.floorsCount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              floorsCount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("basement")}
                        </label>
                        <select
                          className="easy-form-input"
                          value={formData.basement}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              basement: e.target.value,
                            })
                          }
                        >
                          <option value="none">{t("noBasement")}</option>
                          <option value="one">{t("oneBasement")}</option>
                          <option value="two">{t("twoBasement")}</option>
                          <option value="more">{t("moreBasement")}</option>
                        </select>
                      </div>
                    </div>

                    <div className="easy-form-row">
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("location")}
                        </label>
                        <input
                          type="text"
                          className="easy-form-input"
                          placeholder={t("locationPlaceholder")}
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="easy-form-group">
                        <label className="easy-form-label">
                          {t("finishingLevel")}
                        </label>
                        <select
                          className="easy-form-input"
                          value={formData.finishingLevel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              finishingLevel: e.target.value,
                            })
                          }
                        >
                          <option value="normal">{t("finishingNormal")}</option>
                          <option value="medium">{t("finishingMedium")}</option>
                          <option value="premium">
                            {t("finishingPremium")}
                          </option>
                          <option value="luxury">{t("finishingLuxury")}</option>
                        </select>
                      </div>
                    </div>

                    <div className="easy-btn-row">
                      <button className="easy-btn-primary" onClick={handleNext}>
                        {t("next")}
                      </button>
                      <button
                        className="easy-btn-secondary"
                        onClick={handlePrevious}
                      >
                        {t("previous")}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div>
                    <div className="easy-step-label">
                      <span className="easy-step-dot" />
                      {t("step", {
                        current: 3,
                        total: 3,
                        title: t("step3Title"),
                      })}
                    </div>

                    <div className="easy-upload-area" onClick={() => {}}>
                      <div className="easy-upload-icon">📄</div>
                      <div className="easy-upload-title">
                        {t("uploadTitle")}
                      </div>
                      <div className="easy-upload-sub">
                        {t("uploadSubtitle")}
                      </div>
                      <button
                        className="easy-btn-secondary"
                        style={{ fontSize: "12px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("chooseFiles")}
                      </button>
                    </div>

                    <div className="easy-info-note">
                      <span className="easy-info-note-icon">ℹ️</span>
                      <span className="easy-info-note-text">
                        {t("uploadNote")}
                      </span>
                    </div>

                    <div className="easy-tab-row">
                      <button
                        className={`easy-tab ${activeTab === 0 ? "active" : ""}`}
                        onClick={() => setActiveTab(0)}
                      >
                        {t("tabsLandLicense")}
                      </button>
                      <button
                        className={`easy-tab ${activeTab === 1 ? "active" : ""}`}
                        onClick={() => setActiveTab(1)}
                      >
                        {t("tabsAutocad")}
                      </button>
                      <button
                        className={`easy-tab ${activeTab === 2 ? "active" : ""}`}
                        onClick={() => setActiveTab(2)}
                      >
                        {t("tabsFinishing")}
                      </button>
                    </div>

                    <div className="easy-empty-state">
                      {t("noFilesUploaded")}
                    </div>

                    <div className="easy-btn-row">
                      <button
                        className="easy-btn-primary"
                        onClick={handleGenerateStudy}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <span className="easy-spinner" />
                            {t("generatingStudy")}
                          </>
                        ) : (
                          t("generateStudy")
                        )}
                      </button>
                      <button
                        className="easy-btn-secondary"
                        onClick={handlePrevious}
                      >
                        {t("previous")}
                      </button>
                    </div>

                    {generationError && (
                      <div className="easy-error-toast">
                        <span>{generationError}</span>
                        <button
                          onClick={() => setGenerationError(null)}
                          className="easy-error-dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* SYSTEM PROMPTS SCREEN */}
            <div
              className={`easy-screen ${activeScreen === "prompts" ? "active" : ""}`}
            >
              <div className="easy-new-study-wrap">
                <PromptEditor className="h-full" />
              </div>
            </div>

            {/* PRICING SETTINGS SCREEN */}
            <div
              className={`easy-screen ${activeScreen === "pricing" ? "active" : ""}`}
            >
              <div className="easy-new-study-wrap">
                <PricingEditor className="h-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}