import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute(
  "/_authenticated/clients/"
)({
  component: ClientsPage,
});

function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClients();

    const interval = setInterval(() => {
      fetchClients();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function fetchClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      console.log(data);

      setClients([...(data || [])]);
    }
  }

  async function deleteClient(id: string) {
    const confirmDelete = confirm(
      "Supprimer ce client ?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      alert("Erreur suppression");
    } else {
      alert("Client supprimé");

      fetchClients();
    }
  }

  const filteredClients = clients.filter((client) =>
    client.nom
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#d6a128] uppercase tracking-[0.3em] text-sm font-semibold">
            Clients
          </p>

          <h1 className="text-5xl font-serif text-[#2d1b12]">
            Clients
          </h1>
        </div>

        <Link
          to="/clients/new"
          className="bg-[#d6a128] hover:bg-[#bf8f22] transition text-white px-6 py-4 rounded-xl font-bold"
        >
          + Nouveau client
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl px-4 py-3 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#2d1b12]">
                {client.nom}
              </h2>

              <p className="text-gray-600 mt-2">
                📞 {client.telephone}
              </p>

              <p className="text-gray-600">
                ✉️ {client.email}
              </p>

              <p className="text-gray-600">
                📍 {client.adresse}
              </p>
            </div>

            <div className="flex items-center gap-2">

              <Link
                to="/clients/$clientId/edit"
                params={{
                  clientId: client.id,
                }}
                className="bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg"
              >
                ✏️
              </Link>

              <button
                onClick={() =>
                  deleteClient(String(client.id))
                }
                className="bg-red-500 hover:bg-red-600 text-white transition px-4 py-2 rounded-lg"
              >
                🗑️
              </button>

            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">
              Aucun client trouvé
            </p>
          </div>
        )}
      </div>
    </div>
  );
}