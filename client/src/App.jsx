import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import History from "./pages/History";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import useAuthRedirect from "./hooks/useAuthRedirect";
import InstallPrompt from "./components/InstallPrompt";

function AppRoutes() {
  const { authLoading } = useAuth();
  const location = useLocation();

  useAuthRedirect();

  if (authLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const isAuthPage = ["/sign-in", "/sign-up", "/reset-password"].includes(location.pathname);

  return (
    <div className="app-container">
      <InstallPrompt />
      <Navbar />
      <main className={`relative z-10 ${isAuthPage ? "h-screen overflow-hidden" : "pt-32 pb-40 md:pb-24"}`}>
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
