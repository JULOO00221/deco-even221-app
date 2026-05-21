import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  pb,
  type Client,
  type QuotationItem,
  nextQuotationNumber,
} from "@/lib/pb";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Plus,
  Trash2,
  Save,
} from "lucide-react";

import { toast } from "sonner";

export const Route = createFileRoute(
  "/_authenticated/devis/new"
)({
  component: NewQuotation,
});

function NewQuotation() {

  const navigate = useNavigate();

  const [clientId, setClientId] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [salle, setSalle] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [taxRate, setTaxRate] =
    useState(0);

  const [number, setNumber] =
    useState("");

  const [items, setItems] = useState<
    QuotationItem[]
  >([
    {
      service_id: "",
      name: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
    },
  ]);

  // =========================
  // NUMERO DEVIS
  // =========================
  useEffect(() => {
    nextQuotationNumber().then(setNumber);
  }, []);

  // =========================
  // CLIENTS
  // =========================
  const { data: clients = [] } =
    useQuery({
      queryKey: ["clients"],

      queryFn: async () =>
        (await pb
          .collection("clients")
          .getFullList({
            sort: "nom",
          })) as unknown as Client[],
    });

  // =========================
  // TOTALS
  // =========================
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0) *
          Number(item.unit_price || 0),
        0
      ),
    [items]
  );

  const tax =
    (subtotal * Number(taxRate || 0)) /
    100;

  const total = subtotal + tax;

  // =========================
  // UPDATE ITEM
  // =========================
  const updateItem = (
    i: number,
    patch: Partial<QuotationItem>
  ) => {

    setItems((arr) =>
      arr.map((it, idx) =>
        idx === i
          ? { ...it, ...patch }
          : it
      )
    );
  };

  // =========================
  // CREATE DEVIS
  // =========================
  const create = useMutation({

    mutationFn: async () => {

      const totalGeneral =
        items.reduce(
          (sum, item) =>
            sum +
            Number(item.quantity) *
            Number(item.unit_price),
          0
        );

      // CREATE DEVIS
      const createdQuotation =
        await pb
          .collection("devis")
          .create({

            numero: number,

            client: clientId,

            even_date: eventDate,

            Salle: salle,

            notes,

            taxe: taxRate,

            total: totalGeneral,

            statut: "Brouillon",
          });

      // CREATE LIGNES
      for (const item of items) {

        await pb
          .collection("lignes_devis")
          .create({

            devis:
              createdQuotation.id,

            prestation:
              item.name,

            quantite: Number(
              item.quantity
            ),

            prix_unitaire: Number(
              item.unit_price
            ),

            total:
              Number(item.quantity) *
              Number(item.unit_price),
          });
      }

      return createdQuotation.id as string;
    },

    onSuccess: (id) => {

      toast.success(
        `Devis ${number} créé`
      );

      navigate({
        to: "/devis/$id",
        params: {
          id: String(id),
        },
      });

    },

    onError: (e: any) => {

      console.log(e);

      toast.error(
        e?.message ||
        "Erreur création devis"
      );
    },

  });

  // =========================
  // VALIDATION
  // =========================
  const canSubmit =
    clientId &&
    eventDate &&
    items.length > 0 &&
    items.every(
      (it) =>
        it.name &&
        it.quantity > 0
    );

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-3">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Nouveau devis
          </p>

          <h1 className="mt-1 font-display text-4xl">
            Nouveau devis
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Numéro :
            <span className="font-medium text-gold">
              {" "}
              {number || "..."}
            </span>
          </p>
        </div>

        <Button
          onClick={() => create.mutate()}
          disabled={
            !canSubmit ||
            create.isPending
          }
          className="bg-gradient-gold text-primary-foreground hover:opacity-90"
        >
          <Save className="mr-1 h-4 w-4" />
          Enregistrer
        </Button>
      </div>

      {/* EVENT */}
      <Card className="border-gold/20">

        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Détails de l’événement
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">

          {/* CLIENT */}
          <div className="space-y-2">

            <Label>Client</Label>

            <Select
              value={clientId}
              onValueChange={setClientId}
            >

              <SelectTrigger>
                <SelectValue placeholder="Choisir un client" />
              </SelectTrigger>

              <SelectContent>

                {clients.map((c: any) => (

                  <SelectItem
                    key={c.id}
                    value={c.id}
                  >
                    {c.nom}
                  </SelectItem>

                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE */}
          <div className="space-y-2">

            <Label>Date événement</Label>

            <Input
              type="date"
              value={eventDate}
              onChange={(e) =>
                setEventDate(
                  e.target.value
                )
              }
            />
          </div>

          {/* SALLE */}
          <div className="space-y-2 sm:col-span-2">

            <Label>Salle</Label>

            <Input
              value={salle}
              onChange={(e) =>
                setSalle(
                  e.target.value
                )
              }
              placeholder="Salle, hôtel..."
            />
          </div>

        </CardContent>
      </Card>

      {/* PRESTATIONS */}
      <Card className="border-gold/20">

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle className="font-display text-2xl">
            Prestations
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setItems((arr) => [
                ...arr,
                {
                  service_id: "",
                  name: "",
                  quantity: 1,
                  unit_price: 0,
                  total: 0,
                },
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Ajouter
          </Button>

        </CardHeader>

        <CardContent className="space-y-4">

          {items.map((item, i) => (

            <div
              key={i}
              className="grid gap-3 rounded-lg border border-gold/20 p-4 md:grid-cols-12"
            >

              {/* PRESTATION */}
              <div className="md:col-span-5">

                <Label>Prestation</Label>

                <Input
                  placeholder="Nom de la prestation"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(i, {
                      name: e.target.value,
                    })
                  }
                />

              </div>

              {/* QTE */}
              <div className="md:col-span-2">

                <Label>Qté</Label>

                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(i, {
                      quantity: Number(
                        e.target.value
                      ),
                    })
                  }
                />
              </div>

              {/* PRIX */}
              <div className="md:col-span-2">

                <Label>Prix</Label>

                <Input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) =>
                    updateItem(i, {
                      unit_price: Number(
                        e.target.value
                      ),
                    })
                  }
                />
              </div>

              {/* TOTAL */}
              <div className="md:col-span-2">

                <Label>Total</Label>

                <div className="flex h-10 items-center rounded-md border px-3 text-sm">

                  {(
                    Number(item.quantity) *
                    Number(item.unit_price)
                  ).toLocaleString("fr-FR")} FCFA

                </div>
              </div>

              {/* DELETE */}
              <div className="flex items-end">

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    setItems((arr) =>
                      arr.filter(
                        (_, idx) =>
                          idx !== i
                      )
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>

            </div>

          ))}

        </CardContent>
      </Card>

      {/* NOTES */}
      <Card className="border-gold/20">

        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Notes
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Notes du devis..."
          />

          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">

              <Label>Taxe (%)</Label>

              <Input
                type="number"
                value={taxRate}
                onChange={(e) =>
                  setTaxRate(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>

          </div>

        </CardContent>
      </Card>

      {/* TOTAL */}
      <Card className="border-gold/20">

        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Résumé
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex items-center justify-between">

            <span>Sous-total</span>

            <span>
              {subtotal.toLocaleString(
                "fr-FR"
              )} FCFA
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span>
              TVA ({taxRate}%)
            </span>

            <span>
              {tax.toLocaleString(
                "fr-FR"
              )} FCFA
            </span>

          </div>

          <div className="border-t pt-4">

            <div className="flex items-center justify-between text-xl font-bold">

              <span>Total</span>

              <span className="text-gold">
                {total.toLocaleString(
                  "fr-FR"
                )} FCFA
              </span>

            </div>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}