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
import type { Project, CostEstimation } from '@/lib/types/project';
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils/formatters';
import { calculateCostEstimationTotals } from '@/lib/utils/calculations';

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

export async function generateEstimateDocument(project: Project): Promise<void> {
  const costEst = project.calculations.costEstimation;
  const totals = calculateCostEstimationTotals(costEst);

  // Build children array with explicit conditions
  const children: (Paragraph | Table)[] = [
    // Title
    new Paragraph({
      text: 'COST ESTIMATION REPORT',
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

    // Summary Table
    new Paragraph({
      text: 'COST SUMMARY',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 150 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRow([{ text: 'Item' }, { text: 'Amount', align: 'right' }], true),
        createTableRow([{ text: 'Land Cost' }, { text: formatCurrency(costEst.landCost), align: 'right' }]),
        createTableRow([{ text: 'Construction Cost' }, { text: formatCurrency(costEst.totalConstructionCost), align: 'right' }]),
        createTableRow([{ text: 'Materials' }, { text: formatCurrency(costEst.materials.reduce((s, i) => s + i.total, 0)), align: 'right' }]),
        createTableRow([{ text: 'Labor' }, { text: formatCurrency(costEst.labor.reduce((s, i) => s + i.total, 0)), align: 'right' }]),
        createTableRow([{ text: 'Overhead' }, { text: formatCurrency(costEst.overhead.reduce((s, i) => s + i.total, 0)), align: 'right' }]),
        createTableRow([
          { text: 'Subtotal', bold: true },
          { text: formatCurrency(totals.subtotal), align: 'right', bold: true },
        ]),
        createTableRow([
          { text: `Contingency (${costEst.contingencyPercent}%)`, bold: true },
          { text: formatCurrency(totals.contingency), align: 'right', bold: true },
        ]),
        createTableRow([
          { text: `Profit Margin (${costEst.profitMarginPercent}%)`, bold: true },
          { text: formatCurrency(totals.grandTotal - totals.subtotal - totals.contingency), align: 'right', bold: true },
        ]),
        createTableRow([
          { text: 'GRAND TOTAL', bold: true },
          { text: formatCurrency(totals.grandTotal), align: 'right', bold: true },
        ], true),
      ],
    }),
  ];

  // Add materials section if present
  if (costEst.materials.length > 0) {
    children.push(
      new Paragraph({
        text: 'MATERIALS BREAKDOWN',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createTableRow([{ text: 'Description' }, { text: 'Unit' }, { text: 'Qty', align: 'right' }, { text: 'Unit Cost', align: 'right' }, { text: 'Total', align: 'right' }], true),
          ...costEst.materials.map((item) =>
            createTableRow([
              { text: item.description },
              { text: item.unit },
              { text: item.quantity.toString(), align: 'right' },
              { text: formatCurrency(item.unitCost), align: 'right' },
              { text: formatCurrency(item.total), align: 'right' },
            ])
          ),
        ],
      })
    );
  }

  // Add labor section if present
  if (costEst.labor.length > 0) {
    children.push(
      new Paragraph({
        text: 'LABOR BREAKDOWN',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createTableRow([{ text: 'Description' }, { text: 'Unit' }, { text: 'Qty', align: 'right' }, { text: 'Unit Cost', align: 'right' }, { text: 'Total', align: 'right' }], true),
          ...costEst.labor.map((item) =>
            createTableRow([
              { text: item.description },
              { text: item.unit },
              { text: item.quantity.toString(), align: 'right' },
              { text: formatCurrency(item.unitCost), align: 'right' },
              { text: formatCurrency(item.total), align: 'right' },
            ])
          ),
        ],
      })
    );
  }

  // Add overhead section if present
  if (costEst.overhead.length > 0) {
    children.push(
      new Paragraph({
        text: 'OVERHEAD COSTS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createTableRow([{ text: 'Description' }, { text: 'Unit' }, { text: 'Qty', align: 'right' }, { text: 'Unit Cost', align: 'right' }, { text: 'Total', align: 'right' }], true),
          ...costEst.overhead.map((item) =>
            createTableRow([
              { text: item.description },
              { text: item.unit },
              { text: item.quantity.toString(), align: 'right' },
              { text: formatCurrency(item.unitCost), align: 'right' },
              { text: formatCurrency(item.total), align: 'right' },
            ])
          ),
        ],
      })
    );
  }

  // Add footer
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
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          run: { size: 32, bold: true },
          paragraph: { spacing: { after: 200 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          run: { size: 24, bold: true },
          paragraph: { spacing: { after: 150 } },
        },
      ],
    },
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${project.name.replace(/[^a-z0-9]/gi, '_')}_Cost_Estimate.docx`;
  saveAs(blob, filename);
}