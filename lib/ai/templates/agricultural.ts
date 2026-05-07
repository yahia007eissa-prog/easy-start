// Agricultural HTML Template CSS
// Extracted from public/templates/agricultural.html

export const agriculturalTemplateCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif;
    background: #F7F8FA;
    color: #111827;
    line-height: 1.6;
    padding: 20px;
  }
  .header {
    background: linear-gradient(135deg, #0F6E56 0%, #2F855A 100%);
    color: white;
    padding: 40px;
    border-radius: 12px 12px 0 0;
    text-align: center;
  }
  .header h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .header .category {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 5px;
  }
  .header .date {
    font-size: 12px;
    opacity: 0.7;
  }
  .container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .content {
    font-size: 15px;
    line-height: 1.8;
  }
  .content h2 {
    color: #0F6E56;
    font-size: 22px;
    margin: 30px 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #C6F6D5;
  }
  .content h3 {
    color: #2F855A;
    font-size: 18px;
    margin: 25px 0 12px 0;
  }
  .content p {
    margin: 15px 0;
    color: #4A5568;
  }
  .content table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  .content th {
    background: #0F6E56;
    color: white;
    padding: 12px;
    text-align: right;
  }
  .content td {
    padding: 12px;
    border-bottom: 1px solid #C6F6D5;
  }
  .content tr:nth-child(even) {
    background: #F0FFF4;
  }
  .footer {
    margin-top: 40px;
    padding: 20px;
    background: #C6F6D5;
    border-radius: 8px;
    text-align: center;
    font-size: 13px;
    color: #276749;
  }
  .footer strong {
    color: #0F6E56;
  }
  @media print {
    body { background: white; padding: 0; }
    .container { box-shadow: none; padding: 20px; }
    .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

// Full HTML template wrapper function
export function wrapInAgriculturalTemplate(
  content: string,
  projectName: string,
  category: string = 'مشروع زراعي'
): string {
  const date = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Clean up the content before wrapping
  let cleanContent = content;

  // Remove any duplicate footer note text (appears at end)
  // Handle both Arabic and any text after the footer note
  cleanContent = cleanContent.replace(/ملاحظة: هذه دراسة تقديرية[\s\S]*?تفاصيل دقيقة\./g, '');

  // Find where the actual content starts (first < of any HTML tag)
  const firstTagIndex = cleanContent.indexOf('<');
  if (firstTagIndex > 0) {
    // There's plain text before the first tag - strip it
    cleanContent = cleanContent.substring(firstTagIndex);
  }

  // Remove any header-like div from the start
  if (cleanContent.includes('class="header"') || cleanContent.includes("class='header'")) {
    const headerMatch = cleanContent.match(/<div[^>]*class="header"[^>]*>[\s\S]*?<\/div>\s*/);
    if (headerMatch) {
      cleanContent = cleanContent.replace(headerMatch[0], '');
    }
  }

  // Remove any footer div (we'll add our own)
  const footerPattern = /<div[^>]*class="footer"[^>]*>[\s\S]*?<\/div>/;
  if (footerPattern.test(cleanContent)) {
    cleanContent = cleanContent.replace(footerPattern, '');
  }

  // Clean up any extra whitespace
  cleanContent = cleanContent.trim();

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} - دراسة جدوى زراعية</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    ${agriculturalTemplateCSS}
  </style>
</head>
<body>
  <div class="header">
    <div class="category">${category}</div>
    <h1>${projectName}</h1>
    <div class="date">${date}</div>
  </div>
  <div class="container">
    <div class="content">
      ${cleanContent}
    </div>
    <div class="footer">
      <strong>ملاحظة:</strong> هذه دراسة تقديرية - تواصل مع فريق Easy Start للحصول على تفاصيل دقيقة.
    </div>
  </div>
</body>
</html>`;
}