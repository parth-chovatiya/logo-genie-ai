import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GeneratedLogo } from "@shared/schema";
import jsPDF from "jspdf";
import {
  Download,
  FileImage,
  FileType,
  FileText,
  ZoomIn,
} from "lucide-react";

interface LogoCardProps {
  logo: GeneratedLogo;
}

const LogoCard = ({ logo }: LogoCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const downloadAsFormat = async (format: "png" | "svg" | "pdf") => {
    try {
      setIsDownloading(true);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        let downloadData = logo.imageData;
        let filename = `logo-${logo.style.toLowerCase().replace(/\s+/g, "-")}-${logo.id}`;

        if (format === "png") {
          downloadData = canvas.toDataURL("image/png");
          filename += ".png";
        } else if (format === "svg") {
          const svgData = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <defs>
    <style>
      .logo-background { fill: transparent; }
      .logo-image { opacity: 1; }
    </style>
  </defs>
  <rect class="logo-background" width="100%" height="100%"/>
  <image class="logo-image" href="${logo.imageData}" x="0" y="0" width="${img.width}" height="${img.height}" preserveAspectRatio="xMidYMid meet"/>
  <g id="logo-group" transform="translate(0,0)">
    <rect id="bounding-box" x="0" y="0" width="${img.width}" height="${img.height}" fill="none" stroke="none" opacity="0"/>
  </g>
</svg>`;
          downloadData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
          filename += ".svg";
        } else if (format === "pdf") {
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const maxWidth = pageWidth * 0.6;
          const maxHeight = pageHeight * 0.6;

          const scaleX = maxWidth / (img.width * 0.264583);
          const scaleY = maxHeight / (img.height * 0.264583);
          const scale = Math.min(scaleX, scaleY);

          const logoWidth = img.width * 0.264583 * scale;
          const logoHeight = img.height * 0.264583 * scale;

          const x = (pageWidth - logoWidth) / 2;
          const y = (pageHeight - logoHeight) / 2;

          pdf.addImage(logo.imageData, "PNG", x, y, logoWidth, logoHeight);

          const pdfBlob = pdf.output("blob");
          downloadData = URL.createObjectURL(pdfBlob);
          filename += ".pdf";
        }

        const link = document.createElement("a");
        link.href = downloadData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (format === "pdf") {
          setTimeout(() => URL.revokeObjectURL(downloadData), 1000);
        }

        setTimeout(() => setIsDownloading(false), 1000);
      };

      img.src = logo.imageData;
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Image preview */}
      <div
        className="aspect-square bg-white p-6 sm:p-8 flex items-center justify-center relative cursor-pointer"
        onClick={() => setIsPreviewOpen(true)}
        role="button"
        aria-label="Open logo preview"
      >
        <img
          src={logo.imageData}
          alt={`Generated logo - ${logo.style}`}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/70 rounded-full p-2.5 shadow-lg">
            <ZoomIn className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4 space-y-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {logo.style}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            <Download className="h-3 w-3" />
            3 formats
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => downloadAsFormat("png")}
            disabled={isDownloading}
            size="sm"
            className="h-9 text-xs font-medium rounded-lg"
            data-testid={`button-download-png-${logo.id}`}
          >
            <FileImage className="h-3.5 w-3.5 mr-1" />
            PNG
          </Button>
          <Button
            onClick={() => downloadAsFormat("svg")}
            disabled={isDownloading}
            size="sm"
            variant="secondary"
            className="h-9 text-xs font-medium rounded-lg"
            data-testid={`button-download-svg-${logo.id}`}
          >
            <FileType className="h-3.5 w-3.5 mr-1" />
            SVG
          </Button>
          <Button
            onClick={() => downloadAsFormat("pdf")}
            disabled={isDownloading}
            size="sm"
            variant="secondary"
            className="h-9 text-xs font-medium rounded-lg"
            data-testid={`button-download-pdf-${logo.id}`}
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Preview dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[70vw] lg:max-w-[60vw] p-2 sm:p-4">
          <div className="w-full flex items-center justify-center bg-white rounded-lg p-4 sm:p-8">
            <img
              src={logo.imageData}
              alt={`Preview - ${logo.style}`}
              className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogoCard;
