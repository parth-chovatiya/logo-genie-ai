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
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-6">
          <i className="fas fa-check text-white text-2xl"></i>
        </div>
        <h3 className="text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your AI-Generated Logos
        </h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          ✨ Amazing! We've created <span className="font-semibold text-foreground">{logos.length} unique designs</span> for your brand. 
          Choose your favorite and download in any format you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button 
            onClick={onGenerateMore}
            variant="outline"
            className="px-8 py-3 font-medium border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            data-testid="button-generate-more"
          >
            <i className="fas fa-magic mr-2"></i>
            Generate New Variations
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <i className="fas fa-info-circle"></i>
            <span>All formats work perfectly in Figma</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {logos.map((logo) => (
          <LogoCard key={logo.id} logo={logo} />
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <i className="fas fa-download text-white text-xl"></i>
              </div>
              <div className="text-left">
                <h4 className="text-2xl font-bold text-foreground mb-1">Professional Downloads</h4>
                <p className="text-muted-foreground">Export in any format you need</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-200 group">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-file-image text-blue-600 text-lg"></i>
              </div>
              <h5 className="font-semibold text-foreground mb-2">PNG</h5>
              <p className="text-sm text-muted-foreground mb-4">High-quality raster format with transparency</p>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Web Ready</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-200 group">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-vector-square text-purple-600 text-lg"></i>
              </div>
              <h5 className="font-semibold text-foreground mb-2">SVG</h5>
              <p className="text-sm text-muted-foreground mb-4">Scalable vector format perfect for editing</p>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Figma Compatible</div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-200 group">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <i className="fas fa-file-pdf text-red-600 text-lg"></i>
              </div>
              <h5 className="font-semibold text-foreground mb-2">PDF</h5>
              <p className="text-sm text-muted-foreground mb-4">Print-ready document format</p>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Print Ready</div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-sm text-foreground font-medium flex items-center justify-center gap-2">
              <i className="fas fa-lightbulb text-primary"></i>
              Pro Tip: Use SVG files for the best editing experience in Figma and design tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
