'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LandTab }          from './integrated/LandTab';
import { ComponentsTab }    from './integrated/ComponentsTab';
import { ResidentialTab }   from './integrated/ResidentialTab';
import { CommercialTab }    from './integrated/CommercialTab';
import { AdminTab }         from './integrated/AdminTab';
import { MedicalTab }       from './integrated/MedicalTab';
import { HotelTab }         from './integrated/HotelTab';
import { EntertainmentTab } from './integrated/EntertainmentTab';
import { SalesPlanTab }     from './integrated/SalesPlanTab';

interface IntegratedFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

type TabId = 'land' | 'components' | 'residential' | 'commercial' | 'administrative' | 'medical' | 'hotel' | 'entertainment' | 'salesPlan';

interface TabDef {
  id: TabId;
  icon: string;
  labelKey: string;
  conditionKey?: string;
}

const ALL_TABS: TabDef[] = [
  { id: 'land',           icon: '🗺️', labelKey: 'landTab' },
  { id: 'components',     icon: '⚙️', labelKey: 'componentsTab' },
  { id: 'residential',    icon: '🏠', labelKey: 'residentialTab',    conditionKey: 'hasResidential' },
  { id: 'commercial',     icon: '🏬', labelKey: 'commercialTab',     conditionKey: 'hasCommercial' },
  { id: 'administrative', icon: '🏢', labelKey: 'adminTab',          conditionKey: 'hasAdministrative' },
  { id: 'medical',        icon: '🏥', labelKey: 'medicalTab',        conditionKey: 'hasMedical' },
  { id: 'hotel',          icon: '🏨', labelKey: 'hotelTab',          conditionKey: 'hasHotel' },
  { id: 'entertainment',  icon: '🎭', labelKey: 'entertainmentTab',  conditionKey: 'hasEntertainment' },
  { id: 'salesPlan',      icon: '💰', labelKey: 'salesPlanTab' },
];

export function IntegratedForm({ formData, onChange }: IntegratedFormProps) {
  const ti = useTranslations('easyStart.integrated');
  const [activeTab, setActiveTab] = useState<TabId>('land');

  const visibleTabs = ALL_TABS.filter(
    (tab) => !tab.conditionKey || formData[tab.conditionKey] === 'true'
  );

  // If activeTab became hidden after toggling a component off, reset to 'components'
  const currentTab = visibleTabs.find(t => t.id === activeTab)
    ? activeTab
    : 'components';

  const renderContent = () => {
    switch (currentTab) {
      case 'land':           return <LandTab          formData={formData} onChange={onChange} />;
      case 'components':     return <ComponentsTab    formData={formData} onChange={onChange} />;
      case 'residential':    return <ResidentialTab   formData={formData} onChange={onChange} />;
      case 'commercial':     return <CommercialTab    formData={formData} onChange={onChange} />;
      case 'administrative': return <AdminTab         formData={formData} onChange={onChange} />;
      case 'medical':        return <MedicalTab       formData={formData} onChange={onChange} />;
      case 'hotel':          return <HotelTab         formData={formData} onChange={onChange} />;
      case 'entertainment':  return <EntertainmentTab formData={formData} onChange={onChange} />;
      case 'salesPlan':      return <SalesPlanTab     formData={formData} onChange={onChange} />;
      default:               return null;
    }
  };

  return (
    <div className="easy-integrated-wrap">
      {/* Tab bar */}
      <div className="easy-integrated-tabs">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`easy-integrated-tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="easy-integrated-tab-icon">{tab.icon}</span>
            <span className="easy-integrated-tab-label">{ti(tab.labelKey)}</span>
            {/* dot badge for component tabs */}
            {tab.conditionKey && formData[tab.conditionKey] === 'true' && (
              <span className="easy-integrated-tab-dot" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="easy-integrated-content">
        {renderContent()}
      </div>
    </div>
  );
}
