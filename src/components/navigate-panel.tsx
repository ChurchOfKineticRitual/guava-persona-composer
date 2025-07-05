import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, File, Folder, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePersona } from "@/contexts/persona-context";
import klarKentImage from "/personas/klark_kent/image/KK_Shrinkface_M.png";

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  edited?: boolean;
  selected?: 'active' | 'inactive' | 'partial';
}

// Klark Kent persona file structure
const klarKentFileTree: FileNode[] = [
  {
    name: "audio",
    type: "folder",
    selected: "inactive",
    children: [
      {
        name: "KK_Ambience_Marsh.mp3",
        type: "file",
        selected: "inactive"
      }
    ]
  },
  {
    name: "image",
    type: "folder", 
    selected: "inactive",
    children: [
      {
        name: "KK_Shrinkface_M.png",
        type: "file",
        selected: "inactive"
      }
    ]
  },
  {
    name: "versions",
    type: "folder",
    selected: "active",
    children: [
      {
        name: "INITIAL",
        type: "folder",
        selected: "active",
        children: [
          {
            name: "agents",
            type: "folder",
            selected: "active",
            children: [
              {
                name: "critic",
                type: "folder",
                selected: "active",
                children: [
                  { name: "persona_data.xml", type: "file", selected: "active" },
                  { name: "system_prompt.md", type: "file", selected: "active" }
                ]
              },
              {
                name: "researcher", 
                type: "folder",
                selected: "active",
                children: [
                  { name: "persona_data.xml", type: "file", selected: "active" },
                  { name: "system_prompt.md", type: "file", selected: "active" }
                ]
              },
              {
                name: "studio",
                type: "folder", 
                selected: "active",
                children: [
                  { name: "persona_data.xml", type: "file", selected: "active" },
                  { name: "system_prompt.md", type: "file", selected: "active" }
                ]
              },
              {
                name: "voice",
                type: "folder",
                selected: "active", 
                children: [
                  { name: "persona_data.xml", type: "file", selected: "active" },
                  { name: "system_prompt.md", type: "file", selected: "active", edited: true }
                ]
              },
              {
                name: "writer",
                type: "folder",
                selected: "active",
                children: [
                  { name: "persona_data.xml", type: "file", selected: "active" },
                  { name: "system_prompt.md", type: "file", selected: "active" }
                ]
              }
            ]
          },
          {
            name: "config",
            type: "folder",
            selected: "active",
            children: [
              { name: "kontextbase_map.xml", type: "file", selected: "active" },
              { name: "register_selection_guide.xml", type: "file", selected: "active" }
            ]
          },
          {
            name: "content_examples",
            type: "folder",
            selected: "active",
            children: [
              {
                name: "spoken",
                type: "folder",
                selected: "active",
                children: [
                  { name: "core_principles.xml", type: "file", selected: "active" },
                  { name: "qna_examples.xml", type: "file", selected: "active" },
                  { name: "target_ckr02.xml", type: "file", selected: "active" },
                  { name: "target_dearmrc.xml", type: "file", selected: "active" }
                ]
              },
              {
                name: "written", 
                type: "folder",
                selected: "active",
                children: [
                  { name: "core_principles.xml", type: "file", selected: "active" },
                  { name: "qna_examples.xml", type: "file", selected: "active" },
                  { name: "target_webstore.xml", type: "file", selected: "active" }
                ]
              }
            ]
          },
          {
            name: "data",
            type: "folder",
            selected: "active", 
            children: [
              { name: "canonical_entities.xml", type: "file", selected: "active" },
              { name: "codex_summary.xml", type: "file", selected: "active" },
              { name: "proprietary_lexicon.xml", type: "file", selected: "active" },
              {
                name: "lore",
                type: "folder",
                selected: "active",
                children: [
                  { name: "original_sources_archive.md", type: "file", selected: "active" }
                ]
              }
            ]
          },
          {
            name: "definition",
            type: "folder",
            selected: "active",
            children: [
              { name: "development_log.md", type: "file", selected: "active" },
              { name: "fine_tuning_log.md", type: "file", selected: "active" }
            ]
          }
        ]
      }
    ]
  }
];

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
  onNodeUpdate 
}: { 
  node: FileNode; 
  depth?: number;
  onNodeUpdate: (updatedNode: FileNode) => void;
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
        
        <span className="flex-1 truncate font-mono">{node.name}</span>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode 
              key={index} 
              node={child} 
              depth={depth + 1} 
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

export const NavigatePanel = () => {
  const { selectedPersona, selectedVersion } = usePersona();
  
  // Filter file tree to show only the selected version's content
  const currentVersionFiles = useMemo(() => {
    if (!selectedPersona || !selectedVersion) return [];
    
    // Find the selected version folder and return its contents
    const versionsFolder = klarKentFileTree.find(node => node.name === "versions");
    if (!versionsFolder?.children) return [];
    
    const selectedVersionFolder = versionsFolder.children.find(node => node.name === selectedVersion);
    return selectedVersionFolder?.children || [];
  }, [selectedPersona, selectedVersion]);
  
  const [fileTree, setFileTree] = useState(currentVersionFiles);
  
  // Update file tree when persona/version changes
  useMemo(() => {
    setFileTree(currentVersionFiles);
  }, [currentVersionFiles]);
  
  const handleNodeUpdate = (index: number, updatedNode: FileNode) => {
    const newTree = [...fileTree];
    newTree[index] = updatedNode;
    setFileTree(newTree);
  };
  
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
              key={index} 
              node={node} 
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
                <div>- Voice_ID: YOUR_ELEVENLABS_VOICE_ID_HERE</div>
                <div>- Image: KK_Shrinkface_M.png</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-3/4 mt-2">
              RESET
            </Button>
          </div>
          
          {/* Right Half - Persona Image */}
          <div className="w-28 flex-shrink-0">
            <div className="w-full h-full rounded-lg overflow-hidden border border-border shadow-elegant">
              <img 
                src={klarKentImage} 
                alt="Klark Kent Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};