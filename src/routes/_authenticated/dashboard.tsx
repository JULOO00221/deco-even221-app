import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";

import {
  pb,
  type Quotation,
} from "@/lib/pb";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  Sparkles,
  FileText,
  TrendingUp,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute(
  "/_authenticated/dashboard"
)({
  component: DashboardPage,
});

function DashboardPage() {

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],

    queryFn: async () => {

      const [
        clients,
        services,
        quotations,
      ] = await Promise.all([

        pb
          .collection("clients")
          .getFullList()
          .catch(() => []),

        pb
          .collection("prestations")
          .getFullList()
          .catch(() => []),

        pb
          .collection("devis")
          .getFullList({
            sort: "-created",
            expand: "client",
          })
          .catch(() => []),
      ]);

      const items =
        quotations as any as Quotation[];

      const revenue = items.reduce(
  (s: number, q: any) =>
    s + Number(q.total || 0),
  0
);

      return {
        clients: clients.length,
        services: services.length,
        quotations: quotations.length,
        revenue,
        recent: items.slice(0, 5),
      };
    },
  });

  const cards = [
    {
      title: "Clients",
      value: stats?.clients ?? "—",
      icon: Users,
    },

    {
      title: "Prestations",
      value: stats?.services ?? "—",
      icon: Sparkles,
    },

    {
      title: "Devis",
      value: stats?.quotations ?? "—",
      icon: FileText,
    },

    {
      title: "Revenus",
      value: stats
  ? `${Number(
      stats.revenue
    ).toLocaleString("fr-FR")} FCFA`
  : "—",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* HEADER */}

      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Tableau de bord
          </p>

          <h1 className="mt-1 font-display text-4xl">
            Bonjour
          </h1>

          <div className="gold-divider mt-3 max-w-xs" />

        </div>

        <Link to="/devis/new">

          <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90">

            <Plus className="mr-1 h-4 w-4" />

            Nouveau devis

          </Button>

        </Link>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {cards.map((c) => (

          <Card
            key={c.title}
            className="border-gold/20 shadow-soft"
          >

            <CardContent className="flex items-center justify-between p-6">

              <div>

                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {c.title}
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {c.value}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground">

                <c.icon className="h-5 w-5" />

              </div>

            </CardContent>

          </Card>
        ))}
      </div>

      {/* RECENT QUOTATIONS */}

      <Card className="border-gold/20">

        <CardHeader>

          <CardTitle className="font-display text-2xl">
            Devis récents
          </CardTitle>

        </CardHeader>

        <CardContent>

          {!stats?.recent?.length ? (

            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun devis pour le moment
            </p>

          ) : (

            <div className="divide-y divide-gold/15">

              {stats.recent.map((q: any) => (

                <Link
                  key={q.id}
                  to="/devis/$id"
                  params={{
                    id: q.id,
                  }}
                  className="flex items-center justify-between gap-4 py-3 hover:bg-muted/40"
                >

                  <div>

                    <p className="font-medium">
                      {q.numero}
                    </p>

                    <p className="text-xs text-muted-foreground">

                      {q.expand?.client?.nom || "—"}

                      {" · "}

                      {new Date(
                        q.created
                      ).toLocaleDateString(
                        "fr-FR"
                      )}

                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <Badge
                      variant="outline"
                      className="border-gold/40 capitalize"
                    >
                      {q.statut}
                    </Badge>

                    <span className="font-display text-lg">

                      {Number(
                        q.total || 0
                      ).toLocaleString(
                        "fr-FR"
                      )} FCFA

                    </span>

                  </div>

                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}