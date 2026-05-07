import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import type { Project } from '@/lib/types/project';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/formatters';

function createTableRow(cells: { text: string; bold?: boolean; align?: 'left' | 'center' | 'right' }[], isHeader = false) {
  return new TableRow({
    children: cells.map((cell) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: cell.text,
                bold: cell.bold || isHeader,
              }),
            ],
            alignment: cell.align === 'right' ? AlignmentType.RIGHT : cell.align === 'center' ? AlignmentType.CENTER : AlignmentType.LEFT,
          }),
        ],
        borders: {
          bottom: { style: BorderStyle.SINGLE, size: 1 },
        },
      })
    ),
  });
}

export async function generateTakeoffDocument(project: Project): Promise<void> {
  const takeoff = project.calculations.materialTakeoff;

  // Calculate totals
  let totalMaterials = 0;
  let totalLaborHours = 0;
  let totalCost = 0;

  takeoff.phases.forEach((phase) => {
    phase.materials.forEach((item) => {
      totalMaterials += item.total;
      totalCost += item.total;
    });
    phase.labor.forEach((item) => {
      totalLaborHours += item.totalHours;
      totalCost += item.total;
    });
  });

  // Build children array
  const children: (Paragraph | Table)[] = [
    // Title
    new Paragraph({
      text: 'MATERIAL TAKE-OFF REPORT',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),

    // Project Info
    new Paragraph({
      children: [
        new TextRun({ text: 'Project: ', bold: true }),
        new TextRun(project.name),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Type: ', bold: true }),
        new TextRun(project.type.charAt(0).toUpperCase() + project.type.slice(1).replace('-', ' ')),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Location: ', bold: true }),
        new TextRun(`${project.location.address}, ${project.location.city}, ${project.location.state} ${project.location.zipCode}`),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Date: ', bold: true }),
        new TextRun(formatDate(new Date())),
      ],
      spacing: { after: 300 },
    }),

    // Summary
    new Paragraph({
      text: 'SUMMARY',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 150 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([{ text: 'Metric' }, { text: 'Value', align: 'right' }], true),
        createTableRow([{ text: 'Total Materials Cost' }, { text: formatCurrency(totalMaterials), align: 'right' }]),
        createTableRow([{ text: 'Total Labor Hours' }, { text: formatNumber(totalLaborHours), align: 'right' }]),
        createTableRow([{ text: 'Total Labor Cost' }, { text: formatCurrency(takeoff.phases.reduce((s, p) => s + p.labor.reduce((ls, l) => ls + l.total, 0), 0)), align: 'right' }]),
        createTableRow([
          { text: 'GRAND TOTAL', bold: true },
          { text: formatCurrency(totalCost), align: 'right', bold: true },
        ], true),
      ],
    }),
  ];

  // Add phases
  for (const phase of takeoff.phases) {
    const phaseMaterials = phase.materials.reduce((s, m) => s + m.total, 0);
    const phaseLabor = phase.labor.reduce((s, l) => s + l.total, 0);
    const phaseHours = phase.labor.reduce((s, l) => s + l.totalHours, 0);
    const phaseTotal = phaseMaterials + phaseLabor;

    // Phase header
    children.push(
      new Paragraph({
        text: `${phase.order}. ${phase.name.toUpperCase()}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      })
    );

    // Materials table
    if (phase.materials.length > 0) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createTableRow([{ text: 'Material' }, { text: 'Category' }, { text: 'Qty', align: 'right' }, { text: 'Adj. Qty', align: 'right' }, { text: 'Unit' }, { text: 'Unit Cost', align: 'right' }, { text: 'Total', align: 'right' }], true),
            ...phase.materials.map((item) =>
              createTableRow([
                { text: item.name },
                { text: item.category },
                { text: formatNumber(item.quantity), align: 'right' },
                { text: formatNumber(item.adjustedQuantity), align: 'right' },
                { text: item.unit, align: 'center' },
                { text: formatCurrency(item.unitCost), align: 'right' },
                { text: formatCurrency(item.total), align: 'right' },
              ])
            ),
          ],
        })
      );
    }

    // Labor table
    if (phase.labor.length > 0) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createTableRow([{ text: 'Task' }, { text: 'Hrs/Unit', align: 'right' }, { text: 'Units', align: 'right' }, { text: 'Total Hrs', align: 'right' }, { text: 'Rate/hr', align: 'right' }, { text: 'Total', align: 'right' }], true),
            ...phase.labor.map((item) =>
              createTableRow([
                { text: item.task },
                { text: item.hoursPerUnit.toFixed(1), align: 'right' },
                { text: formatNumber(item.unitCount), align: 'right' },
                { text: formatNumber(item.totalHours), align: 'right' },
                { text: formatCurrency(item.hourlyRate), align: 'right' },
                { text: formatCurrency(item.total), align: 'right' },
              ])
            ),
          ],
        })
      );
    }

    // Phase summary
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Phase Total: ', bold: true }),
          new TextRun({ text: formatCurrency(phaseTotal), bold: true }),
          new TextRun({ text: `  |  ${formatNumber(phaseHours)} labor hours`, italics: true }),
        ],
        spacing: { before: 100, after: 200 },
      })
    );
  }

  // Footer
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Generated: ', bold: true }),
        new TextRun(new Date().toLocaleString()),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${project.name.replace(/[^a-z0-9]/gi, '_')}_Material_Takeoff.docx`;
  saveAs(blob, filename);
}