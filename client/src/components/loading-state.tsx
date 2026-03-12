import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

const TIPS = [
  "Our AI is analyzing your brand identity...",
  "Crafting 4 unique logo concepts for you...",
  "Each logo is designed in a different style...",
  "Almost there — finalizing your designs...",
];

const LoadingState = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-2">
      <div className="max-w-md mx-auto text-center space-y-6 mb-10">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl animate-pulse-slow opacity-20" />
          <div className="absolute inset-2 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-white animate-pulse" />
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Designing Your Logos
          </h3>
          <p className="text-sm text-muted-foreground">
            {TIPS[Math.floor(Math.random() * TIPS.length)]}
          </p>
        </div>

        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full rounded-full shimmer-effect"
            style={{ width: "70%" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-9 rounded-lg" />
                  <Skeleton className="h-9 rounded-lg" />
                  <Skeleton className="h-9 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LoadingState;
