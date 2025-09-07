import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-pulse-slow">
          <i className="fas fa-magic text-white text-xl animate-spin"></i>
        </div>
        <h3 className="text-2xl font-semibold text-foreground">
          Creating Your Logos
        </h3>
        <p className="text-muted-foreground">
          Our AI is working its magic to create unique designs for your brand...
        </p>

        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full rounded-full shimmer-effect"
            style={{ width: "65%" }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
