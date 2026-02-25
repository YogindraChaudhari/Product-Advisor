import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
    }
  };

  return (
    show && (
      <div className="fixed bottom-32 md:bottom-10 left-4 right-4 md:left-auto md:right-10 md:w-80 glass-card p-5 rounded-3xl border border-white/10 shadow-2xl z-[60] flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#DD2D4A] rounded-xl flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Install App</h4>
            <p className="text-xs text-gray-400">Add to your home screen for easy access.</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShow(false)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-white transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 premium-button py-2 rounded-xl text-xs font-bold"
          >
            Install
          </button>
        </div>
      </div>
    )
  );
}
