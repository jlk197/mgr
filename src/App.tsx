import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Demographics from "./pages/Demographics";
import MetricsSurvey from "./pages/MetricsSurvey";
import ComparisonSurvey from "./pages/ComparisonSurvey";
import TestPage from "./pages/TestPage";
import ScrollToTop from "./components/ScrollToTop";


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/metryczka" element={<Demographics />} />
        <Route path="/metryki" element={<MetricsSurvey />} />
        <Route path="/porownania" element={<ComparisonSurvey />} />
        <Route path="/testpage" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}
