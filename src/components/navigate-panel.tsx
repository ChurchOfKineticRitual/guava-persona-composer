import { useState, useMemo, useEffect } from "react";
import { ChevronRight, ChevronDown, File, Folder, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePersona } from "@/contexts/persona-context";
import { getPersonaStructure, getPersonaMetadata, FileNode } from "@/utils/file-system";
import klarKentImage from "/personas/klark_kent/image/KK_Shrinkface_M.png";

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
  
const SelectionIndicator = ({ 
  selected, 
  onClick 
}: { 
  selected?: 'active' | 'inactive' | 'partial';
  onClick: () => void;
}) => {
  if (selected === 'active') {
    return <Circle className="w-3 h-3 fill-primary text-primary cursor-pointer hover:opacity-80" onClick={onClick} />;
  } else if (selected === 'partial') {
    return <Circle className="w-3 h-3 fill-primary/50 text-primary cursor-pointer hover:opacity-80" onClick={onClick} />;
  }
  return <Circle className="w-3 h-3 text-muted-foreground/40 cursor-pointer hover:text-muted-foreground" onClick={onClick} />;
};

const FileTreeNode = ({ 
  node, 
  depth = 0, 
  onNodeUpdate,
  onFileClick 
}: { 
  node: FileNode; 
  depth?: number;
  onNodeUpdate: (updatedNode: FileNode) => void;
  onFileClick?: (path: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleSelectionClick = () => {
    const nextState: 'active' | 'inactive' | 'partial' = node.selected === 'active' ? 'inactive' : 'active';
    const updatedNode = { ...node, selected: nextState };
    onNodeUpdate(updatedNode);
  };

  return (
    <div>
      <div 
        className={cn(
          "flex items-center gap-2 py-1 px-2 text-sm cursor-pointer hover:bg-muted/30 transition-colors",
          node.edited && "text-accent font-medium"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === 'folder' && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-muted/50 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        )}
        
        <SelectionIndicator selected={node.selected} onClick={handleSelectionClick} />
        
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 text-muted-foreground" />
        ) : (
          <File className="w-4 h-4 text-muted-foreground" />
        )}
        
        <span 
          className={cn(
            "flex-1 truncate cursor-pointer transition-colors",
            node.type === 'folder' ? "font-sans uppercase font-medium" : "font-mono",
            node.type === 'file' && selectedFile === node.path && "text-accent font-medium"
          )}
          onClick={() => node.type === 'file' && onFileClick?.(node.path)}
        >
          {node.name}
        </span>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode 
              key={child.path || `${child.name}-${index}`}
              node={child} 
              depth={depth + 1}
              onFileClick={onFileClick}
              onNodeUpdate={(updatedChild) => {
                if (node.children) {
                  const updatedChildren = [...node.children];
                  updatedChildren[index] = updatedChild;
                  onNodeUpdate({ ...node, children: updatedChildren });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">NAVIGATE</h2>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-0.5">
          {fileTree.map((node, index) => (
            <FileTreeNode 
              key={node.path || `${node.name}-${index}`}
              node={node}
              onFileClick={handleFileClick}
              onNodeUpdate={(updatedNode) => handleNodeUpdate(index, updatedNode)}
            />
          ))}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="border-t border-border p-4">
        <div className="flex gap-3 h-40">
          {/* Left Half - Metadata and Reset */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 min-h-0">
              <h3 className="text-lg font-semibold text-foreground mb-2">METADATA</h3>
              <div className="overflow-y-auto h-20 text-xs text-muted-foreground space-y-1 font-mono">
                <div>- Voice_ID: {metadata?.voiceId || 'Loading...'}</div>
                <div>- Image: {metadata?.image || 'Loading...'}</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-3/4 mt-2">
              RESET
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};