import { parseXMLToText, parseMarkdownToText } from './file-parsers';
import { fileCache } from './file-cache';

// Load file content from the actual repository files
export const loadFileContent = async (filePath: string): Promise<string> => {
  try {
    // Convert the virtual file path to the actual file path
    const actualPath = filePath.startsWith('/personas/') ? filePath.substring(1) : filePath;
    
    // Fetch the file content from the public directory
    const response = await fetch(`/${actualPath}`);
    
    if (!response.ok) {
      // Try alternative path construction
      const altPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const altResponse = await fetch(`/${altPath}`);
      if (!altResponse.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
      }
      return await altResponse.text();
    }
    
    const content = await response.text();
    return content;
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error);
    throw error;
  }
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