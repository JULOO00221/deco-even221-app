import { pb } from "@/lib/pocketbase";

export const getClients = async () => {
  return await pb.collection("clients").getFullList();
};

export const createClient = async (data: any) => {
  return await pb.collection("clients").create(data);
};