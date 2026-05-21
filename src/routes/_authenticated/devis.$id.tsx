import {
  createFileRoute,
  useParams,
} from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";

import { pb } from "@/lib/pb";
import { quotationToPdf } from "@/lib/pdf";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Download } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/devis/$id"
)({
  component: QuotationDetails,
});

function QuotationDetails() {

  const { id } = useParams({
    from: "/_authenticated/devis/$id",
  });

  // =========================
  // DEVIS
  // =========================

  const {
    data: q,
    isLoading,
  } = useQuery({
    queryKey: ["quotation", id],

    queryFn: async () =>
      await pb.collection("devis")
        .getOne(id, {
          expand: "client",
        }),
  });

  // =========================
  // LIGNES DEVIS
  // =========================

  const {
    data: lignes = [],
  } = useQuery({
    queryKey: ["lignes", id],

    queryFn: async () =>
      await pb
        .collection("lignes_devis")
        .getFullList({
          filter: `devis="${id}"`,
        }),
  });

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (!q) {
    return (
      <div className="p-6">
        Impossible de charger le devis.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* HEADER */}

      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Devis
          </p>

          <h1 className="mt-1 font-display text-4xl">
            {q.numero}
          </h1>

        </div>

        {/* PDF BUTTON */}

        <Button
          className="bg-gradient-gold text-primary-foreground hover:opacity-90"
          onClick={() =>
            quotationToPdf(
              {
                ...q,
                items: lignes,
              },
              q.expand?.client?.nom ||
                "Client"
            )
          }
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger PDF
        </Button>
      </div>

      {/* DETAILS */}

      <Card className="border-gold/20">

        <CardHeader>
          <CardTitle>
            Détails du devis
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* CLIENT */}

          <div>
            <p className="text-sm text-muted-foreground">
              Client
            </p>

            <p className="font-medium text-lg">
              {q.expand?.client?.nom ||
                "—"}
            </p>
          </div>

          {/* SALLE */}

          <div>
            <p className="text-sm text-muted-foreground">
              Salle
            </p>

            <p className="font-medium text-lg">
              {q.Salle || "—"}
            </p>
          </div>

          {/* DATE */}

          <div>
            <p className="text-sm text-muted-foreground">
              Date événement
            </p>

            <p className="font-medium text-lg">
              {q.even_date
                ? new Date(
                    q.even_date
                  ).toLocaleDateString(
                    "fr-FR"
                  )
                : "-"}
            </p>
          </div>

          {/* STATUS */}

          <div>
            <p className="text-sm text-muted-foreground">
              Statut
            </p>

            <Badge
              variant="outline"
              className="border-gold/40 capitalize"
            >
              {q.statut}
            </Badge>
          </div>

          {/* TOTAL */}

          <div>
            <p className="text-sm text-muted-foreground">
              Total
            </p>

            <p className="font-display text-4xl text-gold">
              {Number(
                q.total || 0
              ).toLocaleString("fr-FR")}{" "}
              FCFA
            </p>
          </div>

          {/* LIGNES */}

          <div className="space-y-3">

            <p className="text-sm text-muted-foreground">
              Prestations
            </p>

            {lignes.length === 0 ? (

              <p className="text-sm text-muted-foreground">
                Aucune prestation.
              </p>

            ) : (

              <div className="space-y-2">

                {lignes.map(
                  (ligne: any) => (

                    <div
                      key={ligne.id}
                      className="flex items-center justify-between rounded-lg border border-gold/20 p-3"
                    >

                      <div>

                        <p className="font-medium">
                          {ligne.prestation || "-"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Quantité :{" "}
                          {ligne.quantite}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-medium">
                          {Number(
                            ligne.prix_unitaire || 0
                          ).toLocaleString(
                            "fr-FR"
                          )}{" "}
                          FCFA
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Total :{" "}
                          {Number(
                            ligne.total || 0
                          ).toLocaleString(
                            "fr-FR"
                          )}{" "}
                          FCFA
                        </p>

                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}