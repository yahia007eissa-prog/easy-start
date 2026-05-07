'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { useProjectStore } from '@/lib/hooks/useProjects';
import { formatCurrency, formatPercent, formatDuration } from '@/lib/utils/formatters';
import { calculateROI } from '@/lib/utils/calculations';
import type { ExpenseLineItem } from '@/lib/types/project';
import { useTranslations } from 'next-intl';

export function ROICalculations({ projectId }: { projectId: string }) {
  const t = useTranslations('roi');
  const { projects, updateROICalculations, addExpenseItem, updateExpenseItem, removeExpenseItem } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [newExpense, setNewExpense] = useState({ description: '', amount: 0, category: 'fixed' as 'fixed' | 'variable', frequency: 'monthly' as 'monthly' | 'annual' });

  if (!project) return null;

  const roi = project.calculations.roiCalculations;
  const costEst = project.calculations.costEstimation;

  // Calculate ROI metrics
  const calculatedROI = calculateROI(costEst, roi);

  const handleAddExpense = () => {
    if (!newExpense.description) return;

    addExpenseItem(projectId, {
      description: newExpense.description,
      amount: newExpense.amount || 0,
      category: newExpense.category,
      frequency: newExpense.frequency,
    });

    setNewExpense({ description: '', amount: 0, category: 'fixed', frequency: 'monthly' });
  };

  const metricCards = [
    { label: t('monthlyRevenue'), value: formatCurrency(calculatedROI.monthlyRevenue), color: 'emerald' },
    { label: t('annualRevenue'), value: formatCurrency(calculatedROI.annualRevenue), color: 'emerald' },
    { label: t('netOperatingIncome'), value: formatCurrency(calculatedROI.netOperatingIncome), color: 'blue' },
    { label: t('capRate'), value: formatPercent(calculatedROI.capRate), color: 'purple' },
    { label: t('cashOnCashReturn'), value: formatPercent(calculatedROI.cashOnCashReturn), color: 'amber' },
    { label: t('paybackPeriod'), value: formatDuration(calculatedROI.paybackPeriod), color: 'slate' },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((metric) => (
          <Card key={metric.label} className={`${metric.color === 'emerald' ? 'bg-emerald-50 border-emerald-200' : metric.color === 'blue' ? 'bg-blue-50 border-blue-200' : metric.color === 'purple' ? 'bg-purple-50 border-purple-200' : metric.color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50'}`}>
            <p className={`text-xs ${metric.color === 'emerald' ? 'text-emerald-600' : metric.color === 'blue' ? 'text-blue-600' : metric.color === 'purple' ? 'text-purple-600' : metric.color === 'amber' ? 'text-amber-600' : 'text-slate-500'}`}>{metric.label}</p>
            <p className={`text-xl font-semibold ${metric.color === 'emerald' ? 'text-emerald-700' : metric.color === 'blue' ? 'text-blue-700' : metric.color === 'purple' ? 'text-purple-700' : metric.color === 'amber' ? 'text-amber-700' : 'text-slate-900'}`}>{metric.value}</p>
          </Card>
        ))}
      </div>

      {/* Revenue Input */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('revenue')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('monthlyRevenue')}
            type="number"
            prefix="$"
            value={roi.monthlyRevenue}
            onChange={(e) => updateROICalculations(projectId, { monthlyRevenue: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            hint={t('monthlyRevenueHint')}
          />
          <Input
            label={t('annualDebtService')}
            type="number"
            prefix="$"
            value={roi.annualDebtService}
            onChange={(e) => updateROICalculations(projectId, { annualDebtService: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            hint={t('annualDebtServiceHint')}
          />
        </div>
      </Card>

      {/* Operating Expenses */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('operatingExpenses')}</h3>
        <Table
          columns={[
            { key: 'description', header: t('description'), width: '35%' },
            { key: 'category', header: t('type'), width: '15%', render: (item) => (
              <span className={`px-2 py-0.5 text-xs rounded-full ${item.category === 'fixed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                {item.category === 'fixed' ? t('fixed') : t('variable')}
              </span>
            )},
            { key: 'amount', header: t('unitCost'), width: '20%', align: 'right' as const, render: (item) => formatCurrency(item.amount) },
            { key: 'frequency', header: t('frequency'), width: '15%', render: (item) => (
              <span className="text-sm text-slate-600">
                {item.frequency === 'monthly' ? 'Monthly' : t('annual')}
              </span>
            )},
            { key: 'annual', header: t('annual'), width: '20%', align: 'right' as const, render: (item) => formatCurrency(item.frequency === 'monthly' ? item.amount * 12 : item.amount) },
            { key: 'actions', header: '', width: '5%', align: 'right' as const, render: (item) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeExpenseItem(projectId, item.id);
                }}
                className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )},
          ]}
          data={roi.operatingExpenses}
          emptyMessage="No operating expenses added yet"
        />

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 mb-2">{t('addNewExpense')}</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder={t('description')}
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />
            <select
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as 'fixed' | 'variable' })}
            >
              <option value="fixed">{t('fixed')}</option>
              <option value="variable">{t('variable')}</option>
            </select>
            <Input
              type="number"
              prefix="$"
              placeholder={t('unitCost')}
              value={newExpense.amount || ''}
              onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
            />
            <select
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
              value={newExpense.frequency}
              onChange={(e) => setNewExpense({ ...newExpense, frequency: e.target.value as 'monthly' | 'annual' })}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">{t('annual')}</option>
            </select>
            <Button onClick={handleAddExpense}>
              <Plus className="w-4 h-4 me-1" />
              {t('addNewExpense')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="bg-slate-900 text-white">
        <h3 className="text-lg font-semibold mb-4">{t('financialSummary')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-sm">{t('grossAnnualRevenue')}</p>
            <p className="text-2xl font-bold">{formatCurrency(calculatedROI.annualRevenue)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">{t('totalOperatingExpenses')}</p>
            <p className="text-2xl font-bold">{formatCurrency(calculatedROI.totalOperatingExpenses)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">{t('netOperatingIncome')}</p>
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(calculatedROI.netOperatingIncome)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">{t('annualCashFlow')}</p>
            <p className={`text-2xl font-bold ${calculatedROI.annualCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(calculatedROI.annualCashFlow)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}