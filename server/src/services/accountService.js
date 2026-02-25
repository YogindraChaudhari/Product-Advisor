const { getSupabaseClient } = require("../utils/db");

const deleteAccount = async (user_id) => {
  const supabase = getSupabaseClient(false); // Use secret key for auth operations

  // Delete all user's advice records
  const { error: historyError } = await supabase
    .from("advices")
    .delete()
    .eq("user_id", user_id);

  // Delete the user account
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id);

  if (historyError || deleteError) {
    throw new Error("Could not delete account");
  }

  return { success: true };
};

module.exports = {
  deleteAccount,
};
