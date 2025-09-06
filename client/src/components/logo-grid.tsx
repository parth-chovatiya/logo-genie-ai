import LogoCard from "./logo-card";
import { Button } from "@/components/ui/button";
import { GeneratedLogo } from "@shared/schema";

interface LogoGridProps {
  logos: GeneratedLogo[];
  onGenerateMore: () => void;
}

export default function LogoGrid({ logos, onGenerateMore }: LogoGridProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-foreground mb-4">Your Generated Logos</h3>
        <p className="text-muted-foreground">Choose your favorite design and download it instantly</p>
        <Button 
          onClick={onGenerateMore}
          variant="secondary"
          className="mt-6 px-6 py-3 font-medium"
          data-testid="button-generate-more"
        >
          <i className="fas fa-redo mr-2"></i>
          Generate More Variations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {logos.map((logo) => (
          <LogoCard key={logo.id} logo={logo} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <h4 className="text-xl font-semibold text-foreground mb-4">Download All Formats</h4>
        <p className="text-muted-foreground mb-6">Get your logos in multiple formats for different use cases</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="secondary" 
            className="flex items-center justify-center space-x-2 py-3 px-4"
            data-testid="button-download-png"
          >
            <i className="fas fa-file-image"></i>
            <span>PNG (Transparent)</span>
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center justify-center space-x-2 py-3 px-4"
            data-testid="button-download-svg"
          >
            <i className="fas fa-vector-square"></i>
            <span>SVG (Vector)</span>
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center justify-center space-x-2 py-3 px-4"
            data-testid="button-download-pdf"
          >
            <i className="fas fa-file-pdf"></i>
            <span>PDF (Print Ready)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
