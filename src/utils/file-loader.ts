import { parseXMLToText, parseMarkdownToText } from './file-parsers';
import { fileCache } from './file-cache';

// Load file content from GitHub repository
export const loadFileContent = async (filePath: string): Promise<string> => {
  try {
    // Clean the path - remove leading slash and ensure it's properly formatted
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // GitHub API configuration
    const GITHUB_API_BASE = 'https://api.github.com/repos';
    const GITHUB_REPO = localStorage.getItem('github_repo') || 'ChurchOfKineticRitual/guava-persona-composer';
    const GITHUB_TOKEN = localStorage.getItem('github_token');
    
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    // Fetch from GitHub API
    const response = await fetch(`${GITHUB_API_BASE}/${GITHUB_REPO}/contents/${cleanPath}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // GitHub API returns base64 encoded content for files
    if (data.content) {
      return atob(data.content.replace(/\n/g, ''));
    }
    
    throw new Error('No content found in GitHub response');
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