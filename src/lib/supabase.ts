import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptnjuwthxnbmmqnelxjs.supabase.co";

const supabaseKey =
  "sb_publishable_VvGl0pU7a8MP2cB8bOc6GA_87jmAqXo";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);