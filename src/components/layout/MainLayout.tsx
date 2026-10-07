
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        EstateAI · Estimates and recommendations are guidance, not financial advice.
      </footer>
    </div>
  );
}
