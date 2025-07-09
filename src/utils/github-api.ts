interface GitHubApiConfig {
  repo: string;
  token?: string;
}

interface GitHubApiResponse {
  content?: string;
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
}

class GitHubAPI {
  private baseUrl = 'https://api.github.com/repos';
  
  private getConfig(): GitHubApiConfig {
    const repo = localStorage.getItem('github_repo') || 'ChurchOfKineticRitual/guava-persona-composer';
    const token = localStorage.getItem('github_token');
    
    console.log('GitHub API Config:', { repo, hasToken: !!token });
    
    return { repo, token };
  }
  
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Guava-Persona-Composer/1.0',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  async fetchContent(path: string): Promise<GitHubApiResponse[]> {
    const { repo, token } = this.getConfig();
    const url = `${this.baseUrl}/${repo}/contents/${path}`;
    
    console.log('Fetching GitHub content:', { url, path });
    
    try {
      const response = await fetch(url, {
        headers: this.getHeaders(token)
      });
      
      console.log('GitHub API response:', { 
        status: response.status, 
        statusText: response.statusText,
        url 
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('GitHub path not found:', path);
          console.error('This could mean:');
          console.error('1. The repository structure is different than expected');
          console.error('2. The path does not exist in the repository');
          console.error('3. Authentication issues (if private repo)');
        } else if (response.status === 403) {
          console.error('GitHub API rate limit or authentication error');
        }
        
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('GitHub API fetch error:', error);
      throw error;
    }
  }
  
  async getFileContent(path: string): Promise<string> {
    const [fileData] = await this.fetchContent(path);
    
    if (!fileData.content) {
      throw new Error('No content found in GitHub response');
    }
    
    // GitHub returns base64 encoded content
    return atob(fileData.content.replace(/\n/g, ''));
  }
  
  async getPersonaImage(personaId: string): Promise<string | null> {
    try {
      const imageFiles = await this.fetchContent(`personas/${personaId}/image`);
      const imageFile = imageFiles.find(file => 
        file.type === 'file' && 
        (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg'))
      );
      
      if (imageFile?.download_url) {
        return imageFile.download_url;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to load persona image for ${personaId}:`, error);
      return null;
    }
  }
  
  // Test connection to repository
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { repo, token } = this.getConfig();
      const url = `${this.baseUrl}/${repo}`;
      
      const response = await fetch(url, {
        headers: this.getHeaders(token)
      });
      
      if (response.ok) {
        return { success: true, message: 'Successfully connected to GitHub repository' };
      } else if (response.status === 404) {
        return { success: false, message: 'Repository not found. Please check the repository name.' };
      } else if (response.status === 403) {
        return { success: false, message: 'Access denied. Please check your GitHub token.' };
      } else {
        return { success: false, message: `GitHub API error: ${response.status}` };
      }
    } catch (error) {
      return { success: false, message: `Connection failed: ${error}` };
    }
  }
}

export const githubAPI = new GitHubAPI();