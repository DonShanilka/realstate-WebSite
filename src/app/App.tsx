import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import Assistant from "../pages/Assistant";
import Home from "../pages/Home";
import PricePrediction from "../pages/PricePrediction";
import Search from "../pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-[calc(100vh-130px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/price-prediction" element={<PricePrediction />} />
          <Route path="*" element={<p className="p-10 text-center text-slate-500">Page not found.</p>} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        EstateAI · Estimates and recommendations are guidance, not financial advice.
      </footer>
    </BrowserRouter>
  );
}
