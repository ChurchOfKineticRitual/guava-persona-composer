import { useState, useEffect } from "react";
import { usePersona } from "@/contexts/persona-context";
import { getPersonaStructure, getPersonaMetadata, FileNode } from "@/utils/file-system";
import { FileTreeNode } from "./navigate/file-tree-node";
import { MetadataSection } from "./navigate/metadata-section";

export const NavigatePanel = () => {
  const { selectedPersona, selectedVersion, selectedFile, setSelectedFile } = usePersona();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load persona structure dynamically when persona/version changes
  useEffect(() => {
    const loadPersonaData = async () => {
      if (!selectedPersona || !selectedVersion) return;
      
      setLoading(true);
      try {
        const [structure, meta] = await Promise.all([
          getPersonaStructure(selectedPersona, selectedVersion),
          getPersonaMetadata(selectedPersona, selectedVersion)
        ]);
        
        setFileTree(structure);
        setMetadata(meta);
      } catch (error) {
        console.error('Failed to load persona data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPersonaData();
  }, [selectedPersona, selectedVersion]);

  const handleFileClick = (filePath: string) => {
    setSelectedFile(filePath);
  };

  const handleNodeUpdate = (index: number, updatedNode: FileNode) => {
    const newTree = [...fileTree];
    newTree[index] = updatedNode;
    setFileTree(newTree);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">NAVIGATE</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading persona structure...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'hsl(var(--navpan-bg))' }}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">NAVIGATE</h2>
      </div>

      {/* File Tree with Scroll */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        <div className="space-y-0.5">
          {fileTree.map((node, index) => (
            <FileTreeNode 
              key={node.path || `${node.name}-${index}`}
              node={node}
              selectedFile={selectedFile}
              onFileClick={handleFileClick}
              onNodeUpdate={(updatedNode) => handleNodeUpdate(index, updatedNode)}
            />
          ))}
        </div>
      </div>

      {/* Metadata Section */}
      <MetadataSection metadata={metadata} />
    </div>
  );
};