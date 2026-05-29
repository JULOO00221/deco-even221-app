import { supabase } from "@/lib/supabase";

export const getTableauDeBordStats = async () => {
  const { data: clients } = await supabase
    .from("clients")
    .select("*");

  const { data: prestations } = await supabase
    .from("prestations")
    .select("*");

  const { data: devis } = await supabase
    .from("devis")
    .select("*");

  return {
    clients: clients?.length || 0,
    prestations: prestations?.length || 0,
    devis: devis?.length || 0,
  };
};