import { useState } from "react";

export const EditPanel = () => {
  const [content, setContent] = useState(`Parsed, editable WYSIWYG text optimised for clarity and intuitive editing experience.

Text with only the headings and formatting that can be cleanly and programmatically parsed back to XML/MD.

Text Text Text Text Text Text Text
Text Text Text Text Text Text Text
Text Text Text Text Text Text Text
Text Text Text Text Text Text Text
Text Text Text Text Text Text Text
Text Text Text Text Text Text Text`);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <h2 className="text-lg font-semibold text-foreground">EDIT</h2>
        <div className="mt-2">
          <h3 className="text-xl font-bold text-primary">DOC 12 TITLE</h3>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground text-base leading-relaxed font-mono"
          placeholder="Select a file to edit..."
        />
      </div>
    </div>
  );
};