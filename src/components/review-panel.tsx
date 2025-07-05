import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Save, Play } from "lucide-react";
import personaPlaceholder from "@/assets/persona-placeholder.png";

export const ReviewPanel = () => {
  const [personaSelect, setPersonaSelect] = useState("");
  const [versionSelect, setVersionSelect] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [modelOutput, setModelOutput] = useState("Read-only text:\nmost recent\nMODEL OUTPUT");

  const handleCopy = () => {
    navigator.clipboard.writeText(modelOutput);
    // Show success feedback
    console.log("Content copied to clipboard");
  };

  const handleSave = () => {
    // TODO: Implement save workflow
    console.log("Save clicked");
  };

  const handleRun = () => {
    // TODO: Implement run workflow
    console.log("Run clicked");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Configure Section */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">CONFIGURE</h2>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              PERSONA SELECT
            </label>
            <Select value={personaSelect} onValueChange={setPersonaSelect}>
              <SelectTrigger className="w-full bg-input border-border">
                <SelectValue placeholder="Select persona..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kermit">KermitTheFrog</SelectItem>
                <SelectItem value="piggy">MissPiggy</SelectItem>
                <SelectItem value="gonzo">Gonzo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              PERSONA VERSION
            </label>
            <Select value={versionSelect} onValueChange={setVersionSelect}>
              <SelectTrigger className="w-full bg-input border-border">
                <SelectValue placeholder="Select version..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">2025-07-05_204515</SelectItem>
                <SelectItem value="v2">2025-07-05_213000</SelectItem>
                <SelectItem value="v3">initial_version</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              MODEL SELECT
            </label>
            <Select defaultValue="gpt4">
              <SelectTrigger className="w-full bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt4">GPT-4</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              USER PROMPT
            </label>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-20 bg-input border-border resize-none"
            />
          </div>

          <Button 
            onClick={handleRun}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            RUN
          </Button>
        </div>
      </div>

      {/* Behold Section */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">BEHOLD</h2>
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-border shadow-elegant">
            <img 
              src={personaPlaceholder} 
              alt="Persona Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="flex-1 p-4 flex flex-col">
        <h2 className="text-lg font-semibold text-foreground mb-3">REVIEW</h2>
        
        <Card className="flex-1 bg-muted/20 border-border">
          <CardContent className="p-3 h-full">
            <div className="h-full overflow-y-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {modelOutput}
              </pre>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 mt-3">
          <Button 
            onClick={handleCopy}
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-1" />
            COPY
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
            size="sm"
          >
            <Save className="w-4 h-4 mr-1" />
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};