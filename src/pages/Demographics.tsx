import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import QuestionBlock from "../components/QuestionBlock";
import { getSurveyAnswers, saveDemographicsAnswers } from "../utils/surveyStorage";
import { saveDemographicsToFirebase } from "../firebase/surveyService";
import { configs } from "../ParamsConfig";

export default function Demographics() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    age: "",
    gender: "",
    frequency: "",
    device: ""
  });

  useEffect(() => {
    const savedAnswers = getSurveyAnswers();
    setAnswers(savedAnswers.demographics);
  }, []);

  const handleAnswerChange = async (name: string, value: string) => {
    const updatedAnswers = { ...answers, [name]: value };
    setAnswers(updatedAnswers);
    saveDemographicsAnswers(updatedAnswers);
    try {
      await saveDemographicsToFirebase(updatedAnswers);
    } catch (error) {
      console.error('Error saving demographics to Firebase:', error);
    }
  };

  const allAnswered = Object.values(answers).every((ans) => ans !== "");

  return (
    <div className="container py-5">
      <div className="mb-3 text-center">
        <small className="text-muted">Krok 1/{configs.length + 1}</small>
      </div>

      <h2 className="mb-4 text-center">Pytania wstępne</h2>

      <QuestionBlock
        question="W jakim jesteś wieku?"
        name="age"
        options={[
          "poniżej 18 lat",
          "18-24",
          "25-34",
          "35-44",
          "45-54",
          "55 i więcej",
        ]}
        value={answers.age}
        onChange={handleAnswerChange}
      />

      <QuestionBlock
        question="Jaka jest Twoja płeć?"
        name="gender"
        options={[
          "kobieta",
          "mężczyzna",
          "inna / wolę nie podawać",
        ]}
        value={answers.gender}
        onChange={handleAnswerChange}
      />

      <QuestionBlock
        question="Jak często korzystasz z aplikacji internetowych?"
        name="frequency"
        options={[
          "sporadycznie",
          "kilka razy w tygodniu",
          "codziennie",
          "wiele razy dziennie",
        ]}
        value={answers.frequency}
        onChange={handleAnswerChange}
      />

      <QuestionBlock
        question="Z jakiego urządzenia korzystasz podczas tego testu?"
        name="device"
        options={[
          "komputer stacjonarny",
          "laptop",
          "tablet",
          "smartfon",
        ]}
        value={answers.device}
        onChange={handleAnswerChange}
      />

      <div className="text-center mt-4">
        <p className="text-danger mt-2" style={{opacity: allAnswered ? 0 : 1}}>
          Proszę odpowiedzieć na wszystkie pytania, aby przejść dalej.
        </p>
        <button
          className="btn btn-primary btn-lg"
          disabled={!allAnswered}
          onClick={async () => {
            saveDemographicsAnswers(answers);
            try {
              await saveDemographicsToFirebase(answers);
            } catch (error) {
              console.error('Error saving demographics to Firebase:', error);
            }
            navigate("/metryki");
          }}
        >
          Dalej
        </button>
      </div>
    </div>
  );
}
