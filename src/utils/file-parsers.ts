// Parse XML content to readable text while preserving structure
export const parseXMLToText = (xmlContent: string): string => {
  // Remove XML declarations and comments but preserve for reconstruction
  let text = xmlContent.replace(/<\?xml[^>]*\?>/g, '');
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  
  // Convert XML elements to readable annotations that preserve semantic meaning
  // Use a format that's human-readable but can be reliably converted back
  text = text.replace(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tagName, attributes, content) => {
    const trimmedContent = content.trim();
    const attrText = attributes.trim() ? ` ${attributes.trim()}` : '';
    
    if (trimmedContent.includes('<')) {
      // Nested content - use block format
      return `[${tagName.toUpperCase()}${attrText}]\n${trimmedContent}\n[/${tagName.toUpperCase()}]\n\n`;
    } else {
      // Simple content - use inline format
      return `[${tagName.toUpperCase()}${attrText}] ${trimmedContent}\n\n`;
    }
  });
  
  // Handle self-closing tags
  text = text.replace(/<(\w+)([^>]*?)\/>/gi, '[${1.toUpperCase()}$2 /]\n\n');
  
  // Clean up excessive whitespace while preserving structure
  text = text.replace(/\n\s*\n\s*\n+/g, '\n\n');
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
  // Preserve the original XML declaration if it exists
  const xmlDeclaration = originalXML.match(/<\?xml[^>]*\?>/)?.[0] || '<?xml version="1.0" encoding="UTF-8"?>';
  
  // Convert the annotated text back to proper XML
  let xml = text;
  
  // Convert block-style annotations back to XML
  xml = xml.replace(/\[(\w+)([^\]]*?)\]\n([\s\S]*?)\[\/\1\]/gi, (match, tagName, attributes, content) => {
    const trimmedContent = content.trim();
    return `<${tagName.toLowerCase()}${attributes}>${trimmedContent}</${tagName.toLowerCase()}>`;
  });
  
  // Convert inline-style annotations back to XML
  xml = xml.replace(/\[(\w+)([^\]]*?)\]\s*(.*?)(?=\n|$)/gi, (match, tagName, attributes, content) => {
    const trimmedContent = content.trim();
    if (trimmedContent) {
      return `<${tagName.toLowerCase()}${attributes}>${trimmedContent}</${tagName.toLowerCase()}>`;
    } else {
      return `<${tagName.toLowerCase()}${attributes} />`;
    }
  });
  
  // Handle self-closing tags
  xml = xml.replace(/\[(\w+)([^\]]*?)\s+\/\]/gi, '<$1$2 />');
  
  // Clean up and add XML declaration
  xml = xml.replace(/\n\s*\n+/g, '\n').trim();
  
  return `${xmlDeclaration}\n${xml}`;
};

// Convert parsed text back to Markdown
export const textToMarkdown = (text: string): string => {
  // For markdown, we can mostly return as-is since we preserved the structure
  return text;
};
