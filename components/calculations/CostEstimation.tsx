'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { useProjectStore } from '@/lib/hooks/useProjects';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { calculateCostEstimationTotals } from '@/lib/utils/calculations';
import type { CostLineItem } from '@/lib/types/project';
// CostLineItem type used in local component logic
import { useTranslations } from 'next-intl';

export function CostEstimation({ projectId }: { projectId: string }) {
  const t = useTranslations('cost');
  const { projects, updateCostEstimation, addCostLineItem, updateCostLineItem, removeCostLineItem } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [expandedSection, setExpandedSection] = useState<string | null>('materials');
  const [newItem, setNewItem] = useState({ category: '', description: '', unit: '', quantity: 0, unitCost: 0 });

  if (!project) return null;

  const costEst = project.calculations.costEstimation;
  const totals = calculateCostEstimationTotals(costEst);

  const handleAddItem = (category: 'materials' | 'labor' | 'overhead') => {
    if (!newItem.description || !newItem.unit) return;

    addCostLineItem(projectId, category, {
      ...newItem,
      quantity: newItem.quantity || 0,
      unitCost: newItem.unitCost || 0,
    });

    setNewItem({ category: '', description: '', unit: '', quantity: 0, unitCost: 0 });
  };

  const sectionColors = {
    materials: 'bg-blue-500',
    labor: 'bg-emerald-500',
    overhead: 'bg-amber-500',
  };

  const sections = [
    { id: 'materials', label: t('materials'), items: costEst.materials, total: costEst.materials.reduce((s, i) => s + i.total, 0) },
    { id: 'labor', label: t('labor'), items: costEst.labor, total: costEst.labor.reduce((s, i) => s + i.total, 0) },
    { id: 'overhead', label: t('overhead'), items: costEst.overhead, total: costEst.overhead.reduce((s, i) => s + i.total, 0) },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-50 to-white">
          <p className="text-sm text-slate-500 mb-1">{t('landCost')}</p>
          <p className="text-2xl font-semibold text-slate-900">{formatCurrency(costEst.landCost)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-50 to-white">
          <p className="text-sm text-slate-500 mb-1">{t('constructionCost')}</p>
          <p className="text-2xl font-semibold text-slate-900">{formatCurrency(costEst.totalConstructionCost)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-50 to-white">
          <p className="text-sm text-slate-500 mb-1">{t('lineItemsTotal')}</p>
          <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totals.subtotal - costEst.landCost - costEst.totalConstructionCost)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <p className="text-sm text-amber-600 mb-1">{t('grandTotal')}</p>
          <p className="text-2xl font-semibold text-amber-700">{formatCurrency(totals.grandTotal)}</p>
        </Card>
      </div>

      {/* Base Costs */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Base Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label={t('landCost')}
            type="number"
            prefix="$"
            value={costEst.landCost}
            onChange={(e) => updateCostEstimation(projectId, { landCost: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />
          <Input
            label={t('constructionCostPerSqft')}
            type="number"
            prefix="$"
            value={costEst.constructionCostPerSqft}
            onChange={(e) => {
              const costPerSqft = parseFloat(e.target.value) || 0;
              updateCostEstimation(projectId, {
                constructionCostPerSqft: costPerSqft,
                totalConstructionCost: costPerSqft * (project.residentialData?.totalSqft || project.commercialData?.totalSqft || project.industrialData?.totalSqft || 0)
              });
            }}
            placeholder="0"
          />
          <Input
            label={t('totalConstructionCost')}
            type="number"
            prefix="$"
            value={costEst.totalConstructionCost}
            onChange={(e) => updateCostEstimation(projectId, { totalConstructionCost: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            disabled
            hint={t('autoCalculated')}
          />
        </div>
      </Card>

      {/* Line Items Sections */}
      {sections.map((section) => (
        <Card key={section.id}>
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${sectionColors[section.id as keyof typeof sectionColors]}`} />
              <h3 className="text-lg font-semibold text-slate-900">{section.label}</h3>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                {section.items.length} {t('items')}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-slate-700">{formatCurrency(section.total)}</span>
              {expandedSection === section.id ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </button>

          {expandedSection === section.id && (
            <>
              <Table
                columns={[
                  { key: 'description', header: t('description'), width: '30%' },
                  { key: 'unit', header: t('unit'), width: '10%' },
                  { key: 'quantity', header: t('qty'), width: '10%', align: 'right' as const, render: (item) => item.quantity.toLocaleString() },
                  { key: 'unitCost', header: t('unitCost'), width: '15%', align: 'right' as const, render: (item) => formatCurrency(item.unitCost) },
                  { key: 'total', header: t('total'), width: '15%', align: 'right' as const, render: (item) => formatCurrency(item.total) },
                  { key: 'actions', header: '', width: '10%', align: 'right' as const, render: (item) => (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCostLineItem(projectId, section.id as 'materials' | 'labor' | 'overhead', item.id);
                      }}
                      className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )},
                ]}
                data={section.items}
                emptyMessage="No line items added yet"
              />

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">{t('addNewItem')}</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Input
                    placeholder={t('description')}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                  <Input
                    placeholder={t('unit')}
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder={t('qty')}
                    value={newItem.quantity || ''}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    prefix="$"
                    placeholder={t('unitCost')}
                    value={newItem.unitCost || ''}
                    onChange={(e) => setNewItem({ ...newItem, unitCost: parseFloat(e.target.value) || 0 })}
                  />
                  <Button onClick={() => handleAddItem(section.id as 'materials' | 'labor' | 'overhead')}>
                    <Plus className="w-4 h-4 me-1" />
                    {t('addNewItem')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      ))}

      {/* Margins */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('contingencyProfit')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label={t('contingencyPercent')}
            type="number"
            suffix="%"
            value={costEst.contingencyPercent}
            onChange={(e) => updateCostEstimation(projectId, { contingencyPercent: parseFloat(e.target.value) || 0 })}
            placeholder="10"
          />
          <Input
            label={t('profitMarginPercent')}
            type="number"
            suffix="%"
            value={costEst.profitMarginPercent}
            onChange={(e) => updateCostEstimation(projectId, { profitMarginPercent: parseFloat(e.target.value) || 0 })}
            placeholder="15"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('contingencyAmount')}</label>
            <div className="px-4 py-2.5 bg-slate-50 rounded-xl text-lg font-semibold text-slate-700">
              {formatCurrency(totals.contingency)}
            </div>
          </div>
        </div>
      </Card>

      {/* Grand Total */}
      <Card className="bg-slate-900 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{t('grandTotal')}</p>
            <p className="text-3xl font-bold">{formatCurrency(totals.grandTotal)}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-slate-400 text-sm">{t('subtotal')}: {formatCurrency(totals.subtotal)}</p>
            <p className="text-slate-400 text-sm">Contingency ({costEst.contingencyPercent}%): {formatCurrency(totals.contingency)}</p>
            <p className="text-slate-400 text-sm">Profit Margin ({costEst.profitMarginPercent}%): {formatCurrency(totals.grandTotal - totals.subtotal - totals.contingency)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}