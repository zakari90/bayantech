'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface PdfExporterProps {
  children: React.ReactNode
  fileName?: string
  buttonText?: string
}

export default function PdfExporter({
  children,
  fileName = 'document.pdf',
  buttonText = '',
}: PdfExporterProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);

    const colorToRgb = (colorStr: string, fallback = "#1a1a1a"): string => {
      if (!colorStr) return fallback;
      if (
        !colorStr.includes("lab") &&
        !colorStr.includes("oklch") &&
        !colorStr.includes("color-mix") &&
        !colorStr.includes("color(") &&
        !colorStr.includes("lch")
      ) {
        return colorStr;
      }
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.fillStyle = fallback;
          ctx.fillStyle = colorStr;
          ctx.fillRect(0, 0, 1, 1);
          const data = ctx.getImageData(0, 0, 1, 1).data;
          if (data[3] === 0) return "transparent";
          return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        }
      } catch {
        // ignore
      }
      return fallback;
    };

    const hexOverrides = document.createElement("style");
    hexOverrides.id = "pdf-export-hex-overrides";
    hexOverrides.textContent = `
      :root, [data-pdf-export], [data-pdf-export] * {
        --background: #ffffff !important;
        --foreground: #1a1a1a !important;
        --card: #ffffff !important;
        --card-foreground: #1a1a1a !important;
        --primary: #2563eb !important;
        --primary-foreground: #ffffff !important;
        --secondary: #f3f4f6 !important;
        --secondary-foreground: #1f2937 !important;
        --muted: #f9fafb !important;
        --muted-foreground: #6b7280 !important;
        --accent: #eff6ff !important;
        --accent-foreground: #1e40af !important;
        --destructive: #dc2626 !important;
        --destructive-foreground: #ffffff !important;
        --border: #e5e7eb !important;
        --input: #e5e7eb !important;
        --ring: #2563eb !important;
        --success: #16a34a !important;
        --warning: #ca8a04 !important;
        --info: #0284c7 !important;
        --student: #0ea5e9 !important;
        --teacher: #f59e0b !important;
        --payment: #8b5cf6 !important;
        
        outline-color: #2563eb !important;
        border-color: #e5e7eb !important;
      }
      
      [data-pdf-export] .bg-primary { background-color: #2563eb !important; }
      [data-pdf-export] .text-primary { color: #2563eb !important; }
      [data-pdf-export] .bg-secondary { background-color: #f3f4f6 !important; }
      [data-pdf-export] .text-secondary { color: #1f2937 !important; }
    `;
    document.head.appendChild(hexOverrides);
    contentRef.current.setAttribute("data-pdf-export", "");

    const originalElements = [contentRef.current, ...Array.from(contentRef.current.querySelectorAll("*"))];
    const stylesMap = new Map<number, any>();
    
    const colorProps = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "outlineColor",
      "fill",
      "stroke",
    ] as const;

    originalElements.forEach((el, index) => {
      if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) return;
      try {
        const computed = window.getComputedStyle(el);
        const safeStyles: any = {};
        let hasModern = false;

        colorProps.forEach(prop => {
          const val = computed[prop as any];
          if (typeof val === "string" && (val.includes("lab") || val.includes("oklch") || val.includes("color-mix") || val.includes("lch") || val.includes("color("))) {
            hasModern = true;
            safeStyles[prop] = colorToRgb(val, prop.toLowerCase().includes("background") ? "#ffffff" : "#1a1a1a");
          }
        });

        if (computed.boxShadow && (computed.boxShadow.includes("lab") || computed.boxShadow.includes("oklch") || computed.boxShadow.includes("color-mix"))) {
          hasModern = true;
          safeStyles["boxShadow"] = "none";
        }

        if (hasModern) {
          stylesMap.set(index, safeStyles);
        }
        el.setAttribute("data-pdf-index", index.toString());
      } catch {
        // ignore
      }
    });

    try {
      const element = contentRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const scripts = clonedDoc.getElementsByTagName("script");
          for (let i = scripts.length - 1; i >= 0; i--) {
            scripts[i].parentNode?.removeChild(scripts[i]);
          }

          const clonedElement = clonedDoc.querySelector("[data-pdf-export]");
          if (clonedElement) {
            const allCloned = [clonedElement, ...Array.from(clonedElement.querySelectorAll("*"))];
            allCloned.forEach((el) => {
              if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) return;
              const indexStr = el.getAttribute("data-pdf-index");
              if (indexStr) {
                const index = parseInt(indexStr, 10);
                if (stylesMap.has(index)) {
                  const safeStyles = stylesMap.get(index);
                  for (const prop in safeStyles) {
                    (el.style as any)[prop] = safeStyles[prop];
                  }
                }
              }
            });
          }

          const styleTags = clonedDoc.querySelectorAll("style");
          styleTags.forEach((styleTag) => {
            if (styleTag.textContent) {
              styleTag.textContent = styleTag.textContent
                .replace(/color-mix\((?:[^()]|\([^()]*\))*\)/gi, "#ffffff")
                .replace(/oklch\((?:[^()]|\([^()]*\))*\)/gi, "#1a1a1a")
                .replace(/oklab\((?:[^()]|\([^()]*\))*\)/gi, "#1a1a1a")
                .replace(/lab\((?:[^()]|\([^()]*\))*\)/gi, "#1a1a1a")
                .replace(/lch\((?:[^()]|\([^()]*\))*\)/gi, "#1a1a1a");
            }
          });

          const clonedHexOverrides = clonedDoc.createElement("style");
          clonedHexOverrides.textContent = hexOverrides.textContent;
          clonedDoc.head.appendChild(clonedHexOverrides);
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      if (document.head.contains(hexOverrides)) {
        document.head.removeChild(hexOverrides);
      }
      contentRef.current?.removeAttribute("data-pdf-export");
      originalElements.forEach((el) => {
        if (el instanceof HTMLElement || el instanceof SVGElement) {
          el.removeAttribute("data-pdf-index");
        }
      });
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div ref={contentRef} className=" rounded-md shadow p-1">
        {children}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleDownloadPDF} disabled={isExporting} className="flex items-center gap-2">
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

