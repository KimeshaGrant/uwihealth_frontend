import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppointmentsProvider } from "@/contexts/AppointmentsContext";
import AppLayout from "@/components/AppLayout";
import Register from "@/pages/Register";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import BookAppointment from "@/pages/BookAppointment";
import MyAppointments from "@/pages/MyAppointments";
import LiveQueue from "@/pages/LiveQueue";
import ChatAssistant from "@/pages/ChatAssistant";
import DoctorSchedule from "@/pages/DoctorSchedule";
import Analytics from "@/pages/Analytics";
import AdminSettings from "@/pages/AdminSettings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
      <Route path="/queue" element={<ProtectedRoute><LiveQueue /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><DoctorSchedule /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppointmentsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AppointmentsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
