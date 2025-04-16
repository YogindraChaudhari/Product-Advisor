const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// POST /api/delete-account
router.post("/", async (req, res) => {
  const { user_id } = req.body;

  try {
    const { error: historyError } = await supabase
      .from("advices")
      .delete()
      .eq("user_id", user_id);

    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user_id
    );

    if (historyError || deleteError) {
      return res.status(500).json({ error: "Could not delete account" });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
