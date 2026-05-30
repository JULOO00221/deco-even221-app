import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../assets/logo.png";
export const Route = createFileRoute(
  "/_authenticated/devis/$devisId"
)({
  component: DevisDetailsPage,
});

function DevisDetailsPage() {
  const { devisId } = Route.useParams();

  const [devis, setDevis] = useState<any>(null);

  const [items, setItems] = useState<any[]>([]);

  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDevis();
  }, []);

  async function loadDevis() {
    const { data: devisData, error } =
      await supabase
        .from("devis")
        .select("*")
        .eq("id", devisId)
        .single();

    if (error) {
      console.log(error);
      return;
    }

    const { data: itemsData } =
      await supabase
        .from("devis_items")
        .select("*")
        .eq("devis_id", devisId);

    setDevis(devisData);

    setItems(itemsData || []);
    console.log("itemsData =", itemsData);
console.log("items.length =", itemsData?.length);
  }

  async function downloadPDF() {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
  scale: 2,
  useCORS: true,
  backgroundColor: "#ffffff",
});

    const imgData = canvas.toDataURL(
  "image/jpeg",
  0.80
);

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;

    const pageHeight = 295;

    const imgHeight =
      (canvas.height * imgWidth) /
      canvas.width;

    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(
  imgData,
  "JPEG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
  imgData,
  "JPEG",
  0,
  position,
  imgWidth,
  imgHeight
);

      heightLeft -= pageHeight;
    }

    pdf.save(`${devis.numero}.pdf`);
  }

  async function deleteDevis() {
  const confirmDelete = confirm(
    "Supprimer ce devis ?"
  );

  if (!confirmDelete) return;

  await supabase
    .from("devis_items")
    .delete()
    .eq("devis_id", devis.id);

  await supabase
    .from("devis")
    .delete()
    .eq("id", devis.id);

  window.location.href = "/devis";
}

  if (!devis) {
    return (
      <div className="p-10">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <button
        onClick={downloadPDF}
        className="mb-6 bg-[#d6a128] text-white px-6 py-4 rounded-xl font-bold"
      >
        Télécharger PDF
      </button>
    <a
  href={`/devis-edit/${devis.id}`}
  className="bg-black text-white px-6 py-4 rounded-xl font-bold ml-4 inline-block"
>
  Modifier
</a>

<button
  onClick={deleteDevis}
  className="bg-red-600 text-white px-6 py-4 rounded-xl font-bold ml-4"
>
  Supprimer
</button>
      <div
        ref={pdfRef}
        className="bg-white p-12 rounded-3xl max-w-5xl mx-auto"
      >
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-6">
  <img
    src={logo}
    alt="Logo"
    className="w-32 h-32 object-contain"
  />

  <div>
    <h1 className="text-6xl font-bold text-[#d6a128]">
      Deco Even221
    </h1>

    <p className="italic text-gray-500 mt-2 text-2xl">
      L’art de sublimer vos moments !
    </p>
  </div>
</div>
          </div>

          <div className="text-right">
            <h2 className="text-5xl font-bold">
              DEVIS
            </h2>

            <p className="mt-4 text-2xl">
              {devis.numero}
            </p>
          </div>
        </div>

        <div className="flex justify-between mb-12">
          <div>
            <p className="text-gray-400 uppercase mb-2">
              Client
            </p>

            <h3 className="text-3xl font-bold">
              {devis.client_nom}
            </h3>
          </div>

          <div className="text-right text-2xl">
            <p>
              <strong>
                Événement :
              </strong>{" "}
              {devis.evenement}
            </p>

            <p>
              <strong>Lieu :</strong>{" "}
              {devis.lieu}
            </p>

            <p>
              <strong>Date :</strong>{" "}
              {
                devis.date_evenement
              }
            </p>
            <div className="mt-4">
  <p className="font-bold mb-2">
    Statut
  </p>

  <select
    value={devis.statut || "brouillon"}
    onChange={async (e) => {
      const nouveauStatut = e.target.value;

      const { error } = await supabase
        .from("devis")
        .update({
          statut: nouveauStatut,
        })
        .eq("id", devis.id);

      if (error) {
        alert("Erreur mise à jour statut");
        return;
      }

      setDevis({
        ...devis,
        statut: nouveauStatut,
      });
    }}
    className="border rounded-lg px-4 py-2 font-semibold bg-white"
  >
    <option value="brouillon">
      Brouillon
    </option>

    <option value="valide">
      Validé
    </option>

    <option value="paye">
      Payé
    </option>
  </select>
</div>
          </div>
        </div>

        <table className="w-full border-collapse mb-10">
          <thead>
            <tr className="bg-[#e9e1cf]">
              <th className="border p-4 text-left">
                QTT
              </th>

              <th className="border p-4 text-left">
                DESCRIPTION
              </th>

              <th className="border p-4 text-left">
                PRIX UNIT.
              </th>

              <th className="border p-4 text-left">
                TOTAL
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border p-4">
                  {item.quantite}
                </td>

                <td className="border p-4">
                  {item.description}
                </td>

                <td className="border p-4">
                  {Number(
                    item.prix_unitaire
                  ).toLocaleString()}{" "}
                  FCFA
                </td>

                <td className="border p-4 font-bold">
                  {Number(
                    item.total
                  ).toLocaleString()}{" "}
                  FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-2 border-[#d6a128] p-6 flex justify-between items-center text-3xl font-bold mb-12">
          <span>
            TOTAL PRESTATION FCFA
          </span>

          <span>
            {Number(
              devis.total
            ).toLocaleString()}{" "}
            FCFA
          </span>
        </div>

        <div className="grid grid-cols-2 gap-12 text-xl">
          <div>
            <h4 className="font-bold text-[#d6a128] mb-4">
              CONDITIONS DE PAIEMENT :
            </h4>

            <ul className="space-y-2">
              <li>
                • 60 % à la réservation
              </li>

              <li>
                • 40 % avant événement
              </li>

              <li>
                • Installation la veille
                de l’événement
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#d6a128] mb-4">
              MOYENS DE PAIEMENT :
            </h4>

            <ul className="space-y-2">
              <li>Wave</li>
              <li>Orange Money</li>
              <li>Espèces</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}