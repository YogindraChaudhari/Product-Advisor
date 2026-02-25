const { getSupabaseClient } = require("../utils/db");
const {
  generateOpenAIResponse,
  generateGeminiResponse,
  generateGroqResponse,
  generateDemoResponse,
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

const generateSimpleTitle = (prompt) => {
  if (prompt.includes("http")) {
    try {
      const url = new URL(prompt.match(/https?:\/\/[^\s]+/)?.[0]);
      let slug = url.pathname.split("/").filter(Boolean).pop();
      if (slug && slug.length > 3) {
        // Clean slug: remove dashes, capitalize
        return slug.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").slice(0, 30);
      }
      return url.hostname.replace("www.", "");
    } catch (e) {
      return "Product Analysis";
    }
  }
  
  const words = prompt.trim().split(/\s+/).slice(0, 5).join(" ");
  return words.length > 0 ? words.charAt(0).toUpperCase() + words.slice(1) + "..." : "Product Query";
};

const generateAdvice = async (
  prompt,
  user_id,
  title = "Untitled",
  provider = "openai"
) => {
  let result = null;
  let modelUsed = provider;

  try {
    if (provider === "openai") {
      result = await generateOpenAIResponse(prompt);
    } else if (provider === "gemini") {
      result = await generateGeminiResponse(prompt);
    } else if (provider === "groq") {
      result = await generateGroqResponse(prompt);
    } else if (provider === "demo") {
      result = await generateDemoResponse(prompt);
    } else if (provider === "auto") {
      try {
        result = await generateGeminiResponse(prompt);
        modelUsed = "gemini";
      } catch (err) {
        console.warn("Gemini failed, trying OpenAI:", err.message);
        try {
          result = await generateOpenAIResponse(prompt);
          modelUsed = "openai";
        } catch (err2) {
          console.warn("OpenAI failed, falling back to Demo Mode:", err2.message);
          result = await generateDemoResponse(prompt);
          modelUsed = "demo";
        }
      }
    }
  } catch (err) {
    console.error(`Provider ${provider} failed, using Demo fallback:`, err.message);
    result = await generateDemoResponse(prompt);
    modelUsed = "demo";
  }

  if (!result) {
    throw new Error("Failed to generate response");
  }

  let finalTitle = title;
  if (title === "Product Query" || title === "Untitled") {
    const headerMatch = result.match(/^#+\s*(.*)/m) || result.match(/^\*\*(.*?)\*\*/m);
    if (headerMatch && headerMatch[1] && headerMatch[1].length < 50) {
      finalTitle = headerMatch[1].trim().replace(/\*/g, "");
    } else {
      finalTitle = generateSimpleTitle(prompt);
    }
  }

  const savedData = await saveAdvice(prompt, result, user_id, finalTitle, modelUsed);
  return { result, provider: modelUsed, id: savedData?.[0]?.id, title: finalTitle };
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
