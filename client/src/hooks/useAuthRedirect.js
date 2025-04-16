import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const useAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL parameters
    const params = new URLSearchParams(location.search);

    // Handle both possible parameter types from Supabase
    const type = params.get("type");
    const accessToken = params.get("access_token");

    // Check for reset password specific parameters
    if (type === "recovery" || type === "password_reset" || accessToken) {
      // Verify if there's a valid session with this token
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          navigate("/reset-password");
        } else if (accessToken) {
          // If we have a token but no session, try to use the token
          supabase.auth
            .setSession({ access_token: accessToken })
            .then(({ error }) => {
              if (!error) {
                navigate("/reset-password");
              } else {
                console.error("Error setting session from token:", error);
                // Redirect to login if token is invalid
                navigate("/login?reset_failed=true");
              }
            });
        }
      });
    }
  }, [location, navigate]);
};

export default useAuthRedirect;
