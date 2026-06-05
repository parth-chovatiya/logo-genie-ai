import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  GeneratedLogo,
  LogoGenerationRequest,
  LogoStyleName,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import JSZip from "jszip";
import {
  Download,
  FileImage,
  FileType,
  FileText,
  ZoomIn,
  Eraser,
  Layers,
  RefreshCw,
} from "lucide-react";

interface LogoCardProps {
  logo: GeneratedLogo;
  request: LogoGenerationRequest | null;
  onReplaceLogo: (oldId: string, updated: GeneratedLogo) => void;
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image data"));
    img.src = src;
  });

const triggerDownload = (href: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Remove a near-white background by making bright, low-saturation pixels transparent.
const makeBackgroundTransparent = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): void => {
  const { width, height } = canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max > 240 && max - min < 12) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(image, 0, 0);
};

const LogoCard = ({ logo, request, onReplaceLogo }: LogoCardProps) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const baseFilename = `logo-${logo.style.toLowerCase().replace(/\s+/g, "-")}-${logo.id}`;

  const renderToCanvas = async (
    transparent = false,
    size?: number,
  ): Promise<HTMLCanvasElement> => {
    const img = await loadImage(logo.imageData);
    const canvas = document.createElement("canvas");
    canvas.width = size ?? img.width;
    canvas.height = size ?? img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (transparent) makeBackgroundTransparent(canvas, ctx);
    return canvas;
  };

  const runDownload = async (fn: () => Promise<void>) => {
    try {
      setIsDownloading(true);
      await fn();
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download failed",
        description:
          error instanceof Error ? error.message : "Could not prepare the file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPng = (transparent: boolean) =>
    runDownload(async () => {
      const canvas = await renderToCanvas(transparent);
      const suffix = transparent ? "-transparent" : "";
      triggerDownload(canvas.toDataURL("image/png"), `${baseFilename}${suffix}.png`);
    });

  const downloadSvg = () =>
    runDownload(async () => {
      const img = await loadImage(logo.imageData);
      const svgData = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image href="${logo.imageData}" x="0" y="0" width="${img.width}" height="${img.height}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
      triggerDownload(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`,
        `${baseFilename}.svg`,
      );
    });

  const downloadPdf = () =>
    runDownload(async () => {
      const canvas = await renderToCanvas(false);
      const pngData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth * 0.6;
      const maxHeight = pageHeight * 0.6;
      const scaleX = maxWidth / (canvas.width * 0.264583);
      const scaleY = maxHeight / (canvas.height * 0.264583);
      const scale = Math.min(scaleX, scaleY);
      const logoWidth = canvas.width * 0.264583 * scale;
      const logoHeight = canvas.height * 0.264583 * scale;
      const x = (pageWidth - logoWidth) / 2;
      const y = (pageHeight - logoHeight) / 2;
      pdf.addImage(pngData, "PNG", x, y, logoWidth, logoHeight);
      const url = URL.createObjectURL(pdf.output("blob"));
      triggerDownload(url, `${baseFilename}.pdf`);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

  const downloadFaviconPack = () =>
    runDownload(async () => {
      const sizes = [16, 32, 180, 512];
      const zip = new JSZip();
      for (const size of sizes) {
        const canvas = await renderToCanvas(true, size);
        const blob: Blob = await new Promise((resolve, reject) =>
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
            "image/png",
          ),
        );
        zip.file(`favicon-${size}x${size}.png`, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      triggerDownload(url, `${baseFilename}-favicons.zip`);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

  const handleRegenerate = async () => {
    if (!request) return;
    try {
      setIsRegenerating(true);
      const response = await apiRequest("POST", "/api/generate", {
        ...request,
        styles: [logo.style as LogoStyleName],
      });
      const result = await response.json();
      const next = Array.isArray(result?.logos) ? result.logos[0] : null;
      if (!next) {
        throw new Error(result?.message || "No logo returned. Please try again.");
      }
      onReplaceLogo(logo.id, next as GeneratedLogo);
      toast({
        title: "Regenerated",
        description: `New ${logo.style} concept ready.`,
      });
    } catch (error) {
      toast({
        title: "Regeneration failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const busy = isDownloading || isRegenerating;

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
        {isRegenerating && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}
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
          {request && (
            <Button
              onClick={handleRegenerate}
              disabled={busy}
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              data-testid={`button-regenerate-${logo.id}`}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1 ${isRegenerating ? "animate-spin" : ""}`}
              />
              Regenerate
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => downloadPng(false)}
            disabled={busy}
            size="sm"
            className="h-9 text-xs font-medium rounded-lg"
            data-testid={`button-download-png-${logo.id}`}
          >
            <FileImage className="h-3.5 w-3.5 mr-1" />
            PNG
          </Button>
          <Button
            onClick={() => downloadSvg()}
            disabled={busy}
            size="sm"
            variant="secondary"
            className="h-9 text-xs font-medium rounded-lg"
            data-testid={`button-download-svg-${logo.id}`}
          >
            <FileType className="h-3.5 w-3.5 mr-1" />
            SVG
          </Button>
          <Button
            onClick={() => downloadPdf()}
            disabled={busy}
            size="sm"
            variant="secondary"
            className="h-9 text-xs font-medium rounded-lg"
            data-testid={`button-download-pdf-${logo.id}`}
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            PDF
          </Button>
          <Button
            onClick={() => downloadPng(true)}
            disabled={busy}
            size="sm"
            variant="secondary"
            className="h-9 text-xs font-medium rounded-lg"
            data-testid={`button-download-transparent-${logo.id}`}
          >
            <Eraser className="h-3.5 w-3.5 mr-1" />
            Transparent
          </Button>
          <Button
            onClick={() => downloadFaviconPack()}
            disabled={busy}
            size="sm"
            variant="secondary"
            className="h-9 text-xs font-medium rounded-lg col-span-2"
            data-testid={`button-download-favicons-${logo.id}`}
          >
            <Layers className="h-3.5 w-3.5 mr-1" />
            Favicon pack
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
