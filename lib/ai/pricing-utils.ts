import pricingData from './pricing-data.json';

export interface ProjectType {
  category: 'realEstate' | 'medical' | 'agricultural' | 'industrial';
  subType: string;
}

export function formatPricingForPrompt(
  projectCategory: string,
  projectSubType: string
): string {
  const category = pricingData[projectCategory as keyof typeof pricingData];

  if (!category) {
    return '';
  }

  const subType = category[projectSubType as keyof typeof category];

  if (!subType) {
    return '';
  }

  let prompt = '\n\n###_reference_database\n';
  prompt += `**Project Category:** ${projectCategory}\n`;
  prompt += `**Project Sub-Type:** ${projectSubType}\n\n`;

  // Add construction costs
  if ('constructionPerSqm' in subType) {
    prompt += '**Construction Costs per SQM:**\n';
    const costs = (subType as Record<string, Record<string, number>>).constructionPerSqm;
    for (const [level, price] of Object.entries(costs)) {
      prompt += `- ${level}: ${price.toLocaleString()} EGP/sqm\n`;
    }
  }

  // Add basement addition
  if ('basementAddition' in subType) {
    prompt += '\n**Basement Addition Costs:**\n';
    const basement = (subType as Record<string, Record<string, number>>).basementAddition;
    for (const [type, price] of Object.entries(basement)) {
      prompt += `- ${type}: ${price.toLocaleString()} EGP/sqm\n`;
    }
  }

  // Add per-feddane costs (for agricultural)
  if ('perFeddan' in subType) {
    prompt += '\n**Costs per Feddan:**\n';
    const feddan = (subType as Record<string, number>).perFeddan;
    for (const [type, price] of Object.entries(feddan)) {
      prompt += `- ${type}: ${price.toLocaleString()} EGP/feddan\n`;
    }
  }

  // Add per-sqm costs (for agricultural)
  if ('perSqm' in subType) {
    prompt += '\n**Costs per SQM:**\n';
    const sqm = (subType as Record<string, number>).perSqm;
    for (const [type, price] of Object.entries(sqm)) {
      prompt += `- ${type}: ${price.toLocaleString()} EGP/sqm\n`;
    }
  }

  // Add finishing levels description
  prompt += '\n**Finishing Levels:**\n';
  for (const [level, description] of Object.entries(pricingData.finishingLevels)) {
    prompt += `- ${level}: ${description}\n`;
  }

  // Add additional costs
  prompt += '\n**Additional Costs:**\n';
  const additional = pricingData.additionalCosts;
  prompt += `- Electrical: ${additional.electricalPerSqm.toLocaleString()} EGP/sqm\n`;
  prompt += `- Plumbing: ${additional.plumbingPerSqm.toLocaleString()} EGP/sqm\n`;
  prompt += `- HVAC: ${additional.hvacPerSqm.toLocaleString()} EGP/sqm\n`;
  prompt += `- Elevator: ${additional.elevatorPerUnit.toLocaleString()} EGP/unit\n`;
  prompt += `- Parking: ${additional.parkingPerSqm.toLocaleString()} EGP/sqm\n`;
  prompt += `- Landscaping: ${additional.landscapingPerSqm.toLocaleString()} EGP/sqm\n`;
  prompt += `- Consulting Fees: ${additional.consultingPercent}%\n`;
  prompt += `- Licensing: ${additional.licensingPercent}%\n`;
  prompt += `- Contingency: ${additional.contingencyPercent}%\n`;

  // Add notes
  prompt += '\n**Important Notes:**\n';
  prompt += `- All prices are in EGP (${pricingData.notes.allPricesInEGP})\n`;
  prompt += `- ${pricingData.notes.accuracyNote}\n`;
  prompt += `- ${pricingData.notes.updateFrequency}\n`;

  prompt += '###_end_reference\n';

  return prompt;
}

export function getAvailableCategories(): string[] {
  return ['realEstate', 'medical', 'agricultural', 'industrial'];
}

export function getSubTypesForCategory(category: string): string[] {
  const cat = pricingData[category as keyof typeof pricingData];
  if (!cat || typeof cat !== 'object') return [];

  return Object.keys(cat).filter(key => key !== 'finishingLevels' && key !== 'notes');
}