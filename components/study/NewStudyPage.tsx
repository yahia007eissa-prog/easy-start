'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { generateStudy, type StudyFormData } from '@/app/actions/study';
import { downloadStudyHtml } from '@/lib/html/studyDownload';
import Link from 'next/link';
import { CommonFields } from './forms/CommonFields';
import { RealEstateForm } from './forms/RealEstateForm';
import { AgriculturalForm } from './forms/AgriculturalForm';

/* ─── Data Entry Method Screen ─── */
function DataEntryMethodScreen({
  t,
  onChoose,
}: {
  t: ReturnType<typeof import('next-intl').useTranslations>;
  onChoose: (m: DataEntryMethod) => void;
}) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div className="easy-section-title" style={{ marginBottom: '14px', textAlign: 'center' }}>
        {t('entryMethodTitle')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Upload documents card */}
        <button
          onClick={() => onChoose('documents')}
          style={{
            border: '2px solid #1e3a5f', borderRadius: '12px', padding: '20px 16px',
            background: 'linear-gradient(135deg, #f0f5ff, #e8f0ff)',
            cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📎</div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e3a5f', marginBottom: '4px' }}>
            {t('entryMethodDocs')}
          </div>
          <div style={{ fontSize: '12px', color: '#444', marginBottom: '12px' }}>
            {t('entryMethodDocsDesc')}
          </div>
          <div style={{
            background: '#1e3a5f', color: 'white', fontSize: '11px',
            padding: '4px 10px', borderRadius: '20px', display: 'inline-block',
          }}>
            ✨ {t('entryMethodDocsHint')}
          </div>
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { key: 'entryDocDeed',   icon: '📜' },
              { key: 'entryDocPermit', icon: '📋' },
              { key: 'entryDocSurvey', icon: '📐' },
            ].map(({ key, icon }) => (
              <div key={key} style={{ background: 'white', borderRadius: '8px', padding: '8px 10px', textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '12px', color: '#1e3a5f' }}>
                  {icon} {t(key as never)}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  {t(`${key}Desc` as never)}
                </div>
              </div>
            ))}
          </div>
        </button>

        {/* Manual entry card */}
        <button
          onClick={() => onChoose('manual')}
          style={{
            border: '2px solid #27ae60', borderRadius: '12px', padding: '20px 16px',
            background: 'linear-gradient(135deg, #f0fff4, #e8f5e9)',
            cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✏️</div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a6b3c', marginBottom: '4px' }}>
            {t('entryMethodManual')}
          </div>
          <div style={{ fontSize: '12px', color: '#444', marginBottom: '16px' }}>
            {t('entryMethodManualDesc')}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['اسم المشروع', 'الموقع الجغرافي', 'المساحة والأبعاد', 'تفاصيل المشروع'].map(item => (
              <div key={item} style={{
                background: 'white', borderRadius: '8px', padding: '8px 10px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ color: '#27ae60', fontWeight: 700 }}>→</span>
                <span style={{ fontSize: '12px', color: '#333' }}>{item}</span>
              </div>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}

/* ─── Document Upload Section ─── */
function DocumentUploadSection({
  t,
}: {
  t: ReturnType<typeof import('next-intl').useTranslations>;
}) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          { key: 'entryDocDeed',   icon: '📜', accept: '.pdf,.jpg,.jpeg,.png' },
          { key: 'entryDocPermit', icon: '📋', accept: '.pdf,.jpg,.jpeg,.png' },
          { key: 'entryDocSurvey', icon: '📐', accept: '.pdf,.jpg,.jpeg,.png,.dwg' },
        ].map(({ key, icon, accept }) => (
          <div key={key} style={{
            border: '2px dashed #c0cfe8', borderRadius: '10px', padding: '16px',
            background: '#f8faff', display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{ fontSize: '28px', flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e3a5f', marginBottom: '2px' }}>
                {t(key as never)}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {t(`${key}Desc` as never)}
              </div>
            </div>
            <label style={{
              background: '#1e3a5f', color: 'white', padding: '7px 16px',
              borderRadius: '8px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {t('entryUploadFiles')}
              <input type="file" accept={accept} style={{ display: 'none' }} />
            </label>
          </div>
        ))}
      </div>
      <div className="easy-info-note" style={{ marginTop: '12px' }}>
        <span className="easy-info-note-icon">ℹ️</span>
        <span className="easy-info-note-text">{t('entryUploadNote')}</span>
      </div>
    </div>
  );
}

export const DEFAULT_FORM_VALUES: Record<string, string> = {
  projectName: "Agricultural Reclamation Project",
  location: "Fayoum Governorate",
  description: "A large-scale agricultural reclamation project for orange and mango cultivation",
  area: "30",
  areaUnit: "feddan",
  soil_type: "clay",
  ph: "7.2",
  ec: "2.5",
  reclaim_status: "partial",
  water_source: "well",
  well_depth: "100",
  well_flow: "50",
  water_tds: "500",
  crop: "Oranges, Mangoes",
  postharvest_goal: "export",
  buildings_list: "Warehouse (200m²), Storage facility (100m²), Worker housing (50m²)",
};

type MainCategory = 'realEstate' | 'agricultural';
type RealEstateSubType = 'integrated' | 'residential' | 'efficiency' | 'finishing' | 'industrial';
type MethodType = 'fast' | 'full';
type DataEntryMethod = 'pending' | 'manual' | 'documents';

interface NewStudyPageProps {
  showHeader?: boolean;
  defaultValues?: Record<string, string>;
}

export function NewStudyPage({ showHeader = true, defaultValues }: NewStudyPageProps = {}) {
  const t = useTranslations('easyStart');

  const mergedDefaults = { ...defaultValues };

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>(
    (mergedDefaults.studyType as MainCategory) || 'realEstate'
  );
  const [selectedSubType, setSelectedSubType] = useState<RealEstateSubType | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MethodType>(
    (mergedDefaults.method as MethodType) || 'full'
  );
  const [activeTab, setActiveTab] = useState(0);

  const [dataEntryMethod, setDataEntryMethod] = useState<DataEntryMethod>('pending');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [commonData, setCommonData] = useState<Record<string, string>>({
    projectName: mergedDefaults.projectName || '',
    location: mergedDefaults.location || '',
    description: mergedDefaults.description || '',
  });

  const [categoryData, setCategoryData] = useState<Record<string, string>>(() => {
    const categoryDefaults: Record<string, string> = {};
    for (const [key, value] of Object.entries(mergedDefaults)) {
      if (!['projectName', 'location', 'description', 'studyType', 'method'].includes(key)) {
        categoryDefaults[key] = value;
      }
    }
    return categoryDefaults;
  });

  const canProceedFromStep1 =
    selectedCategory === 'agricultural' ||
    (selectedCategory === 'realEstate' && selectedSubType !== null);

  const COMPONENT_KEYS = ['hasResidential', 'hasCommercial', 'hasAdministrative', 'hasMedical', 'hasHotel', 'hasEntertainment'];
  const hasSelectedComponents = COMPONENT_KEYS.some(k => categoryData[k] === 'true');

  const canStartStudy =
    dataEntryMethod === 'manual' &&
    commonData.projectName.trim() !== '' &&
    (selectedSubType !== 'integrated' || hasSelectedComponents);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleGenerateStudy = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const studyFormData: StudyFormData = {
        ...commonData,
        ...categoryData,
        studyType: selectedCategory === 'realEstate' ? 'realEstate' : 'agricultural',
        method: selectedMethod,
        ...(selectedSubType ? { realEstateSubType: selectedSubType } : {}),
      } as StudyFormData;

      const response = await generateStudy(studyFormData);

      if (!response.success || !response.studyText) {
        throw new Error(response.error || t('generationError'));
      }

      const projectName = response.projectName || commonData.projectName || 'Unnamed_Project';
      await downloadStudyHtml(
        response.studyText,
        projectName,
        { prompt: response.prompt, category: selectedCategory }
      );
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : t('generationError')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const renderCategoryForm = () => {
    if (selectedCategory === 'realEstate') {
      return <RealEstateForm formData={categoryData} onChange={setCategoryData} subType={selectedSubType} />;
    }
    if (selectedCategory === 'agricultural') {
      return <AgriculturalForm formData={categoryData} onChange={setCategoryData} />;
    }
    return null;
  };

  const subTypeOptions: { key: RealEstateSubType; icon: string }[] = [
    { key: 'integrated',  icon: '🏙️' },
    { key: 'residential', icon: '🏠' },
    { key: 'industrial',  icon: '🏭' },
    { key: 'efficiency',  icon: '⚡' },
    { key: 'finishing',   icon: '🎨' },
  ];

  const header = showHeader ? (
    <div className="easy-topbar">
      <div className="flex items-center gap-3">
        <Link href="/" className="easy-back-btn">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
        </Link>
        <div>
          <div className="easy-page-title">{t('newStudyTitle')}</div>
          <div className="easy-page-sub">{t('newStudySub', { current: currentStep, total: 3 })}</div>
        </div>
      </div>
    </div>
  ) : null;

  const wizardContent = (
    <div className="easy-new-study-wrap">
      {/* Progress Bar */}
      <div className="easy-progress-bar-wrap">
        <div className="easy-progress-bar" style={{ width: `${(currentStep / 3) * 100}%` }} />
      </div>

      {/* ── STEP 1 ── */}
      {currentStep === 1 && (
        <div>
          <div className="easy-step-label">
            <span className="easy-step-dot" />
            {t('step', { current: 1, total: 3, title: t('step1Title') })}
          </div>

          {/* Main Categories — 2 cards */}
          <div className="easy-section-title" style={{ marginBottom: '10px' }}>
            {t('projectType')}
          </div>
          <div className="easy-main-categories">
            <button
              className={`easy-main-cat ${selectedCategory === 'realEstate' ? 'sel' : ''}`}
              onClick={() => { setSelectedCategory('realEstate'); setSelectedSubType(null); }}
            >
              <div className="easy-main-cat-icon">🏢</div>
              <div className="easy-main-cat-name">{t('studyTypes.realEstate')}</div>
              <div className="easy-main-cat-desc">{t('studyTypes.realEstateDesc')}</div>
            </button>
            <button
              className={`easy-main-cat ${selectedCategory === 'agricultural' ? 'sel' : ''}`}
              onClick={() => { setSelectedCategory('agricultural'); setSelectedSubType(null); }}
            >
              <div className="easy-main-cat-icon">🌾</div>
              <div className="easy-main-cat-name">{t('studyTypes.agricultural')}</div>
              <div className="easy-main-cat-desc">{t('studyTypes.agriculturalDesc')}</div>
            </button>
          </div>

          {/* Real Estate Sub-types */}
          {selectedCategory === 'realEstate' && (
            <div className="easy-subtype-section">
              <div className="easy-section-title" style={{ marginBottom: '8px', marginTop: '14px' }}>
                {t('selectSubCategory')}
              </div>
              <div className="easy-subtype-grid">
                {subTypeOptions.map(({ key, icon }) => (
                  <button
                    key={key}
                    className={`easy-subtype-btn ${selectedSubType === key ? 'sel' : ''}`}
                    onClick={() => setSelectedSubType(key)}
                  >
                    <span className="easy-subtype-icon">{icon}</span>
                    <span className="easy-subtype-name">{t(`realEstateSubTypes.${key}`)}</span>
                    <span className="easy-subtype-desc">{t(`realEstateSubTypes.${key}Desc`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Method Selection */}
          <div className="easy-section-title" style={{ marginBottom: '10px', marginTop: '18px' }}>
            {t('accuracyMethod')}
          </div>
          <div className="easy-method-row">
            <button
              className={`easy-method-card ${selectedMethod === 'fast' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('fast')}
            >
              <span className="easy-method-badge easy-badge-fast">⚡ {t('methodFast')}</span>
              <div className="easy-method-title">{t('methodFastTitle')}</div>
              <div className="easy-method-desc">{t('methodFastDesc')}</div>
            </button>
            <button
              className={`easy-method-card ${selectedMethod === 'full' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('full')}
            >
              <span className="easy-method-badge easy-badge-full">✦ {t('methodFull')}</span>
              <div className="easy-method-title">{t('methodFullTitle')}</div>
              <div className="easy-method-desc">{t('methodFullDesc')}</div>
            </button>
          </div>

          <div className="easy-btn-row">
            <button
              className="easy-btn-primary"
              onClick={handleNext}
              disabled={!canProceedFromStep1}
              style={{ opacity: canProceedFromStep1 ? 1 : 0.45 }}
            >
              {t('next')}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {currentStep === 2 && (
        <div>
          <div className="easy-step-label">
            <span className="easy-step-dot" />
            {t('step', { current: 2, total: 3, title: t('step2Title') })}
          </div>

          {/* Show selected path */}
          <div className="easy-selected-path">
            <span className="easy-path-tag">
              {selectedCategory === 'realEstate' ? '🏢' : '🌾'}
              {' '}{t(`studyTypes.${selectedCategory}`)}
            </span>
            {selectedSubType && (
              <>
                <span className="easy-path-arrow">›</span>
                <span className="easy-path-tag">
                  {t(`realEstateSubTypes.${selectedSubType}`)}
                </span>
              </>
            )}
            <span className="easy-path-arrow">›</span>
            <span className="easy-path-tag">
              {selectedMethod === 'fast' ? `⚡ ${t('methodFast')}` : `✦ ${t('methodFull')}`}
            </span>
          </div>

          {/* ── Data entry method choice ── */}
          {dataEntryMethod === 'pending' ? (
            <DataEntryMethodScreen t={t} onChoose={setDataEntryMethod} />
          ) : (
            <>
              {/* Method toggle bar */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  onClick={() => setDataEntryMethod('pending')}
                  style={{
                    padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                    border: '1.5px solid #ddd', background: '#f8f9fa', color: '#666',
                  }}
                >
                  ← {t('entryMethodTitle').split('؟')[0]}
                </button>
                <span style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
                  background: dataEntryMethod === 'documents' ? '#1e3a5f' : '#e8f4e8',
                  color: dataEntryMethod === 'documents' ? 'white' : '#2d7a2d',
                  border: '1.5px solid transparent',
                }}>
                  {dataEntryMethod === 'documents' ? `📎 ${t('entryMethodDocs')}` : `✏️ ${t('entryMethodManual')}`}
                </span>
              </div>

              {dataEntryMethod === 'documents' ? (
                <DocumentUploadSection t={t} />
              ) : (
                <>
                  <CommonFields formData={commonData} onChange={setCommonData} />
                  {renderCategoryForm()}
                </>
              )}

              <div className="easy-btn-row">
                <button
                  className="easy-btn-primary"
                  onClick={handleNext}
                  disabled={!canStartStudy}
                  style={{ opacity: canStartStudy ? 1 : 0.45 }}
                >
                  {t('startStudy')}
                </button>
                <button className="easy-btn-secondary" onClick={handlePrevious}>{t('previous')}</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 3 ── */}
      {currentStep === 3 && (
        <div>
          <div className="easy-step-label">
            <span className="easy-step-dot" />
            {t('step', { current: 3, total: 3, title: t('step3Title') })}
          </div>

          <div className="easy-upload-area" onClick={() => {}}>
            <div className="easy-upload-icon">📄</div>
            <div className="easy-upload-title">{t('uploadTitle')}</div>
            <div className="easy-upload-sub">{t('uploadSubtitle')}</div>
            <button
              className="easy-btn-secondary"
              style={{ fontSize: '12px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {t('chooseFiles')}
            </button>
          </div>

          <div className="easy-info-note">
            <span className="easy-info-note-icon">ℹ️</span>
            <span className="easy-info-note-text">{t('uploadNote')}</span>
          </div>

          <div className="easy-tab-row">
            <button className={`easy-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
              {t('tabsLandLicense')}
            </button>
            <button className={`easy-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
              {t('tabsAutocad')}
            </button>
            <button className={`easy-tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
              {t('tabsFinishing')}
            </button>
          </div>

          <div className="easy-empty-state">{t('noFilesUploaded')}</div>

          <div className="easy-btn-row">
            <button
              className="easy-btn-primary"
              onClick={handleGenerateStudy}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><span className="easy-spinner" />{t('generatingStudy')}</>
              ) : (
                t('startStudy')
              )}
            </button>
            <button className="easy-btn-secondary" onClick={handlePrevious}>{t('previous')}</button>
          </div>

          {generationError && (
            <div className="easy-error-toast">
              <span>{generationError}</span>
              <button onClick={() => setGenerationError(null)} className="easy-error-dismiss">✕</button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {header}
      <div className="easy-content">
        <div className="easy-screen active">
          <div className="easy-card">
            {wizardContent}
          </div>
        </div>
      </div>
    </div>
  );
}
