import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import type { SurveyAnswers } from '../utils/surveyStorage';
import { getFirebaseDocId, saveFirebaseDocId } from '../utils/surveyStorage';

export type FirebaseSurveyData = {
  age: string;
  gender: string;
  device: string;
  frequency: string;
  timestamp: Timestamp;

  FCP_fast_speed: number;
  FCP_fast_smoothness: number;
  FCP_fast_irritation: number;
  FCP_medium_speed: number;
  FCP_medium_smoothness: number;
  FCP_medium_irritation: number;
  FCP_slow_speed: number;
  FCP_slow_smoothness: number;
  FCP_slow_irritation: number;
  FCP_very_slow_speed: number;
  FCP_very_slow_smoothness: number;
  FCP_very_slow_irritation: number;

  LCP_fast_speed: number;
  LCP_fast_smoothness: number;
  LCP_fast_irritation: number;
  LCP_medium_speed: number;
  LCP_medium_smoothness: number;
  LCP_medium_irritation: number;
  LCP_slow_speed: number;
  LCP_slow_smoothness: number;
  LCP_slow_irritation: number;
  LCP_very_slow_speed: number;
  LCP_very_slow_smoothness: number;
  LCP_very_slow_irritation: number;

  CLS_fast_speed: number;
  CLS_fast_smoothness: number;
  CLS_fast_irritation: number;
  CLS_medium_speed: number;
  CLS_medium_smoothness: number;
  CLS_medium_irritation: number;
  CLS_slow_speed: number;
  CLS_slow_smoothness: number;
  CLS_slow_irritation: number;
  CLS_very_slow_speed: number;
  CLS_very_slow_smoothness: number;
  CLS_very_slow_irritation: number;

  TBT_fast_speed: number;
  TBT_fast_smoothness: number;
  TBT_fast_irritation: number;
  TBT_medium_speed: number;
  TBT_medium_smoothness: number;
  TBT_medium_irritation: number;
  TBT_slow_speed: number;
  TBT_slow_smoothness: number;
  TBT_slow_irritation: number;
  TBT_very_slow_speed: number;
  TBT_very_slow_smoothness: number;
  TBT_very_slow_irritation: number;

  TTI_fast_speed: number;
  TTI_fast_smoothness: number;
  TTI_fast_irritation: number;
  TTI_medium_speed: number;
  TTI_medium_smoothness: number;
  TTI_medium_irritation: number;
  TTI_slow_speed: number;
  TTI_slow_smoothness: number;
  TTI_slow_irritation: number;
  TTI_very_slow_speed: number;
  TTI_very_slow_smoothness: number;
  TTI_very_slow_irritation: number;

  INP_fast_speed: number;
  INP_fast_smoothness: number;
  INP_fast_irritation: number;
  INP_medium_speed: number;
  INP_medium_smoothness: number;
  INP_medium_irritation: number;
  INP_slow_speed: number;
  INP_slow_smoothness: number;
  INP_slow_irritation: number;
  INP_very_slow_speed: number;
  INP_very_slow_smoothness: number;
  INP_very_slow_irritation: number;
};

const parseAnswer = (answer: string): number => {
  // Wyciąga numer z odpowiedzi typu "1 – bardzo wolna" -> 1
  const match = answer.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

export const transformSurveyData = (surveyAnswers: SurveyAnswers): FirebaseSurveyData => {
  const data: Partial<FirebaseSurveyData> = {
    age: surveyAnswers.demographics.age,
    gender: surveyAnswers.demographics.gender,
    device: surveyAnswers.demographics.device,
    frequency: surveyAnswers.demographics.frequency,
    timestamp: Timestamp.now(),
  };

  // Przekształć odpowiedzi z configAnswers na płaską strukturę
  Object.entries(surveyAnswers.configAnswers).forEach(([configKey, answers]) => {
    // configKey format: "FCP_fast", "LCP_medium", etc.
    const speedKey = `${configKey}_speed` as keyof FirebaseSurveyData;
    const smoothnessKey = `${configKey}_smoothness` as keyof FirebaseSurveyData;
    const irritationKey = `${configKey}_irritation` as keyof FirebaseSurveyData;

    data[speedKey] = parseAnswer(answers.speed) as any;
    data[smoothnessKey] = parseAnswer(answers.smoothness) as any;
    data[irritationKey] = parseAnswer(answers.irritation) as any;
  });

  return data as FirebaseSurveyData;
};

export const submitSurveyToFirebase = async (surveyAnswers: SurveyAnswers): Promise<void> => {
  try {
    const data = transformSurveyData(surveyAnswers);
    const docRef = await addDoc(collection(db, 'survey_responses'), data);
    console.log('Survey submitted successfully with ID:', docRef.id);
  } catch (error) {
    console.error('Error submitting survey to Firebase:', error);
    throw error;
  }
};


export const createOrUpdateSurveyDocument = async (partialData: Partial<FirebaseSurveyData>): Promise<string> => {
  try {
    const existingDocId = getFirebaseDocId();

    const dataWithTimestamp = {
      ...partialData,
      timestamp: partialData.timestamp || Timestamp.now()
    };

    if (existingDocId) {
      const docRef = doc(db, 'survey_responses', existingDocId);
      await updateDoc(docRef, dataWithTimestamp as any);
      return existingDocId;
    } else {
      const docRef = await addDoc(collection(db, 'survey_responses'), dataWithTimestamp);
      saveFirebaseDocId(docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating/updating survey in Firebase:', error);
    throw error;
  }
};

export const saveDemographicsToFirebase = async (demographics: {
  age: string;
  gender: string;
  device: string;
  frequency: string;
}): Promise<string> => {
  return createOrUpdateSurveyDocument({
    age: demographics.age,
    gender: demographics.gender,
    device: demographics.device,
    frequency: demographics.frequency,
  });
};

export const saveConfigAnswersToFirebase = async (
  configKey: string,
  answers: { speed: string; smoothness: string; irritation: string }
): Promise<string> => {
  const speedKey = `${configKey}_speed` as keyof FirebaseSurveyData;
  const smoothnessKey = `${configKey}_smoothness` as keyof FirebaseSurveyData;
  const irritationKey = `${configKey}_irritation` as keyof FirebaseSurveyData;

  const partialData = {
    [speedKey]: parseAnswer(answers.speed),
    [smoothnessKey]: parseAnswer(answers.smoothness),
    [irritationKey]: parseAnswer(answers.irritation),
  } as Partial<FirebaseSurveyData>;

  return createOrUpdateSurveyDocument(partialData);
};

