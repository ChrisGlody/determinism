import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ComparisonPage from "./pages/ComparisonPage";
import DeterminismTester from "./pages/DeterminismTester";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<ComparisonPage />} />
          <Route path="/determinism-tester" element={<DeterminismTester />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
