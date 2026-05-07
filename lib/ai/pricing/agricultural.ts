// Agricultural Pricing Database
// Source: Easy Start verified field data — Egypt 2026

export const agriculturalPricing = {
  // Land preparation costs per feddan
  land_preparation: {
    deep_plowing:      { min: 2000,   max: 4000,   unit: 'EGP/feddan' },
    leveling:          { min: 1000,   max: 2000,   unit: 'EGP/feddan' },
    soil_analysis:     { min: 1500,   max: 3000,   unit: 'EGP/sample' },
    soil_improvement:  { min: 5000,   max: 10000,  unit: 'EGP/feddan' },
    drip_irrigation:   { min: 10000,  max: 25000,  unit: 'EGP/feddan' },
    sprinkler:         { min: 15000,  max: 30000,  unit: 'EGP/feddan' },
    flood_irrigation:  { min: 3000,   max: 8000,   unit: 'EGP/feddan' },
  },

  // Field crops - costs per feddan per season
  field_crops: {
    wheat: {
      seeds: [2000, 3500],
      fertilizer: [2500, 4000],
      pesticides: [500, 1500],
      labor: [3000, 6000],
      yield_ton: [2.5, 4],
      seasons_per_year: 1,
    },
    corn: {
      seeds: [500, 1500],
      fertilizer: [2000, 3500],
      pesticides: [500, 1000],
      labor: [3000, 5000],
      yield_ton: [3, 4.5],
      seasons_per_year: 1,
    },
    potatoes: {
      seeds: [10000, 15000],
      fertilizer: [4000, 7000],
      pesticides: [2000, 4000],
      labor: [8000, 15000],
      yield_ton: [12, 20],
      seasons_per_year: 1,
    },
    tomatoes: {
      seeds: [1500, 3000],
      fertilizer: [5000, 8000],
      pesticides: [2000, 4000],
      labor: [10000, 20000],
      yield_ton: [25, 40],
      seasons_per_year: 1,
    },
    peppers: {
      seeds: [2000, 4000],
      fertilizer: [4000, 7000],
      pesticides: [2000, 5000],
      labor: [10000, 15000],
      yield_ton: [15, 25],
      seasons_per_year: 1,
    },
    cucumbers: {
      seeds: [1000, 3000],
      fertilizer: [4000, 6000],
      pesticides: [2000, 4000],
      labor: [8000, 12000],
      yield_ton: [15, 25],
      seasons_per_year: 1,
    },
    onions: {
      seeds: [5000, 10000],
      fertilizer: [3000, 5000],
      pesticides: [1000, 2000],
      labor: [5000, 10000],
      yield_ton: [15, 25],
      seasons_per_year: 1,
    },
    garlic: {
      seeds: [15000, 25000],
      fertilizer: [3000, 6000],
      pesticides: [1500, 2500],
      labor: [6000, 12000],
      yield_ton: [10, 15],
      seasons_per_year: 1,
    },
    strawberries: {
      seeds: [10000, 20000],
      fertilizer: [8000, 15000],
      pesticides: [5000, 8000],
      labor: [15000, 25000],
      yield_ton: [15, 25],
      seasons_per_year: 1,
    },
    sugarcane: {
      seeds: [8000, 15000],
      fertilizer: [5000, 10000],
      pesticides: [2000, 4000],
      labor: [8000, 15000],
      yield_ton: [45, 55],
      seasons_per_year: 1,
    },
  },

  // Fruit trees - setup and annual costs per feddan
  fruit_trees: {
    oranges: {
      years_to_yield: '3-4',
      setup: [80000, 150000],
      annual: [15000, 25000],
      sell_price: [8000, 12000],
      yield_note: '15-25 kg/tree',
    },
    mangoes: {
      years_to_yield: '4-5',
      setup: [150000, 250000],
      annual: [20000, 30000],
      sell_price: [10000, 20000],
      yield_note: '8-12 ton/feddan',
    },
    olives: {
      years_to_yield: '4-6',
      setup: [50000, 100000],
      annual: [10000, 15000],
      sell_price: [8000, 15000],
      yield_note: '4-6 kg/tree',
    },
    dates: {
      years_to_yield: '5-7',
      setup: [100000, 200000],
      annual: [15000, 25000],
      sell_price: [5000, 8000],
      yield_note: '60-100 kg/tree',
    },
    grapes: {
      years_to_yield: '2-3',
      setup: [60000, 120000],
      annual: [12000, 20000],
      sell_price: [8000, 15000],
      yield_note: '8-15 ton/feddan',
    },
    lemons: {
      years_to_yield: '3-4',
      setup: [60000, 100000],
      annual: [10000, 18000],
      sell_price: [6000, 9000],
      yield_note: '15-25 ton/feddan',
    },
    pomegranates: {
      years_to_yield: '3-4',
      setup: [70000, 120000],
      annual: [12000, 20000],
      sell_price: [8000, 12000],
      yield_note: '10-18 ton/feddan',
    },
    figs: {
      years_to_yield: '2-3',
      setup: [40000, 70000],
      annual: [8000, 12000],
      sell_price: [6000, 10000],
      yield_note: '8-12 ton/feddan',
    },
    avocados: {
      years_to_yield: '4-6',
      setup: [200000, 300000],
      annual: [25000, 40000],
      sell_price: [20000, 40000],
      yield_note: '5-10 ton/feddan',
    },
    bananas: {
      years_to_yield: '1-1.5',
      setup: [80000, 120000],
      annual: [20000, 30000],
      sell_price: [6000, 9000],
      yield_note: '20-30 ton/feddan',
    },
  },

  // Post-harvest costs
  post_harvest: {
    sun_drying:        { min: 500,   max: 1000,  unit: 'EGP/ton' },
    industrial_drying: { min: 2000,  max: 4000,  unit: 'EGP/ton' },
    cold_storage:      { min: 100,   max: 300,   unit: 'EGP/ton/month' },
    packaging:         { min: 1000,  max: 2500,  unit: 'EGP/ton' },
    sorting:           { min: 500,   max: 1500,  unit: 'EGP/ton' },
    olive_pressing:    { min: 1000,  max: 2000,  unit: 'EGP/ton' },
    transport:         { min: 1,     max: 2,     unit: 'EGP/ton/km' },
  },

  // Farm infrastructure
  infrastructure: {
    plastic_greenhouse: { min: 300000, max: 600000, unit: 'EGP/feddan', lifespan: '8-12 years' },
    glass_greenhouse:   { min: 1500,   max: 3000,   unit: 'EGP/m²', lifespan: '20-30 years' },
    fencing:            { min: 300,    max: 600,     unit: 'EGP/linear m', lifespan: '15-25 years' },
    warehouse:          { min: 6000,   max: 12000,  unit: 'EGP/m²', lifespan: '25-40 years' },
    guard_room:         { min: 4000,   max: 8000,   unit: 'EGP/m²', lifespan: '20-30 years' },
    irrigation_pump:    { min: 25000,  max: 60000,  unit: 'EGP/unit', lifespan: '10-15 years' },
    solar_panels:       { min: 12000,  max: 15000,  unit: 'EGP/kW', lifespan: '20-25 years' },
  },

  // Labor costs per day
  labor: {
    general_worker:  { min: 80,  max: 150, unit: 'EGP/day' },
    skilled_worker:  { min: 150, max: 300, unit: 'EGP/day' },
  },

  // Contingency percentage
  contingency: 0.10,
};

// Helper function to format pricing for prompts
export function formatAgriculturalPricing(): string {
  return `### قاعدة بيانات الأسعار (EGP) ###

** подготов الأرض (لكل فدان) **
- حراثة عميقة: ${formatRange(agriculturalPricing.land_preparation.deep_plowing)}
- تسوية: ${formatRange(agriculturalPricing.land_preparation.leveling)}
- تحليل تربة: ${formatRange(agriculturalPricing.land_preparation.soil_analysis)}
- تحسن التربة: ${formatRange(agriculturalPricing.land_preparation.soil_improvement)}
- ري بالتنقيط: ${formatRange(agriculturalPricing.land_preparation.drip_irrigation)}
- ري رش: ${formatRange(agriculturalPricing.land_preparation.sprinkler)}

** المحاصيل الحقلية (لكل موسم / فدان) **
- قمح: بذور ${formatRange2(agriculturalPricing.field_crops.wheat.seeds)}, عائد ${formatRange2(agriculturalPricing.field_crops.wheat.yield_ton)} طن
- ذرة: بذور ${formatRange2(agriculturalPricing.field_crops.corn.seeds)}, عائد ${formatRange2(agriculturalPricing.field_crops.corn.yield_ton)} طن
- بطاطس: بذور ${formatRange2(agriculturalPricing.field_crops.potatoes.seeds)}, عائد ${formatRange2(agriculturalPricing.field_crops.potatoes.yield_ton)} طن
- طماطم: بذور ${formatRange2(agriculturalPricing.field_crops.tomatoes.seeds)}, عائد ${formatRange2(agriculturalPricing.field_crops.tomatoes.yield_ton)} طن

** الأشجار المثمرة (لكل فدان) **
- برتقال: تأسيس ${formatRange2(agriculturalPricing.fruit_trees.oranges.setup)}, سنوي ${formatRange2(agriculturalPricing.fruit_trees.oranges.annual)}, سعر البيع ${formatRange2(agriculturalPricing.fruit_trees.oranges.sell_price)} EGP/طن
- مانجو: تأسيس ${formatRange2(agriculturalPricing.fruit_trees.mangoes.setup)}, سنوي ${formatRange2(agriculturalPricing.fruit_trees.mangoes.annual)}, سعر البيع ${formatRange2(agriculturalPricing.fruit_trees.mangoes.sell_price)} EGP/طن
- زيتون: تأسيس ${formatRange2(agriculturalPricing.fruit_trees.olives.setup)}, سنوي ${formatRange2(agriculturalPricing.fruit_trees.olives.annual)}, سعر البيع ${formatRange2(agriculturalPricing.fruit_trees.olives.sell_price)} EGP/طن
- تمر: تأسيس ${formatRange2(agriculturalPricing.fruit_trees.dates.setup)}, سنوي ${formatRange2(agriculturalPricing.fruit_trees.dates.annual)}, سعر البيع ${formatRange2(agriculturalPricing.fruit_trees.dates.sell_price)} EGP/طن

** البنية التحتية **
- صوبة بلاستيك: ${formatRange(agriculturalPricing.infrastructure.plastic_greenhouse)}
- سياج: ${formatRange(agriculturalPricing.infrastructure.fencing)}
- مخزن: ${formatRange(agriculturalPricing.infrastructure.warehouse)}
- طلمبة ري: ${formatRange(agriculturalPricing.infrastructure.irrigation_pump)}

** العمالة (لكل يوم) **
- عامل عادي: ${formatRange(agriculturalPricing.labor.general_worker)}
- عامل ماهر: ${formatRange(agriculturalPricing.labor.skilled_worker)}

** هامش الأمان: ${agriculturalPricing.contingency * 100}% من تكاليف التأسيس**`;
}

function formatRange(item: { min: number; max: number; unit: string }): string {
  return `${item.min.toLocaleString()} - ${item.max.toLocaleString()} ${item.unit}`;
}

function formatRange2(arr: readonly number[]): string {
  return `${arr[0].toLocaleString()} - ${arr[1].toLocaleString()}`;
}