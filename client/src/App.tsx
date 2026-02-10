import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/AuthContext";
import LoginPage from "./features/auth/LoginPage";
import DashboardPage from "./features/dashboard/DashBoardPage";
import ServiceDetailPage from "./features/services/ServiceDetailPage.tsx";

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
