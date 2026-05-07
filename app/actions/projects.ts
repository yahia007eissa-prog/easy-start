'use server';

/* Prisma imports commented out for Vercel deployment
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { ProjectType, ProjectStatus } from '@prisma/client';
*/

// =====================
// PLACEHOLDER DATA (for demo mode)
// =====================

export interface ProjectData {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

// =====================
// PROJECT ACTIONS (PLACEHOLDER)
// =====================

export async function getProjects() {
  // Placeholder: Return empty array
  return [];
}

export async function getProject(id: string) {
  // Placeholder: Return null
  return null;
}

export async function createProject(data: {
  name: string;
  type: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}) {
  // Placeholder: Return mock project
  return {
    id: 'placeholder-' + Date.now(),
    ...data,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    status?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }
) {
  // Placeholder: Return updated data
  return { id, ...data, updatedAt: new Date().toISOString() };
}

export async function deleteProject(id: string) {
  // Placeholder: Do nothing
  console.log('[ProjectsAction] deleteProject called with:', id);
}

// =====================
// COST ESTIMATION ACTIONS (PLACEHOLDER)
// =====================

export async function createCostEstimation(projectId: string, data: {
  landCost: number;
  constructionCostPerSqft: number;
  totalConstructionCost: number;
  contingencyPercent: number;
  profitMarginPercent: number;
  subtotal: number;
  contingency: number;
  grandTotal: number;
}) {
  return { id: 'placeholder-ce', projectId, ...data };
}

export async function updateCostEstimation(
  projectId: string,
  data: Partial<{
    landCost: number;
    constructionCostPerSqft: number;
    totalConstructionCost: number;
    contingencyPercent: number;
    profitMarginPercent: number;
    subtotal: number;
    contingency: number;
    grandTotal: number;
  }>
) {
  return { projectId, ...data };
}

export async function addCostLineItem(
  costEstimationId: string,
  projectId: string,
  data: {
    category: string;
    description: string;
    unit: string;
    quantity: number;
    unitCost: number;
    total: number;
    itemType: 'materials' | 'labor' | 'overhead';
  }
) {
  return { id: 'placeholder-cli', costEstimationId, ...data };
}

export async function updateCostLineItem(
  id: string,
  projectId: string,
  data: Partial<{
    category: string;
    description: string;
    unit: string;
    quantity: number;
    unitCost: number;
    total: number;
    itemType: string;
  }>
) {
  return { id, ...data };
}

export async function deleteCostLineItem(id: string, projectId: string) {
  console.log('[ProjectsAction] deleteCostLineItem called');
}

// =====================
// ROI CALCULATIONS ACTIONS (PLACEHOLDER)
// =====================

export async function createROICalculations(projectId: string, data: {
  monthlyRevenue: number;
  annualRevenue: number;
  totalOperatingExpenses: number;
  netOperatingIncome: number;
  annualDebtService: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  paybackPeriod: number;
}) {
  return { id: 'placeholder-roi', projectId, ...data };
}

export async function updateROICalculations(
  projectId: string,
  data: Partial<{
    monthlyRevenue: number;
    annualRevenue: number;
    totalOperatingExpenses: number;
    netOperatingIncome: number;
    annualDebtService: number;
    annualCashFlow: number;
    capRate: number;
    cashOnCashReturn: number;
    paybackPeriod: number;
  }>
) {
  return { projectId, ...data };
}

export async function addExpenseItem(
  roiCalculationsId: string,
  projectId: string,
  data: {
    category: string;
    description: string;
    amount: number;
    frequency: string;
  }
) {
  return { id: 'placeholder-ei', roiCalculationsId, ...data };
}

export async function updateExpenseItem(
  id: string,
  projectId: string,
  data: Partial<{
    category: string;
    description: string;
    amount: number;
    frequency: string;
  }>
) {
  return { id, ...data };
}

export async function deleteExpenseItem(id: string, projectId: string) {
  console.log('[ProjectsAction] deleteExpenseItem called');
}

// =====================
// MATERIAL TAKEOFF ACTIONS (PLACEHOLDER)
// =====================

export async function createMaterialTakeoff(projectId: string, data: {
  totalMaterialsCost: number;
  totalLaborHours: number;
  totalLaborCost: number;
  grandTotal: number;
}) {
  return { id: 'placeholder-mt', projectId, ...data };
}

export async function updateMaterialTakeoff(
  projectId: string,
  data: Partial<{
    totalMaterialsCost: number;
    totalLaborHours: number;
    totalLaborCost: number;
    grandTotal: number;
  }>
) {
  return { projectId, ...data };
}

export async function addConstructionPhase(
  materialTakeoffId: string,
  projectId: string,
  data: {
    name: string;
    order: number;
    materialsCost: number;
    laborCost: number;
    laborHours: number;
  }
) {
  return { id: 'placeholder-cp', materialTakeoffId, ...data };
}

export async function updateConstructionPhase(
  id: string,
  projectId: string,
  data: Partial<{
    name: string;
    order: number;
    materialsCost: number;
    laborCost: number;
    laborHours: number;
  }>
) {
  return { id, ...data };
}

export async function deleteConstructionPhase(id: string, projectId: string) {
  console.log('[ProjectsAction] deleteConstructionPhase called');
}

export async function addMaterialItem(
  phaseId: string,
  projectId: string,
  data: {
    category: string;
    name: string;
    unit: string;
    quantity: number;
    wasteFactor: number;
    adjustedQty: number;
    unitCost: number;
    total: number;
  }
) {
  return { id: 'placeholder-mi', phaseId, ...data };
}

export async function updateMaterialItem(
  id: string,
  projectId: string,
  data: Partial<{
    category: string;
    name: string;
    unit: string;
    quantity: number;
    wasteFactor: number;
    adjustedQty: number;
    unitCost: number;
    total: number;
  }>
) {
  return { id, ...data };
}

export async function deleteMaterialItem(id: string, projectId: string) {
  console.log('[ProjectsAction] deleteMaterialItem called');
}

export async function addLaborItem(
  phaseId: string,
  projectId: string,
  data: {
    task: string;
    hoursPerUnit: number;
    unitCount: number;
    totalHours: number;
    hourlyRate: number;
    total: number;
  }
) {
  return { id: 'placeholder-li', phaseId, ...data };
}

export async function updateLaborItem(
  id: string,
  projectId: string,
  data: Partial<{
    task: string;
    hoursPerUnit: number;
    unitCount: number;
    totalHours: number;
    hourlyRate: number;
    total: number;
  }>
) {
  return { id, ...data };
}

export async function deleteLaborItem(id: string, projectId: string) {
  console.log('[ProjectsAction] deleteLaborItem called');
}

// =====================
// BULK OPERATIONS (PLACEHOLDER)
// =====================

export async function createFullProject(data: {
  project: {
    name: string;
    type: string;
    description?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  costEstimation?: {
    landCost: number;
    constructionCostPerSqft: number;
    totalConstructionCost: number;
    contingencyPercent: number;
    profitMarginPercent: number;
    subtotal: number;
    contingency: number;
    grandTotal: number;
    lineItems?: Array<{
      category: string;
      description: string;
      unit: string;
      quantity: number;
      unitCost: number;
      total: number;
      itemType: 'materials' | 'labor' | 'overhead';
    }>;
  };
  roiCalculations?: {
    monthlyRevenue: number;
    annualRevenue: number;
    totalOperatingExpenses: number;
    netOperatingIncome: number;
    annualDebtService: number;
    annualCashFlow: number;
    capRate: number;
    cashOnCashReturn: number;
    paybackPeriod: number;
    expenseItems?: Array<{
      category: string;
      description: string;
      amount: number;
      frequency: string;
    }>;
  };
  materialTakeoff?: {
    totalMaterialsCost: number;
    totalLaborHours: number;
    totalLaborCost: number;
    grandTotal: number;
    phases?: Array<{
      name: string;
      order: number;
      materialsCost: number;
      laborCost: number;
      laborHours: number;
      materialItems?: Array<{
        category: string;
        name: string;
        unit: string;
        quantity: number;
        wasteFactor: number;
        adjustedQty: number;
        unitCost: number;
        total: number;
      }>;
      laborItems?: Array<{
        task: string;
        hoursPerUnit: number;
        unitCount: number;
        totalHours: number;
        hourlyRate: number;
        total: number;
      }>;
    }>;
  };
}) {
  console.log('[ProjectsAction] createFullProject called');
  return {
    id: 'placeholder-full-' + Date.now(),
    ...data.project,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}