import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDualPrice, formatPrice as fcfa } from "../utils/currency.js";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

function cleanText(text) {
  if (!text) return "";
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[«»“”]/g, '"')
    .trim();
}

/**
 * Génère le PDF A4 Corporate Blue haute fidélité (Image 4)
 */
export function generateCorporateInvoiceA4Pdf(order, boutique, cashierName) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const storeName = boutique?.nom || "ETABLISSEMENT LIHOMA BTP";
  const storeTagline = boutique?.description || "Materiaux de Construction - Mboude & Ngazidja";
  const activeDevise = order.devise || boutique?.devise || "KMF";
  const orderNumber = order.reference || (order.id ? `#FAC-${String(order.id).padStart(5, "0")}` : "#FAC-2026");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const formattedDateTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const clientName = order.client?.nom || order.clientNom || order.nomClient || "Client Comptoir / Chantier";
  const clientPhone = order.client?.telephone || order.clientTelephone || order.telephoneClient || "";
  const clientEmail = order.client?.email || order.clientEmail || order.emailClient || "";
  const clientAddress = order.adresseLivraison || order.zoneLivraison || "Chantier Ngazidja, Comores";

  const totalAmount = Number(order.total || 0);
  const rawPaye = order.montantPaye !== undefined && order.montantPaye !== null
    ? Number(order.montantPaye)
    : (order.statutPaiement === "non_paye" ? 0 : totalAmount);
  const isFullyPaid = order.statutPaiement === "paye" || (rawPaye >= totalAmount && order.statutPaiement !== "non_paye");

  const validatorName = cashierName || order.employeAssigne?.nom || order.vendeur?.nom || "Responsable Caisse / Depot";

  // 1. TOP RIGHT POLYGONAL BLUE BANNER (CORPORATE ACCENT IMAGE 4)
  // Deep Blue (#0F4C81 / #034694)
  doc.setFillColor(15, 76, 129); // #0F4C81
  // Draw polygonal shape at top right
  doc.lines(
    [
      [70, 0],
      [0, 50],
      [-110, -50]
    ],
    140, 0, // start X, Y
    [1, 1],
    "F"
  );

  // Big White "INVOICE" or "FACTURE" Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("FACTURE", pageWidth - 18, 25, { align: "right" });

  // Top Left Company Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 76, 129);
  doc.text(cleanText(storeName).toUpperCase(), 16, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(cleanText(storeTagline), 16, 28);
  doc.text("Depot Central : Mboude - Ntsaweni, Ngazidja", 16, 33);

  // Invoice Meta Block (under the blue banner on the right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Facture N* :", 135, 38);
  doc.setFont("helvetica", "normal");
  doc.text(cleanText(orderNumber), 165, 38);

  doc.setFont("helvetica", "bold");
  doc.text("Date d'emission :", 135, 44);
  doc.setFont("helvetica", "normal");
  doc.text(`${formattedDate} a ${formattedDateTime}`, 165, 44);

  doc.setFont("helvetica", "bold");
  doc.text("Delai livraison :", 135, 50);
  doc.setFont("helvetica", "normal");
  doc.text("1 a 2 semaines (Comores)", 165, 50);

  // 2. CLIENT & PAYMENT SECTION (IMAGE 4)
  const metaY = 62;

  // INVOICE TO (LEFT)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 76, 129);
  doc.text("FACTURE A :", 16, metaY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText(clientName), 16, metaY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  let curClientY = metaY + 12;
  if (clientPhone) {
    doc.text(`Telephone : ${cleanText(clientPhone)}`, 16, curClientY);
    curClientY += 5;
  }
  if (clientEmail) {
    doc.text(`Email : ${cleanText(clientEmail)}`, 16, curClientY);
    curClientY += 5;
  }
  doc.text(`Adresse / Chantier : ${cleanText(clientAddress)}`, 16, curClientY);

  // PAYMENT METHOD & STATUS (RIGHT)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 76, 129);
  doc.text("REGLEMENT & VALIDATION :", 125, metaY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Mode de paiement :", 125, metaY + 7);
  doc.setFont("helvetica", "normal");
  doc.text(cleanText(order.moyenPaiement || "Especes / Mobile Money").toUpperCase(), 165, metaY + 7);

  doc.setFont("helvetica", "bold");
  doc.text("Statut du paiement :", 125, metaY + 13);
  if (isFullyPaid) {
    doc.setTextColor(22, 163, 74);
    doc.text("PAYE (REGLE)", 165, metaY + 13);
  } else {
    doc.setTextColor(220, 38, 38);
    doc.text("EN ATTENTE / NON PAYE", 165, metaY + 13);
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Valide & Vendu par :", 125, metaY + 19);
  doc.setFont("helvetica", "normal");
  doc.text(cleanText(validatorName), 165, metaY + 19);

  // 3. TABLE OF ITEMS (BLUE HEADER & CLEAN ZEBRA ROWS PER IMAGE 4)
  const items = order.items || [];
  const tableData = items.map((it, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    const name = it.product?.nom || it.nom || it.designation || "Article BTP";
    const volume = it.volume || it.product?.volume || "";
    const fullDesc = volume ? `${name} (${volume})` : name;
    const pu = Number(it.prixUnitaire || it.product?.prix || 0);
    const qte = Number(it.quantite || 1);
    const lineTot = pu * qte;
    const eurPrice = (lineTot / 491.96775).toFixed(2);

    return [
      num,
      cleanText(fullDesc),
      `${pu.toLocaleString("fr-FR")} ${activeDevise}`,
      String(qte),
      `${lineTot.toLocaleString("fr-FR")} ${activeDevise}\n(${eurPrice} €)`
    ];
  });

  autoTable(doc, {
    startY: 96,
    head: [["NO.", "DESIGNATION (MATERIAUX BTP)", "PRIX UNITAIRE", "QTE", "TOTAL"]],
    body: tableData.length > 0 ? tableData : [["01", "Commande de materiaux BTP", `${totalAmount} ${activeDevise}`, "1", `${totalAmount} ${activeDevise}`]],
    theme: "striped",
    headStyles: {
      fillColor: [15, 76, 129], // Corporate Blue
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "left"
    },
    columnStyles: {
      0: { cellWidth: 14, halign: "center" },
      1: { cellWidth: 88 },
      2: { cellWidth: 32, halign: "right" },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 32, halign: "right", fontStyle: "bold" }
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      valign: "middle",
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = doc.lastAutoTable.finalY + 8;

  // 4. TERMS & CONDITIONS (LEFT) & TOTALS BOX (RIGHT)
  // Left: Thank you & Terms
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 76, 129);
  doc.text("MERCI POUR VOTRE CONFIANCE.", 16, finalY + 4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("CONDITIONS GENERALES :", 16, finalY + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("1. Materiaux livres sous 1 a 2 semaines ouvrables sur vos chantiers aux Comores.", 16, finalY + 17);
  doc.text("2. Verifier la conformite et les quantites lors du dechargement des camions.", 16, finalY + 22);
  doc.text("3. Toute reclamation technique doit intervenir sous 48h maximum apres reception.", 16, finalY + 27);

  // Right: Subtotals & Solid Blue TOTAL box
  const rightBoxX = 125;
  let totY = finalY + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Sous-total :", rightBoxX, totY);
  doc.text(`${totalAmount.toLocaleString("fr-FR")} ${activeDevise}`, pageWidth - 16, totY, { align: "right" });
  totY += 6;

  doc.text("Livraison Chantier :", rightBoxX, totY);
  const livText = order.fraisLivraison ? `${Number(order.fraisLivraison).toLocaleString("fr-FR")} ${activeDevise}` : "Incluse / Selon zone";
  doc.text(livText, pageWidth - 16, totY, { align: "right" });
  totY += 6;

  // TOTAL BLUE BOX (IMAGE 4)
  doc.setFillColor(15, 76, 129);
  doc.rect(rightBoxX - 4, totY, pageWidth - rightBoxX - 10, 12, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL :", rightBoxX, totY + 8);
  doc.text(`${totalAmount.toLocaleString("fr-FR")} ${activeDevise}`, pageWidth - 16, totY + 8, { align: "right" });

  const eurTotal = (totalAmount / 491.96775).toFixed(2);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`(${eurTotal} EUR)`, pageWidth - 16, totY + 16, { align: "right" });

  // SIGNATURE ZONE (BOTTOM RIGHT ABOVE FOOTER)
  const sigY = Math.max(totY + 28, finalY + 42);
  doc.setDrawColor(203, 213, 225);
  doc.line(pageWidth - 65, sigY, pageWidth - 16, sigY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Cachet & Signature / Direction des Ventes", pageWidth - 40, sigY + 5, { align: "center" });

  // 5. SOLID DARK BLUE BOTTOM BANNER (IMAGE 4)
  const footerH = 14;
  doc.setFillColor(10, 37, 64); // Dark Navy Blue #0A2540
  doc.rect(0, pageHeight - footerH, pageWidth, footerH, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const footerText = "Tel : +269 342 08 08   |   Email : contact@etablissementlihoma.com   |   Depot Central : Mboude & Ngazidja, Comores";
  doc.text(footerText, pageWidth / 2, pageHeight - 5.5, { align: "center" });

  const cleanId = orderNumber.replace(/[^a-zA-Z0-9]/g, "");
  const fileName = `Facture-${cleanId}.pdf`;
  const blob = doc.output("blob");

  return { doc, blob, fileName, cleanId };
}

/**
 * Composant visuel React reproduisant fidèlement la Facture Corporate Blue A4 (Image 4)
 */
export default function CorporateInvoiceA4({ order, boutique, cashierName }) {
  if (!order) return null;

  const storeName = boutique?.nom || "ÉTABLISSEMENT LIHOMA BTP";
  const storeTagline = boutique?.description || "Matériaux de Construction - Mboudé & Ngazidja";
  const activeDevise = order.devise || boutique?.devise || "KMF";
  const orderNumber = order.reference || (order.id ? `#FAC-${String(order.id).padStart(5, "0")}` : "#FAC-2026");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const formattedDateTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const clientName = order.client?.nom || order.clientNom || order.nomClient || "Client Comptoir / Chantier";
  const clientPhone = order.client?.telephone || order.clientTelephone || order.telephoneClient || "";
  const clientEmail = order.client?.email || order.clientEmail || order.emailClient || "";
  const clientAddress = order.adresseLivraison || order.zoneLivraison || "Chantier Ngazidja, Comores";

  const totalAmount = Number(order.total || 0);
  const rawPaye = order.montantPaye !== undefined && order.montantPaye !== null
    ? Number(order.montantPaye)
    : (order.statutPaiement === "non_paye" ? 0 : totalAmount);
  const isFullyPaid = order.statutPaiement === "paye" || (rawPaye >= totalAmount && order.statutPaiement !== "non_paye");

  const validatorName = cashierName || order.employeAssigne?.nom || order.vendeur?.nom || "Responsable Caisse / Dépôt";
  const items = order.items || [];

  return (
    <div 
      className="corporate-invoice-sheet"
      style={{
        background: "#ffffff",
        color: "#1e293b",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        width: "100%",
        maxWidth: 780,
        margin: "0 auto",
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      {/* ── TOP HEADER WITH CORPORATE BLUE POLYGON ACCENT ── */}
      <div style={{ position: "relative", minHeight: 120, padding: "28px 32px 14px", overflow: "hidden" }}>
        {/* Background diagonal blue polygon on right */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: 110,
            background: "linear-gradient(135deg, #0F4C81 0%, #034694 100%)",
            clipPath: "polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 32
          }}
        >
          <span style={{ color: "#ffffff", fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>
            FACTURE
          </span>
        </div>

        {/* Company info left */}
        <div style={{ maxWidth: "60%" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#0F4C81", textTransform: "uppercase" }}>
            {storeName}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B", fontWeight: 600 }}>
            {storeTagline}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>
            Dépôt Central : Mboudé - Ntsaweni, Ngazidja · Tél : +269 342 08 08
          </p>
        </div>
      </div>

      {/* ── INVOICE META & DETAILS ROW ── */}
      <div style={{ padding: "0 32px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, borderBottom: "1.5px solid #F1F5F9" }}>
        {/* INVOICE TO */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#0F4C81", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Facturé à / Client :
          </span>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", marginTop: 4 }}>
            {clientName}
          </div>
          {clientPhone && (
            <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
              <span style={{ fontWeight: 700 }}>Tél :</span> {clientPhone}
            </div>
          )}
          {clientEmail && (
            <div style={{ fontSize: 13, color: "#475569" }}>
              <span style={{ fontWeight: 700 }}>Email :</span> {clientEmail}
            </div>
          )}
          <div style={{ fontSize: 13, color: "#475569" }}>
            <span style={{ fontWeight: 700 }}>Chantier / Livraison :</span> {clientAddress}
          </div>
        </div>

        {/* PAYMENT & INVOICE DETAILS */}
        <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 18px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "#64748B" }}>Réf. Facture :</span>
            <span style={{ fontWeight: 900, color: "#0F172A", fontFamily: "monospace" }}>{orderNumber}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "#64748B" }}>Date & Heure :</span>
            <span style={{ fontWeight: 700, color: "#0F172A" }}>{formattedDate} à {formattedDateTime}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "#64748B" }}>Mode de paiement :</span>
            <span style={{ fontWeight: 800, color: "#0F4C81", textTransform: "uppercase" }}>{order.moyenPaiement || "Espèces"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "#64748B" }}>Statut :</span>
            {isFullyPaid ? (
              <span style={{ background: "#DCFCE7", color: "#16A34A", padding: "2px 8px", borderRadius: 6, fontWeight: 900, fontSize: 12 }}>
                PAYÉ (RÉGLÉ)
              </span>
            ) : (
              <span style={{ background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 6, fontWeight: 900, fontSize: 12 }}>
                NON PAYÉ / EN ATTENTE
              </span>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, borderTop: "1px dashed #CBD5E1", paddingTop: 6, marginTop: 4 }}>
            <span style={{ fontWeight: 600, color: "#64748B" }}>Validé par :</span>
            <span style={{ fontWeight: 700, color: "#334155" }}>{validatorName}</span>
          </div>
        </div>
      </div>

      {/* ── TABLE OF ITEMS (BLUE HEADER) ── */}
      <div style={{ padding: "20px 32px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#0F4C81", color: "#ffffff", fontSize: 12.5, fontWeight: 800 }}>
              <th style={{ padding: "12px 14px", borderRadius: "8px 0 0 8px", width: 45, textAlign: "center" }}>N°</th>
              <th style={{ padding: "12px 14px" }}>DÉSIGNATION DES MATÉRIAUX BTP</th>
              <th style={{ padding: "12px 14px", textAlign: "right" }}>PRIX UNITAIRE</th>
              <th style={{ padding: "12px 14px", textAlign: "center", width: 60 }}>QTÉ</th>
              <th style={{ padding: "12px 14px", textAlign: "right", borderRadius: "0 8px 8px 0" }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => {
              const name = it.product?.nom || it.nom || it.designation || "Article BTP";
              const volume = it.volume || it.product?.volume || "";
              const pu = Number(it.prixUnitaire || it.product?.prix || 0);
              const qte = Number(it.quantite || 1);
              const lineTot = pu * qte;
              const { primary, secondary } = formatDualPrice(lineTot);

              return (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "#ffffff" : "#F8FAFC", borderBottom: "1px solid #EDF2F7", fontSize: 13.5 }}>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 800, color: "#64748B" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 800, color: "#0F172A" }}>{name}</div>
                    {volume && <div style={{ fontSize: 12, color: "#0F4C81", fontWeight: 600 }}>Spécification : {volume}</div>}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: "#334155" }}>
                    {fcfa(pu, activeDevise)}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700, color: "#0F172A" }}>
                    {qte}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <div style={{ fontWeight: 900, color: "#0F4C81" }}>{primary}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{secondary}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── BOTTOM TOTALS & TERMS ── */}
      <div style={{ padding: "24px 32px 30px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>
        {/* TERMS & SIGNATURE */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#0F4C81", textTransform: "uppercase", marginBottom: 6 }}>
            Merci pour votre commande !
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>
            CONDITIONS GÉNÉRALES :
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: "#64748B", lineHeight: 1.6 }}>
            <li>Matériaux livrés sous 1 à 2 semaines ouvrables sur vos chantiers aux Comores.</li>
            <li>Vérification obligatoire des volumes (sable, gravier, fer) au déchargement du camion.</li>
            <li>Toute réclamation technique sous 48h auprès de notre service commercial.</li>
          </ul>

          <div style={{ marginTop: 24 }}>
            <div style={{ width: 180, borderBottom: "1.5px dashed #94A3B8", height: 35 }}></div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic", marginTop: 4 }}>
              Cachet & Signature / Direction des Ventes
            </div>
          </div>
        </div>

        {/* SUMMARY & BIG BLUE TOTAL BOX */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "#475569" }}>
            <span>Sous-total :</span>
            <span style={{ fontWeight: 700, color: "#0F172A" }}>{fcfa(totalAmount, activeDevise)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12, color: "#475569" }}>
            <span>Livraison Chantier :</span>
            <span style={{ fontWeight: 700, color: "#0F172A" }}>
              {order.fraisLivraison ? fcfa(order.fraisLivraison, activeDevise) : "Incluse aux Comores"}
            </span>
          </div>

          {/* SOLID BLUE TOTAL HIGHLIGHT BOX */}
          <div 
            style={{
              background: "#0F4C81",
              borderRadius: 10,
              padding: "14px 18px",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 16px rgba(15,76,129,0.3)"
            }}
          >
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total TTC :
              </span>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                {(totalAmount / 491.96775).toFixed(2)} €
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900 }}>
              {fcfa(totalAmount, activeDevise)}
            </span>
          </div>
        </div>
      </div>

      {/* ── FOOTER BANNER SOLID NAVY BLUE ── */}
      <div 
        style={{
          background: "#0A2540",
          color: "#ffffff",
          padding: "12px 32px",
          fontSize: 12,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: 20,
          flexWrap: "wrap",
          letterSpacing: "0.3px"
        }}
      >
        <span>📞 +269 342 08 08</span>
        <span>✉️ contact@etablissementlihoma.com</span>
        <span>📍 Mboudé & Ngazidja, Moroni, Comores</span>
      </div>
    </div>
  );
}
