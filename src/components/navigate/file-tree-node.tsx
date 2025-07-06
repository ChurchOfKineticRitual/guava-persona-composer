import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode } from "@/utils/file-system";

const SelectionIndicator = ({ 
  selected, 
  onClick,
  isFolder
}: { 
  selected?: 'active' | 'inactive' | 'partial';
  onClick: () => void;
  isFolder?: boolean;
}) => {
  const size = isFolder ? "w-4 h-4" : "w-3 h-3";
  
  if (selected === 'active') {
    return <Circle className={`${size} fill-primary text-primary cursor-pointer hover:opacity-80 flex-shrink-0`} onClick={onClick} />;
  } else if (selected === 'partial') {
    // Half-moon effect using a mask
    return (
      <div className={`${size} relative cursor-pointer hover:opacity-80 flex-shrink-0`} onClick={onClick}>
        <Circle className={`${size} text-primary`} />
        <div className={`absolute inset-0 ${size} overflow-hidden`}>
          <Circle className={`${size} fill-primary`} style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)' }} />
        </div>
      </div>
    );
  }
  return <Circle className={`${size} text-muted-foreground/40 cursor-pointer hover:text-muted-foreground flex-shrink-0`} onClick={onClick} />;
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
    if (node.type === 'folder' && node.selected === 'partial') {
      // Toggle all children to active, then inactive on next click
      const allActive = node.children?.every(child => child.selected === 'active');
      const newState: 'active' | 'inactive' = allActive ? 'inactive' : 'active';
      const updateChildrenRecursively = (children: FileNode[]): FileNode[] => {
        return children.map(child => ({
          ...child,
          selected: newState,
          children: child.children ? updateChildrenRecursively(child.children) : undefined
        }));
      };
      const updatedNode = { 
        ...node, 
        selected: newState,
        children: node.children ? updateChildrenRecursively(node.children) : undefined
      };
      onNodeUpdate(updatedNode);
    } else {
      const nextState: 'active' | 'inactive' = node.selected === 'active' ? 'inactive' : 'active';
      const updatedNode = { ...node, selected: nextState };
      onNodeUpdate(updatedNode);
    }
  };

  return (
    <div style={{ backgroundColor: node.type === 'folder' && isExpanded ? 'hsl(var(--navpan-folder-bg))' : undefined }}>
      <div 
        className={cn(
          "flex items-center gap-2 py-1 text-sm cursor-pointer hover:bg-muted/30 transition-colors relative",
          node.edited && "text-accent font-medium"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px`, paddingRight: '32px' }}
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
        
        {/* Selection indicator positioned at the right */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <SelectionIndicator 
            selected={node.selected} 
            onClick={handleSelectionClick} 
            isFolder={node.type === 'folder'}
          />
        </div>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div style={{ backgroundColor: 'hsl(var(--navpan-folder-bg))' }}>
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