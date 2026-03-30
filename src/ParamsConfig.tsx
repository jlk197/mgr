export const MetricType = {
  FCP: 'FCP',
  LCP: 'LCP',
  CLS: 'CLS',
  TBT: 'TBT',
  TTI: 'TTI',
  INP: 'INP'
} as const;

export type MetricType = typeof MetricType[keyof typeof MetricType];

export const SpeedLevel = {
  FAST: 'fast',
  MEDIUM: 'medium',
  SLOW: 'slow',
  VERY_SLOW: 'very_slow'
} as const;

export type SpeedLevel = typeof SpeedLevel[keyof typeof SpeedLevel];

export type TestConfig = {
  fcp: number;      
  lcp: number;    
  cls: number;     
  tbt: number;   
  tti: number;     
  inp: number;  
  metricType?: MetricType;
  speedLevel?: SpeedLevel;
};


const defaultConfig: TestConfig = {
  fcp: 0,
  lcp: 0,
  cls: 0,
  tbt: 0,
  tti: 0,
  inp: 0,
};



const lcpConfigs: Array<TestConfig> = [
  { ...defaultConfig, lcp: 0, metricType: MetricType.LCP, speedLevel: SpeedLevel.FAST },
  { ...defaultConfig, lcp: 1000, metricType: MetricType.LCP, speedLevel: SpeedLevel.MEDIUM },
  { ...defaultConfig, lcp: 2000, metricType: MetricType.LCP, speedLevel: SpeedLevel.SLOW },
  { ...defaultConfig, lcp: 3000, metricType: MetricType.LCP, speedLevel: SpeedLevel.VERY_SLOW },
];

export const fcpConfigs: Array<TestConfig> = [
  { ...defaultConfig, fcp: 0, metricType: MetricType.FCP, speedLevel: SpeedLevel.FAST },
  { ...defaultConfig, fcp: 1000, metricType: MetricType.FCP, speedLevel: SpeedLevel.MEDIUM },
  { ...defaultConfig, fcp: 2000, metricType: MetricType.FCP, speedLevel: SpeedLevel.SLOW },
  { ...defaultConfig, fcp: 3000, metricType: MetricType.FCP, speedLevel: SpeedLevel.VERY_SLOW },
];

const clsConfigs: Array<TestConfig> = [
  { ...defaultConfig, cls: 0.1, metricType: MetricType.CLS, speedLevel: SpeedLevel.FAST },
  { ...defaultConfig, cls: 0.2, metricType: MetricType.CLS, speedLevel: SpeedLevel.MEDIUM },
  { ...defaultConfig, cls: 0.3, metricType: MetricType.CLS, speedLevel: SpeedLevel.SLOW },
  { ...defaultConfig, cls: 0.4, metricType: MetricType.CLS, speedLevel: SpeedLevel.VERY_SLOW },
];

const tbtConfigs: Array<TestConfig> = [
  { ...defaultConfig, tbt: 0, metricType: MetricType.TBT, speedLevel: SpeedLevel.FAST },
  { ...defaultConfig, tbt: 200, metricType: MetricType.TBT, speedLevel: SpeedLevel.MEDIUM },
  { ...defaultConfig, tbt: 500, metricType: MetricType.TBT, speedLevel: SpeedLevel.SLOW },
  { ...defaultConfig, tbt: 800, metricType: MetricType.TBT, speedLevel: SpeedLevel.VERY_SLOW },
];

const ttiConfigs: Array<TestConfig> = [
  { ...defaultConfig, tti: 0, metricType: MetricType.TTI, speedLevel: SpeedLevel.FAST },
  { ...defaultConfig, tti: 1000, metricType: MetricType.TTI, speedLevel: SpeedLevel.MEDIUM },
  { ...defaultConfig, tti: 2000, metricType: MetricType.TTI, speedLevel: SpeedLevel.SLOW },
  { ...defaultConfig, tti: 3000, metricType: MetricType.TTI, speedLevel: SpeedLevel.VERY_SLOW },
];

const inpConfigs: Array<TestConfig> = [
  { ...defaultConfig, inp: 0, metricType: MetricType.INP, speedLevel: SpeedLevel.FAST },
  { ...defaultConfig, inp: 100, metricType: MetricType.INP, speedLevel: SpeedLevel.MEDIUM },
  { ...defaultConfig, inp: 200, metricType: MetricType.INP, speedLevel: SpeedLevel.SLOW },
  { ...defaultConfig, inp: 300, metricType: MetricType.INP, speedLevel: SpeedLevel.VERY_SLOW },
];

export const configs = [...lcpConfigs, ...fcpConfigs, ...clsConfigs, ...tbtConfigs, ...ttiConfigs, ...inpConfigs];



