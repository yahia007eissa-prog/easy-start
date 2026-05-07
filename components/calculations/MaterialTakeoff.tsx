'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { useProjectStore } from '@/lib/hooks/useProjects';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import type { ConstructionPhase, MaterialItem, LaborItem } from '@/lib/types/project';
import { useTranslations } from 'next-intl';

export function MaterialTakeoff({ projectId }: { projectId: string }) {
  const t = useTranslations('takeoff');
  const tUnits = useTranslations('units');
  const { projects, updateMaterialTakeoff, addMaterialItem, addLaborItem } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [newMaterial, setNewMaterial] = useState({ category: '', name: '', unit: '', quantity: 0, wasteFactor: 5, unitCost: 0 });
  const [newLabor, setNewLabor] = useState({ task: '', hoursPerUnit: 0, unitCount: 0, hourlyRate: 0 });

  if (!project) return null;

  const takeoff = project.calculations.materialTakeoff;

  // Calculate totals
  let totalMaterials = 0;
  let totalLaborHours = 0;
  let totalCost = 0;

  takeoff.phases.forEach((phase) => {
    phase.materials.forEach((item) => {
      totalMaterials += item.total;
      totalCost += item.total;
    });
    phase.labor.forEach((item) => {
      totalLaborHours += item.totalHours;
      totalCost += item.total;
    });
  });

  const handleAddMaterial = (phaseId: string) => {
    if (!newMaterial.name) return;
    addMaterialItem(projectId, phaseId, newMaterial);
    setNewMaterial({ category: '', name: '', unit: '', quantity: 0, wasteFactor: 5, unitCost: 0 });
  };

  const handleAddLabor = (phaseId: string) => {
    if (!newLabor.task) return;
    addLaborItem(projectId, phaseId, newLabor);
    setNewLabor({ task: '', hoursPerUnit: 0, unitCount: 0, hourlyRate: 0 });
  };

  const getPhaseTotals = (phase: ConstructionPhase) => {
    const materials = phase.materials.reduce((s, m) => s + m.total, 0);
    const labor = phase.labor.reduce((s, l) => s + l.total, 0);
    const laborHours = phase.labor.reduce((s, l) => s + l.totalHours, 0);
    return { materials, labor, total: materials + labor, laborHours };
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <p className="text-sm text-blue-600 mb-1">{t('totalMaterialsCost')}</p>
          <p className="text-2xl font-semibold text-blue-700">{formatCurrency(totalMaterials)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <p className="text-sm text-emerald-600 mb-1">{t('totalLaborHours')}</p>
          <p className="text-2xl font-semibold text-emerald-700">{formatNumber(totalLaborHours)} {tUnits('hrs')}</p>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <p className="text-sm text-amber-600 mb-1">{t('laborCost')}</p>
          <p className="text-2xl font-semibold text-amber-700">
            {formatCurrency(takeoff.phases.reduce((s, p) => s + p.labor.reduce((ls, l) => ls + l.total, 0), 0))}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <p className="text-slate-400 text-sm mb-1">{t('grandTotal')}</p>
          <p className="text-2xl font-semibold text-white">{formatCurrency(totalCost)}</p>
        </Card>
      </div>

      {/* Construction Phases */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">{t('constructionPhases')}</h3>

        {takeoff.phases.map((phase) => {
          const phaseTotals = getPhaseTotals(phase);
          const isExpanded = expandedPhase === phase.id;

          return (
            <Card key={phase.id} padding="none">
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className="w-full p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                    {phase.order}
                  </span>
                  <div className="text-left">
                    <h4 className="text-base font-semibold text-slate-900">{phase.name}</h4>
                    <p className="text-sm text-slate-500">
                      {phase.materials.length} {t('materials')}, {phase.labor.length} {t('labor')} tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(phaseTotals.total)}</p>
                    <p className="text-sm text-slate-500">{formatNumber(phaseTotals.laborHours)} {tUnits('hrs')}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-6">
                  {/* Materials Section */}
                  <div>
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">{t('materials')}</h5>
                    <Table
                      columns={[
                        { key: 'name', header: 'Material', width: '30%' },
                        { key: 'category', header: 'Category', width: '15%' },
                        { key: 'quantity', header: 'Qty', width: '10%', align: 'right' as const, render: (item) => formatNumber(item.quantity) },
                        { key: 'adjusted', header: 'Adjusted', width: '10%', align: 'right' as const, render: (item) => formatNumber(item.adjustedQuantity) },
                        { key: 'unit', header: 'Unit', width: '10%' },
                        { key: 'unitCost', header: 'Unit Cost', width: '15%', align: 'right' as const, render: (item) => formatCurrency(item.unitCost) },
                        { key: 'total', header: 'Total', width: '15%', align: 'right' as const, render: (item) => formatCurrency(item.total) },
                      ]}
                      data={phase.materials}
                      emptyMessage="No materials added"
                    />
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-6 gap-3">
                      <Input
                        placeholder="Name"
                        value={newMaterial.name}
                        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                        className="md:col-span-2"
                      />
                      <Input
                        placeholder="Category"
                        value={newMaterial.category}
                        onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={newMaterial.quantity || ''}
                        onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseFloat(e.target.value) || 0 })}
                      />
                      <Input
                        type="number"
                        prefix="$"
                        placeholder="Cost"
                        value={newMaterial.unitCost || ''}
                        onChange={(e) => setNewMaterial({ ...newMaterial, unitCost: parseFloat(e.target.value) || 0 })}
                      />
                      <Button onClick={() => handleAddMaterial(phase.id)} size="sm">
                        <Plus className="w-4 h-4 me-1" />
                        {t('addNewItem')}
                      </Button>
                    </div>
                  </div>

                  {/* Labor Section */}
                  <div>
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">{t('labor')}</h5>
                    <Table
                      columns={[
                        { key: 'task', header: 'Task', width: '35%' },
                        { key: 'hoursPerUnit', header: 'Hrs/Unit', width: '15%', align: 'right' as const, render: (item) => item.hoursPerUnit.toFixed(1) },
                        { key: 'unitCount', header: 'Units', width: '10%', align: 'right' as const, render: (item) => formatNumber(item.unitCount) },
                        { key: 'totalHours', header: 'Total Hrs', width: '15%', align: 'right' as const, render: (item) => formatNumber(item.totalHours) },
                        { key: 'hourlyRate', header: 'Rate', width: '15%', align: 'right' as const, render: (item) => formatCurrency(item.hourlyRate) },
                        { key: 'total', header: 'Total', width: '15%', align: 'right' as const, render: (item) => formatCurrency(item.total) },
                      ]}
                      data={phase.labor}
                      emptyMessage="No labor tasks added"
                    />
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3">
                      <Input
                        placeholder="Task description"
                        value={newLabor.task}
                        onChange={(e) => setNewLabor({ ...newLabor, task: e.target.value })}
                        className="md:col-span-1"
                      />
                      <Input
                        type="number"
                        placeholder="Hrs/Unit"
                        value={newLabor.hoursPerUnit || ''}
                        onChange={(e) => setNewLabor({ ...newLabor, hoursPerUnit: parseFloat(e.target.value) || 0 })}
                      />
                      <Input
                        type="number"
                        placeholder="Units"
                        value={newLabor.unitCount || ''}
                        onChange={(e) => setNewLabor({ ...newLabor, unitCount: parseFloat(e.target.value) || 0 })}
                      />
                      <Input
                        type="number"
                        prefix="$"
                        placeholder="Rate/hr"
                        value={newLabor.hourlyRate || ''}
                        onChange={(e) => setNewLabor({ ...newLabor, hourlyRate: parseFloat(e.target.value) || 0 })}
                      />
                      <Button onClick={() => handleAddLabor(phase.id)} size="sm">
                        <Plus className="w-4 h-4 me-1" />
                        {t('addNewItem')}
                      </Button>
                    </div>
                  </div>

                  {/* Phase Total */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
                    <span className="text-sm font-medium text-slate-600">{t('phaseTotal')}</span>
                    <span className="text-lg font-semibold text-slate-900">{formatCurrency(phaseTotals.total)}</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}