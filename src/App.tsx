import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreditCardPage from "./pages/CreditCardPage";
import MobileWalletPage from "./pages/MobileWalletPage";
import ResultPage from "./pages/ResultPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/card" replace />} />
        <Route path="/card" element={<CreditCardPage />} />
        <Route path="/wallet" element={<MobileWalletPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
