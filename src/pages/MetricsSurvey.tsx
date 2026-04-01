import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import QuestionBlock from "../components/QuestionBlock";
import Buttons from "../components/Buttons";
import { configs } from "../ParamsConfig";
import { saveConfigAnswers } from "../utils/surveyStorage";
import { saveConfigAnswersToFirebase } from "../firebase/surveyService";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function MetricsSurvey() {
  const navigate = useNavigate();
  const [currentConfigIndex, setCurrentConfigIndex] = useState(0);
  const [shuffledConfigs, _] = useState(() => shuffleArray(configs));
  const [answers, setAnswers] = useState({
    speed: "",
    smoothness: "",
    irritation: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentConfigIndex]);

  const handleAnswerChange = async (name: string, value: string) => {
    const updatedAnswers = { ...answers, [name]: value };
    setAnswers(updatedAnswers);

    const allQuestionsAnswered = Object.values(updatedAnswers).every((ans) => ans !== "");

    if (allQuestionsAnswered) {
      const currentConfig = shuffledConfigs[currentConfigIndex];
      const configKey = `${currentConfig.metricType}_${currentConfig.speedLevel}`;
      saveConfigAnswers(configKey, updatedAnswers);
      try {
        await saveConfigAnswersToFirebase(configKey, updatedAnswers);
      } catch (error) {
        console.error('Error saving config answers to Firebase:', error);
      }
    }
  };

  const allAnswered = Object.values(answers).every((ans) => ans !== "");

  const handleNext = async () => {
    const currentConfig = shuffledConfigs[currentConfigIndex];
    const configKey = `${currentConfig.metricType}_${currentConfig.speedLevel}`;
    saveConfigAnswers(configKey, answers);
    try {
      await saveConfigAnswersToFirebase(configKey, answers);
    } catch (error) {
      console.error('Error saving config answers to Firebase:', error);
    }

    if (currentConfigIndex < shuffledConfigs.length - 1) {
      setCurrentConfigIndex(currentConfigIndex + 1);
      setAnswers({
        speed: "",
        smoothness: "",
        irritation: ""
      });
    } else {
      navigate("/dziekuje");
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4 text-center">
        <small className="text-muted">
          Krok {currentConfigIndex + 2}/{configs.length + 1}
        </small>
      </div>

      <p className="text-justify">
        Przejdź na stronę testową, zapoznaj się z jej funkcjonalnościami poprzez interakcję, a następnie odpowiedz na poniższe pytania.
      </p>
      <Buttons config={shuffledConfigs[currentConfigIndex]} />

      <QuestionBlock
        question="1. Jak oceniasz szybkość działania strony?"
        name="speed"
        options={[
          "1 - bardzo wolna",
          "2 - wolna",
          "3 - raczej wolna",
          "4 - średnia",
          "5 - raczej szybka",
          "6 - szybka",
          "7 - bardzo szybka"
        ]}
        value={answers.speed}
        onChange={handleAnswerChange}
      />

      <QuestionBlock
        question="2. Jak oceniasz płynność działania strony podczas interakcji?"
        name="smoothness"
        options={[
          "1 - bardzo niepłynna",
          "2 - niepłynna",
          "3 - raczej niepłynna",
          "4 - umiarkowana",
          "5 - raczej płynna",
          "6 - płynna",
          "7 - bardzo płynna"
        ]}
        value={answers.smoothness}
        onChange={handleAnswerChange}
      />

      <QuestionBlock
        question="3. W jakim stopniu działanie strony było dla Ciebie irytujące?"
        name="irritation"
        options={[
          "1 - bardzo irytujące",
          "2 - irytujące",
          "3 - raczej irytujące",
          "4 - umiarkowanie irytujące",
          "5 - raczej mało irytujące",
          "6 - mało irytujące",
          "7 - wcale nie irytujące"
        ]}
        value={answers.irritation}
        onChange={handleAnswerChange}
      />

      <div className="text-center mt-4">
        <p className="text-danger mt-2" style={{opacity: allAnswered ? 0 : 1}}>
          Proszę odpowiedzieć na wszystkie pytania, aby przejść dalej.
        </p>
        <button
          className="btn btn-primary btn-lg"
          disabled={!allAnswered}
          onClick={handleNext}
        >
          {currentConfigIndex < shuffledConfigs.length - 1 ? "Dalej" : "Zakończ"}
        </button>
      </div>
    </div>
  );
}
