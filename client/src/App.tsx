import { useAuth } from "./hooks/AuthContext";
import LoginPage from "./features/auth/LoginPage";
import DashboardPage from "./features/dashboard/DashBoardPage";

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}

export default App;
