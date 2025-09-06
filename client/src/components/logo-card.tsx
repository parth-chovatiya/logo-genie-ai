import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GeneratedLogo } from "@shared/schema";

interface LogoCardProps {
  logo: GeneratedLogo;
}

export default function LogoCard({ logo }: LogoCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = logo.imageData;
      link.download = `logo-${logo.style.toLowerCase().replace(/\s+/g, '-')}-${logo.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show feedback
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center relative overflow-hidden">
        <img 
          src={logo.imageData} 
          alt={`Generated logo - ${logo.style}`}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Style: {logo.style}</span>
          <div className="flex items-center space-x-1">
            <i className="fas fa-star text-yellow-400 text-sm"></i>
            <span className="text-sm text-muted-foreground">{logo.rating}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-2 px-4 font-medium text-sm"
            data-testid={`button-download-${logo.id}`}
          >
            <i className={`mr-2 ${isDownloading ? 'fas fa-check' : 'fas fa-download'}`}></i>
            {isDownloading ? 'Downloaded!' : 'Download PNG'}
          </Button>
          <Button 
            variant="secondary"
            onClick={handleFavorite}
            className="p-2"
            data-testid={`button-favorite-${logo.id}`}
          >
            <i className={isFavorited ? 'fas fa-heart text-red-500' : 'far fa-heart'}></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
