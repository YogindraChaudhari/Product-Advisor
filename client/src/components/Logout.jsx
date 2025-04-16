import { useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Logout failed!");
      } else {
        toast.success("Logged out successfully!");
        navigate("/login");
      }
    };

    signOut();
  }, [navigate]);

  return (
    <div className="text-center mt-20 text-lg font-medium">
      Logging you out...
    </div>
  );
}
