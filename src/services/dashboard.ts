import { pb } from "@/lib/pocketbase";

export const getTableau de bordStats = async () => {
  const clients = await pb.collection("clients").getFullList();
  const Prestations = await pb.collection("prestations").getFullList();
  const Devis = await pb.collection("devis").getFullList();

  return {
    clients: clients.length,
    Prestations: Prestations.length,
    Devis: Devis.length,
  };
};