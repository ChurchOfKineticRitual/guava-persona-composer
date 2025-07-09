import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Save } from "lucide-react";

export const GitHubTokenInput = () => {
  const [token, setToken] = useState(localStorage.getItem('github_token') || '');
  const [isExpanded, setIsExpanded] = useState(!localStorage.getItem('github_token'));

  const handleSave = () => {
    localStorage.setItem('github_token', token);
    setIsExpanded(false);
    window.location.reload();
  };

  const hasToken = !!localStorage.getItem('github_token');

  if (!isExpanded && hasToken) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
        <Key className="w-4 h-4 mr-2" />
        Update Token
      </Button>
    );
  }

  return (
    <div className="space-y-2 p-2 border border-border rounded">
      <Label className="text-xs text-muted-foreground">
        GitHub Token (required for private repo)
      </Label>
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="ghp_xxxxxxxxxxxx"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="text-xs"
        />
        <Button size="sm" onClick={handleSave} disabled={!token.trim()}>
          <Save className="w-3 h-3" />
        </Button>
      </div>
      {hasToken && (
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
          Cancel
        </Button>
      )}
    </div>
  );
};