// Parse XML content - just decode character references
export const parseXMLToText = (xmlContent: string): string => {
  // Decode common XML character references
  return xmlContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
};

// Parse Markdown content (minimal processing for editing)
export const parseMarkdownToText = (mdContent: string): string => {
  // Keep markdown structure but clean up for editing
  return mdContent.trim();
};

// Convert parsed text back to XML
export const textToXML = (text: string, originalXML: string): string => {
  // Re-encode special characters for XML
  const xml = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  return xml;
};

// Convert parsed text back to Markdown
export const textToMarkdown = (text: string): string => {
  // For markdown, we can mostly return as-is since we preserved the structure
  return text;
};
