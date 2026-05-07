// API route for managing individual pricing categories

import { NextRequest, NextResponse } from 'next/server';
import { getPricingData, updatePricing, type PricingCategory } from '@/lib/ai/dynamic-pricing';

const VALID_CATEGORIES: PricingCategory[] = ['realEstate', 'medical', 'agricultural', 'industrial', 'global'];

interface Params {
  params: Promise<{ category: string }>;
}

// GET /api/pricing/[category] - Get single pricing category
export async function GET(request: NextRequest, { params }: Params) {
  const { category } = await params;

  try {
    if (!VALID_CATEGORIES.includes(category as PricingCategory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const info = getPricingData(category as PricingCategory);

    if (!info) {
      return NextResponse.json(
        { success: false, error: 'Pricing data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error(`[API/pricing/${category}] GET error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}

// PUT /api/pricing/[category] - Update single pricing category
export async function PUT(request: NextRequest, { params }: Params) {
  const { category } = await params;

  try {
    if (!VALID_CATEGORIES.includes(category as PricingCategory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { data } = body;

    // Validate data exists and is an object
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Data is required and must be an object' },
        { status: 400 }
      );
    }

    // Validate it's valid JSON by stringifying
    try {
      JSON.stringify(data);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON data' },
        { status: 400 }
      );
    }

    const success = updatePricing(category as PricingCategory, data);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update pricing data' },
        { status: 500 }
      );
    }

    // Return updated config
    const updated = getPricingData(category as PricingCategory);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Pricing data updated successfully',
    });
  } catch (error) {
    console.error(`[API/pricing/${category}] PUT error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update pricing data' },
      { status: 500 }
    );
  }
}
