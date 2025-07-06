interface CachedFile {
  path: string;
  originalContent: string;
  parsedContent: string;
  editedContent: string;
  isEdited: boolean;
  fileType: 'xml' | 'md' | 'other';
}

class FileCache {
  private cache: Map<string, CachedFile> = new Map();

  // Get file from cache or return null if not cached
  getFile(path: string): CachedFile | null {
    return this.cache.get(path) || null;
  }

  // Add or update file in cache
  setFile(path: string, originalContent: string, parsedContent: string, fileType: 'xml' | 'md' | 'other'): void {
    const existing = this.cache.get(path);
    
    this.cache.set(path, {
      path,
      originalContent,
      parsedContent,
      editedContent: existing?.editedContent || parsedContent,
      isEdited: existing?.isEdited || false,
      fileType
    });
  }

  // Update edited content
  updateEditedContent(path: string, content: string): void {
    const existing = this.cache.get(path);
    if (existing) {
      this.cache.set(path, {
        ...existing,
        editedContent: content,
        isEdited: content !== existing.parsedContent
      });
    }
  }

  // Get all edited files
  getEditedFiles(): CachedFile[] {
    return Array.from(this.cache.values()).filter(file => file.isEdited);
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
  }

  // Get all cached files
  getAllFiles(): CachedFile[] {
    return Array.from(this.cache.values());
  }
}

export const fileCache = new FileCache();
export type { CachedFile };