import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import QuestionBlock from "../components/QuestionBlock";
import ComparisonButtons from "../components/ComparisonButtons";
import {
  lcpVsFcpConfigs,
  ttiVsInpConfigs,
  clsVsTtiConfigs,
  lcpVsClsConfigs,
  tbtVsTtiConfigs,
  inpVsClsConfigs,
  tbtVsInpConfigs
} from "../ParamsConfig";
import { getSurveyAnswers, saveComparisonAnswers, clearSurveyAnswers } from "../utils/surveyStorage";

export default function ComparisonSurvey() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    lcp_fcp: "",
    tti_inp: "",
    cls_tti: "",
    lcp_cls: "",
    tbt_tti: "",
    inp_cls: "",
    tbt_inp: ""
  });

  useEffect(() => {
    const savedAnswers = getSurveyAnswers();
    setAnswers(savedAnswers.comparison);
  }, []);

  const handleAnswerChange = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const allAnswered = Object.values(answers).every((ans) => ans !== "");

  return (
    <div className="container py-5">
      <div className="mb-4 text-center">
        <small className="text-muted">Krok 3/3</small>
      </div>

      <h2 className="mb-4 text-center">Porównania metryk</h2>

      <p className="text-justify">
        Kliknij przyciski i porównaj, która wersja była bardziej irytująca. Następnie odpowiedz na pytania poniżej.
      </p>

      <ComparisonButtons configs={lcpVsFcpConfigs} />
      <QuestionBlock
        question="Która wersja była bardziej irytująca?"
        name="lcp_fcp"
        options={[
          "Test 1",
          "Test 2",
          "Obie podobnie",
          "Żadna",
        ]}
        value={answers.lcp_fcp}
        onChange={handleAnswerChange}
      />

      <ComparisonButtons configs={ttiVsInpConfigs} />
      <QuestionBlock
        question="Co było bardziej irytujące?"
        name="tti_inp"
        options={[
          "Test 1",
          "Test 2",
          "Oba podobnie",
          "Żadne",
        ]}
        value={answers.tti_inp}
        onChange={handleAnswerChange}
      />

      <ComparisonButtons configs={clsVsTtiConfigs} />
      <QuestionBlock
        question="Co było bardziej problematyczne?"
        name="cls_tti"
        options={[
          "Test 1",
          "Test 2",
          "Oba podobnie",
          "Żadne",
        ]}
        value={answers.cls_tti}
        onChange={handleAnswerChange}
      />

      <ComparisonButtons configs={lcpVsClsConfigs} />
      <QuestionBlock
        question="Która wersja była bardziej irytująca?"
        name="lcp_cls"
        options={[
          "Test 1",
          "Test 2",
          "Obie podobnie",
          "Żadna",
        ]}
        value={answers.lcp_cls}
        onChange={handleAnswerChange}
      />

      <ComparisonButtons configs={tbtVsTtiConfigs} />
      <QuestionBlock
        question="Co bardziej pogarszało UX?"
        name="tbt_tti"
        options={[
          "Test 1",
          "Test 2",
          "Oba podobnie",
          "Żadne",
        ]}
        value={answers.tbt_tti}
        onChange={handleAnswerChange}
      />

      <ComparisonButtons configs={inpVsClsConfigs} />
      <QuestionBlock
        question="Co bardziej psuło wrażenia?"
        name="inp_cls"
        options={[
          "Test 1",
          "Test 2",
          "Oba podobnie",
          "Żadne",
        ]}
        value={answers.inp_cls}
        onChange={handleAnswerChange}
      />

      <ComparisonButtons configs={tbtVsInpConfigs} />
      <QuestionBlock
        question="Co było bardziej frustrujące?"
        name="tbt_inp"
        options={[
          "Test 1",
          "Test 2",
          "Oba podobnie",
          "Żadne",
        ]}
        value={answers.tbt_inp}
        onChange={handleAnswerChange}
      />

      <div className="text-center mt-4">
        <p className="text-danger mt-2" style={{opacity: allAnswered ? 0 : 1}}>
          Proszę odpowiedzieć na wszystkie pytania, aby zakończyć badanie.
        </p>
        <button
          className="btn btn-success btn-lg"
          disabled={!allAnswered}
          onClick={() => {
            saveComparisonAnswers(answers);
            clearSurveyAnswers(); 
            navigate("/");
          }}
        >
          Zakończ badanie
        </button>
      </div>
    </div>
  );
}
