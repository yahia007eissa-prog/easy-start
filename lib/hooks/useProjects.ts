'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectType, CostLineItem, ExpenseLineItem, MaterialItem, LaborItem } from '@/lib/types/project';
import { createEmptyProject, createEmptyCostEstimation, createEmptyROICalculations, createEmptyMaterialTakeoff } from '@/lib/types/project';

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;

  // CRUD operations
  addProject: (type: ProjectType) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;

  // Cost Estimation
  updateCostEstimation: (projectId: string, updates: Partial<Project['calculations']['costEstimation']>) => void;
  addCostLineItem: (projectId: string, category: 'materials' | 'labor' | 'overhead', item: Omit<CostLineItem, 'id' | 'total'>) => void;
  updateCostLineItem: (projectId: string, category: 'materials' | 'labor' | 'overhead', itemId: string, updates: Partial<CostLineItem>) => void;
  removeCostLineItem: (projectId: string, category: 'materials' | 'labor' | 'overhead', itemId: string) => void;

  // ROI Calculations
  updateROICalculations: (projectId: string, updates: Partial<Project['calculations']['roiCalculations']>) => void;
  addExpenseItem: (projectId: string, item: Omit<ExpenseLineItem, 'id'>) => void;
  updateExpenseItem: (projectId: string, itemId: string, updates: Partial<ExpenseLineItem>) => void;
  removeExpenseItem: (projectId: string, itemId: string) => void;

  // Material Takeoff
  updateMaterialTakeoff: (projectId: string, updates: Partial<Project['calculations']['materialTakeoff']>) => void;
  addMaterialItem: (projectId: string, phaseId: string, item: Omit<MaterialItem, 'id' | 'adjustedQuantity' | 'total'>) => void;
  addLaborItem: (projectId: string, phaseId: string, item: Omit<LaborItem, 'id' | 'totalHours' | 'total'>) => void;
}

// Mock data for demo
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Sunset Heights Condominiums',
    type: 'residential',
    status: 'active',
    description: 'A 48-unit luxury condominium development with rooftop amenities and underground parking.',
    location: {
      address: '1250 Sunset Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90028',
    },
    createdAt: new Date('2025-11-15'),
    updatedAt: new Date('2026-01-20'),
    residentialData: {
      unitCount: 48,
      unitTypes: [
        { type: '2br', count: 24, sqft: 1100, pricePerUnit: 650000 },
        { type: '3br', count: 18, sqft: 1400, pricePerUnit: 825000 },
        { type: 'penthouse', count: 6, sqft: 2200, pricePerUnit: 1450000 },
      ],
      totalSqft: 72000,
      parkingSpaces: 60,
      amenitySpaces: ['Rooftop pool', 'Fitness center', 'Business lounge', 'Dog park'],
    },
    calculations: {
      costEstimation: {
        landCost: 4500000,
        constructionCostPerSqft: 285,
        totalConstructionCost: 20520000,
        materials: [
          { id: 'm1', category: 'Structural', description: 'Rebar #5', unit: 'ton', quantity: 45, unitCost: 1200, total: 54000 },
          { id: 'm2', category: 'Structural', description: 'Ready-mix concrete', unit: 'yd³', quantity: 1800, unitCost: 165, total: 297000 },
          { id: 'm3', category: 'MEP', description: 'Copper piping', unit: 'linear ft', quantity: 8500, unitCost: 8.5, total: 72250 },
          { id: 'm4', category: 'Exterior', description: 'Stucco materials', unit: 'sq ft', quantity: 24000, unitCost: 12, total: 288000 },
        ],
        labor: [
          { id: 'l1', category: 'General', description: 'Carpenters', unit: 'hrs', quantity: 12000, unitCost: 65, total: 780000 },
          { id: 'l2', category: 'General', description: 'Electricians', unit: 'hrs', quantity: 4800, unitCost: 75, total: 360000 },
          { id: 'l3', category: 'General', description: 'Plumbers', unit: 'hrs', quantity: 3600, unitCost: 70, total: 252000 },
        ],
        overhead: [
          { id: 'o1', category: 'Insurance', description: 'Builder risk insurance', unit: ' lump sum', quantity: 1, unitCost: 180000, total: 180000 },
          { id: 'o2', category: 'Permits', description: 'Building permits & fees', unit: ' lump sum', quantity: 1, unitCost: 95000, total: 95000 },
        ],
        contingencyPercent: 8,
        profitMarginPercent: 18,
        subtotal: 26245250,
        contingency: 2099620,
        grandTotal: 29981570,
      },
      roiCalculations: {
        monthlyRevenue: 185000,
        annualRevenue: 2220000,
        operatingExpenses: [
          { id: 'e1', category: 'fixed', description: 'Property management', amount: 12000, frequency: 'monthly' },
          { id: 'e2', category: 'fixed', description: 'Insurance', amount: 36000, frequency: 'annual' },
          { id: 'e3', category: 'variable', description: 'Maintenance reserve', amount: 8500, frequency: 'monthly' },
        ],
        totalOperatingExpenses: 234000,
        netOperatingIncome: 1986000,
        annualDebtService: 1560000,
        annualCashFlow: 426000,
        capRate: 6.62,
        cashOnCashReturn: 1.42,
        paybackPeriod: 70.4,
      },
      materialTakeoff: {
        phases: [
          { id: '1', name: 'Foundation', order: 1, materials: [], labor: [] },
          { id: '2', name: 'Framing', order: 2, materials: [], labor: [] },
          { id: '3', name: 'Exterior', order: 3, materials: [], labor: [] },
          { id: '4', name: 'Mechanical', order: 4, materials: [], labor: [] },
          { id: '5', name: 'Interior', order: 5, materials: [], labor: [] },
          { id: '6', name: 'Finishing', order: 6, materials: [], labor: [] },
        ],
        summary: { totalMaterials: 0, totalLaborHours: 0, totalCost: 0 },
      },
    },
  },
  {
    id: '2',
    name: 'Harbor View Office Tower',
    type: 'commercial',
    status: 'draft',
    description: 'Class A office building with ground-floor retail and structured parking.',
    location: {
      address: '800 Harbor Boulevard',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
    },
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-02-15'),
    commercialData: {
      totalSqft: 185000,
      floorCount: 12,
      spaceTypes: [
        { type: 'office', sqft: 156000, rentalRate: 48 },
        { type: 'retail', sqft: 18000, rentalRate: 65 },
        { type: 'restaurant', sqft: 11000, rentalRate: 72 },
      ],
      parkingRatio: 4,
      commonAreas: ['Lobby', 'Conference center', 'Cafeteria', 'Rooftop terrace'],
    },
    calculations: {
      costEstimation: createEmptyCostEstimation(),
      roiCalculations: createEmptyROICalculations(),
      materialTakeoff: createEmptyMaterialTakeoff(),
    },
  },
  {
    id: '3',
    name: 'Pacific Industrial Park',
    type: 'industrial',
    status: 'active',
    description: 'Distribution and light manufacturing facility with expandable layout.',
    location: {
      address: '4500 Industrial Parkway',
      city: 'Ontario',
      state: 'CA',
      zipCode: '91761',
    },
    createdAt: new Date('2025-09-22'),
    updatedAt: new Date('2026-01-10'),
    industrialData: {
      totalSqft: 280000,
      warehouseSqft: 245000,
      officeSqft: 35000,
      loadingDocks: 24,
      clearHeight: 32,
      zoning: 'M-2 Heavy Industrial',
      utilities: ['3-phase power', 'Natural gas', 'Fiber optic', 'EV charging stations'],
    },
    calculations: {
      costEstimation: createEmptyCostEstimation(),
      roiCalculations: createEmptyROICalculations(),
      materialTakeoff: createEmptyMaterialTakeoff(),
    },
  },
  {
    id: '4',
    name: 'Meridian Mixed-Use Development',
    type: 'mixed-use',
    status: 'draft',
    description: 'Vertical mixed-use project combining retail, office, and 120 residential units.',
    location: {
      address: '2100 Meridian Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
    },
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-03-12'),
    mixedUseData: {
      residentialUnits: 120,
      commercialSqft: 45000,
      retailSqft: 28000,
      officeSqft: 95000,
      parkingLevels: 3,
    },
    calculations: {
      costEstimation: createEmptyCostEstimation(),
      roiCalculations: createEmptyROICalculations(),
      materialTakeoff: createEmptyMaterialTakeoff(),
    },
  },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: mockProjects,
  selectedProject: null,
  isLoading: false,

  addProject: (type: ProjectType) => {
    const newProject = createEmptyProject(uuidv4(), type);
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
    return newProject;
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
      selectedProject: state.selectedProject?.id === id
        ? { ...state.selectedProject, ...updates, updatedAt: new Date() }
        : state.selectedProject,
    }));
  },

  deleteProject: (id: string) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
    }));
  },

  selectProject: (id: string | null) => {
    if (id === null) {
      set({ selectedProject: null });
    } else {
      const project = get().projects.find((p) => p.id === id);
      set({ selectedProject: project || null });
    }
  },

  updateCostEstimation: (projectId: string, updates: Partial<Project['calculations']['costEstimation']>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                costEstimation: { ...p.calculations.costEstimation, ...updates },
              },
              updatedAt: new Date(),
            }
          : p
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? {
            ...state.selectedProject,
            calculations: {
              ...state.selectedProject.calculations,
              costEstimation: { ...state.selectedProject.calculations.costEstimation, ...updates },
            },
            updatedAt: new Date(),
          }
        : state.selectedProject,
    }));
  },

  addCostLineItem: (projectId: string, category: 'materials' | 'labor' | 'overhead', item: Omit<CostLineItem, 'id' | 'total'>) => {
    const newItem: CostLineItem = {
      ...item,
      id: uuidv4(),
      total: item.quantity * item.unitCost,
    };
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                costEstimation: {
                  ...p.calculations.costEstimation,
                  [category]: [...p.calculations.costEstimation[category], newItem],
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  updateCostLineItem: (projectId: string, category: 'materials' | 'labor' | 'overhead', itemId: string, updates: Partial<CostLineItem>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                costEstimation: {
                  ...p.calculations.costEstimation,
                  [category]: p.calculations.costEstimation[category].map((item) =>
                    item.id === itemId
                      ? { ...item, ...updates, total: (updates.quantity ?? item.quantity) * (updates.unitCost ?? item.unitCost) }
                      : item
                  ),
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  removeCostLineItem: (projectId: string, category: 'materials' | 'labor' | 'overhead', itemId: string) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                costEstimation: {
                  ...p.calculations.costEstimation,
                  [category]: p.calculations.costEstimation[category].filter((item) => item.id !== itemId),
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  updateROICalculations: (projectId: string, updates: Partial<Project['calculations']['roiCalculations']>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                roiCalculations: { ...p.calculations.roiCalculations, ...updates },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  addExpenseItem: (projectId: string, item: Omit<ExpenseLineItem, 'id'>) => {
    const newItem: ExpenseLineItem = { ...item, id: uuidv4() };
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                roiCalculations: {
                  ...p.calculations.roiCalculations,
                  operatingExpenses: [...p.calculations.roiCalculations.operatingExpenses, newItem],
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  updateExpenseItem: (projectId: string, itemId: string, updates: Partial<ExpenseLineItem>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                roiCalculations: {
                  ...p.calculations.roiCalculations,
                  operatingExpenses: p.calculations.roiCalculations.operatingExpenses.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  removeExpenseItem: (projectId: string, itemId: string) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                roiCalculations: {
                  ...p.calculations.roiCalculations,
                  operatingExpenses: p.calculations.roiCalculations.operatingExpenses.filter((item) => item.id !== itemId),
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  updateMaterialTakeoff: (projectId: string, updates: Partial<Project['calculations']['materialTakeoff']>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                materialTakeoff: { ...p.calculations.materialTakeoff, ...updates },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  addMaterialItem: (projectId: string, phaseId: string, item: Omit<MaterialItem, 'id' | 'adjustedQuantity' | 'total'>) => {
    const newItem: MaterialItem = {
      ...item,
      id: uuidv4(),
      adjustedQuantity: item.quantity * (1 + item.wasteFactor / 100),
      total: item.quantity * (1 + item.wasteFactor / 100) * item.unitCost,
    };
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                materialTakeoff: {
                  ...p.calculations.materialTakeoff,
                  phases: p.calculations.materialTakeoff.phases.map((phase) =>
                    phase.id === phaseId
                      ? { ...phase, materials: [...phase.materials, newItem] }
                      : phase
                  ),
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  addLaborItem: (projectId: string, phaseId: string, item: Omit<LaborItem, 'id' | 'totalHours' | 'total'>) => {
    const newItem: LaborItem = {
      ...item,
      id: uuidv4(),
      totalHours: item.hoursPerUnit * item.unitCount,
      total: item.hoursPerUnit * item.unitCount * item.hourlyRate,
    };
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              calculations: {
                ...p.calculations,
                materialTakeoff: {
                  ...p.calculations.materialTakeoff,
                  phases: p.calculations.materialTakeoff.phases.map((phase) =>
                    phase.id === phaseId
                      ? { ...phase, labor: [...phase.labor, newItem] }
                      : phase
                  ),
                },
              },
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },
}));