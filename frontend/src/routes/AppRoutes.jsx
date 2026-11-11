
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoutes.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import Login from "../pages/Auth/Login.jsx";

import Dashboard from "../pages/Dashboard/Dashboard";
import Leads from "../pages/Leads/Leads";
import LeadDetails from "../pages/Leads/LeadDetails";
import Clients from "../pages/Clients/Clients";
import Projects from "../pages/Projects/Projects";
import Proposals from "../pages/Proposals/Proposals";
import Invoices from "../pages/Invoices/Invoices";
import Income from "../pages/Income/Income";

function LoginRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#D6D0C7] border-t-[#A66A43]" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginRoute />} />

      {/* Protected application routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:leadId" element={<LeadDetails />} />

        <Route path="/clients" element={<Clients />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/income" element={<Income />} />
      </Route>

      {/* 404 page */}
      <Route
        path="*"
        element={<h1>404 - Page Not Found</h1>}
      />
    </Routes>
  );
}

export default AppRoutes;
