'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const SECTORS = [
  { key: 'residential',    icon: '🏠' },
  { key: 'commercial',     icon: '🏬' },
  { key: 'administrative', icon: '🏢' },
  { key: 'medical',        icon: '🏥' },
  { key: 'hotel',          icon: '🏨' },
  { key: 'entertainment',  icon: '🎭' },
] as const;

type SectorKey = typeof SECTORS[number]['key'];

const ORDINALS_AR = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];
const ORDINALS_EN = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

const SECTOR_LABELS: Record<string, { ar: string; en: string }> = {
  residential:    { ar: 'سكني',   en: 'Residential' },
  commercial:     { ar: 'تجاري',  en: 'Commercial' },
  administrative: { ar: 'إداري',  en: 'Administrative' },
  medical:        { ar: 'طبي',    en: 'Medical' },
  hotel:          { ar: 'فندقي',  en: 'Hotel' },
  entertainment:  { ar: 'ترفيهي', en: 'Entertainment' },
};

interface PhaseData {
  sectors: SectorKey[];
  pricePerSqm: string;
  percentOfTotal: string;
  durationMonths: string;
}

export function SalesStudyPage() {
  const t = useTranslations('easyStart');
  const isAr = t('logo') === 'ستيدي بيلدر';

  const [projectName, setProjectName]       = useState('');
  const [location, setLocation]             = useState('');
  const [totalArea, setTotalArea]           = useState('');
  const [selectedSectors, setSelectedSectors] = useState<SectorKey[]>([]);
  const [phaseCount, setPhaseCount]         = useState(0);
  const [phases, setPhases]                 = useState<PhaseData[]>([]);
  const [totalDuration, setTotalDuration]   = useState('');
  const [notes, setNotes]                   = useState('');

  const toggleSector = (key: SectorKey) => {
    setSelectedSectors(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handlePhaseCountChange = (n: number) => {
    setPhaseCount(n);
    setPhases(prev => {
      const next = [...prev];
      while (next.length < n) next.push({ sectors: [], pricePerSqm: '', percentOfTotal: '', durationMonths: '' });
      return next.slice(0, n);
    });
  };

  const updatePhase = (idx: number, field: keyof PhaseData, value: string | SectorKey[]) => {
    setPhases(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const togglePhaseSector = (idx: number, key: SectorKey) => {
    const current = phases[idx]?.sectors ?? [];
    const next: SectorKey[] = current.includes(key)
      ? current.filter(s => s !== key)
      : [...current, key];
    updatePhase(idx, 'sectors', next);
  };

  const canGenerate = projectName.trim() !== '' && selectedSectors.length > 0 && phaseCount > 0;

  const label = (key: string) => isAr ? SECTOR_LABELS[key]?.ar : SECTOR_LABELS[key]?.en;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div className="easy-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="easy-back-btn">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
          <div>
            <div className="easy-page-title">{t('salesStudyTitle')}</div>
            <div className="easy-page-sub">{t('salesStudySub')}</div>
          </div>
        </div>
      </div>

      <div className="easy-content">
        <div className="easy-new-study-wrap">

          {/* Basic Info */}
          <div className="easy-section-title" style={{ marginBottom: '10px' }}>
            {isAr ? 'بيانات المشروع' : 'Project Information'}
          </div>
          <div className="easy-form-row" style={{ marginBottom: '10px' }}>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {isAr ? 'اسم المشروع' : 'Project Name'}
                <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
              </label>
              <input
                className="easy-form-input"
                placeholder={isAr ? 'مثال: مشروع الواجهة التجارية' : 'e.g. Commercial Front Project'}
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {isAr ? 'الموقع' : 'Location'}
                <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
              </label>
              <input
                className="easy-form-input"
                placeholder={isAr ? 'المحافظة / المنطقة' : 'Governorate / District'}
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="easy-form-row" style={{ marginBottom: '20px' }}>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {isAr ? 'إجمالي المساحة القابلة للبيع (م²)' : 'Total Sellable Area (m²)'}
                <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
              </label>
              <input
                type="number"
                className="easy-form-input"
                placeholder="0"
                value={totalArea}
                onChange={e => setTotalArea(e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {isAr ? 'مدة البيع الإجمالية' : 'Total Sales Duration'}
                <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
              </label>
              <input
                className="easy-form-input"
                placeholder={isAr ? 'مثال: 3 سنوات' : 'e.g. 3 years'}
                value={totalDuration}
                onChange={e => setTotalDuration(e.target.value)}
              />
            </div>
          </div>

          {/* Sector Selection */}
          <div className="easy-section-title" style={{ marginBottom: '10px' }}>
            {isAr ? 'مكونات المشروع' : 'Project Components'}
            <span className="easy-field-badge easy-field-required" style={{ marginRight: '6px' }}>{t('fieldRequired')}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {SECTORS.map(({ key, icon }) => {
              const sel = selectedSectors.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px',
                    border: `1.5px solid ${sel ? 'var(--purple)' : 'var(--border-dark)'}`,
                    borderRadius: '20px',
                    background: sel ? 'var(--purple-light)' : '#fff',
                    color: sel ? 'var(--purple-dark)' : 'var(--text)',
                    fontWeight: sel ? 700 : 500,
                    fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  onClick={() => toggleSector(key)}
                >
                  <span>{icon}</span>
                  <span>{label(key)}</span>
                  {sel && <span style={{ color: 'var(--purple)', fontWeight: 800 }}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* Phase Count */}
          <div className="easy-section-title" style={{ marginBottom: '10px' }}>
            {isAr ? 'مراحل البيع' : 'Sales Phases'}
            <span className="easy-field-badge easy-field-required" style={{ marginRight: '6px' }}>{t('fieldRequired')}</span>
          </div>
          <div className="easy-form-group" style={{ maxWidth: '200px', marginBottom: '20px' }}>
            <select
              className="easy-form-input"
              value={phaseCount}
              onChange={e => handlePhaseCountChange(Number(e.target.value))}
            >
              <option value={0}>{isAr ? 'اختر عدد المراحل' : 'Choose phase count'}</option>
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n}>
                  {n} {isAr ? (n === 1 ? 'مرحلة' : 'مراحل') : (n === 1 ? 'phase' : 'phases')}
                </option>
              ))}
            </select>
          </div>

          {/* Phase Cards */}
          {phaseCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {phases.map((phase, i) => (
                <div key={i} className="easy-phase-card">
                  <div className="easy-phase-card-header">
                    <span className="easy-phase-num">{i + 1}</span>
                    <span>
                      {isAr ? `المرحلة ${ORDINALS_AR[i]}` : `${ORDINALS_EN[i]} Phase`}
                    </span>
                  </div>

                  {selectedSectors.length > 0 ? (
                    <div style={{ marginBottom: '12px' }}>
                      <p className="easy-phase-hint">
                        {isAr ? 'اختر القطاعات التي تُباع في هذه المرحلة:' : 'Select sectors sold in this phase:'}
                      </p>
                      <div className="easy-phase-sectors">
                        {selectedSectors.map(key => {
                          const sel = phase.sectors.includes(key);
                          const ico = SECTORS.find(s => s.key === key)?.icon;
                          return (
                            <button
                              key={key}
                              type="button"
                              className={`easy-phase-sector-btn${sel ? ' sel' : ''}`}
                              onClick={() => togglePhaseSector(i, key)}
                            >
                              <span>{ico}</span>
                              <span>{label(key)}</span>
                              {sel && <span className="easy-phase-check">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="easy-phase-hint" style={{ color: '#f59e0b' }}>
                      {isAr ? 'اختر مكونات المشروع أولاً' : 'Select project components first'}
                    </p>
                  )}

                  <div className="easy-form-row">
                    <div className="easy-form-group">
                      <label className="easy-form-label">
                        {isAr ? 'سعر البيع (جنيه/م²)' : 'Sale Price (EGP/m²)'}
                        <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
                      </label>
                      <input
                        type="number"
                        className="easy-form-input"
                        placeholder="0"
                        value={phase.pricePerSqm}
                        onChange={e => updatePhase(i, 'pricePerSqm', e.target.value)}
                      />
                    </div>
                    <div className="easy-form-group">
                      <label className="easy-form-label">
                        {isAr ? 'نسبة من الإجمالي (%)' : 'Share of total (%)'}
                        <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
                      </label>
                      <input
                        type="number"
                        className="easy-form-input"
                        placeholder="0"
                        value={phase.percentOfTotal}
                        onChange={e => updatePhase(i, 'percentOfTotal', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="easy-form-group" style={{ marginTop: '6px' }}>
                    <label className="easy-form-label">
                      {isAr ? 'مدة المرحلة (أشهر)' : 'Phase duration (months)'}
                      <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
                    </label>
                    <input
                      type="number"
                      className="easy-form-input"
                      placeholder="0"
                      value={phase.durationMonths}
                      onChange={e => updatePhase(i, 'durationMonths', e.target.value)}
                      style={{ maxWidth: '160px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {phaseCount === 0 && (
            <div className="easy-phase-empty" style={{ marginBottom: '20px' }}>
              {isAr ? 'حدد عدد مراحل البيع بالأعلى لتظهر تفاصيل كل مرحلة' : 'Set the number of sales phases above to configure each phase'}
            </div>
          )}

          {/* Notes */}
          <div className="easy-form-group" style={{ marginBottom: '20px' }}>
            <label className="easy-form-label">
              {isAr ? 'ملاحظات إضافية' : 'Additional Notes'}
              <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
            </label>
            <textarea
              className="easy-form-input"
              rows={3}
              style={{ resize: 'vertical' }}
              placeholder={isAr ? 'أي تفاصيل إضافية تتعلق بخطة البيع...' : 'Any additional details about the sales plan...'}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Hint */}
          {!canGenerate && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#FFFDE7', border: '1px solid #F9A825',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '12px',
              fontSize: '12px', color: '#795548',
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span>
                {projectName.trim() === ''
                  ? (isAr ? 'أدخل اسم المشروع أولاً' : 'Enter the project name first')
                  : selectedSectors.length === 0
                  ? (isAr ? 'اختر مكونات المشروع' : 'Select project components')
                  : (isAr ? 'اختر عدد مراحل البيع' : 'Set the number of sales phases')}
              </span>
            </div>
          )}

          {/* Generate Button */}
          <div className="easy-btn-row">
            <button
              className="easy-btn-primary"
              disabled={!canGenerate}
              style={{ opacity: canGenerate ? 1 : 0.45 }}
              onClick={() => {}}
            >
              📊 {isAr ? 'إنشاء الدراسة البيعية' : 'Generate Sales Study'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
