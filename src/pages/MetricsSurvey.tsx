import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import QuestionBlock from "../components/QuestionBlock";
import ButtonsWithDelayedAction from "../components/ButtonsWithDelayedAction";
import Buttons from "../components/Buttons";
import { cls2Configs, clsConfigs, fcpConfigs, lcpConfigs, tbtConfigs, ttiConfigs } from "../ParamsConfig";
import { getSurveyAnswers, saveMetricsAnswers } from "../utils/surveyStorage";


export default function MetricsSurvey() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    inp: "",
    lcp: "",
    fcp: "",
    cls: "",
    cls2: "",
    tbt: "",
    tti: ""
  });

  useEffect(() => {
    const savedAnswers = getSurveyAnswers();
    setAnswers(savedAnswers.metrics);
  }, []);

  const handleAnswerChange = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const allAnswered = Object.values(answers).every((ans) => ans !== "");

  return (
    <div className="container py-5">
      <div className="mb-4 text-center">
        <small className="text-muted">Krok 2/3</small>
      </div>

      <h2 className="mb-4 text-center">Ocena wydajności</h2>

      <p className="text-justify">
        Kliknij wszystkie przyciski i poczekaj, aż zmienią kolor. Zwróć uwagę, który przycisk reagował zbyt wolno i odpowiedz na poniższe pytanie.
      </p>
      <ButtonsWithDelayedAction />
      <QuestionBlock
        question="Od którego przycisku reakcja trwała zbyt wolno?"
        name="inp"
        options={["Przycisk 1", "Przycisk 2", "Przycisk 3", "Przycisk 4", "Przycisk 5", "Wszystkie", "Żaden"]}
        value={answers.inp}
        onChange={handleAnswerChange}
      />

      <p className="text-justify">
        Kliknij przyciski i poczekaj, aż wszystkie elementy pojawią się na stronie. Zwróć uwagę na szybkość pojawiania się elementów i odpowiedz na pytania poniżej.
      </p>
      <Buttons configs={lcpConfigs} />
      <QuestionBlock
        question="Od której wersji czas ładowania był zbyt długi?"
        name="lcp"
        options={["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Wszystkie", "Żadna"]}
        value={answers.lcp}
        onChange={handleAnswerChange}
      />

      <Buttons configs={fcpConfigs} />
      <QuestionBlock
        question="Od której wersji strona była zbyt długo pusta?"
        name="fcp"
        options={["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Wszystkie", "Żadna"]}
        value={answers.fcp}
        onChange={handleAnswerChange}
      />

      <p className="text-justify">
        Obserwuj ładowanie strony i zwróć uwagę, czy elementy zmieniają swoje położenie. Następnie odpowiedz na pytania poniżej.
      </p>
      <Buttons configs={clsConfigs} />
      <QuestionBlock
        question="Od której wersji zachowanie było nieakceptowalne?"
        name="cls"
        options={["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Wszystkie", "Żadna"]}
        value={answers.cls}
        onChange={handleAnswerChange}
      />
      <Buttons configs={cls2Configs} />
      <QuestionBlock
        question="Od której wersji zachowanie było nieakceptowalne?"
        name="cls2"
        options={["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Wszystkie", "Żadna"]}
        value={answers.cls2}
        onChange={handleAnswerChange}
      />

      <p className="text-justify">
        Kliknij przycisk i spróbuj wejść w interakcję ze stroną. Zwróć uwagę, czy strona reaguje od razu czy z opóźnieniem, i odpowiedz na poniższe pytanie.
      </p>
      <Buttons configs={tbtConfigs} />
      <QuestionBlock
        question="Od której wersja strona sprawiała wrażenie zawieszającej się?"
        name="tbt"
        options={["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Wszystkie", "Żadna"]}
        value={answers.tbt}
        onChange={handleAnswerChange}
      />
      <Buttons configs={ttiConfigs} />
      <QuestionBlock
        question="Od której wersji zachowanie było nieakceptowalne?"
        name="tti"
        options={["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Wszystkie", "Żadna"]}
        value={answers.tti}
        onChange={handleAnswerChange}
      />

      <div className="text-center mt-4">
        <p className="text-danger mt-2" style={{opacity: allAnswered ? 0 : 1}}>
          Proszę odpowiedzieć na wszystkie pytania, aby przejść dalej.
        </p>
        <button
          className="btn btn-primary btn-lg"
          disabled={!allAnswered}
          onClick={() => {
            saveMetricsAnswers(answers);
            navigate("/porownania");
          }}
        >
          Dalej
        </button>
      </div>
    </div>
  );
}
