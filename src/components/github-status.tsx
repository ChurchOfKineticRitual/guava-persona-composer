import { useState, useEffect } from "react";
import { githubAPI } from "@/utils/github-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

interface GitHubStatusProps {
  onRetry?: () => void;
}

export const GitHubStatus = ({ onRetry }: GitHubStatusProps) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('');

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const result = await githubAPI.testConnection();
      setStatus(result.success ? 'connected' : 'error');
      setMessage(result.message);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to check GitHub connection');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleRetry = () => {
    checkConnection();
    onRetry?.();
  };

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Checking GitHub connection...</span>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-md">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
        <span className="text-sm text-emerald-700 dark:text-emerald-400">GitHub connected</span>
        <Badge variant="secondary" className="text-xs">Connected</Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
      <AlertCircle className="w-4 h-4 text-destructive" />
      <div className="flex-1">
        <div className="text-sm text-destructive font-medium">GitHub Error</div>
        <div className="text-xs text-muted-foreground">{message}</div>
      </div>
      <Button variant="outline" size="sm" onClick={handleRetry}>
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </Button>
    </div>
  );
};