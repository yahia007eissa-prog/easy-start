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
import { formatCurrency, formatDate, formatPercent, formatDuration } from '@/lib/utils/formatters';
import { calculateROI, calculateCostEstimationTotals } from '@/lib/utils/calculations';

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

export async function generateROIDocument(project: Project): Promise<void> {
  const costEst = project.calculations.costEstimation;
  const roi = project.calculations.roiCalculations;
  const calculatedROI = calculateROI(costEst, roi);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'ROI ANALYSIS REPORT',
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

          // Key Metrics
          new Paragraph({
            text: 'KEY FINANCIAL METRICS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              createTableRow([{ text: 'Metric' }, { text: 'Value', align: 'right' }], true),
              createTableRow([{ text: 'Total Investment' }, { text: formatCurrency(costEst.grandTotal), align: 'right' }]),
              createTableRow([{ text: 'Monthly Revenue' }, { text: formatCurrency(calculatedROI.monthlyRevenue), align: 'right' }]),
              createTableRow([{ text: 'Annual Revenue' }, { text: formatCurrency(calculatedROI.annualRevenue), align: 'right' }]),
              createTableRow([{ text: 'Net Operating Income (NOI)' }, { text: formatCurrency(calculatedROI.netOperatingIncome), align: 'right' }]),
              createTableRow([{ text: 'Annual Cash Flow' }, { text: formatCurrency(calculatedROI.annualCashFlow), align: 'right' }]),
              createTableRow([{ text: 'Cap Rate', bold: true }, { text: formatPercent(calculatedROI.capRate), align: 'right', bold: true }]),
              createTableRow([{ text: 'Cash on Cash Return', bold: true }, { text: formatPercent(calculatedROI.cashOnCashReturn), align: 'right', bold: true }]),
              createTableRow([{ text: 'Payback Period', bold: true }, { text: formatDuration(calculatedROI.paybackPeriod), align: 'right', bold: true }]),
            ],
          }),

          // Revenue Breakdown
          new Paragraph({
            text: 'REVENUE BREAKDOWN',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Monthly Revenue: ', bold: true }),
              new TextRun(formatCurrency(roi.monthlyRevenue)),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Annual Revenue: ', bold: true }),
              new TextRun(formatCurrency(calculatedROI.annualRevenue)),
            ],
            spacing: { after: 200 },
          }),

          // Operating Expenses
          new Paragraph({
            text: 'OPERATING EXPENSES',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          roi.operatingExpenses.length > 0
            ? new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  createTableRow([{ text: 'Description' }, { text: 'Type' }, { text: 'Amount', align: 'right' }, { text: 'Frequency' }, { text: 'Annual', align: 'right' }], true),
                  ...roi.operatingExpenses.map((item) =>
                    createTableRow([
                      { text: item.description },
                      { text: item.category },
                      { text: formatCurrency(item.amount), align: 'right' },
                      { text: item.frequency === 'monthly' ? 'Monthly' : 'Annual' },
                      { text: formatCurrency(item.frequency === 'monthly' ? item.amount * 12 : item.amount), align: 'right' },
                    ])
                  ),
                  createTableRow([
                    { text: 'Total Operating Expenses', bold: true },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: formatCurrency(calculatedROI.totalOperatingExpenses), align: 'right', bold: true },
                  ]),
                ],
              })
            : new Paragraph({ text: 'No operating expenses recorded.', spacing: { after: 200 } }),

          // Cash Flow Summary
          new Paragraph({
            text: 'CASH FLOW SUMMARY',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              createTableRow([{ text: 'Item' }, { text: 'Amount', align: 'right' }], true),
              createTableRow([{ text: 'Annual Revenue' }, { text: formatCurrency(calculatedROI.annualRevenue), align: 'right' }]),
              createTableRow([{ text: 'Operating Expenses' }, { text: `- ${formatCurrency(calculatedROI.totalOperatingExpenses)}`, align: 'right' }]),
              createTableRow([{ text: 'Net Operating Income', bold: true }, { text: formatCurrency(calculatedROI.netOperatingIncome), align: 'right', bold: true }]),
              createTableRow([{ text: 'Annual Debt Service' }, { text: `- ${formatCurrency(roi.annualDebtService)}`, align: 'right' }]),
              createTableRow([
                { text: 'Annual Cash Flow', bold: true },
                { text: formatCurrency(calculatedROI.annualCashFlow), align: 'right', bold: true },
              ]),
            ],
          }),

          // Footer
          new Paragraph({
            children: [
              new TextRun({ text: 'Generated: ', bold: true }),
              new TextRun(new Date().toLocaleString()),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
          }),
        ].filter(Boolean),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${project.name.replace(/[^a-z0-9]/gi, '_')}_ROI_Analysis.docx`;
  saveAs(blob, filename);
}