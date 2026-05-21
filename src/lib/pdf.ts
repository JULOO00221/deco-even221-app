import { jsPDF } from "jspdf";

import logo from "@/assets/logo.png";
import cachet from "@/assets/cachet.png";

export async function quotationToPdf(
  q: any,
  clientName: string
) {
  const doc = new jsPDF(
    "p",
    "pt",
    "a4"
  );

  const pageWidth =
    doc.internal.pageSize.getWidth();

  // =========================
  // HEADER
  // =========================
  doc.setFillColor(0, 0, 0);

  doc.rect(
    0,
    0,
    pageWidth,
    120,
    "F"
  );

  // =========================
  // LOGO
  // =========================
  try {
    doc.addImage(
      logo,
      "PNG",
      40,
      20,
      120,
      80
    );
  } catch (e) {
    console.log(
      "Logo error"
    );
  }

  // =========================
  // TITRE
  // =========================
  doc.setTextColor(
    255,
    255,
    255
  );

  doc.setFont(
    "times",
    "bold"
  );

  doc.setFontSize(28);

  doc.text(
    "DECO EVEN 221",
    250,
    55
  );

  doc.setFontSize(16);

  doc.text(
    "DES EVENEMENTS INOUBLIABLES",
    250,
    85
  );

  // =========================
  // INFOS
  // =========================
  doc.setTextColor(
    0,
    0,
    0
  );

  doc.setFont(
    "times",
    "normal"
  );

  doc.setFontSize(18);

  doc.text(
    `Facture A : ${clientName}`,
    40,
    170
  );

  doc.text(
    `DATE EVENEMENT : ${
      q.even_date
        ? new Date(
            q.even_date
          ).toLocaleDateString("fr-FR")
        : "-"
    }`,
    40,
    205
  );

  doc.text(
    `SALLE : ${q.Salle || "-"}`,
    40,
    240
  );

// =========================
// NOTES
// =========================

if (q.notes) {

  doc.setFont(
    "times",
    "normal"
  );

  doc.setFontSize(14);

  doc.text(
    "Notes :",
    40,
    275
  );

  doc.setFont(
    "times",
    "italic"
  );

  doc.text(
    q.notes,
    100,
    275,
    {
      maxWidth: 420,
    }
  );
}

  doc.setFont(
  "times",
  "bold"
);

doc.setFontSize(18);

const devisText =
  `DEVIS N° ${q.number || q.id}`;

doc.text(
  devisText,
  360,
  205,
  {
    maxWidth: 180,
  }
);

  // =========================
  // TABLE HEADER
  // =========================
  const tableTop = 310;

  doc.setFillColor(
    212,
    175,
    55
  );

  doc.rect(
    40,
    tableTop,
    90,
    40,
    "F"
  );

  doc.rect(
    130,
    tableTop,
    250,
    40,
    "F"
  );

  doc.rect(
    380,
    tableTop,
    120,
    40,
    "F"
  );

  doc.rect(
    500,
    tableTop,
    90,
    40,
    "F"
  );

  doc.setDrawColor(
    0,
    0,
    0
  );

  doc.rect(
    40,
    tableTop,
    550,
    360
  );

  doc.line(
    130,
    tableTop,
    130,
    tableTop + 360
  );

  doc.line(
    380,
    tableTop,
    380,
    tableTop + 360
  );

  doc.line(
    500,
    tableTop,
    500,
    tableTop + 360
  );

  doc.setFont(
    "times",
    "bold"
  );

  doc.setFontSize(16);

  doc.text(
    "Quantite",
    50,
    tableTop + 25
  );

  doc.text(
    "Description",
    220,
    tableTop + 25
  );

  doc.text(
    "Prix",
    425,
    tableTop + 25
  );

  doc.text(
    "Total",
    525,
    tableTop + 25
  );

  // =========================
  // LIGNES
  // =========================
  let y =
    tableTop + 70;

  doc.setFont(
    "times",
    "normal"
  );

  doc.setFontSize(14);

  q.items.forEach(
    (it: any) => {
      const qty =
        Number(
          it.quantite || 0
        );

      const price =
        Number(
          it.prix_unitaire ||
            0
        );

      const lineTotal =
        qty * price;

      // quantité
      doc.text(
        String(qty),
        70,
        y
      );

      // description
      doc.text(
        it.prestation || "-",
        150,
        y
      );

      // prix
      doc.text(
        `${price} FCFA`,
        395,
        y
      );

      // total
      doc.text(
        `${lineTotal} FCFA`,
        505,
        y
      );

      y += 22;
    }
  );

  // =========================
  // TOTAL
  // =========================
  doc.setFont(
    "times",
    "bold"
  );

  doc.setFontSize(22);

  doc.text(
    "TOTAL PRESTATION FCFA :",
    70,
    690
  );

  doc.text(
    `${q.total || 0} FCFA`,
    410,
    690
  );

  // =========================
  // CACHET
  // =========================
  try {
    doc.addImage(
      cachet,
      "PNG",
      430,
      680,
      100,
      150
    );
  } catch (e) {
    console.log(
      "Cachet error"
    );
  }

  // =========================
  // FOOTER
  // =========================
  doc.line(
    120,
    840,
    490,
    840
  );

  doc.setFont(
    "times",
    "normal"
  );

  doc.setFontSize(12);

  doc.text(
    "Decoeven 221",
    pageWidth / 2,
    860,
    {
      align: "center",
    }
  );

  doc.text(
    "77 728 32 29 - 78 370 03 20",
    pageWidth / 2,
    880,
    {
      align: "center",
    }
  );

  doc.text(
    "decoeven221@gmail.com",
    pageWidth / 2,
    900,
    {
      align: "center",
    }
  );

  // =========================
  // =========================
// PIED DE PAGE
// =========================

const footerY = 800;

doc.setDrawColor(180, 180, 180);

doc.line(
  60,
  footerY - 20,
  535,
  footerY - 20
);

doc.setTextColor(
  60,
  60,
  60
);

// Titre
doc.setFont(
  "times",
  "bold"
);

doc.setFontSize(12);

doc.text(
  "DECO EVEN 221",
  pageWidth / 2,
  footerY,
  {
    align: "center",
  }
);

// Infos
doc.setFont(
  "times",
  "normal"
);

doc.setFontSize(10);

doc.text(
  "77 728 32 29 - 78 370 03 20 - decoeven221@gmail.com",
  pageWidth / 2,
  footerY + 18,
  {
    align: "center",
  }
);

doc.text(
  "RCCM : SN DKR 2012 B 10472",
  pageWidth / 2,
  footerY + 36,
  {
    align: "center",
  }
);
  // SAVE
  // =========================
  doc.save(
    `${q.number || q.id}.pdf`
  );
}