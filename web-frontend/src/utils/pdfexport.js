import { jsPDF } from "jspdf";

export function exportRunbookPdf(title, runbook) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AI Runbook Generator", pageWidth / 2, 20, {
    align: "center",
  });

  // Incident
  doc.setFontSize(14);
  doc.text(`Incident: ${title}`, 15, 35);

  // Generated Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    15,
    45
  );

  // Divider
  doc.line(15, 50, 195, 50);

  // Runbook Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Runbook", 15, 60);

  // Runbook Content
  doc.setFont("courier", "normal");
  doc.setFontSize(10);

  const lines = doc.splitTextToSize(
    runbook || "",
    180
  );

  doc.text(lines, 15, 70);

  // Save PDF
  const fileName = `${title
    .replace(/\s+/g, "_")
    .toLowerCase()}_runbook.pdf`;

  doc.save(fileName);
}