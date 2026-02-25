require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai").OpenAI;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const deleteAccount = require("./src/routes/deleteAccount");

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Gemini setup with v1 API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1",
});

// Utility function to create Supabase client
const getSupabaseClient = () => {
  return require("@supabase/supabase-js").createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    // process.env.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

app.use("/api/delete-account", deleteAccount);

// POST /api/advice
app.post("/api/advice", async (req, res) => {
  const { prompt, user_id, title = "Untitled", provider = "openai" } = req.body;

  if (!prompt || !user_id) {
    return res.status(400).json({ error: "Missing prompt or user ID" });
  }

  const supabase = getSupabaseClient();

  const saveToDB = async (result, modelUsed) => {
    const { data, error } = await supabase
      .from("advices")
      .insert([
        {
          input_prompt: prompt,
          result,
          user_id,
          title,
          provider: modelUsed,
        },
      ])
      .select();

    if (error) {
      console.error("Database save error:", error);
      throw new Error("Failed to save to database");
    }

    return data;
  };

  const tryOpenAI = async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  };

  const tryGemini = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([{ text: prompt }]);
    const response = await result.response;
    return response.text();
  };

  try {
    let result = null;
    let modelUsed = provider;

    if (provider === "openai") {
      result = await tryOpenAI();
    } else if (provider === "gemini") {
      result = await tryGemini();
    } else if (provider === "auto") {
      try {
        result = await tryOpenAI();
        modelUsed = "openai";
      } catch (err) {
        console.warn("OpenAI failed, falling back to Gemini:", err.message);
        result = await tryGemini();
        modelUsed = "gemini";
      }
    }

    if (!result) {
      return res.status(500).json({ error: "Failed to generate response" });
    }

    const savedData = await saveToDB(result, modelUsed);
    res.json({ result, provider: modelUsed, id: savedData?.[0]?.id });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "All LLMs failed. Please try again later." });
  }
});

// GET /api/history/:user_id
app.get("/api/history/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("advices")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("History fetch error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// DELETE /api/advice/:id
app.delete("/api/advice/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!id || !user_id) {
    return res.status(400).json({ error: "Missing advice ID or user ID" });
  }

  try {
    const supabase = getSupabaseClient();

    // Verify this advice belongs to the user
    const { data: advice, error: fetchError } = await supabase
      .from("advices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user_id)
      .single();

    if (fetchError || !advice) {
      return res
        .status(404)
        .json({ error: "Advice not found or unauthorized" });
    }

    const { error: deleteError } = await supabase
      .from("advices")
      .delete()
      .eq("id", id)
      .eq("user_id", user_id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return res.status(500).json({ error: deleteError.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to delete advice" });
  }
});

// PATCH /api/advice/:id
app.patch("/api/advice/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, title } = req.body;

  if (!id || !user_id || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const supabase = getSupabaseClient();

    // Verify this advice belongs to the user
    const { data: advice, error: fetchError } = await supabase
      .from("advices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user_id)
      .single();

    if (fetchError || !advice) {
      return res
        .status(404)
        .json({ error: "Advice not found or unauthorized" });
    }

    const { error: updateError } = await supabase
      .from("advices")
      .update({ title })
      .eq("id", id)
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Update error:", updateError);
      return res.status(500).json({ error: updateError.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to update advice" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
