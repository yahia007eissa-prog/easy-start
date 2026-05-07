export interface PDFSection {
  type: 'h1' | 'h2' | 'paragraph';
  content: string;
}

export interface StudyPDFOptions {
  locale?: 'en' | 'ar';
  includeTimestamp?: boolean;
}
