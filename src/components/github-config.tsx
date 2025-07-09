import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save } from "lucide-react";

export const GitHubConfig = () => {
  const [repo, setRepo] = useState(localStorage.getItem('github_repo') || '');
  const [token, setToken] = useState(localStorage.getItem('github_token') || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    localStorage.setItem('github_repo', repo);
    localStorage.setItem('github_token', token);
    setIsOpen(false);
    // Reload the page to pick up new settings
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Settings className="w-4 h-4 mr-2" />
        GitHub Settings
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>GitHub Configuration</CardTitle>
        <CardDescription>
          Configure your GitHub repository and access token
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repo">Repository (owner/repo)</Label>
          <Input
            id="repo"
            placeholder="e.g., username/repository-name"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="token">GitHub Token (optional for public repos)</Label>
          <Input
            id="token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save & Reload
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};