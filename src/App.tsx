import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

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

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-yellow-400 animate-spin mb-4"></div>
            <div className="text-yellow-400 font-medium">
              Loading WealthWise...
            </div>
          </div>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/goals" element={<Home />} />
          <Route path="/expenses" element={<Home />} />
          <Route path="/transactions" element={<Home />} />
          <Route path="/analytics" element={<Home />} />
          <Route path="/profile" element={<Home />} />
          <Route path="/settings" element={<Home />} />
          {/* Redirect any other routes to dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
