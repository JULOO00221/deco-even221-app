import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";

import { supabase } from "../lib/supabase";

export const Route = createFileRoute(
  "/_authenticated"
)({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();

    navigate({
      to: "/login",
    });
  }

  return (
    <div className="flex min-h-screen bg-[#f5f1e8]">

      {/* Sidebar */}

      <aside className="w-64 bg-[#efe8d8] p-6 flex flex-col justify-between">

        <div>

          <div className="mb-12">

            <h1 className="text-5xl font-bold leading-none text-[#d4a028]">
              Deco
              <br />
              Even221
            </h1>

            <p className="text-gray-500 mt-2 tracking-widest">
              ATELIER
            </p>

          </div>

          <nav className="space-y-4">

            <Link
              to="/dashboard"
              className="block px-4 py-3 rounded-2xl hover:bg-[#e5d5b8]"
            >
              Tableau de bord
            </Link>

            <Link
              to="/clients"
              className="block px-4 py-3 rounded-2xl hover:bg-[#e5d5b8]"
            >
              Clients
            </Link>

            <Link
              to="/devis"
              className="block px-4 py-3 rounded-2xl hover:bg-[#e5d5b8]"
            >
              Devis
            </Link>

          </nav>

        </div>

        <div className="space-y-3">

          <Link
            to="/devis/new"
            className="block text-center bg-[#d4a028] text-white py-4 rounded-2xl font-bold hover:opacity-90"
          >
            + Nouveau devis
          </Link>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600"
          >
            Déconnexion
          </button>

        </div>

      </aside>

      {/* Contenu */}

      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
}