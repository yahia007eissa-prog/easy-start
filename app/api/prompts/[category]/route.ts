// API route for managing individual system prompt categories

import { NextRequest, NextResponse } from 'next/server';
import { getSystemPromptInfo, updatePrompt, type ProjectCategory } from '@/lib/ai/system-prompts/dynamic-prompts';

const VALID_CATEGORIES: ProjectCategory[] = ['realEstate', 'medical', 'agricultural', 'industrial'];

interface Params {
  params: Promise<{ category: string }>;
}

// GET /api/prompts/[category] - Get single prompt
export async function GET(request: NextRequest, { params }: Params) {
  const { category } = await params;

  try {
    if (!VALID_CATEGORIES.includes(category as ProjectCategory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const info = getSystemPromptInfo(category as ProjectCategory);

    if (!info) {
      return NextResponse.json(
        { success: false, error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error(`[API/prompts/${category}] GET error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

// PUT /api/prompts/[category] - Update single prompt
export async function PUT(request: NextRequest, { params }: Params) {
  const { category } = await params;

  try {
    if (!VALID_CATEGORIES.includes(category as ProjectCategory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { prompt, name, nameAr } = body;

    // Validate prompt exists and is a string
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate prompt isn't empty
    if (prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt cannot be empty' },
        { status: 400 }
      );
    }

    const updates: { prompt: string; name?: string; nameAr?: string } = { prompt };

    // Optional name updates
    if (name && typeof name === 'string') {
      updates.name = name;
    }
    if (nameAr && typeof nameAr === 'string') {
      updates.nameAr = nameAr;
    }

    const success = updatePrompt(category as ProjectCategory, updates);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update prompt' },
        { status: 500 }
      );
    }

    // Return updated config
    const updated = getSystemPromptInfo(category as ProjectCategory);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Prompt updated successfully',
    });
  } catch (error) {
    console.error(`[API/prompts/${category}] PUT error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}