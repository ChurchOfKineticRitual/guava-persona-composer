import { githubAPI } from './github-api';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  edited?: boolean;
  selected?: 'active' | 'inactive' | 'partial';
}

// Convert GitHub API response to FileNode structure
const convertGitHubItemToFileNode = (item: any): FileNode => {
  return {
    name: item.name,
    type: item.type === 'dir' ? 'folder' : 'file',
    path: item.path,
    selected: 'active', // Default to active
    ...(item.type === 'dir' && { children: [] }) // Will be populated recursively
  };
};

// Recursively fetch folder structure from GitHub
const fetchGitHubFolderStructure = async (path: string): Promise<FileNode[]> => {
  try {
    const items = await githubAPI.fetchContent(path);
    const nodes: FileNode[] = [];
    
    for (const item of items) {
      const node = convertGitHubItemToFileNode(item);
      
      if (node.type === 'folder') {
        // Recursively fetch folder contents
        node.children = await fetchGitHubFolderStructure(item.path);
        
        // Set folder selection state based on children
        const activeChildren = node.children?.filter(child => child.selected === 'active').length || 0;
        const totalChildren = node.children?.length || 0;
        
        if (activeChildren === 0) {
          node.selected = 'inactive';
        } else if (activeChildren === totalChildren) {
          node.selected = 'active';
        } else {
          node.selected = 'partial';
        }
      }
      
      nodes.push(node);
    }
    
    return nodes;
  } catch (error) {
    console.error(`Error fetching GitHub folder ${path}:`, error);
    throw error; // Re-throw to handle properly
  }
};

export const getPersonaStructure = async (personaId: string, version: string): Promise<FileNode[]> => {
  const basePath = `personas/${personaId}/versions/${version}`;
  
  try {
    return await fetchGitHubFolderStructure(basePath);
  } catch (error) {
    console.error('Failed to load persona structure from GitHub:', error);
    // For now, return empty array instead of fallback - we need GitHub to work
    return [];
  }
};

export const getAvailablePersonas = async (): Promise<string[]> => {
  try {
    const items = await githubAPI.fetchContent('personas');
    return items
      .filter(item => item.type === 'dir')
      .map(item => item.name);
  } catch (error) {
    console.error('Error fetching personas:', error);
    throw error; // Re-throw to handle properly
  }
};

export const getPersonaVersions = async (personaId: string): Promise<string[]> => {
  try {
    const items = await githubAPI.fetchContent(`personas/${personaId}/versions`);
    return items
      .filter(item => item.type === 'dir')
      .map(item => item.name);
  } catch (error) {
    console.error('Error fetching versions:', error);
    throw error; // Re-throw to handle properly
  }
};

export const getPersonaMetadata = async (personaId: string, version: string) => {
  try {
    // Try to get the persona image from GitHub
    const imageUrl = await githubAPI.getPersonaImage(personaId);
    
    return {
      voiceId: "YOUR_ELEVENLABS_VOICE_ID_HERE",
      image: imageUrl || null,
      persona: personaId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      version: version
    };
  } catch (error) {
    console.error('Error loading persona metadata:', error);
    return {
      voiceId: "YOUR_ELEVENLABS_VOICE_ID_HERE",
      image: null,
      persona: personaId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      version: version
    };
  }
};