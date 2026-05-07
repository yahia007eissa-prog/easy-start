import { PDFDocument, rgb, PageSizes } from 'pdf-lib';
import type { PDFSection } from './types';

const MARGIN = 50;
const FONT_SIZE_BODY = 11;
const FONT_SIZE_H1 = 18;
const FONT_SIZE_H2 = 14;

// Arabic numeral mapping - these are Western numerals that the font can display
// The font itself handles Arabic characters

// This function removes RTL marks and keeps Arabic text as-is
function cleanTextForPdf(text: string): string {
  // Remove RTL/LTR marks that might cause issues
  return text.replace(/[\u200F\u200E]/g, '');
}

export async function generateStudyPDF(
  studyText: string,
  projectName: string
): Promise<Uint8Array> {
  console.log('[PDFGenerator] Starting PDF generation...');
  console.log('[PDFGenerator] Study text length:', studyText.length);

  const pdfDoc = await PDFDocument.create();

  // Load Noto Sans Arabic font from public folder
  let fontBytes: ArrayBuffer;
  try {
    const fontResponse = await fetch('/fonts/NotoSansArabic-Regular.ttf');
    if (!fontResponse.ok) {
      throw new Error(`Failed to fetch font: ${fontResponse.status}`);
    }
    fontBytes = await fontResponse.arrayBuffer();
    console.log('[PDFGenerator] Font loaded successfully');
  } catch (error) {
    console.error('[PDFGenerator] Failed to load Arabic font:', error);
    throw new Error('Could not load Arabic font for PDF generation');
  }

  // Embed the Arabic font
  const font = await pdfDoc.embedFont(fontBytes);

  // We use the same font for both regular and bold (simplified)
  // For proper bold, we'd need a separate bold font file
  const boldFont = font;

  let page = pdfDoc.addPage(PageSizes.A4);
  const { width } = page.getSize();
  let y = page.getHeight() - MARGIN;

  const drawText = (
    text: string,
    fontSize: number,
    isBold = false,
    color = rgb(0, 0, 0)
  ) => {
    const currentFont = isBold ? boldFont : font;
    const cleanedText = cleanTextForPdf(text);

    if (y - fontSize < MARGIN) {
      page = pdfDoc.addPage(PageSizes.A4);
      y = page.getHeight() - MARGIN;
    }

    try {
      page.drawText(cleanedText, {
        x: MARGIN,
        y,
        size: fontSize,
        font: currentFont,
        color,
      });
    } catch (error) {
      console.error('[PDFGenerator] Error drawing text:', error, 'Text:', cleanedText.substring(0, 50));
      // Try to draw a placeholder
      page.drawText('[Text could not be rendered]', {
        x: MARGIN,
        y,
        size: fontSize,
        font: currentFont,
        color: rgb(0.5, 0, 0),
      });
    }

    y -= fontSize + 4;
  };

  const drawWrappedText = (text: string, fontSize: number) => {
    const maxWidth = width - 2 * MARGIN;
    const cleanedText = cleanTextForPdf(text);

    // For Arabic text, we need a different wrapping approach
    // Arabic is RTL, so we draw from right to left or use word-based wrapping
    const words = cleanedText.split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && line) {
        drawText(line, fontSize);
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      drawText(line, fontSize);
    }
  };

  // Title
  drawText(projectName, FONT_SIZE_H1, true, rgb(0.1, 0.3, 0.6));
  drawText('Feasibility Study Report', FONT_SIZE_H2, false);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  drawText(date, FONT_SIZE_BODY, false, rgb(0.4, 0.4, 0.4));
  y -= 30;

  // Content sections
  const sections = parseStudyText(studyText);
  console.log('[PDFGenerator] Parsed', sections.length, 'sections');

  let sectionCount = 0;
  for (const section of sections) {
    sectionCount++;
    if (section.type === 'h1') {
      y -= 10;
      drawText(section.content, FONT_SIZE_H1, true, rgb(0.1, 0.3, 0.6));
      y -= 5;
    } else if (section.type === 'h2') {
      y -= 5;
      drawText(section.content, FONT_SIZE_H2, true);
      y -= 3;
    } else {
      drawWrappedText(section.content, FONT_SIZE_BODY);
      y -= 6;
    }

    // Log progress every 50 sections
    if (sectionCount % 50 === 0) {
      console.log('[PDFGenerator] Processed', sectionCount, 'sections');
    }
  }

  console.log('[PDFGenerator] PDF generation complete');
  return await pdfDoc.save();
}

function parseStudyText(text: string): PDFSection[] {
  const sections: PDFSection[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## ')) {
      sections.push({ type: 'h1', content: trimmed.replace('## ', '') });
    } else if (trimmed.startsWith('### ')) {
      sections.push({ type: 'h2', content: trimmed.replace('### ', '') });
    } else {
      sections.push({ type: 'paragraph', content: trimmed });
    }
  }

  return sections;
}
