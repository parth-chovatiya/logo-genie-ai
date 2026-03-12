import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="max-w-md mx-auto text-center py-12 sm:py-16 px-4">
      <div className="space-y-5">
        <div className="w-14 h-14 mx-auto bg-destructive/10 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button
          onClick={onRetry}
          className="px-6 h-11 font-medium rounded-xl"
          data-testid="button-retry"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
