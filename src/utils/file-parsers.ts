// Parse XML content - keep structure but decode character references
export const parseXMLToText = (xmlContent: string): string => {
  // Decode common XML character references
  let text = xmlContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  
  return text;
};

// Parse Markdown content (minimal processing for editing)
export const parseMarkdownToText = (mdContent: string): string => {
  // Keep markdown structure but clean up for editing
  return mdContent.trim();
};

// Convert parsed text back to XML
export const textToXML = (text: string, originalXML: string): string => {
  // Preserve the original XML declaration if it exists
  const xmlDeclaration = originalXML.match(/<\?xml[^>]*\?>/)?.[0] || '<?xml version="1.0" encoding="UTF-8"?>';
  
  // Re-encode special characters for XML
  let xml = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // Add XML declaration if original had one
  if (originalXML.includes('<?xml')) {
    return `${xmlDeclaration}\n${xml}`;
  }
  
  return xml;
};

// Convert parsed text back to Markdown
export const textToMarkdown = (text: string): string => {
  // For markdown, we can mostly return as-is since we preserved the structure
  return text;
};
