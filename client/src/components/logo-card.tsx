import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GeneratedLogo } from "@shared/schema";

interface LogoCardProps {
  logo: GeneratedLogo;
}

export default function LogoCard({ logo }: LogoCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsFormat = async (format: 'png' | 'svg' | 'pdf') => {
    try {
      setIsDownloading(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        let downloadData = logo.imageData;
        let filename = `logo-${logo.style.toLowerCase().replace(/\s+/g, '-')}-${logo.id}`;
        
        if (format === 'png') {
          downloadData = canvas.toDataURL('image/png');
          filename += '.png';
        } else if (format === 'svg') {
          // Create SVG with embedded image
          const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            <image href="${logo.imageData}" width="${img.width}" height="${img.height}"/>
          </svg>`;
          downloadData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
          filename += '.svg';
        } else if (format === 'pdf') {
          // For PDF, we'll use a simple approach - create a data URL that opens as PDF
          const pdfCanvas = document.createElement('canvas');
          const pdfCtx = pdfCanvas.getContext('2d');
          pdfCanvas.width = 800;
          pdfCanvas.height = 600;
          
          // White background
          if (pdfCtx) {
            pdfCtx.fillStyle = 'white';
            pdfCtx.fillRect(0, 0, 800, 600);
            
            // Center the logo
            const scale = Math.min(600 / img.width, 600 / img.height) * 0.8;
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (800 - scaledWidth) / 2;
            const y = (600 - scaledHeight) / 2;
            
            pdfCtx.drawImage(img, x, y, scaledWidth, scaledHeight);
          }
          
          downloadData = pdfCanvas.toDataURL('image/png');
          filename += '.png'; // For now, PDF will be PNG format
        }
        
        // Create and trigger download
        const link = document.createElement('a');
        link.href = downloadData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          setIsDownloading(false);
        }, 1000);
      };
      
      img.src = logo.imageData;
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const handleDownload = () => downloadAsFormat('png');

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
        
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={() => downloadAsFormat('png')}
              disabled={isDownloading}
              size="sm"
              className="py-2 px-3 text-xs font-medium"
              data-testid={`button-download-png-${logo.id}`}
            >
              <i className={`mr-1 ${isDownloading ? 'fas fa-check' : 'fas fa-file-image'}`}></i>
              PNG
            </Button>
            <Button 
              onClick={() => downloadAsFormat('svg')}
              disabled={isDownloading}
              size="sm"
              variant="secondary"
              className="py-2 px-3 text-xs font-medium"
              data-testid={`button-download-svg-${logo.id}`}
            >
              <i className="fas fa-vector-square mr-1"></i>
              SVG
            </Button>
            <Button 
              onClick={() => downloadAsFormat('pdf')}
              disabled={isDownloading}
              size="sm"
              variant="secondary"
              className="py-2 px-3 text-xs font-medium"
              data-testid={`button-download-pdf-${logo.id}`}
            >
              <i className="fas fa-file-pdf mr-1"></i>
              PDF
            </Button>
          </div>
          <Button 
            variant="outline"
            onClick={handleFavorite}
            size="sm"
            className="w-full py-2 px-3 text-xs font-medium"
            data-testid={`button-favorite-${logo.id}`}
          >
            <i className={`mr-1 ${isFavorited ? 'fas fa-heart text-red-500' : 'far fa-heart'}`}></i>
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </Button>
        </div>
      </div>
    </div>
  );
}
