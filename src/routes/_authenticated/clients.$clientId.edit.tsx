import {
  createFileRoute,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute(
  "/_authenticated/clients/$clientId/edit"
)({
  component: EditClientPage,
});

function EditClientPage() {
  const { clientId } = Route.useParams();

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] =
    useState("");
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] =
    useState("");

  useEffect(() => {
    fetchClient();
  }, []);

  async function fetchClient() {
    const { data, error } = await supabase
  .from("clients")
  .select("*")
  .eq("id", String(clientId))
  .single();

    if (error) {
      console.log(error);
    } else {
      setNom(data.nom || "");
      setTelephone(data.telephone || "");
      setEmail(data.email || "");
      setAdresse(data.adresse || "");
    }
  }

  async function updateClient() {
    console.log({
      nom,
      telephone,
      email,
      adresse,
    });

    const { error } = await supabase
      .from("clients")
      .update({
        nom,
        telephone,
        email,
        adresse,
      })
      .eq("id", clientId);

    if (error) {
      console.log(error);
      alert("Erreur modification");
    } else {
      alert("Client modifié avec succès");

      window.location.replace("/clients");
    }
  }

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#d6a128] uppercase tracking-[0.3em] text-sm font-semibold">
            Client
          </p>

          <h1 className="text-5xl font-serif text-[#2d1b12]">
            Modifier client
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm max-w-4xl">
        <div className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Nom
            </label>

            <input
              type="text"
              value={nom}
              onChange={(e) =>
                setNom(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Téléphone
            </label>

            <input
              type="text"
              value={telephone}
              onChange={(e) =>
                setTelephone(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Adresse
            </label>

            <input
              type="text"
              value={adresse}
              onChange={(e) =>
                setAdresse(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          <button
            onClick={updateClient}
            className="bg-[#d6a128] hover:bg-[#bf8f22] transition text-white px-6 py-4 rounded-xl font-bold"
          >
            Sauvegarder
          </button>

        </div>
      </div>
    </div>
  );
}