import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="space-y-6">
        <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground">
          Oops! Something went wrong
        </h3>
        <p className="text-muted-foreground">{message}</p>
        <Button
          onClick={onRetry}
          className="px-6 py-3 font-medium"
          data-testid="button-retry"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    </div>
  );
}
