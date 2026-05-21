import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
  useEffect,
} from "react";

import { getClients } from "@/services/clients";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { pb } from "@/lib/pb";

import { toast } from "sonner";

import { Sparkles } from "lucide-react";

export const Route = createFileRoute(
  "/login"
)({
  component: LoginPage,
});

function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    getClients()
      .then((data) => {
        console.log(
          "Clients:",
          data
        );
      })
      .catch((err) => {
        console.error(
          "PocketBase error:",
          err
        );
      });

  }, []);

  const submit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      await pb
        .collection("users")
        .authWithPassword(
          email,
          password
        );

      toast.success(
        "Welcome back"
      );

      navigate({
        to: "/dashboard",
      });

    } catch (err: any) {

      console.error(err);

      toast.error(
        err?.message ||
        "Invalid credentials or server unreachable"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-beige">

      <div className="pointer-events-none absolute inset-0 opacity-40">

        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-gold blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent blur-3xl" />

      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">

        <div className="grid w-full gap-10 md:grid-cols-2 md:gap-16">

          {/* LEFT */}

          <div className="hidden flex-col justify-center md:flex">

            <div className="flex items-center gap-2 text-gold">

              <Sparkles className="h-5 w-5" />

              <span className="text-xs uppercase tracking-[0.3em]">
                Maison de décoration
              </span>

            </div>

            <h1 className="mt-4 font-display text-6xl leading-tight text-foreground">

              Deco
              <span className="text-gold">
                {" "}
                Even221
              </span>

            </h1>

            <div className="gold-divider my-6 max-w-xs" />

            <p className="max-w-md text-muted-foreground">


            </p>
          </div>

          {/* CARD */}

          <Card className="border-gold/30 shadow-luxury backdrop-blur">

            <CardContent className="p-8">

              <div className="mb-6 text-center md:hidden">

                <h1 className="font-display text-4xl">

                  Deco
                  <span className="text-gold">
                    {" "}
                    Even221
                  </span>

                </h1>

                <div className="gold-divider my-3" />

              </div>

              <h2 className="font-display text-3xl">
                ESPACE CONNEXION
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Acceder a la plateforme
              </p>

              {/* FORM */}

              <form
                onSubmit={submit}
                className="mt-6 space-y-4"
              >

                {/* EMAIL */}

                <div className="space-y-2">

                  <Label htmlFor="email">
                    Email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@deco-even221.com"
                  />

                </div>

                {/* PASSWORD */}

                <div className="space-y-2">

                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                  />

                </div>

                {/* BUTTON */}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-gold text-primary-foreground shadow-soft hover:opacity-90"
                >

                  {loading
                    ? "Signing in…"
                    : "Enter the atelier"}

                </Button>
              </form>

              {/* FOOTER */}

              <p className="mt-6 text-center text-xs text-muted-foreground">

                Required collections:
                <span className="text-gold">
                  {" "}users
                </span>
                ,
                <span className="text-gold">
                  {" "}clients
                </span>
                ,
                <span className="text-gold">
                  {" "}prestations
                </span>
                ,
                <span className="text-gold">
                  {" "}quotations
                </span>

              </p>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}