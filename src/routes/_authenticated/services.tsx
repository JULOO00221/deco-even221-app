import { createFileRoute } from "@tanstack/react-router";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useState } from "react";

import {
  pb,
  type Service,
} from "@/lib/pb";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

export const Route = createFileRoute(
  "/_authenticated/services"
)({
  component: ServicesPage,
});

function ServicesPage() {
  const qc = useQueryClient();

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Service | null>(null);

  const [form, setForm] =
    useState<any>({
      prix: 0,
    });

  const { data: services = [] } =
    useQuery({
      queryKey: ["services"],

      queryFn: async () =>
        (
          await pb
            .collection("prestations")
            .getFullList({
              sort: "-created",
            })
        ) as unknown as Service[],
    });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,

        prix: Number(
          form.prix || 0
        ),
      };

      if (editing) {
        await pb
          .collection("prestations")
          .update(editing.id, payload);
      } else {
        await pb
          .collection("prestations")
          .create(payload);
      }
    },

    onSuccess: () => {
      toast.success(
        editing
          ? "Prestation modifiée"
          : "Prestation créée"
      );

      qc.invalidateQueries({
        queryKey: ["services"],
      });

      setOpen(false);

      setEditing(null);

      setForm({
        prix: 0,
      });
    },

    onError: (e: any) =>
      toast.error(
        e?.message || "Erreur"
      ),
  });

  const del = useMutation({
    mutationFn: (id: string) =>
      pb
        .collection("prestations")
        .delete(id),

    onSuccess: () => {
      toast.success(
        "Prestation supprimée"
      );

      qc.invalidateQueries({
        queryKey: ["services"],
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Catalogue
          </p>

          <h1 className="mt-1 font-display text-4xl">
            Prestations
          </h1>
        </div>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);

                setForm({
                  prix: 0,
                });

                setOpen(true);
              }}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            >
              <Plus className="mr-1 h-4 w-4" />
              Ajouter prestation
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editing
                  ? "Modifier prestation"
                  : "Nouvelle prestation"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label>
                  Nom
                </Label>

                <Input
                  value={
                    form.nom || ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nom: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>
                  Catégorie
                </Label>

                <Input
                  value={
                    form.categorie || ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categorie:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>
                  Prix
                </Label>

                <Input
                  type="number"
                  value={
                    form.prix ?? 0
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      prix:
                        parseFloat(
                          e.target.value
                        ),
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() =>
                  setOpen(false)
                }
              >
                Annuler
              </Button>

              <Button
                onClick={() =>
                  save.mutate()
                }
                disabled={
                  !form.nom ||
                  save.isPending
                }
                className="bg-gradient-gold text-primary-foreground"
              >
                {editing
                  ? "Enregistrer"
                  : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card className="border-gold/20">
          <CardContent className="py-16 text-center text-muted-foreground">
            Aucune prestation
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s: any) => (
            <Card
              key={s.id}
              className="border-gold/20 shadow-soft transition hover:shadow-luxury"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-xl">
                      {s.nom}
                    </p>

                    {s.categorie && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {s.categorie}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(s);

                        setForm(s);

                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        confirm(
                          `Supprimer ${s.nom} ?`
                        ) &&
                        del.mutate(s.id)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between border-t border-gold/15 pt-3">
                  <span className="font-display text-2xl text-gold">
                    {Number(
                      s.prix || 0
                    ).toLocaleString(
                      "fr-FR"
                    )}{" "}
                    FCFA
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}