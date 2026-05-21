import PocketBase from "pocketbase";

// =========================
// POCKETBASE
// =========================

export const pb = new PocketBase(
  "http://127.0.0.1:8090"
);

// =========================
// CLIENT
// =========================

export type Client = {
  id: string;

  nom: string;

  email?: string;

  telephone?: string;

  adresse?: string;

  created: string;

  updated: string;
};

// =========================
// SERVICE
// =========================

export type Service = {
  id: string;

  nom: string;

  description?: string;

  prix_unitaire: number;

  created: string;

  updated: string;
};

// =========================
// QUOTATION
// =========================

export type Quotation = {
  id: string;

  numero: string;

  client: string;

  date_evenement: string;

  salle?: string;

  statut?: string;

  notes?: string;

  total: number;

  created: string;

  updated: string;
};

// =========================
// LIGNE DEVIS
// =========================

export type LigneDevis = {
  id: string;

  devis: string;

  prestation: string;

  quantite: number;

  prix_unitaire: number;

  total: number;

  created: string;

  updated: string;
};
// =========================
// QUOTATION ITEM
// =========================

export type QuotationItem = {
  service_id: string;

  name: string;

  quantity: number;

  unit_price: number;

  total: number;
};

// =========================
// NEXT NUMBER
// =========================

export async function nextQuotationNumber() {
  const list = await pb
    .collection("Devis")
    .getFullList({
      sort: "-created",
      perPage: 1,
    });

  const last = list[0];

  if (!last) return "001";

  const current = parseInt(
    last.numero || "0"
  );

  return String(current + 1).padStart(
    3,
    "0"
  );
}