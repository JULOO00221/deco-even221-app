import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute(
  "/_authenticated/devis-edit/$devisId"
)({
  component: EditPage,
});

function EditPage() {
  const { devisId } = Route.useParams();

  const [clients, setClients] = useState<any[]>([]);

  const [clientId, setClientId] =
    useState("");

  const [clientNom, setClientNom] =
    useState("");

  const [evenement, setEvenement] =
    useState("");

  const [lieu, setLieu] = useState("");

  const [dateEvenement, setDateEvenement] =
    useState("");

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
    loadDevis();
  }, []);

  async function fetchClients() {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("nom");

    setClients(data || []);
  }

  async function loadDevis() {
    const { data: devis } = await supabase
      .from("devis")
      .select("*")
      .eq("id", devisId)
      .single();

    if (!devis) return;

    setClientId(devis.client_id || "");
    setClientNom(devis.client_nom || "");
    setEvenement(devis.evenement || "");
    setLieu(devis.lieu || "");
    setDateEvenement(
      devis.date_evenement || ""
    );

    const { data: devisItems } =
      await supabase
        .from("devis_items")
        .select("*")
        .eq("devis_id", devisId);

    setItems(devisItems || []);
  }

  function addLine() {
    setItems([
      ...items,
      {
        description: "",
        quantite: 1,
        prix_unitaire: 0,
        total: 0,
      },
    ]);
  }

  function removeLine(index: number) {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  }

  function updateItem(
    index: number,
    field: string,
    value: any
  ) {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updated[index].total =
      Number(updated[index].quantite) *
      Number(updated[index].prix_unitaire);

    setItems(updated);
  }

  const totalGeneral = items.reduce(
    (acc, item) =>
      acc + Number(item.total || 0),
    0
  );

  async function saveDevis() {
    const { error } = await supabase
      .from("devis")
      .update({
        client_id: clientId,
        client_nom: clientNom,
        evenement,
        lieu,
        date_evenement: dateEvenement,
        total: totalGeneral,
      })
      .eq("id", devisId);

    if (error) {
      console.log(error);
      alert("Erreur mise à jour devis");
      return;
    }

    await supabase
      .from("devis_items")
      .delete()
      .eq("devis_id", devisId);

    const devisItems = items.map(
      (item) => ({
        devis_id: devisId,
        description:
          item.description,
        quantite: item.quantite,
        prix_unitaire:
          item.prix_unitaire,
        total: item.total,
      })
    );

    const { error: itemsError } =
      await supabase
        .from("devis_items")
        .insert(devisItems);

    if (itemsError) {
      console.log(itemsError);
      alert("Erreur lignes");
      return;
    }

    window.location.href =
      `/devis/${devisId}`;
  }

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <p className="text-[#d6a128] uppercase tracking-[0.3em] text-sm font-semibold">
          Devis
        </p>

        <h1 className="text-5xl font-serif text-[#2d1b12]">
          Modifier devis
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2">
              Client
            </label>

            <select
              value={clientId}
              onChange={(e) => {
                const selected =
                  clients.find(
                    (c) =>
                      c.id ===
                      e.target.value
                  );

                setClientId(
                  e.target.value
                );

                setClientNom(
                  selected?.nom || ""
                );
              }}
              className="w-full border rounded-xl p-4"
            >
              <option value="">
                Sélectionner
              </option>

              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Événement</label>

            <input
              type="text"
              value={evenement}
              onChange={(e) =>
                setEvenement(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label>Lieu</label>

            <input
              type="text"
              value={lieu}
              onChange={(e) =>
                setLieu(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label>Date</label>

            <input
              type="date"
              value={dateEvenement}
              onChange={(e) =>
                setDateEvenement(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 mb-4"
          >
            <input
              className="col-span-5 border rounded-xl p-4"
              value={item.description}
              onChange={(e) =>
                updateItem(
                  index,
                  "description",
                  e.target.value
                )
              }
            />

            <input
              type="number"
              className="col-span-2 border rounded-xl p-4"
              value={item.quantite}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantite",
                  Number(e.target.value)
                )
              }
            />

            <input
              type="number"
              className="col-span-2 border rounded-xl p-4"
              value={item.prix_unitaire}
              onChange={(e) =>
                updateItem(
                  index,
                  "prix_unitaire",
                  Number(e.target.value)
                )
              }
            />

            <div className="col-span-2 border rounded-xl p-4 font-bold">
              {Number(
                item.total
              ).toLocaleString()}
              {" "}FCFA
            </div>

            <button
              onClick={() =>
                removeLine(index)
              }
              className="bg-red-500 text-white rounded-xl"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={addLine}
          className="mt-4 bg-gray-100 px-6 py-3 rounded-xl"
        >
          + Ajouter ligne
        </button>

        <div className="mt-10 flex justify-between items-center">
          <div className="text-3xl font-bold">
            Total :
            {" "}
            {totalGeneral.toLocaleString()}
            {" "}
            FCFA
          </div>

          <button
            onClick={saveDevis}
            className="bg-[#d6a128] text-white px-8 py-4 rounded-xl font-bold"
          >
            Enregistrer modifications
          </button>
        </div>
      </div>
    </div>
  );
}