import { NavigatePanel } from "@/components/navigate-panel";
import { EditPanel } from "@/components/edit-panel";
import { ReviewPanel } from "@/components/review-panel";

const Index = () => {
  return (
    <div className="h-screen bg-background text-foreground overflow-hidden">
      {/* Main Three Column Layout */}
      <div className="flex h-full">
        {/* Left Column - Navigate & Control */}
        <div className="w-nav flex-shrink-0 bg-card border-r border-border shadow-panel">
          <NavigatePanel />
        </div>

        {/* Middle Column - Edit */}
        <div className="flex-1 min-w-edit-min bg-gradient-surface">
          <EditPanel />
        </div>

        {/* Right Column - Behold & Review */}
        <div className="w-review flex-shrink-0 bg-card border-l border-border shadow-panel">
          <ReviewPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;