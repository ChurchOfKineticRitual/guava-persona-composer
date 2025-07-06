// Parse XML content to readable text
export const parseXMLToText = (xmlContent: string): string => {
  // Remove XML declarations and comments
  let text = xmlContent.replace(/<\?xml[^>]*\?>/g, '');
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  
  // Convert common XML tags to readable format
  text = text.replace(/<title[^>]*>(.*?)<\/title>/gi, '# $1\n\n');
  text = text.replace(/<heading[^>]*>(.*?)<\/heading>/gi, '## $1\n\n');
  text = text.replace(/<description[^>]*>(.*?)<\/description>/gi, '$1\n\n');
  text = text.replace(/<content[^>]*>(.*?)<\/content>/gi, '$1\n\n');
  text = text.replace(/<example[^>]*>(.*?)<\/example>/gi, 'Example: $1\n\n');
  text = text.replace(/<note[^>]*>(.*?)<\/note>/gi, 'Note: $1\n\n');
  
  // Remove remaining XML tags but keep content
  text = text.replace(/<[^>]*>/g, '');
  
  // Clean up whitespace
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  text = text.trim();
  
  return text;
};

// Parse Markdown content (minimal processing for editing)
export const parseMarkdownToText = (mdContent: string): string => {
  // Keep markdown structure but clean up for editing
  return mdContent.trim();
};

// Convert parsed text back to XML
export const textToXML = (text: string, originalXML: string): string => {
  // This is a simplified implementation
  // In practice, you'd want to preserve the original XML structure
  
  // Extract the root element from original
  const rootMatch = originalXML.match(/<(\w+)[^>]*>/);
  const rootElement = rootMatch ? rootMatch[1] : 'content';
  
  // Basic conversion back to XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n`;
  
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    if (trimmedLine.startsWith('# ')) {
      xml += `  <title>${trimmedLine.substring(2)}</title>\n`;
    } else if (trimmedLine.startsWith('## ')) {
      xml += `  <heading>${trimmedLine.substring(3)}</heading>\n`;
    } else if (trimmedLine.startsWith('Example: ')) {
      xml += `  <example>${trimmedLine.substring(9)}</example>\n`;
    } else if (trimmedLine.startsWith('Note: ')) {
      xml += `  <note>${trimmedLine.substring(6)}</note>\n`;
    } else {
      xml += `  <content>${trimmedLine}</content>\n`;
    }
  }
  
  xml += `</${rootElement}>`;
  return xml;
};

// Convert parsed text back to Markdown
export const textToMarkdown = (text: string): string => {
  // For markdown, we can mostly return as-is since we preserved the structure
  return text;
};
