
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // 🔹 Assure-toi que ton fichier est bien placé

// @ts-ignore
import AnalyseBivariée from "./pages/AnalyseBivariée";
// @ts-ignore
import Dashboard from "./pages/Dashboard";
// @ts-ignore
import ModelePrediction from "./pages/ModelePrediction";
// @ts-ignore
import AnalyseModeles from "./pages/AnalyseModeles";
// @ts-ignore
import Prediction from "./pages/Prediction";

function App() {
  return (
    <Router>
      <Header />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyse" element={<AnalyseBivariée />} />
          <Route path="/modeles" element={<ModelePrediction />} />
          <Route path="/modelesAvancees" element={<AnalyseModeles />} />
          <Route path="/prediction" element={<Prediction />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
