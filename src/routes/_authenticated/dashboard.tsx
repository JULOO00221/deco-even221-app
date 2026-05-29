import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
export const Route = createFileRoute(
  "/_authenticated/dashboard"
)({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState({
    clients: 0,
    devis: 0,
    total: 0,
    payes: 0,
  });
  

  const [recentDevis, setRecentDevis] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] =
  useState<any[]>([]);

const [statusData, setStatusData] =
  useState<any[]>([]);
  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { count: clientsCount } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true });

    const { data: devisData } = await supabase
      .from("devis")
      .select("*")
      .order("created_at", { ascending: false });

    const total =
      devisData?.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      ) || 0;

    const payes =
  devisData?.filter(
    (item) =>
      item.statut?.toLowerCase() === "paye"
  ).length || 0;

    setStats({
      clients: clientsCount || 0,
      devis: devisData?.length || 0,
      total,
      payes,
    });

    setRecentDevis(
      devisData?.slice(0, 5) || []
    );
    const monthlyTotals: any = {};

devisData?.forEach((item) => {
  const date = new Date(
    item.created_at
  );

  const month =
    date.toLocaleDateString(
      "fr-FR",
      {
        month: "short",
      }
    );

  if (!monthlyTotals[month]) {
    monthlyTotals[month] = 0;
  }

  monthlyTotals[month] += Number(
    item.total || 0
  );
});

setMonthlyData(
  Object.entries(monthlyTotals).map(
    ([month, total]) => ({
      month,
      total,
    })
  )
);

const chartData = [
  {
    name: "Brouillon",
    value:
      devisData?.filter(
        (d) => d.statut === "brouillon"
      ).length || 0,
  },
  {
    name: "Validé",
    value:
      devisData?.filter(
        (d) => d.statut === "valide"
      ).length || 0,
  },
  {
    name: "Payé",
    value:
      devisData?.filter(
        (d) => d.statut === "paye"
      ).length || 0,
  },
].filter((item) => item.value > 0);

setStatusData(chartData);
}
  return (
    <div className="p-8 w-full">

      <p className="uppercase tracking-[0.3em] text-sm text-[#d6a128] font-semibold">
        Tableau de bord
      </p>

      <h1 className="text-5xl font-serif text-[#2d1b12] mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl">
          <p>Clients</p>
          <h2 className="text-4xl font-bold">
            {stats.clients}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <p>Devis</p>
          <h2 className="text-4xl font-bold">
            {stats.devis}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <p>Montant total</p>
          <h2 className="text-3xl font-bold text-[#d6a128]">
            {stats.total.toLocaleString()} FCFA
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <p>Payés</p>
          <h2 className="text-4xl font-bold text-green-600">
            {stats.payes}
          </h2>
        </div>

      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">

  <div className="bg-white rounded-2xl p-6">
    <h2 className="text-xl font-bold mb-4">
      Chiffre d'affaires par mois
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart
        data={monthlyData}
      >
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />

        <Bar
          dataKey="total"
          fill="#d6a128"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-white rounded-2xl p-6">
    <h2 className="text-xl font-bold mb-4">
      Répartition des devis
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          <Cell fill="#d6a128" />
          <Cell fill="#4CAF50" />
          <Cell fill="#2196F3" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

</div>
      <div className="bg-white rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          Derniers devis
        </h2>

        <div className="space-y-4">

          {recentDevis.map((item) => (

            <div
              key={item.id}
              className="border rounded-xl p-4"
            >
              <p className="font-bold">
                {item.numero}
              </p>

              <p>
                {Number(item.total).toLocaleString()}
                {" "}
                FCFA
              </p>

              <p
  className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
    item.statut === "paye"
      ? "bg-green-100 text-green-700"
      : item.statut === "valide"
      ? "bg-blue-100 text-blue-700"
      : "bg-orange-100 text-orange-700"
  }`}
>
  {item.statut === "paye"
    ? "Payé"
    : item.statut === "valide"
    ? "Validé"
    : "Brouillon"}
</p>
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}