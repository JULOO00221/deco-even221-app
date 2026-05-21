import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { pb } from "@/lib/pb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/clients/new"
)({
  component: NewClientPage,
});

function NewClientPage() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mail, setMail] = useState("");
  const [adresse, setAdresse] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await pb.collection("clients").create({
        nom,
        telephone,
        mail,
        adresse,
      });

      navigate({
        to: "/clients",
      });
    } catch (err) {
      console.error(err);
      alert("Erreur création client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            CLIENT
          </p>

          <h1 className="font-display text-6xl leading-none">
            Nouveau client
          </h1>
        </div>

        <Link to="/clients">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <Card className="border-gold/20">
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nom
              </label>

              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  value={nom}
                  onChange={(e) =>
                    setNom(e.target.value)
                  }
                  required
                  placeholder="Nom du client"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Téléphone
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  value={telephone}
                  onChange={(e) =>
                    setTelephone(e.target.value)
                  }
                  required
                  placeholder="77XXXXXXX"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  value={mail}
                  onChange={(e) =>
                    setMail(e.target.value)
                  }
                  placeholder="email@gmail.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Adresse
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  value={adresse}
                  onChange={(e) =>
                    setAdresse(e.target.value)
                  }
                  placeholder="Dakar"
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            >
              {loading
                ? "Création..."
                : "Créer le client"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}