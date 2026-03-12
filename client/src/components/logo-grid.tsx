import LogoCard from "./logo-card";
import { Button } from "@/components/ui/button";
import { GeneratedLogo } from "@shared/schema";
import {
  Sparkles,
  RefreshCw,
  ArrowDown,
} from "lucide-react";

interface LogoGridProps {
  logos: GeneratedLogo[];
  onGenerateMore: () => void;
}

const LogoGrid = ({ logos, onGenerateMore }: LogoGridProps) => {
  return (
    <div className="max-w-6xl mx-auto px-2">
      {/* Results header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-600 dark:text-green-400 font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          {logos.length} Logos Generated
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
          Your Logo Concepts
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-lg mx-auto">
          Each logo is designed in a different style. Click any logo to preview
          it full-size, then download in your preferred format.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button
            onClick={onGenerateMore}
            variant="outline"
            className="px-6 py-2.5 font-medium border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200 rounded-xl"
            data-testid="button-generate-more"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Variations
          </Button>
        </div>
      </div>

      {/* Logo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
        {logos.map((logo) => (
          <LogoCard key={logo.id} logo={logo} />
        ))}
      </div>

      {/* Download info bar */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted-foreground">
          <ArrowDown className="h-4 w-4 text-primary shrink-0" />
          <span>
            <strong className="text-foreground">PNG</strong> for web &amp; social
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span>
            <strong className="text-foreground">SVG</strong> for Figma &amp; editing
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span>
            <strong className="text-foreground">PDF</strong> for print &amp; documents
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogoGrid;
