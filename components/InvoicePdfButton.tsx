// components/InvoicePdfButton.tsx
"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export function InvoicePdfButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("invoice-preview");
    if (!element) {
      alert("No se encontró la vista previa para exportar.");
      return;
    }

    try {
      setLoading(true);

     
      element.classList.add("pdf-mode");

      const canvas = await html2canvas(element, {
        scale: 2, 
      });


      element.classList.remove("pdf-mode");

      const imgData = canvas.toDataURL("image/png");


      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("factura.pdf");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al generar el PDF.");
    } finally {
   
      const el = document.getElementById("invoice-preview");
      if (el) el.classList.remove("pdf-mode");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-lg border border-indigo-400 px-4 py-2 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/10 disabled:opacity-60"
      disabled={loading}
    >
      {loading ? "Generando PDF..." : "Descargar PDF"}
    </button>
  );
}
