import { Suspense, lazy, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ErrorBoundary from "./components/ErrorBoundary";
import routes from "tempo-routes";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import UserProvider from "./context/UserContext";
import AdvancedPreloader from "./components/ui/preloader/AdvancedPreloader";

// Lazy load components for better performance
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const SignupForm = lazy(() => import("./components/auth/SignupForm"));

// Lazy load dashboard components
const GoalsSummary = lazy(() => import("./components/goals/GoalsSummary"));
const ExpenseTracker = lazy(
  () => import("./components/expense/ExpenseTracker"),
);
const BudgetOverview = lazy(
  () => import("./components/dashboard/BudgetOverview"),
);
const SpendingPatterns = lazy(
  () => import("./components/dashboard/SpendingPatterns"),
);
const GoalProgress = lazy(() => import("./components/dashboard/GoalProgress"));

const App = () => {
  const { isLoading, user } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  if (isLoading) {
    // Show premium preloader while checking auth
    return <AdvancedPreloader duration={7000} onComplete={() => {}} />;
  }

  return (
    <ErrorBoundary>
      <UserProvider>
        <Suspense
          fallback={<AdvancedPreloader duration={7000} onComplete={() => {}} />}
        >
          <Routes>
            {/* Public routes - accessible to all */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupForm />} />
            
            {/* Root route - show landing for unauthenticated users, redirect to dashboard for authenticated users */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            
            {/* Protected routes - require authentication */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </Suspense>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
