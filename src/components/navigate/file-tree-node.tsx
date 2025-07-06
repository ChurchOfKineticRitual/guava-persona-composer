import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode } from "@/utils/file-system";

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

interface FileTreeNodeProps {
  node: FileNode;
  depth?: number;
  selectedFile?: string;
  onNodeUpdate: (updatedNode: FileNode) => void;
  onFileClick?: (path: string) => void;
}

export const FileTreeNode = ({ 
  node, 
  depth = 0, 
  selectedFile,
  onNodeUpdate,
  onFileClick 
}: FileTreeNodeProps) => {
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
            node.type === 'file' && selectedFile === node.path && "!text-accent font-medium"
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
              selectedFile={selectedFile}
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