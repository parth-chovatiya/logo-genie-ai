import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="space-y-6">
        <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
          <i className="fas fa-exclamation-triangle text-destructive text-xl"></i>
        </div>
        <h3 className="text-2xl font-semibold text-foreground">Oops! Something went wrong</h3>
        <p className="text-muted-foreground">{message}</p>
        <Button 
          onClick={onRetry}
          className="px-6 py-3 font-medium"
          data-testid="button-retry"
        >
          <i className="fas fa-redo mr-2"></i>
          Try Again
        </Button>
      </div>
    </div>
  );
}
