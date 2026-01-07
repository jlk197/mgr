const STORAGE_KEY = 'survey_answers';

export type SurveyAnswers = {
  demographics: {
    age: string;
    gender: string;
    frequency: string;
    device: string;
  };
  metrics: {
    inp: string;
    lcp: string;
    fcp: string;
    cls: string;
    cls2: string;
    tbt: string;
    tti: string;
  };
  comparison: {
    lcp_fcp: string;
    tti_inp: string;
    cls_tti: string;
    lcp_cls: string;
    tbt_tti: string;
    inp_cls: string;
    tbt_inp: string;
  };
};

const defaultAnswers: SurveyAnswers = {
  demographics: {
    age: "",
    gender: "",
    frequency: "",
    device: ""
  },
  metrics: {
    inp: "",
    lcp: "",
    fcp: "",
    cls: "",
    cls2: "",
    tbt: "",
    tti: ""
  },
  comparison: {
    lcp_fcp: "",
    tti_inp: "",
    cls_tti: "",
    lcp_cls: "",
    tbt_tti: "",
    inp_cls: "",
    tbt_inp: ""
  }
};

export const getSurveyAnswers = (): SurveyAnswers => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading survey answers from localStorage:', error);
  }
  return defaultAnswers;
};

export const saveDemographicsAnswers = (answers: SurveyAnswers['demographics']) => {
  const current = getSurveyAnswers();
  current.demographics = answers;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const saveMetricsAnswers = (answers: SurveyAnswers['metrics']) => {
  const current = getSurveyAnswers();
  current.metrics = answers;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const saveComparisonAnswers = (answers: SurveyAnswers['comparison']) => {
  const current = getSurveyAnswers();
  current.comparison = answers;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const clearSurveyAnswers = () => {
  localStorage.removeItem(STORAGE_KEY);
};

