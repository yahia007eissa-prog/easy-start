import type {
  CostLineItem,
  CostEstimation,
  ROICalculations,
  MaterialTakeoff,
  LaborItem,
  MaterialItem,
} from '@/lib/types/project';

export const calculateLineItemTotal = (item: CostLineItem): number => {
  return item.quantity * item.unitCost;
};

export const calculateCostEstimationTotals = (estimation: CostEstimation): CostEstimation => {
  const materialsTotal = estimation.materials.reduce((sum, item) => sum + item.total, 0);
  const laborTotal = estimation.labor.reduce((sum, item) => sum + item.total, 0);
  const overheadTotal = estimation.overhead.reduce((sum, item) => sum + item.total, 0);

  const subtotal = estimation.landCost + estimation.totalConstructionCost + materialsTotal + laborTotal + overheadTotal;
  const contingency = subtotal * (estimation.contingencyPercent / 100);
  const profitMargin = subtotal * (estimation.profitMarginPercent / 100);
  const grandTotal = subtotal + contingency + profitMargin;

  return {
    ...estimation,
    subtotal,
    contingency,
    grandTotal,
  };
};

export const calculateROI = (
  costEstimation: CostEstimation,
  roiCalculations: ROICalculations
): ROICalculations => {
  const annualRevenue = roiCalculations.monthlyRevenue * 12;
  const totalOperatingExpenses = roiCalculations.operatingExpenses.reduce((sum, exp) => {
    return sum + (exp.frequency === 'monthly' ? exp.amount * 12 : exp.amount);
  }, 0);

  const netOperatingIncome = annualRevenue - totalOperatingExpenses;
  const annualCashFlow = netOperatingIncome - roiCalculations.annualDebtService;

  // Cap Rate = NOI / Total Cost
  const capRate = costEstimation.grandTotal > 0
    ? (netOperatingIncome / costEstimation.grandTotal) * 100
    : 0;

  // Cash on Cash Return = Annual Cash Flow / Total Investment
  const totalInvestment = costEstimation.grandTotal;
  const cashOnCashReturn = totalInvestment > 0
    ? (annualCashFlow / totalInvestment) * 100
    : 0;

  // Payback Period = Total Investment / Annual Cash Flow
  const paybackPeriod = annualCashFlow > 0
    ? totalInvestment / annualCashFlow
    : 0;

  return {
    ...roiCalculations,
    annualRevenue,
    totalOperatingExpenses,
    netOperatingIncome,
    annualCashFlow,
    capRate,
    cashOnCashReturn,
    paybackPeriod,
  };
};

export const calculateMaterialTotals = (
  phases: MaterialTakeoff['phases']
): { totalMaterials: number; totalLaborHours: number; totalCost: number } => {
  let totalMaterials = 0;
  let totalLaborHours = 0;
  let totalCost = 0;

  phases.forEach((phase) => {
    phase.materials.forEach((item) => {
      totalMaterials += item.total;
      totalCost += item.total;
    });
    phase.labor.forEach((item) => {
      totalLaborHours += item.totalHours;
      totalCost += item.total;
    });
  });

  return { totalMaterials, totalLaborHours, totalCost };
};

export const calculateMaterialItem = (item: Omit<MaterialItem, 'id' | 'adjustedQuantity' | 'total'>): MaterialItem => {
  const adjustedQuantity = item.quantity * (1 + item.wasteFactor / 100);
  const total = adjustedQuantity * item.unitCost;

  return {
    ...item,
    id: crypto.randomUUID(),
    adjustedQuantity,
    total,
  };
};

export const calculateLaborItem = (item: Omit<LaborItem, 'id' | 'totalHours' | 'total'>): LaborItem => {
  const totalHours = item.hoursPerUnit * item.unitCount;
  const total = totalHours * item.hourlyRate;

  return {
    ...item,
    id: crypto.randomUUID(),
    totalHours,
    total,
  };
};

export const calculateTotalConstructionCost = (sqft: number, costPerSqft: number): number => {
  return sqft * costPerSqft;
};