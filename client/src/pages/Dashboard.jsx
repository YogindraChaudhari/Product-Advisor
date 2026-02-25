import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import useAdviceStore from "../store/adviceStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Upload, Cpu, MessageSquare } from "lucide-react";
import { ENDPOINTS } from "../config/api";

const AILoader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="ai-loader-container mt-12 mb-8"
  >
    <div className="ai-orbital">
      <div className="ai-ring"></div>
      <div className="ai-core"></div>
    </div>
    <div className="text-center">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#DD2D4A] to-[#F26A8D]">
        AI is Thinking...
      </h3>
      <p className="text-muted text-sm mt-2">Analyzing your request for the best advice</p>
    </div>
  </motion.div>
);

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get advice");
      }

      setResponse(data.result);
      toast.success("Advice generated!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    if (!text) return "";

    const normalizedText = text.replace(/([^\n])(\s[\*\-]\s)/g, "$1\n$2");

    const lines = normalizedText.split("\n");
    let html = [];
    let inList = false;

    lines.forEach((line) => {
      let trimmed = line.trim();
      
      if (!trimmed) {
        if (inList) { html.push("</ul>"); inList = false; }
        return;
      }

      if (trimmed.startsWith("#### ")) {
        if (inList) { html.push("</ul>"); inList = false; }
        const content = trimmed.substring(5).replace(/\*\*/g, "");
        html.push(`<h4 class="text-base md:text-lg font-bold text-white mt-7 mb-3 border-l-4 border-[#DD2D4A] pl-4">${content}</h4>`);
        return;
      }
      
      if (trimmed.startsWith("### ")) {
        if (inList) { html.push("</ul>"); inList = false; }
        const content = trimmed.substring(4).replace(/\*\*/g, "");
        html.push(`<h3 class="text-lg md:text-xl font-bold text-bright mt-10 mb-4 border-b border-brand-primary/10 pb-2">${content}</h3>`);
        return;
      }

      const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
      let processed = isBullet ? trimmed.replace(/^[\*\-\•]\s+/, "") : trimmed;

      processed = processed
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-bright font-bold italic">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-bright font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-brand-secondary italic">$1</em>');

      if (isBullet) {
        if (!inList) {
          html.push('<ul class="list-none pl-1 space-y-3 mb-6">');
          inList = true;
        }
        html.push(`
          <li class="flex items-start gap-3 text-muted leading-relaxed">
            <span class="mt-2 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 shadow-[0_0_8px_rgba(221,45,74,0.4)]"></span>
            <span class="text-main">${processed}</span>
          </li>
        `);
      } else {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push(`<p class="mb-5 leading-relaxed text-main">${processed}</p>`);
      }
    });

    if (inList) html.push("</ul>");
    return html.join("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4">
          Hello, <span className="text-[#DD2D4A]">{user.user_metadata?.name?.split(' ')[0] || "there"}</span> 👋
        </h1>
        <p className="text-muted text-sm md:text-lg">
          Ask for expert AI advice on any product or query.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 mb-8 md:mb-12 relative overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6 md:space-y-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#F26A8D] font-semibold mb-1 md:mb-2 text-sm md:text-base">
              <MessageSquare size={18} />
              <span>What's on your mind?</span>
            </div>
            <textarea
              id="query"
              placeholder="Paste a product URL or describe what you're looking for..."
              className="w-full premium-input rounded-3xl p-5 md:p-6 text-base md:text-lg min-h-[140px] md:min-h-[160px] resize-none text-main focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <label className="text-[10px] md:text-sm font-semibold text-[#F49CBB]/80 ml-2 uppercase tracking-wider">Upload Product View</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="premium-input rounded-2xl p-3 md:p-4 flex items-center justify-between group-hover:border-[#DD2D4A] transition-colors">
                  <span className="text-muted truncate mr-4 text-sm md:text-base">
                    {image ? image.name : "Choose a file..."}
                  </span>
                  <Upload size={18} className="text-[#F26A8D] shrink-0" />
                </div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className="text-[10px] md:text-sm font-semibold text-[#F49CBB]/80 ml-2 uppercase tracking-wider">AI Expert Agent</label>
              <div className="relative">
                <select
                  className="w-full premium-input rounded-2xl p-3 md:p-4 appearance-none focus:outline-none font-medium cursor-pointer text-sm md:text-base"
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                >
                  <option value="openai" className="bg-app-bg text-main">OpenAI Expert (GPT-4o)</option>
                  <option value="gemini" className="bg-app-bg text-main">Google Expert (Gemini)</option>
                  <option value="groq" className="bg-app-bg text-main">Groq Expert (Ultra Fast)</option>
                  <option value="demo" className="bg-app-bg text-main">Demo Expert (Truly Free)</option>
                  <option value="auto" className="bg-app-bg text-main">Auto Optimizer (Fallback Mode)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#F26A8D]">
                  <Sparkles size={16} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full premium-button text-white font-bold h-14 md:h-16 rounded-2xl text-lg md:text-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-2xl mt-2"
          >
            {loading ? (
               <span className="flex items-center space-x-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Syncing...</span>
               </span>
            ) : (
              <>
                <span>Get Expert Advice</span>
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      <AnimatePresence>
        {loading && <AILoader />}
        
        {response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 relative"
          >
            <button
              onClick={() => setResponse(null)}
              className="absolute top-8 right-8 text-muted hover:text-bright transition-colors p-2 glass-pill rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-[#DD2D4A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#DD2D4A]/30">
                <Sparkles size={20} />
              </div>
              <h2 className="text-2xl font-bold">AI Recommendation</h2>
            </div>
            
            <div
              className="prose dark:prose-invert max-w-none text-muted leading-relaxed space-y-4 text-lg
                prose-strong:text-main prose-strong:font-bold prose-headings:text-main
                prose-li:list-disc prose-li:marker:text-brand-primary"
              dangerouslySetInnerHTML={{ __html: formatText(response) }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
