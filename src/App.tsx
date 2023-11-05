import "./App.css";
import { SearchPage } from "./pages/SearchPage.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { Outlet } from "react-router-dom";

export const App = () => {
  return (
    <>
      <ErrorBoundary>
        <div className="flex">
          <SearchPage />
          <Outlet />
        </div>
      </ErrorBoundary>
    </>
  );
};
