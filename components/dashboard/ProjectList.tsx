'use client';

import { useTranslations } from 'next-intl';

type ProjectStatus = 'done' | 'prog' | 'new';
type ProjectIcon = 'hosp' | 'res' | 'com' | 'agr';

interface Project {
  id: string;
  nameKey: string;
  metaKey: string;
  costKey: string;
  status: ProjectStatus;
  icon: ProjectIcon;
}

interface ProjectListProps {
  projects: Project[];
}

const iconEmojis: Record<ProjectIcon, string> = {
  hosp: '🏥',
  res: '🏗️',
  com: '🏖️',
  agr: '🌿',
};

const statusClasses: Record<ProjectStatus, string> = {
  done: 'easy-st-done',
  prog: 'easy-st-prog',
  new: 'easy-st-new',
};

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations('easyStart');

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'done':
        return t('kpiActive');
      case 'prog':
        return t('kpiInProgressLabel');
      case 'new':
        return t('kpiNewThisMonth', { count: '' }).replace('+', '').trim();
    }
  };

  return (
    <div className="easy-proj-card">
      <div className={`easy-proj-icon easy-ic-${project.icon}`}>
        {iconEmojis[project.icon]}
      </div>
      <div className="easy-proj-info">
        <div className="easy-proj-name">{t(project.nameKey)}</div>
        <div className="easy-proj-meta">{t(project.metaKey)}</div>
      </div>
      <div className="easy-proj-right">
        <div className="easy-proj-cost">{t(project.costKey)}</div>
        <span className={`easy-proj-status ${statusClasses[project.status]}`}>
          {getStatusLabel(project.status)}
        </span>
      </div>
    </div>
  );
}

export function ProjectList({ projects }: ProjectListProps) {
  const t = useTranslations('easyStart');

  return (
    <>
      <div className="easy-section-head">
        <div className="easy-section-title">{t('recentStudies')}</div>
        <div className="easy-section-link">{t('viewAll')}</div>
      </div>

      <div className="easy-proj-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}