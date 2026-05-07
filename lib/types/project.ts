export type ProjectType = 'residential' | 'commercial' | 'industrial' | 'mixed-use';

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ResidentialData {
  unitCount: number;
  unitTypes: UnitType[];
  totalSqft: number;
  parkingSpaces: number;
  amenitySpaces: string[];
}

export interface UnitType {
  type: 'studio' | '1br' | '2br' | '3br' | 'penthouse';
  count: number;
  sqft: number;
  pricePerUnit: number;
}

export interface CommercialData {
  totalSqft: number;
  floorCount: number;
  spaceTypes: SpaceType[];
  parkingRatio: number;
  commonAreas: string[];
}

export interface SpaceType {
  type: 'retail' | 'office' | 'restaurant' | 'medical';
  sqft: number;
  rentalRate: number;
}

export interface IndustrialData {
  totalSqft: number;
  warehouseSqft: number;
  officeSqft: number;
  loadingDocks: number;
  clearHeight: number;
  zoning: string;
  utilities: string[];
}

export interface MixedUseData {
  residentialUnits: number;
  commercialSqft: number;
  retailSqft: number;
  officeSqft: number;
  parkingLevels: number;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  description: string;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
  // Type-specific data
  residentialData?: ResidentialData;
  commercialData?: CommercialData;
  industrialData?: IndustrialData;
  mixedUseData?: MixedUseData;
  // Calculations
  calculations: {
    costEstimation: CostEstimation;
    roiCalculations: ROICalculations;
    materialTakeoff: MaterialTakeoff;
  };
}

export interface CostEstimation {
  landCost: number;
  constructionCostPerSqft: number;
  totalConstructionCost: number;
  materials: CostLineItem[];
  labor: CostLineItem[];
  overhead: CostLineItem[];
  contingencyPercent: number;
  profitMarginPercent: number;
  subtotal: number;
  contingency: number;
  grandTotal: number;
}

export interface CostLineItem {
  id: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface ROICalculations {
  monthlyRevenue: number;
  annualRevenue: number;
  operatingExpenses: ExpenseLineItem[];
  totalOperatingExpenses: number;
  netOperatingIncome: number;
  annualDebtService: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  paybackPeriod: number;
}

export interface ExpenseLineItem {
  id: string;
  category: 'fixed' | 'variable';
  description: string;
  amount: number;
  frequency: 'monthly' | 'annual';
}

export interface MaterialTakeoff {
  phases: ConstructionPhase[];
  summary: {
    totalMaterials: number;
    totalLaborHours: number;
    totalCost: number;
  };
}

export interface ConstructionPhase {
  id: string;
  name: string;
  order: number;
  materials: MaterialItem[];
  labor: LaborItem[];
}

export interface MaterialItem {
  id: string;
  category: string;
  name: string;
  unit: string;
  quantity: number;
  wasteFactor: number;
  adjustedQuantity: number;
  unitCost: number;
  total: number;
}

export interface LaborItem {
  id: string;
  task: string;
  hoursPerUnit: number;
  unitCount: number;
  totalHours: number;
  hourlyRate: number;
  total: number;
}

// Default empty calculations
export const createEmptyCostEstimation = (): CostEstimation => ({
  landCost: 0,
  constructionCostPerSqft: 0,
  totalConstructionCost: 0,
  materials: [],
  labor: [],
  overhead: [],
  contingencyPercent: 10,
  profitMarginPercent: 15,
  subtotal: 0,
  contingency: 0,
  grandTotal: 0,
});

export const createEmptyROICalculations = (): ROICalculations => ({
  monthlyRevenue: 0,
  annualRevenue: 0,
  operatingExpenses: [],
  totalOperatingExpenses: 0,
  netOperatingIncome: 0,
  annualDebtService: 0,
  annualCashFlow: 0,
  capRate: 0,
  cashOnCashReturn: 0,
  paybackPeriod: 0,
});

export const createEmptyMaterialTakeoff = (): MaterialTakeoff => ({
  phases: [
    { id: '1', name: 'Foundation', order: 1, materials: [], labor: [] },
    { id: '2', name: 'Framing', order: 2, materials: [], labor: [] },
    { id: '3', name: 'Exterior', order: 3, materials: [], labor: [] },
    { id: '4', name: 'Mechanical', order: 4, materials: [], labor: [] },
    { id: '5', name: 'Interior', order: 5, materials: [], labor: [] },
    { id: '6', name: 'Finishing', order: 6, materials: [], labor: [] },
  ],
  summary: {
    totalMaterials: 0,
    totalLaborHours: 0,
    totalCost: 0,
  },
});

export const createEmptyProject = (id: string, type: ProjectType): Project => ({
  id,
  name: '',
  type,
  status: 'draft',
  description: '',
  location: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  calculations: {
    costEstimation: createEmptyCostEstimation(),
    roiCalculations: createEmptyROICalculations(),
    materialTakeoff: createEmptyMaterialTakeoff(),
  },
});