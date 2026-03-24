export type TestConfig = {
  fcp: number;
  lcp: number;
  cls: number;
  tbt: number;
  tti: number;
  inp: number;
  metricType?: string; // FCP, LCP, CLS, TBT, TTI, INP
  speedLevel?: string; // fast, medium, slow, very_slow
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
  { ...defaultConfig, lcp: 0, metricType: 'LCP', speedLevel: 'fast' },
 /* { ...defaultConfig, lcp: 1000, metricType: 'LCP', speedLevel: 'medium' },
  { ...defaultConfig, lcp: 2000, metricType: 'LCP', speedLevel: 'slow' },*/
  { ...defaultConfig, lcp: 3000, metricType: 'LCP', speedLevel: 'very_slow' },
];

export const fcpConfigs: Array<TestConfig> = [
 /* { ...defaultConfig, fcp: 0, metricType: 'FCP', speedLevel: 'fast' },
  { ...defaultConfig, fcp: 1000, metricType: 'FCP', speedLevel: 'medium' },
  { ...defaultConfig, fcp: 2000, metricType: 'FCP', speedLevel: 'slow' },
  { ...defaultConfig, fcp: 3000, metricType: 'FCP', speedLevel: 'very_slow' },*/
];

const clsConfigs: Array<TestConfig> = [
  /*{ ...defaultConfig, cls: 0.1, metricType: 'CLS', speedLevel: 'fast' },
  { ...defaultConfig, cls: 0.2, metricType: 'CLS', speedLevel: 'medium' },
  { ...defaultConfig, cls: 0.3, metricType: 'CLS', speedLevel: 'slow' },
  { ...defaultConfig, cls: 0.4, metricType: 'CLS', speedLevel: 'very_slow' },*/
];

const tbtConfigs: Array<TestConfig> = [
 /* { ...defaultConfig, tbt: 0, metricType: 'TBT', speedLevel: 'fast' },
  { ...defaultConfig, tbt: 200, metricType: 'TBT', speedLevel: 'medium' },
  { ...defaultConfig, tbt: 500, metricType: 'TBT', speedLevel: 'slow' },
  { ...defaultConfig, tbt: 800, metricType: 'TBT', speedLevel: 'very_slow' },*/
];

const ttiConfigs: Array<TestConfig> = [
  /*{ ...defaultConfig, tti: 0, metricType: 'TTI', speedLevel: 'fast' },
  { ...defaultConfig, tti: 1000, metricType: 'TTI', speedLevel: 'medium' },
  { ...defaultConfig, tti: 2000, metricType: 'TTI', speedLevel: 'slow' },
  { ...defaultConfig, tti: 3000, metricType: 'TTI', speedLevel: 'very_slow' },*/
];

const inpConfigs: Array<TestConfig> = [
 /* { ...defaultConfig, inp: 0, metricType: 'INP', speedLevel: 'fast' },
  { ...defaultConfig, inp: 100, metricType: 'INP', speedLevel: 'medium' },
  { ...defaultConfig, inp: 200, metricType: 'INP', speedLevel: 'slow' },
  { ...defaultConfig, inp: 300, metricType: 'INP', speedLevel: 'very_slow' },*/
];

export const configs = [...lcpConfigs, ...fcpConfigs, ...clsConfigs, ...tbtConfigs, ...ttiConfigs, ...inpConfigs];



