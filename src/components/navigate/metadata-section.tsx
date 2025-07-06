import { Button } from "@/components/ui/button";

interface MetadataSectionProps {
  metadata: any;
}

export const MetadataSection = ({ metadata }: MetadataSectionProps) => {
  return (
    <div className="border-t border-border p-4">
      <div className="flex gap-3 h-40">
        {/* Left Half - Metadata and Reset */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <h3 className="text-lg font-semibold text-foreground mb-2">METADATA</h3>
            <div className="overflow-y-auto h-20 text-xs text-muted-foreground space-y-1 font-mono">
              <div>- Voice_ID: {metadata?.voiceId || 'Loading...'}</div>
              <div>- Image: {metadata?.image || 'Loading...'}</div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-3/4 mt-2">
            RESET
          </Button>
        </div>
      </div>
    </div>
  );
};