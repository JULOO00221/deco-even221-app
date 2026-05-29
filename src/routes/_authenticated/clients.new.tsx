import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createClient } from "../../services/clients";

export const Route = createFileRoute(
  "/_authenticated/clients/new"
)({
  component: NewClientPage,
});

function NewClientPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
  });

  const handleSubmit = async () => {
    try {
      console.log(formData);

      const result = await createClient(formData);

      console.log(result);

      alert("Client créé avec succès");

      navigate({ to: "/clients" });
    } catch (error) {
      console.error(error);

      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#d6a128] uppercase tracking-[0.3em] text-sm font-semibold">
            Client
          </p>

          <h1 className="text-5xl font-serif text-[#2d1b12]">
            Nouveau client
          </h1>
        </div>

        <Link
          to="/clients"
          className="border px-5 py-3 rounded-xl bg-white hover:bg-gray-50"
        >
          ← Retour
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm max-w-4xl">
        <div className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Nom
            </label>

            <input
              type="text"
              placeholder="Nom du client"
              className="w-full border rounded-xl p-4"
              value={formData.nom}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nom: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Téléphone
            </label>

            <input
              type="text"
              placeholder="77XXXXXXX"
              className="w-full border rounded-xl p-4"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  telephone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="email@gmail.com"
              className="w-full border rounded-xl p-4"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Adresse
            </label>

            <input
              type="text"
              placeholder="Dakar"
              className="w-full border rounded-xl p-4"
              value={formData.adresse}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  adresse: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#d6a128] text-white px-6 py-4 rounded-xl font-bold"
          >
            Créer le client
          </button>

        </div>
      </div>
    </div>
  );
}