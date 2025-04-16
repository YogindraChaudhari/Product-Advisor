const { getSupabaseClient } = require("../utils/db");
const {
  generateOpenAIResponse,
  generateGeminiResponse,
} = require("../utils/ai-providers");

const saveAdvice = async (prompt, result, user_id, title, provider) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("advices")
    .insert([
      {
        input_prompt: prompt,
        result,
        user_id,
        title,
        provider,
      },
    ])
    .select();

  if (error) {
    console.error("Database save error:", error);
    throw new Error("Failed to save to database");
  }

  return data;
};

const generateAdvice = async (
  prompt,
  user_id,
  title = "Untitled",
  provider = "openai"
) => {
  let result = null;
  let modelUsed = provider;

  if (provider === "openai") {
    result = await generateOpenAIResponse(prompt);
  } else if (provider === "gemini") {
    result = await generateGeminiResponse(prompt);
  } else if (provider === "auto") {
    try {
      result = await generateOpenAIResponse(prompt);
      modelUsed = "openai";
    } catch (err) {
      console.warn("OpenAI failed, falling back to Gemini:", err.message);
      result = await generateGeminiResponse(prompt);
      modelUsed = "gemini";
    }
  }

  if (!result) {
    throw new Error("Failed to generate response");
  }

  const savedData = await saveAdvice(prompt, result, user_id, title, modelUsed);
  return { result, provider: modelUsed, id: savedData?.[0]?.id };
};

const getUserAdviceHistory = async (user_id) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("advices")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("History fetch error:", error);
    throw new Error(error.message);
  }

  return data || [];
};

const verifyAdviceOwnership = async (id, user_id) => {
  const supabase = getSupabaseClient();

  const { data: advice, error: fetchError } = await supabase
    .from("advices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (fetchError || !advice) {
    throw new Error("Advice not found or unauthorized");
  }

  return advice;
};

const deleteAdvice = async (id, user_id) => {
  await verifyAdviceOwnership(id, user_id);

  const supabase = getSupabaseClient();

  const { error: deleteError } = await supabase
    .from("advices")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return { success: true };
};

const updateAdviceTitle = async (id, user_id, title) => {
  await verifyAdviceOwnership(id, user_id);

  const supabase = getSupabaseClient();

  const { error: updateError } = await supabase
    .from("advices")
    .update({ title })
    .eq("id", id)
    .eq("user_id", user_id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { success: true };
};

module.exports = {
  generateAdvice,
  getUserAdviceHistory,
  deleteAdvice,
  updateAdviceTitle,
};
