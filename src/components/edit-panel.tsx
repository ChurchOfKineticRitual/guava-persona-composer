import { useState, useEffect } from "react";
import { usePersona } from "@/contexts/persona-context";
import { PersonaImage } from "@/components/persona-image";
import { loadAndParseFile } from "@/utils/file-loader";
import { fileCache } from "@/utils/file-cache";
import klarKentImage from "/personas/klark_kent/image/KK_Shrinkface_M.png";

export const EditPanel = () => {
  const { selectedPersona, selectedFile } = usePersona();
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // Load file content when selectedFile changes
  useEffect(() => {
    const loadFile = async () => {
      if (!selectedFile) {
        setContent("");
        setFileName("");
        return;
      }

      setLoading(true);
      try {
        const { parsedContent } = await loadAndParseFile(selectedFile);
        setContent(parsedContent);
        setFileName(selectedFile.split('/').pop() || "");
      } catch (error) {
        console.error('Failed to load file:', error);
        setContent("Error loading file content");
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [selectedFile]);

  // Update cache when content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (selectedFile) {
      fileCache.updateEditedContent(selectedFile, newContent);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <h2 className="text-lg font-semibold text-foreground">EDIT</h2>
        <div className="mt-2">
          <h3 className="text-xl font-bold text-primary">
            {fileName || "Select a file to edit"}
          </h3>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading file content...</div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground text-base leading-relaxed"
            placeholder="Select a file to edit..."
            disabled={!selectedFile}
          />
        )}
      </div>

      {/* Persona Image - Bottom Right Corner */}
      <div className="absolute bottom-4 right-4">
        <PersonaImage 
          src={klarKentImage} 
          alt="Klark Kent Avatar"
        />
      </div>
    </div>
  );
};