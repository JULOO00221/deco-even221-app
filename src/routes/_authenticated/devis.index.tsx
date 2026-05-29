import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "@tanstack/react-router";

import {
  Eye,
  Pencil,
  Trash2,
  Download,
  Search,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/devis/"
)({
  component: DevisPage,
});

function DevisPage() {
  const [devis, setDevis] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadDevis();
  }, []);

  async function loadDevis() {
    const { data, error } = await supabase
      .from("devis")
      .select(`
        *,
        clients (
          nom
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setDevis(data || []);
  }

  async function deleteDevis(id: string) {
    const confirmDelete = confirm(
      "Supprimer ce devis ?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("devis_items")
      .delete()
      .eq("devis_id", id);

    await supabase
      .from("devis")
      .delete()
      .eq("id", id);

    loadDevis();
  }

  const filteredDevis = devis.filter((item) => {

    const searchMatch =
      item.numero
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.clients?.nom
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const dateMatch =
      !dateFilter ||
      item.date_evenement === dateFilter;

    return searchMatch && dateMatch;
  });

  function getStatusColor(status: string) {

  if (status === "paye") {
    return "bg-green-100 text-green-700";
  }

  if (status === "valide") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-orange-100 text-orange-700";
}

  return (
    <div className="p-8 w-full">

      <div className="flex items-center justify-between mb-8">

        <div>
          <p className="uppercase tracking-[0.3em] text-sm text-[#d6a128] font-semibold">
            Devis
          </p>

          <h1 className="text-5xl font-serif text-[#2d1b12]">
            Devis
          </h1>
        </div>

        <Link
          to="/devis/new"
          className="bg-[#d6a128] text-white px-6 py-4 rounded-xl font-bold hover:opacity-90"
        >
          Nouveau devis
        </Link>

      </div>

      <div className="bg-white rounded-2xl p-4 mb-6 border">

        <div className="flex items-center gap-3">

          <div className="relative flex-1">

            <Search
              className="absolute left-4 top-4 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Rechercher un devis ou un client..."
              className="w-full border rounded-xl p-4 pl-12"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <input
            type="date"
            className="border rounded-xl p-4"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
          />

          <button
            onClick={() => {
              setSearch("");
              setDateFilter("");
            }}
            className="border rounded-xl px-5 py-4 font-medium hover:bg-gray-100"
          >
            Réinitialiser
          </button>

        </div>

      </div>

      <div className="space-y-4">

        {filteredDevis.map((item) => (

          <div
            key={item.id}
            className="bg-white border rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition"
          >

            <div>

              <h2 className="text-3xl font-bold text-[#2d1b12]">
                {item.numero || "DEV"}
              </h2>

              <p className="text-gray-500 mt-1">
                {item.clients?.nom}
                {" • "}
                {item.date_evenement}
              </p>

              <p className="text-[#d6a128] font-bold text-xl mt-3">
                {Number(item.total).toLocaleString()} FCFA
              </p>

              <div className="mt-3">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    item.statut
                  )}`}
                >
                  {item.statut || "Brouillon"}
                </span>

              </div>

            </div>

            <div className="flex items-center gap-3">

              {/* VOIR */}

              <button
                onClick={() =>
                  navigate({
                    to: "/devis/$devisId",
                    params: {
                      devisId: item.id,
                    },
                  })
                }
                className="w-11 h-11 rounded-xl border flex items-center justify-center hover:bg-gray-100"
              >
                <Eye size={18} />
              </button>

              {/* TELECHARGER */}

              <button
                onClick={() =>
                  window.open(
                    `/devis/${item.id}`,
                    "_blank"
                  )
                }
                className="w-11 h-11 rounded-xl border flex items-center justify-center hover:bg-gray-100"
              >
                <Download size={18} />
              </button>

              {/* MODIFIER */}

            <button
  onClick={() =>
    navigate({
      to: "/devis-edit/$devisId",
      params: {
        devisId: item.id,
      },
    })
  }
  className="w-11 h-11 rounded-xl border flex items-center justify-center hover:bg-gray-100"
>
  <Pencil size={18} />
</button>

              {/* SUPPRIMER */}

              <button
                onClick={() =>
                  deleteDevis(item.id)
                }
                className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}