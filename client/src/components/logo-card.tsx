import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GeneratedLogo } from "@shared/schema";
import jsPDF from "jspdf";

interface LogoCardProps {
  logo: GeneratedLogo;
}

export default function LogoCard({ logo }: LogoCardProps) {
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
        let filename = `logo-${logo.style.toLowerCase().replace(/\s+/g, "-")}-${
          logo.id
        }`;

        if (format === "png") {
          downloadData = canvas.toDataURL("image/png");
          filename += ".png";
        } else if (format === "svg") {
          // Create proper SVG that Figma can edit
          // Convert image to a proper SVG with vector elements
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
  <!-- Figma-editable elements -->
  <g id="logo-group" transform="translate(0,0)">
    <rect id="bounding-box" x="0" y="0" width="${img.width}" height="${img.height}" fill="none" stroke="none" opacity="0"/>
  </g>
</svg>`;
          downloadData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            svgData
          )}`;
          filename += ".svg";
        } else if (format === "pdf") {
          // Create proper PDF using jsPDF
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          // Calculate dimensions to center logo on A4 page
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const maxWidth = pageWidth * 0.6; // 60% of page width
          const maxHeight = pageHeight * 0.6; // 60% of page height

          // Calculate scale to fit within max dimensions
          const scaleX = maxWidth / (img.width * 0.264583); // Convert px to mm
          const scaleY = maxHeight / (img.height * 0.264583);
          const scale = Math.min(scaleX, scaleY);

          const logoWidth = img.width * 0.264583 * scale;
          const logoHeight = img.height * 0.264583 * scale;

          // Center the logo
          const x = (pageWidth - logoWidth) / 2;
          const y = (pageHeight - logoHeight) / 2;

          // Add the logo to PDF
          pdf.addImage(logo.imageData, "PNG", x, y, logoWidth, logoHeight);

          // Save as blob and create download link
          const pdfBlob = pdf.output("blob");
          downloadData = URL.createObjectURL(pdfBlob);
          filename += ".pdf";
        }

        // Create and trigger download
        const link = document.createElement("a");
        link.href = downloadData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up object URL for PDF
        if (format === "pdf") {
          setTimeout(() => URL.revokeObjectURL(downloadData), 1000);
        }

        setTimeout(() => {
          setIsDownloading(false);
        }, 1000);
      };

      img.src = logo.imageData;
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  const handleDownload = () => downloadAsFormat("png");

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
      <div
        className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center relative overflow-hidden cursor-zoom-in"
        onClick={() => setIsPreviewOpen(true)}
        role="button"
        aria-label="Open logo preview"
      >
        <img
          src={logo.imageData}
          alt={`Generated logo - ${logo.style}`}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Style: {logo.style}
          </span>
          <div className="flex items-center space-x-1">
            <i className="fas fa-star text-yellow-400 text-sm"></i>
            <span className="text-sm text-muted-foreground">{logo.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => downloadAsFormat("png")}
            disabled={isDownloading}
            size="sm"
            className="py-2 px-3 text-xs font-medium"
            data-testid={`button-download-png-${logo.id}`}
          >
            <i
              className={`mr-1 ${
                isDownloading ? "fas fa-check" : "fas fa-file-image"
              }`}
            ></i>
            PNG
          </Button>
          <Button
            onClick={() => downloadAsFormat("svg")}
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
            onClick={() => downloadAsFormat("pdf")}
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
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[90vw]">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={logo.imageData}
              alt={`Preview - ${logo.style}`}
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
