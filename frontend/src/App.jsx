import React, { useEffect, lazy, Suspense } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
// import OverviewPage from './pages/OverviewPage';
import SideBar from "./components/common/Sidebar";
import PowerPlantInsights from "./pages/PowerPlantInsights";
import ImpactPage from "./pages/ImpactPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import SplashCursor from "./animations/SplashCursor";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import PredictionsPage from "./pages/PredictionsPage";
import ProtectedRoutes from "./components/utils/ProtectedRoutes";
import ReportsPage from "./pages/ReportsPage";

const OverviewPage = lazy(() => import("./pages/OverviewPage"));
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is already logged in
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      // Or use navigate("/overview") if not using window.location
      navigate("/overview");
    }
  }, [isAuthenticated, location]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      {/* <SplashCursor /> */}
      {location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/forgot-password" && <SideBar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/overview" /> : <LandingPage />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoutes />}>

          <Route path="/insights" element={<PowerPlantInsights />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/impacts" element={<ImpactPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          
        </Route>

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default App;
