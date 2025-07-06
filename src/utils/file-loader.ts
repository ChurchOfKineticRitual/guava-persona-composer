import { parseXMLToText, parseMarkdownToText } from './file-parsers';
import { fileCache } from './file-cache';

// Simulate loading file content from the repository
export const loadFileContent = async (filePath: string): Promise<string> => {
  // In a real implementation, this would fetch from GitHub API
  // For now, we'll return sample content based on file type
  
  const fileName = filePath.split('/').pop() || '';
  
  if (fileName.includes('persona_data.xml')) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<persona_data>
  <title>Agent Configuration</title>
  <description>Core persona data for the agent</description>
  <properties>
    <name>Klark Kent</name>
    <role>Creative Agent</role>
    <personality>Thoughtful, creative, and methodical</personality>
  </properties>
  <content>
    This agent specializes in creative content generation with a focus on maintaining consistency and quality across all outputs.
  </content>
</persona_data>`;
  }
  
  if (fileName.includes('system_prompt.md')) {
    return `# System Prompt

## Role
You are a creative writing assistant specializing in character development and narrative consistency.

## Guidelines
- Maintain character voice throughout all interactions
- Focus on creative and engaging content
- Ensure consistency with established lore and world-building

## Examples
Example interactions and expected responses would go here.

## Notes
Additional configuration notes and special instructions.`;
  }
  
  if (fileName.endsWith('.xml')) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <title>${fileName}</title>
  <content>Sample XML content for ${fileName}</content>
</document>`;
  }
  
  if (fileName.endsWith('.md')) {
    return `# ${fileName}

Sample markdown content for this file.

## Section 1
Content here...

## Section 2
More content here...`;
  }
  
  return `Sample content for ${fileName}`;
};

// Load and parse file content
export const loadAndParseFile = async (filePath: string): Promise<{ parsedContent: string; fileType: 'xml' | 'md' | 'other' }> => {
  // Check cache first
  const cached = fileCache.getFile(filePath);
  if (cached) {
    return { 
      parsedContent: cached.editedContent, 
      fileType: cached.fileType 
    };
  }
  
  // Load original content
  const originalContent = await loadFileContent(filePath);
  
  // Determine file type and parse
  let parsedContent: string;
  let fileType: 'xml' | 'md' | 'other';
  
  if (filePath.endsWith('.xml')) {
    parsedContent = parseXMLToText(originalContent);
    fileType = 'xml';
  } else if (filePath.endsWith('.md')) {
    parsedContent = parseMarkdownToText(originalContent);
    fileType = 'md';
  } else {
    parsedContent = originalContent;
    fileType = 'other';
  }
  
  // Cache the file
  fileCache.setFile(filePath, originalContent, parsedContent, fileType);
  
  return { parsedContent, fileType };
};