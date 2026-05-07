import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.laborItem.deleteMany();
  await prisma.materialItem.deleteMany();
  await prisma.constructionPhase.deleteMany();
  await prisma.materialTakeoff.deleteMany();
  await prisma.expenseLineItem.deleteMany();
  await prisma.roiCalculations.deleteMany();
  await prisma.costLineItem.deleteMany();
  await prisma.costEstimation.deleteMany();
  await prisma.project.deleteMany();

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Sunset Heights Condominiums',
      type: 'RESIDENTIAL',
      status: 'ACTIVE',
      description: 'A 48-unit luxury condominium development with rooftop amenities and underground parking.',
      address: '1250 Sunset Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90028',
      residentialData: {
        unitCount: 48,
        totalSqft: 72000,
        parkingSpaces: 60,
        amenitySpaces: ['Rooftop pool', 'Fitness center', 'Business lounge', 'Dog park'],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Harbor View Office Tower',
      type: 'COMMERCIAL',
      status: 'DRAFT',
      description: 'Class A office building with ground-floor retail and structured parking.',
      address: '800 Harbor Boulevard',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      commercialData: {
        totalSqft: 185000,
        floorCount: 12,
        parkingRatio: 4,
        commonAreas: ['Lobby', 'Conference center', 'Cafeteria', 'Rooftop terrace'],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Pacific Industrial Park',
      type: 'INDUSTRIAL',
      status: 'ACTIVE',
      description: 'Distribution and light manufacturing facility with expandable layout.',
      address: '4500 Industrial Parkway',
      city: 'Ontario',
      state: 'CA',
      zipCode: '91761',
      industrialData: {
        totalSqft: 280000,
        warehouseSqft: 245000,
        officeSqft: 35000,
        loadingDocks: 24,
        clearHeight: 32,
        zoning: 'M-2 Heavy Industrial',
      },
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: 'Meridian Mixed-Use Development',
      type: 'MIXED_USE',
      status: 'DRAFT',
      description: 'Vertical mixed-use project combining retail, office, and 120 residential units.',
      address: '2100 Meridian Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      mixedUseData: {
        residentialUnits: 120,
        commercialSqft: 45000,
        retailSqft: 28000,
        officeSqft: 95000,
        parkingLevels: 3,
      },
    },
  });

  // Create Cost Estimation for Project 1
  const costEst1 = await prisma.costEstimation.create({
    data: {
      projectId: project1.id,
      landCost: 4500000,
      constructionCostPerSqft: 285,
      totalConstructionCost: 20520000,
      contingencyPercent: 8,
      profitMarginPercent: 18,
      subtotal: 26245250,
      contingency: 2099620,
      grandTotal: 29981570,
    },
  });

  // Add cost line items for Project 1
  await prisma.costLineItem.createMany({
    data: [
      { costEstimationId: costEst1.id, category: 'Structural', description: 'Rebar #5', unit: 'ton', quantity: 45, unitCost: 1200, total: 54000, itemType: 'materials' },
      { costEstimationId: costEst1.id, category: 'Structural', description: 'Ready-mix concrete', unit: 'yd3', quantity: 1800, unitCost: 165, total: 297000, itemType: 'materials' },
      { costEstimationId: costEst1.id, category: 'MEP', description: 'Copper piping', unit: 'linear ft', quantity: 8500, unitCost: 8.5, total: 72250, itemType: 'materials' },
      { costEstimationId: costEst1.id, category: 'Exterior', description: 'Stucco materials', unit: 'sq ft', quantity: 24000, unitCost: 12, total: 288000, itemType: 'materials' },
      { costEstimationId: costEst1.id, category: 'General', description: 'Carpenters', unit: 'hrs', quantity: 12000, unitCost: 65, total: 780000, itemType: 'labor' },
      { costEstimationId: costEst1.id, category: 'General', description: 'Electricians', unit: 'hrs', quantity: 4800, unitCost: 75, total: 360000, itemType: 'labor' },
      { costEstimationId: costEst1.id, category: 'General', description: 'Plumbers', unit: 'hrs', quantity: 3600, unitCost: 70, total: 252000, itemType: 'labor' },
      { costEstimationId: costEst1.id, category: 'Insurance', description: 'Builder risk insurance', unit: 'lump sum', quantity: 1, unitCost: 180000, total: 180000, itemType: 'overhead' },
      { costEstimationId: costEst1.id, category: 'Permits', description: 'Building permits & fees', unit: 'lump sum', quantity: 1, unitCost: 95000, total: 95000, itemType: 'overhead' },
    ],
  });

  // Create ROI Calculations for Project 1
  const roi1 = await prisma.roiCalculations.create({
    data: {
      projectId: project1.id,
      monthlyRevenue: 185000,
      annualRevenue: 2220000,
      totalOperatingExpenses: 234000,
      netOperatingIncome: 1986000,
      annualDebtService: 1560000,
      annualCashFlow: 426000,
      capRate: 6.62,
      cashOnCashReturn: 1.42,
      paybackPeriod: 70.4,
    },
  });

  await prisma.expenseLineItem.createMany({
    data: [
      { roiCalculationsId: roi1.id, category: 'fixed', description: 'Property management', amount: 12000, frequency: 'monthly' },
      { roiCalculationsId: roi1.id, category: 'fixed', description: 'Insurance', amount: 36000, frequency: 'annual' },
      { roiCalculationsId: roi1.id, category: 'variable', description: 'Maintenance reserve', amount: 8500, frequency: 'monthly' },
    ],
  });

  // Create Material Takeoff for Project 1
  const takeoff1 = await prisma.materialTakeoff.create({
    data: {
      projectId: project1.id,
      totalMaterialsCost: 711250,
      totalLaborHours: 20400,
      totalLaborCost: 1392000,
      grandTotal: 2103250,
    },
  });

  // Create Construction Phases
  const phases = await Promise.all([
    prisma.constructionPhase.create({ data: { materialTakeoffId: takeoff1.id, name: 'Foundation', order: 1, materialsCost: 285000, laborCost: 180000, laborHours: 3200 } }),
    prisma.constructionPhase.create({ data: { materialTakeoffId: takeoff1.id, name: 'Framing', order: 2, materialsCost: 156000, laborCost: 240000, laborHours: 4000 } }),
    prisma.constructionPhase.create({ data: { materialTakeoffId: takeoff1.id, name: 'Exterior', order: 3, materialsCost: 120000, laborCost: 180000, laborHours: 3200 } }),
    prisma.constructionPhase.create({ data: { materialTakeoffId: takeoff1.id, name: 'Mechanical', order: 4, materialsCost: 85000, laborCost: 210000, laborHours: 3500 } }),
    prisma.constructionPhase.create({ data: { materialTakeoffId: takeoff1.id, name: 'Interior', order: 5, materialsCost: 45000, laborCost: 240000, laborHours: 3800 } }),
    prisma.constructionPhase.create({ data: { materialTakeoffId: takeoff1.id, name: 'Finishing', order: 6, materialsCost: 20250, laborCost: 242000, laborHours: 2700 } }),
  ]);

  // Add material items
  await prisma.materialItem.createMany({
    data: [
      { phaseId: phases[0].id, category: 'Structural', name: 'Rebar #5', unit: 'ton', quantity: 45, wasteFactor: 5, adjustedQty: 47.25, unitCost: 1200, total: 56700 },
      { phaseId: phases[0].id, category: 'Concrete', name: 'Ready-mix concrete', unit: 'yd3', quantity: 1200, wasteFactor: 5, adjustedQty: 1260, unitCost: 165, total: 207900 },
      { phaseId: phases[1].id, category: 'Framing', name: 'LVL beams', unit: 'linear ft', quantity: 8500, wasteFactor: 10, adjustedQty: 9350, unitCost: 12, total: 112200 },
      { phaseId: phases[1].id, category: 'Framing', name: 'OSB sheathing', unit: 'sheets', quantity: 1200, wasteFactor: 10, adjustedQty: 1320, unitCost: 33, total: 43560 },
    ],
  });

  // Add labor items
  await prisma.laborItem.createMany({
    data: [
      { phaseId: phases[0].id, task: 'Excavation', hoursPerUnit: 0.5, unitCount: 72000, totalHours: 36000, hourlyRate: 65, total: 2340000 },
      { phaseId: phases[0].id, task: 'Formwork', hoursPerUnit: 0.8, unitCount: 72000, totalHours: 57600, hourlyRate: 55, total: 3168000 },
      { phaseId: phases[1].id, task: 'Wall framing', hoursPerUnit: 1.2, unitCount: 72000, totalHours: 86400, hourlyRate: 65, total: 5616000 },
      { phaseId: phases[1].id, task: 'Roof framing', hoursPerUnit: 0.8, unitCount: 72000, totalHours: 57600, hourlyRate: 70, total: 4032000 },
    ],
  });

  console.log('✅ Seeding complete!');
  console.log('Created 4 projects');
  console.log('Created 1 cost estimations');
  console.log('Created 1 ROI calculations');
  console.log('Created 1 material takeoffs');
  console.log('Created 6 construction phases');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });