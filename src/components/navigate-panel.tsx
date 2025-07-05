import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import personaPlaceholder from "@/assets/persona-placeholder.png";

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  edited?: boolean;
  selected?: 'active' | 'inactive' | 'partial';
}

// Mock data structure based on the wireframe
const mockFileTree: FileNode[] = [
  {
    name: "FOLDER 1",
    type: "folder",
    selected: "active",
    children: []
  },
  {
    name: "FOLDER 2",
    type: "folder",
    selected: "inactive",
    children: []
  },
  {
    name: "DOC 1.xml",
    type: "file",
    selected: "inactive"
  },
  {
    name: "DOC 2.md",
    type: "file",
    selected: "active",
    edited: true
  },
  {
    name: "DOC 3.xml",
    type: "file",
    selected: "inactive"
  },
  {
    name: "FOLDER 3",
    type: "folder",
    selected: "active",
    children: []
  },
  {
    name: "FOLDER 4",
    type: "folder",
    selected: "inactive",
    children: []
  },
  {
    name: "FOLDER 5",
    type: "folder",
    selected: "active",
    children: [
      {
        name: "SUBFOLDER 1",
        type: "folder",
        selected: "active",
        children: []
      },
      {
        name: "SUBFOLDER 2",
        type: "folder",
        selected: "active",
        children: [
          {
            name: "DOC 11.xml",
            type: "file",
            selected: "active"
          },
          {
            name: "DOC 12.xml",
            type: "file",
            selected: "active",
            edited: true
          },
          {
            name: "DOC 13.xml",
            type: "file",
            selected: "active"
          },
          {
            name: "DOC 14.md",
            type: "file",
            selected: "active"
          }
        ]
      }
    ]
  },
  {
    name: "FOLDER 6",
    type: "folder",
    selected: "inactive",
    children: []
  },
  {
    name: "FOLDER 7",
    type: "folder",
    selected: "inactive",
    children: []
  }
];

const SelectionIndicator = ({ selected }: { selected?: 'active' | 'inactive' | 'partial' }) => {
  if (selected === 'active') {
    return <Circle className="w-3 h-3 fill-primary text-primary" />;
  } else if (selected === 'partial') {
    return <Circle className="w-3 h-3 fill-primary/50 text-primary" />;
  }
  return <Circle className="w-3 h-3 text-muted-foreground/40" />;
};

const FileTreeNode = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);

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
        
        <SelectionIndicator selected={node.selected} />
        
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 text-muted-foreground" />
        ) : (
          <File className="w-4 h-4 text-muted-foreground" />
        )}
        
        <span className="flex-1 truncate font-mono">{node.name}</span>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const NavigatePanel = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">NAVIGATE</h2>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-0.5">
          {mockFileTree.map((node, index) => (
            <FileTreeNode key={index} node={node} />
          ))}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="border-t border-border p-4">
        <div className="flex gap-3 h-48">
          {/* Left Half - Metadata and Reset */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-foreground mb-2">METADATA</h3>
              <div className="text-xs text-muted-foreground space-y-1 font-mono">
                <div>- Voice_ID</div>
                <div>- Image_filename</div>
                <div>- Other metadata</div>
                <div>- Additional info</div>
                <div>- More details</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-3/4">
              RESET
            </Button>
          </div>
          
          {/* Right Half - Persona Image */}
          <div className="w-28">
            <div className="w-full h-full rounded-lg overflow-hidden border border-border shadow-elegant">
              <img 
                src={personaPlaceholder} 
                alt="Persona Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};