// API route for managing pricing configurations

import { NextResponse } from 'next/server';
import { getPricingConfigList, type PricingCategory } from '@/lib/ai/dynamic-pricing';

// GET /api/pricing - Get all pricing categories (metadata only)
export async function GET() {
  try {
    const pricing = getPricingConfigList();

    // Return summary without full data for list view
    const summary = pricing.map(({ category, info }) => ({
      category,
      name: info.name,
      nameAr: info.nameAr,
      dataSize: JSON.stringify(info.data).length,
      updatedAt: info.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('[API/pricing] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}
