import { saveAs } from 'file-saver';

// Check if prompt download is enabled via environment variable
const ENABLE_PROMPT_DOWNLOAD = process.env.NEXT_PUBLIC_DOWNLOAD_PROMPT === 'true';

export interface DownloadOptions {
  prompt?: string;
  includePrompt?: boolean; // Override env flag for specific calls
  category?: string; // Category for template selection (realEstate, medical, industrial, agricultural)
}

export async function downloadStudyHtml(
  studyText: string,
  projectName: string,
  options: DownloadOptions = {}
): Promise<void> {
  console.log('[HtmlDownload] Starting HTML download...');
  console.log('[HtmlDownload] Study text length:', studyText.length);
  console.log('[HtmlDownload] Project name:', projectName);
  console.log('[HtmlDownload] Category:', options.category);
  console.log('[HtmlDownload] ENABLE_PROMPT_DOWNLOAD:', ENABLE_PROMPT_DOWNLOAD);

  // Determine if we should download prompt
  const shouldDownloadPrompt = options.includePrompt ?? ENABLE_PROMPT_DOWNLOAD;

  // Try to get template-based HTML or fall back to inline
  let htmlContent = await getHtmlWithTemplate(studyText, projectName, options.category);

  const safeProjectName = projectName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');

  // Download HTML file
  const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const htmlFilename = `${safeProjectName}_feasibility_study.html`;
  console.log('[HtmlDownload] Saving HTML as:', htmlFilename);
  saveAs(htmlBlob, htmlFilename);

  // Download prompt TXT file if enabled
  if (shouldDownloadPrompt && options.prompt) {
    const promptFilename = `${safeProjectName}_prompt.txt`;
    console.log('[HtmlDownload] Saving prompt as:', promptFilename);
    const promptBlob = new Blob([options.prompt], { type: 'text/plain;charset=utf-8' });
    saveAs(promptBlob, promptFilename);
  }
}

async function getHtmlWithTemplate(
  studyText: string,
  projectName: string,
  category?: string
): Promise<string> {
  // Check if studyText is already a complete HTML document
  // If it already has DOCTYPE or <html> tag, it's already wrapped - return as-is
  if (studyText.includes('<!DOCTYPE') || studyText.includes('<html')) {
    console.log('[HtmlDownload] Study text is already a complete HTML document, returning as-is');
    return studyText;
  }

  // If category is provided, try to fetch template
  if (category) {
    try {
      const templateUrl = `/templates/${category}.html`;
      console.log('[HtmlDownload] Fetching template from:', templateUrl);

      const response = await fetch(templateUrl);
      if (response.ok) {
        let template = await response.text();
        console.log('[HtmlDownload] Template loaded successfully');

        // Get current date in Arabic format
        const date = new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Get category display name
        const categoryNames: Record<string, string> = {
          realEstate: 'عقارات',
          medical: 'طبى',
          industrial: 'صناعى',
          agricultural: 'زراعى'
        };
        const categoryDisplay = categoryNames[category] || category;

        // Replace placeholders
        template = template
          .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
          .replace(/\{\{CONTENT\}\}/g, studyText)
          .replace(/\{\{DATE\}\}/g, date)
          .replace(/\{\{CATEGORY\}\}/g, categoryDisplay);

        return template;
      } else {
        console.log('[HtmlDownload] Template not found, using inline fallback');
      }
    } catch (error) {
      console.log('[HtmlDownload] Error fetching template:', error);
    }
  }

  // Fall back to inline template (existing behavior)
  return getInlineHtmlTemplate(studyText, projectName);
}

function getInlineHtmlTemplate(studyText: string, projectName: string): string {
  // Check if it looks like a complete HTML document
  if (!studyText.includes('<!DOCTYPE') && !studyText.includes('<html')) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} - دراسة جدوى</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Cairo', sans-serif;
      background: #F7F8FA;
      color: #111827;
      line-height: 1.6;
      padding: 20px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${studyText}
  </div>
</body>
</html>`;
  }

  // Return as-is if it's already a complete HTML document
  return studyText;
}