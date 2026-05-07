'use server';

import { deepseek, DEEPSEEK_MODEL } from '@/lib/ai/deepseek';
import { getBuilder, hasBuilder } from '@/lib/ai/prompt-builder';
import type { StudyFormData } from '@/lib/ai/prompt-builder/types';

export type { StudyFormData } from '@/lib/ai/prompt-builder/types';

export interface StudyResponse {
  success: boolean;
  studyText?: string;
  projectName?: string;
  prompt?: string; // Full prompt sent to LLM (for debugging)
  error?: string;
  debug?: {
    promptLength: number;
    responseLength: number;
    rawError?: string;
  };
}

export async function generateStudy(formData: StudyFormData): Promise<StudyResponse> {
  console.log('[StudyAction] Starting study generation...');
  console.log('[StudyAction] Form data:', JSON.stringify(formData, null, 2));

  try {
    // Validate form data
    if (!formData.projectName || formData.projectName.trim() === '') {
      console.error('[StudyAction] Validation error: projectName is empty');
      return {
        success: false,
        error: 'Project name is required',
        debug: { promptLength: 0, responseLength: 0 },
      };
    }

    // Build prompt using registered builder for the category
    const category = formData.studyType;
    const builder = getBuilder(category);

    if (!builder) {
      console.error(`[StudyAction] No prompt builder found for category: ${category}`);
      return {
        success: false,
        error: `Unsupported project category: ${category}`,
        debug: { promptLength: 0, responseLength: 0 },
      };
    }

    const fullPrompt = builder.buildPrompt(formData);
    console.log(`[StudyAction] Using prompt builder for category: ${category}`);

    // Log complete prompt
    console.log("[StudyAction]  ======= === COMPLETE PROMPT ==========");
    console.log(`[StudyAction] Category: ${formData.studyType}`);
    console.log(fullPrompt);
    console.log('[StudyAction] ========== END PROMPT ==========');
    console.log('[StudyAction] Prompt length:', fullPrompt.length, 'characters');

    const completion = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: 0.7,
      max_tokens: 8000,
    });

    let fullResponse = completion.choices[0]?.message?.content || '';
    const chunkCount = 1;

    console.log('[StudyAction] Response received');
    console.log('[StudyAction] Total chunks:', chunkCount);
    console.log('[StudyAction] Response length:', fullResponse.length);
    console.log('[StudyAction] Response preview:', fullResponse.substring(0, 500) + '...');

    if (!fullResponse || fullResponse.trim() === '') {
      console.error('[StudyAction] Error: Empty response from AI');
      return {
        success: false,
        error: 'Empty response from AI',
        projectName: formData.projectName,
        debug: { promptLength: fullPrompt.length, responseLength: 0 },
      };
    }

    // Strip markdown code fences if AI wraps HTML in ```html ... ```
    let finalStudyText = fullResponse.trim();
    if (finalStudyText.startsWith('```')) {
      finalStudyText = finalStudyText.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    }

    return {
      success: true,
      studyText: finalStudyText,
      projectName: formData.projectName,
      prompt: fullPrompt, // Include full prompt for debugging
      debug: {
        promptLength: fullPrompt.length,
        responseLength: finalStudyText.length,
      },
    };
  } catch (error) {
    console.error('[StudyAction] Error:', error);
    console.error('[StudyAction] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate study',
      debug: { promptLength: 0, responseLength: 0, rawError: String(error) },
    };
  }
}