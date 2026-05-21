import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { pb } from "@/lib/pb";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/clients/$id")({
  component: ClientDetailsPage,
});

function ClientDetailsPage() {
  const { id } = Route.useParams();

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const record = await pb
          .collection("clients")
          .getOne(id);

        setClient(record);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10">
        Chargement...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-10">
        Client introuvable
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            CLIENT
          </p>

          <h1 className="font-display text-6xl leading-none">
            {client.nom}
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
        <CardContent className="space-y-6 p-8">

          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-gold" />

            <div>
              <p className="text-sm text-muted-foreground">
                Nom
              </p>

              <p className="text-lg font-medium">
                {client.nom}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-gold" />

            <div>
              <p className="text-sm text-muted-foreground">
                Téléphone
              </p>

              <p className="text-lg font-medium">
                {client.telephone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-gold" />

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="text-lg font-medium">
                {client.mail || "Pas d'email"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-gold" />

            <div>
              <p className="text-sm text-muted-foreground">
                Adresse
              </p>

              <p className="text-lg font-medium">
                {client.adresse || "Pas d'adresse"}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}