import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import useAdviceStore from "../store/adviceStore";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ENDPOINTS } from "../config/api"; // Import the API endpoints

export default function Dashboard() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [llmProvider, setLlmProvider] = useState("openai");
  const { loading, setLoading, response, setResponse } = useAdviceStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a question or product URL");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        prompt: input,
        user_id: user.id,
        title: "Product Query",
        provider: llmProvider,
      };

      const res = await fetch(ENDPOINTS.ADVICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to get advice");

      const data = await res.json();
      setResponse(data.result);
      toast.success("Advice generated!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAdvice = () => {
    setResponse(null);
  };

  const formatText = (text) => {
    if (!text) return "";
    const boldText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const withBullets = boldText.replace(/\* (.*?)(\n|$)/g, "<li>$1</li>");
    const withParagraphs = withBullets.replace(/\n\n/g, "</p><p>");
    return `<p>${withParagraphs}</p>`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Hello, {user.user_metadata?.name || "User"} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Get personalized advice about products or ask any questions
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Your Question
            </label>
            <textarea
              id="query"
              placeholder="Enter product URL or question..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              rows="4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Upload Image (Optional)
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="provider"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                AI Provider
              </label>
              <select
                id="provider"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="auto">Auto (Fallback)</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-medium px-4 py-3 rounded-lg transition duration-200 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Get Advice"
            )}
          </motion.button>
        </form>
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Generating advice...
          </p>
        </motion.div>
      )}

      {response && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          {/* Dismiss Button */}
          <button
            onClick={handleDismissAdvice}
            className="absolute top-6 right-6 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            aria-label="Dismiss advice"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b pb-2 dark:border-gray-700">
            AI Advice
          </h2>
          <div
            className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-800 dark:prose-p:text-gray-200"
            dangerouslySetInnerHTML={{ __html: formatText(response) }}
          />
        </motion.div>
      )}
    </div>
  );
}
