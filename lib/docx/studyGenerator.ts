import Turndown from 'turndown';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

// Configure turndown with custom rules
const turndownService = new Turndown({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Custom rule for HTML tables - convert to markdown tables
turndownService.addRule('tables', {
  filter: 'table',
  replacement: function (content) {
    // Convert HTML table to markdown table
    const rows: string[] = [];
    const tableBody = content.replace(/<thead[\s\S]*?<\/thead>/gi, '');
    const tableRows = tableBody.match(/<tr[\s\S]*?<\/tr>/gi) || [];

    for (const row of tableRows) {
      const cells: string[] = [];
      const cellMatches = row.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) || [];
      for (const cell of cellMatches) {
        const text = cell.replace(/<t[dh][^>]*>/gi, '').replace(/<\/t[dh]>/gi, '').trim();
        cells.push(text);
      }
      if (cells.length > 0) {
        rows.push('| ' + cells.join(' | ') + ' |');
      }
    }

    if (rows.length === 0) return '';

    // Add separator row after header
    let table = rows[0] + '\n';
    if (rows.length > 1) {
      const cols = rows[0].split('|').length - 2;
      table += '|' + '---|'.repeat(cols) + '\n';
      table += rows.slice(1).join('\n');
    }

    return table + '\n';
  },
});

// Custom rule to handle div sections as headers if they contain emojis
turndownService.addRule('sectionHeaders', {
  filter: function (node) {
    return (
      node.nodeName === 'DIV' &&
      /^[📍💰🌱📊📈⚠️🗓️✅]/.test(node.textContent || '')
    );
  },
  replacement: function (content) {
    return '\n## ' + content.trim() + '\n';
  },
});

export async function generateStudyDocx(
  studyText: string,
  projectName: string
): Promise<void> {
  console.log('[DocxGenerator] Starting DOCX generation...');
  console.log('[DocxGenerator] Study text length:', studyText.length);

  // Check if content is HTML
  const isHtml = /<[^>]+>/i.test(studyText) || studyText.includes('<html') || studyText.includes('<!DOCTYPE');
  console.log('[DocxGenerator] Is HTML content:', isHtml);

  let processedText = studyText;

  // Convert HTML to markdown if needed
  if (isHtml) {
    console.log('[DocxGenerator] Converting HTML to markdown...');
    processedText = turndownService.turndown(studyText);
    console.log('[DocxGenerator] Converted text length:', processedText.length);
    console.log('[DocxGenerator] Converted text preview:', processedText.substring(0, 500));
  }

  const lines = processedText.split('\n');
  console.log('[DocxGenerator] Total lines:', lines.length);

  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: projectName,
          bold: true,
          size: 48,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Feasibility Study Report',
          size: 32,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: new Date().toLocaleDateString('ar-EG'),
          size: 24,
          color: '666666',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Parse markdown content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      children.push(new Paragraph({ children: [], spacing: { after: 100 } }));
      continue;
    }

    // Check for markdown table (| column | column |)
    if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
      // This is a table separator row, skip it
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Table row
      const cells = trimmed
        .split('|')
        .filter((c) => c.trim())
        .map((c) => c.trim());

      const rowColor = i === 0 ? 'E8F5EE' : undefined; // Header row background
      const isHeader = cells.some(
        (c) => c.match(/^[-:\s]+$/) === null && /^(المشروع|البند|العنصر|النوع|الفئة)/.test(c)
      );

      const tableRow = new TableRow({
        children: cells.map((cellText) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText,
                    size: isHeader ? 22 : 20,
                    bold: isHeader,
                  }),
                ],
              }),
            ],
            shading: isHeader
              ? {
                  fill: rowColor,
                  type: 'clear',
                }
              : undefined,
          })
        ),
      });

      // For now, just add as text since we can't mix paragraphs and tables easily
      // We'll create a simple table structure at the end
      const cellText = cells.join('  |  ');
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cellText,
              size: 20,
              font: 'Courier New',
              bold: isHeader,
            }),
          ],
          spacing: { after: 40 },
          indent: { left: convertInchesToTwip(0.25) },
        })
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      // H1 heading
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^#+\s*/, ''),
              bold: true,
              size: 40,
              color: '0F6E56',
            }),
          ],
          spacing: { before: 400, after: 200 },
        })
      );
    } else if (trimmed.startsWith('## ')) {
      // H2 heading
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^#+\s*/, ''),
              bold: true,
              size: 32,
              color: '2C7A4F',
            }),
          ],
          spacing: { before: 300, after: 150 },
        })
      );
    } else if (trimmed.startsWith('### ')) {
      // H3 heading
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^#+\s*/, ''),
              bold: true,
              size: 26,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      // Bullet point
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^[-*•]\s*/, ''),
              size: 22,
            }),
          ],
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.25) },
        })
      );
    } else if (/^\d+[\.\):]\s/.test(trimmed)) {
      // Numbered list
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              size: 22,
            }),
          ],
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.25) },
        })
      );
    } else {
      // Regular paragraph
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              size: 22,
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  console.log('[DocxGenerator] Created', children.length, 'paragraphs');

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${projectName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}_Feasibility_Study.docx`;
  console.log('[DocxGenerator] Saving as:', filename);
  saveAs(blob, filename);
}