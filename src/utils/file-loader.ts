import { parseXMLToText, parseMarkdownToText } from './file-parsers';
import { fileCache } from './file-cache';
import { githubAPI } from './github-api';

// Load file content from GitHub repository
export const loadFileContent = async (filePath: string): Promise<string> => {
  try {
    // Clean the path - remove leading slash and ensure it's properly formatted
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    return await githubAPI.getFileContent(cleanPath);
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