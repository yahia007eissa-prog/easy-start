'use client';

import { useTranslations } from 'next-intl';

interface ComponentsTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

interface ComponentCard {
  key: string;
  icon: string;
  labelKey: string;
}

const COMPONENTS: ComponentCard[] = [
  { key: 'hasResidential',    icon: '🏠', labelKey: 'residential' },
  { key: 'hasCommercial',     icon: '🏬', labelKey: 'commercial' },
  { key: 'hasAdministrative', icon: '🏢', labelKey: 'administrative' },
  { key: 'hasMedical',        icon: '🏥', labelKey: 'medical' },
  { key: 'hasHotel',          icon: '🏨', labelKey: 'hotel' },
  { key: 'hasEntertainment',  icon: '🎭', labelKey: 'entertainment' },
];

export function ComponentsTab({ formData, onChange }: ComponentsTabProps) {
  const t  = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');

  const toggle = (key: string) => {
    const current = formData[key] === 'true';
    onChange({ ...formData, [key]: current ? 'false' : 'true' });
  };

  return (
    <div className="easy-tab-content">
      <div className="easy-components-hint">{ti('selectComponentsHint')}</div>

      <div className="easy-components-grid">
        {COMPONENTS.map(({ key, icon, labelKey }) => {
          const selected = formData[key] === 'true';
          return (
            <button
              key={key}
              type="button"
              className={`easy-component-card ${selected ? 'sel' : ''}`}
              onClick={() => toggle(key)}
            >
              <span className="easy-component-check">{selected ? '✓' : ''}</span>
              <div className="easy-component-icon">{icon}</div>
              <div className="easy-component-name">{ti(labelKey)}</div>
            </button>
          );
        })}
      </div>

      {/* No components selected warning */}
      {COMPONENTS.every(c => formData[c.key] !== 'true') && (
        <div className="easy-info-note" style={{ marginTop: '12px' }}>
          <span className="easy-info-note-icon">💡</span>
          <span className="easy-info-note-text">{ti('selectComponents')}</span>
        </div>
      )}
    </div>
  );
}
