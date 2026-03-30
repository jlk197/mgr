import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { clearSurveyAnswers } from "../utils/surveyStorage";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center p-3">
      <h1 className="mb-5">Wpływ wydajności interfejsu użytkownika na doświadczenie użytkownika w aplikacjach webowych</h1>
      <p className="mb-4 text-justify">
        Nazywam się Julia Klechammer i jestem studentką informatyki na Politechnice Poznańskiej.<br />
        Niniejsze badanie stanowi część pracy magisterskiej i dotyczy wpływu wydajności interfejsu użytkownika na doświadczenie użytkownika (UX) w aplikacjach webowych.<br />
        Celem badania jest analiza, w jaki sposób różne aspekty wydajności aplikacji internetowych wpływają na subiektywne odczucia użytkowników podczas korzystania ze stron internetowych.<br />
        Udział w badaniu jest dobrowolny i anonimowy, a uzyskane wyniki zostaną wykorzystane wyłącznie do celów naukowych.<br /><br />
      </p>
      <p className="mb-3 text-justify"><em>Klikając "Rozpocznij badanie", wyrażam zgodę na udział w badaniu zgodnie z powyższymi informacjami.</em></p>
      <button
        className="btn btn-primary btn-lg"
        onClick={() => {
          clearSurveyAnswers();
          navigate("/metryczka");
        }}
      >
        Rozpocznij badanie
      </button>
    </div>
  );
}
