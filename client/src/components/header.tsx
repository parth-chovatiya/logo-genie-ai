import { Sparkles } from "lucide-react";

const Header = () => {
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
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Powered by Gemini
        </div>
      </div>
    </header>
  );
};

export default Header;
