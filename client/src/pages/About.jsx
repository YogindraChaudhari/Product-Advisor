import { motion } from "framer-motion";
import { Sparkles, ShoppingCart, ShieldCheck, Zap, ArrowRight, Target, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 pt-8 md:pt-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-24"
      >
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 glass-pill px-4 py-2 rounded-2xl mb-4">
            <Sparkles size={16} className="text-[#F26A8D]" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Intelligent Shopping</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-bold tracking-tighter leading-none">
            Your Ultimate <span className="text-[#DD2D4A]">AI Shopping</span> Companion
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Product Advisor uses state-of-the-art AI to help you make smarter purchasing decisions in seconds. No more endless scrolling through reviews.
          </motion.p>
        </section>

        {/* Why Product Advisor */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="text-[#DD2D4A]" size={28} />,
              title: "Save Time",
              desc: "Get instant analysis of any product without reading thousands of conflicting reviews."
            },
            {
              icon: <Target className="text-[#F26A8D]" size={28} />,
              title: "Better Choices",
              desc: "Deep-dive technical analysis that highlights pros, cons, and hidden value."
            },
            {
              icon: <ShieldCheck className="text-[#F49CBB]" size={28} />,
              title: "Trusted Advice",
              desc: "Objective AI-driven recommendations from specialized experts like OpenAI and Google Agents."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-card p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group"
            >
              <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-main">{item.title}</h3>
              <p className="text-muted leading-relaxed text-sm md:text-base">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* How to Use Section */}
        <section className="glass-card rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DD2D4A]/10 blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-main">
                How to get <span className="text-[#F26A8D]">Expert Advice</span> in 3 steps
              </h2>
              
              <div className="space-y-6">
                {[
                  { step: "01", title: "Paste or Upload", desc: "Paste a product URL from Flipkart/Amazon or upload a photo of the item." },
                  { step: "02", title: "Select Your Expert", desc: "Choose between specialized agents like OpenAI, Google, or our Ultra-Fast Groq Expert." },
                  { step: "03", title: "Get Your Report", desc: "Receive a structured analysis covering core verdicts, pros, cons, and final recommendations." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[#DD2D4A] font-black text-2xl italic opacity-50">{s.step}</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-main">{s.title}</h4>
                      <p className="text-muted text-sm md:text-base leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-40 bg-brand-primary/30 rounded-3xl animate-pulse"></div>
                <div className="h-64 bg-gradient-to-tr from-[#DD2D4A]/10 to-transparent rounded-3xl border border-brand-primary/10 flex items-center justify-center">
                   <Search size={48} className="text-brand-primary opacity-40" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-64 bg-brand-secondary/5 rounded-3xl border border-brand-secondary/10 flex items-center justify-center">
                   <Sparkles size={48} className="text-brand-primary opacity-40" />
                </div>
                <div className="h-40 bg-brand-secondary/30 rounded-3xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Agents Section */}
        <section className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-main">Meet the <span className="text-[#DD2D4A]">Consultants</span></h2>
            <p className="text-muted max-w-xl mx-auto">Different experts for different needs. Our platform integrates the world's most powerful AI models.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {["OpenAI (GPT-4o)", "Google (Gemini)", "Groq (Llama 3)", "Demo Expert"].map((agent, i) => (
              <span key={i} className="glass-pill px-6 py-3 rounded-2xl text-sm font-bold border border-brand-primary/10 hover:border-brand-primary shadow-sm transition-colors">
                {agent}
              </span>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <Link 
            to="/" 
            className="premium-button px-10 py-5 rounded-2xl text-xl font-bold inline-flex items-center space-x-3 group"
          >
            <span>Start Exploring Now</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </motion.div>
    </div>
  );
}
