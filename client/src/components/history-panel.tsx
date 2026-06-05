import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, Trash2, X } from "lucide-react";
import type { HistoryEntry } from "@/hooks/use-logo-history";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const formatWhen = (ts: number): string => {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString();
};

const HistoryPanel = ({
  history,
  onRestore,
  onRemove,
  onClear,
  onClose,
}: HistoryPanelProps) => {
  return (
    <div className="max-w-3xl mx-auto px-2">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Recent Generations
          </h3>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-xs text-muted-foreground"
                data-testid="button-clear-history"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-history"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No past generations yet. Your logo history will appear here.
          </p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 border border-border rounded-xl p-3"
                data-testid={`history-entry-${entry.id}`}
              >
                <div className="flex -space-x-2 shrink-0">
                  {entry.logos.slice(0, 4).map((logo) => (
                    <img
                      key={logo.id}
                      src={logo.imageData}
                      alt={logo.style}
                      className="h-10 w-10 rounded-md border border-border bg-white object-contain"
                    />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {entry.request.brandName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {entry.logos.length} logos · {formatWhen(entry.createdAt)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore(entry)}
                  className="shrink-0 text-xs"
                  data-testid={`button-restore-${entry.id}`}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Restore
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(entry.id)}
                  className="shrink-0"
                  data-testid={`button-remove-${entry.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
