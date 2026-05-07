import React from 'react';
import type { ProjectType, ProjectStatus } from '@/lib/types/project';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}

// Project type badge with specific colors
const projectTypeColors: Record<ProjectType, { bg: string; text: string }> = {
  residential: { bg: 'bg-blue-100', text: 'text-blue-700' },
  commercial: { bg: 'bg-purple-100', text: 'text-purple-700' },
  industrial: { bg: 'bg-orange-100', text: 'text-orange-700' },
  'mixed-use': { bg: 'bg-teal-100', text: 'text-teal-700' },
};

export function ProjectTypeBadge({ type, label }: { type: ProjectType; label?: string }) {
  // Handle both lowercase (frontend) and uppercase (from Prisma) types
  const normalizedType = type.toLowerCase().replace('_', '-') as ProjectType;
  const colors = projectTypeColors[normalizedType] || projectTypeColors.residential;
  const displayLabel = label || type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ').replace('-', ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
      {displayLabel}
    </span>
  );
}

// Status badge
const statusColors: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  draft: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  archived: { bg: 'bg-slate-100', text: 'text-slate-400', dot: 'bg-slate-300' },
};

export function StatusBadge({ status, label }: { status: ProjectStatus; label?: string }) {
  // Handle both lowercase (frontend) and uppercase (from Prisma) statuses
  const normalizedStatus = status.toLowerCase() as ProjectStatus;
  const colors = statusColors[normalizedStatus] || statusColors.draft;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {displayLabel}
    </span>
  );
}