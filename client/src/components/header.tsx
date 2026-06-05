import { Sparkles, History } from "lucide-react";
import ThemeToggle from "./theme-toggle";

interface HeaderProps {
  onToggleHistory?: () => void;
  historyCount?: number;
}

const Header = ({ onToggleHistory, historyCount = 0 }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight tracking-tight">
              LogoGenie
              <span className="text-primary ml-0.5">AI</span>
            </h1>
          </div>
        </a>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Powered by Gemini
          </div>
          {onToggleHistory && (
            <button
              type="button"
              onClick={onToggleHistory}
              aria-label="Toggle generation history"
              data-testid="button-toggle-history"
              className="relative inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
