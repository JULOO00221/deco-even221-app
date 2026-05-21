import {
  createFileRoute,
  Outlet,
  Link,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";

import { pb } from "@/lib/pb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  User,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/clients/$id/edit"
)({
  component: ClientsLayout,
});

function ClientsLayout() {
  return <Outlet />;
}

export function ClientsPage() {
  const [clients, setClients] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const records =
        await pb
          .collection("clients")
          .getFullList({
            sort: "-created",
          });

      setClients(records);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = clients.filter((c) =>
    `${c.nom} ${c.telephone} ${c.mail}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            CLIENTS
          </p>

          <h1 className="font-display text-6xl leading-none">
            Clients
          </h1>
        </div>

        <Link to="/clients/new">
          <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau client
          </Button>
        </Link>

      </div>

      <Card className="border-gold/20">
        <CardContent className="p-4">

          <div className="relative">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="pl-10"
            />

          </div>

        </CardContent>
      </Card>

      <div className="space-y-5">

        {filtered.map((c) => (

          <Card
            key={c.id}
            className="border-gold/20"
          >

            <CardContent className="flex items-center justify-between p-5">

              <div className="space-y-2">

                <div className="flex items-center gap-2">

                  <User className="h-4 w-4 text-gold" />

                  <p className="text-2xl font-semibold">
                    {c.nom}
                  </p>

                </div>

                <p className="text-lg">
                  {c.telephone}
                </p>

                <p className="text-muted-foreground">
                  {c.mail || "Pas d'email"}
                </p>

              </div>

              <div className="flex items-center gap-2">

                <Link
                  to="/clients/$id"
                  params={{
                    id: c.id,
                  }}
                >
                  <Button
                    size="icon"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>

                <Link
                  to="/clients/$id/edit"
                  params={{
                    id: c.id,
                  }}
                >
                  <Button
                    size="icon"
                    variant="outline"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  size="icon"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>
  );
}