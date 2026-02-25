const { createClient } = require("@supabase/supabase-js");
const config = require("../config/config");

const getSupabaseClient = (useServiceRole = true) => {
  return createClient(
    config.supabase.url,
    useServiceRole ? config.supabase.serviceRoleKey : config.supabase.secretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

module.exports = {
  getSupabaseClient,
};
