import { useEffect, useState } from "react";

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
      <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded shadow-lg flex justify-between items-center">
        <span>Install this app?</span>
        <button
          onClick={handleInstall}
          className="bg-white text-blue-600 px-3 py-1 rounded ml-4"
        >
          Install
        </button>
      </div>
    )
  );
}
