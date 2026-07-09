import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
import { LoadingProvider } from "./context/LoadingProvider";
import { PortfolioProvider } from "./context/PortfolioProvider";

const App = () => {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LoadingProvider>
                <Suspense>
                  <MainContainer />
                </Suspense>
              </LoadingProvider>
            }
          />
          <Route
            path="/myworks"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <MyWorks />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminPanel />
              </Suspense>
            }
          />
        </Routes>
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </PortfolioProvider>
  );
};

export default App;
