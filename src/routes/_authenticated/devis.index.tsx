import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { pb } from "@/lib/pb";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Calendar,
  Download,
  Eye,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { quotationToPdf } from "@/lib/pdf";

export const Route = createFileRoute(
  "/_authenticated/devis/"
)({
  component: DevisPage,
});

function DevisPage() {

  const queryClient = useQueryClient();

  const [search, setSearch] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  // =========================
  // GET DEVIS
  // =========================

  const {
    data: devis = [],
  } = useQuery({
    queryKey: ["devis"],

    queryFn: async () => {

      const res =
        await pb
          .collection("devis")
          .getFullList({
            sort: "-created",
            expand: "client",
          });

      return res;
    },
  });

  // =========================
  // FILTERS
  // =========================

  const filtered = useMemo(() => {

    return devis.filter(
      (q: any) => {

        const client =
          q.expand?.client?.nom || "";

        const matchSearch =
          q.numero
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          client
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchDate =
  !dateFilter ||
  q.even_date?.slice(0, 10) ===
    dateFilter;

        return (
          matchSearch &&
          matchDate
        );
      }
    );

  }, [
    devis,
    search,
    dateFilter,
  ]);

  // =========================
  // DELETE
  // =========================

  const remove =
    useMutation({

      mutationFn: async (
        id: string
      ) => {

        await pb
          .collection(
            "devis"
          )
          .delete(id);
      },

      onSuccess: () => {

        toast.success(
          "Devis supprimé"
        );

        queryClient.invalidateQueries({
          queryKey: ["devis"],
        });
      },
    });

  // =========================
  // RENAME
  // =========================

  const renameQuotation =
    async (q: any) => {

      const value = prompt(
        "Nouveau numéro",
        q.numero
      );

      if (!value) return;

      await pb
        .collection(
          "devis"
        )
        .update(q.id, {
          numero: value,
        });

      toast.success(
        "Devis renommé"
      );

      queryClient.invalidateQueries({
        queryKey: ["devis"],
      });
    };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            Devis
          </p>

          <h1 className="font-display text-5xl">
            Devis
          </h1>
        </div>

        <Link to="/devis/new">

          <Button className="bg-gradient-gold">
            Nouveau devis
          </Button>

        </Link>
      </div>

      {/* FILTERS */}

      <Card className="border-gold/20">

        <CardContent className="p-4 flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Rechercher un devis ou un client..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">

            <Calendar className="h-4 w-4" />

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
            />
          </div>

          <Button
            variant="outline"
            onClick={() => {

              setSearch("");
              setDateFilter("");

            }}
          >
            Réinitialiser
          </Button>
        </CardContent>
      </Card>

      {/* LIST */}

      <div className="space-y-4">

        {filtered.map(
          (q: any) => (

            <Card
              key={q.id}
              className="border-gold/20 hover:border-gold transition"
            >

              <CardContent className="p-5 flex items-center justify-between">

                {/* LEFT */}

                <div>

                  <p className="font-semibold text-xl">
                    {q.numero}
                  </p>

                  <p className="text-muted-foreground">

                    {
                      q.expand
                        ?.client
                        ?.nom
                    }

                    {" • "}

                    {q.even_date
  ? new Date(
      q.even_date
    ).toLocaleDateString("fr-FR")
  : "Pas de date"}
                  </p>

                  <p className="mt-2 text-gold font-semibold">

                    {Number(
                      q.total || 0
                    ).toLocaleString(
                      "fr-FR"
                    )}{" "}

                    FCFA
                  </p>
                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-2">

                  {/* VIEW */}

                  <Link
                    to="/devis/$id"
                    params={{
                      id: q.id,
                    }}
                  >

                    <Button
                      size="icon"
                      variant="outline"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                  </Link>

                  {/* PDF */}

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={async () => {

                      const items =
                        await pb
                          .collection(
                            "lignes_devis"
                          )
                          .getFullList({
                            filter: `devis="${q.id}"`,
                            expand:
                              "prestation",
                          });

                      quotationToPdf(
                        {
                          ...q,
                          items,
                        },
                        q.expand
                          ?.client
                          ?.nom || ""
                      );
                    }}
                  >

                    <Download className="h-4 w-4" />

                  </Button>

                  {/* RENAME */}

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      renameQuotation(
                        q
                      )
                    }
                  >

                    <Pencil className="h-4 w-4" />

                  </Button>

                  {/* DELETE */}

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() =>
                      remove.mutate(
                        q.id
                      )
                    }
                  >

                    <Trash2 className="h-4 w-4" />

                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {filtered.length ===
          0 && (

          <Card>

            <CardContent className="p-10 text-center text-muted-foreground">

              Aucun devis trouvé

            </CardContent>

          </Card>
        )}
      </div>
    </div>
  );
}