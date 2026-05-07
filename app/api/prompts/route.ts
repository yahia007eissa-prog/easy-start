// API route for managing system prompts

import { NextRequest, NextResponse } from 'next/server';
import { getAllPromptConfigs, getPromptConfigList, type ProjectCategory } from '@/lib/ai/system-prompts/dynamic-prompts';

// GET /api/prompts - Get all prompts (metadata only, no full prompt text for list view)
export async function GET() {
  try {
    const prompts = getPromptConfigList();

    // Return summary without full prompt text for list view
    const summary = prompts.map(({ category, info }) => ({
      category,
      name: info.name,
      nameAr: info.nameAr,
      promptLength: info.prompt.length,
      updatedAt: info.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('[API/prompts] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}