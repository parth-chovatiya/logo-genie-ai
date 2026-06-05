import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

const TIPS = [
  "Analyzing your brand identity...",
  "Sketching unique logo concepts...",
  "Balancing color, type, and form...",
  "Polishing the finer details...",
  "Almost there — finalizing your designs...",
];

interface LoadingStateProps {
  count?: number;
}

const LoadingState = ({ count = 4 }: LoadingStateProps) => {
  const safeCount = Math.min(Math.max(count, 1), 4);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 2600);
    return () => clearInterval(tipTimer);
  }, []);

  useEffect(() => {
    // Ease progress toward ~92% so the bar always feels alive without ever "completing".
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 92 ? 92 : p + Math.max(1, (92 - p) * 0.06)));
    }, 400);
    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-2 animate-fade-in">
      <div className="max-w-md mx-auto text-center space-y-6 mb-8 sm:mb-12">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 animate-ping" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-30 animate-pulse-slow" />
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Sparkles className="h-7 w-7 text-white animate-pulse" />
          </div>
        </div>

        <div className="min-h-[3.5rem]">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Designing Your Logos
          </h3>
          <p
            key={tipIndex}
            className="text-sm text-muted-foreground animate-fade-in"
          >
            {TIPS[tipIndex]}
          </p>
        </div>

        <div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden shimmer-effect">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            Generating {safeCount} {safeCount === 1 ? "concept" : "concepts"}…
          </p>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          safeCount >= 3 ? "lg:grid-cols-4" : "lg:grid-cols-2"
        } gap-4 sm:gap-6`}
      >
        {Array.from({ length: safeCount }).map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <div className="aspect-square w-full bg-secondary shimmer-effect" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
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
