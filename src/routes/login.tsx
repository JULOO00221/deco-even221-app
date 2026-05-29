import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      navigate({
        to: "/dashboard",
      });

    } catch (error) {
      console.log(error);
      alert("Erreur connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f0e6] flex items-center justify-center">

      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-5xl font-bold text-[#d6a128]">
            Deco Even221
          </h1>

          <p className="text-gray-500 mt-2">
            Connexion
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#d6a128] text-white p-4 rounded-xl font-bold"
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>

        </div>

      </div>

    </div>
  );
}