const STORAGE_KEY = 'survey_answers';
const FIREBASE_DOC_ID_KEY = 'firebase_doc_id';

export type MetricAnswers = {
  speed: string;
  smoothness: string;
  irritation: string;
};

export type ConfigAnswers = {
  [key: string]: MetricAnswers; // key format: "FCP_fast", "LCP_medium", etc.
};

export type SurveyAnswers = {
  demographics: {
    age: string;
    gender: string;
    frequency: string;
    device: string;
  };
  configAnswers: ConfigAnswers;
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
  configAnswers: {},
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

export const saveConfigAnswers = (configKey: string, answers: MetricAnswers) => {
  const current = getSurveyAnswers();
  current.configAnswers[configKey] = answers;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const saveComparisonAnswers = (answers: SurveyAnswers['comparison']) => {
  const current = getSurveyAnswers();
  current.comparison = answers;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const clearSurveyAnswers = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(FIREBASE_DOC_ID_KEY);
};

export const getFirebaseDocId = (): string | null => {
  return localStorage.getItem(FIREBASE_DOC_ID_KEY);
};

export const saveFirebaseDocId = (docId: string) => {
  localStorage.setItem(FIREBASE_DOC_ID_KEY, docId);
};

export const clearFirebaseDocId = () => {
  localStorage.removeItem(FIREBASE_DOC_ID_KEY);
};

