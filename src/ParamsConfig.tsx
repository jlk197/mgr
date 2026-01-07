export type ButtonId = 1 | 2 | 3 | 4 | 5;

export type TestConfig = {
  fcp: number;
  lcp: number;
  cls: boolean;
  tbt: number;
  tti: number;
  inp: number;
  impactFraction: number;
  distanceFraction: number;
};


export const lcpConfigs: Record<ButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0,    cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  2: { fcp: 0, lcp: 1000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  3: { fcp: 0, lcp: 2000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  4: { fcp: 0, lcp: 3000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  5: { fcp: 0, lcp: 5000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
};

export const fcpConfigs: Record<ButtonId, TestConfig> = { //lcp większe o 1000
  1: { fcp: 0,    lcp: 0,    cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  2: { fcp: 500,  lcp: 1500,  cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  3: { fcp: 1000, lcp: 200, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  4: { fcp: 2000, lcp: 3000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  5: { fcp: 3000, lcp: 4000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
};

//niewielki element przesuwany coraz dalej
export const clsConfigs: Record<ButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0.1, distanceFraction: 0 },
  2: { fcp: 0, lcp: 0, cls: true,  tbt: 0, tti: 0, inp: 0, impactFraction: 0.1, distanceFraction: 0.1 },
  3: { fcp: 0, lcp: 0, cls: true,  tbt: 0, tti: 0, inp: 0, impactFraction: 0.1, distanceFraction: 0.2 },
  4: { fcp: 0, lcp: 0, cls: true,  tbt: 0, tti: 0, inp: 0, impactFraction: 0.1, distanceFraction: 0.3 },
  5: { fcp: 0, lcp: 0, cls: true, tbt: 0, tti: 0, inp: 0, impactFraction: 0.1, distanceFraction: 0.4 },
};

//coraz większy element przesuwany o stałą wartość
export const cls2Configs: Record<ButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0.1, distanceFraction: 0.2 },
  2: { fcp: 0, lcp: 0, cls: true,  tbt: 0, tti: 0, inp: 0, impactFraction: 0.2, distanceFraction: 0.2 },
  3: { fcp: 0, lcp: 0, cls: true,  tbt: 0, tti: 0, inp: 0, impactFraction: 0.3, distanceFraction: 0.2 },
  4: { fcp: 0, lcp: 0, cls: true,  tbt: 0, tti: 0, inp: 0, impactFraction: 0.4, distanceFraction: 0.2 },
  5: { fcp: 0, lcp: 0, cls: true, tbt: 0, tti: 0, inp: 0, impactFraction: 0.5, distanceFraction: 0.2 },
};


export const tbtConfigs: Record<ButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  2: { fcp: 0, lcp: 0, cls: false, tbt: 200, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  3: { fcp: 0, lcp: 0, cls: false, tbt: 500, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  4: { fcp: 0, lcp: 0, cls: false, tbt: 800, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  5: { fcp: 0, lcp: 0, cls: false, tbt: 1200, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
};

export const ttiConfigs: Record<ButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 },
  2: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 1000, inp: 0, impactFraction: 0, distanceFraction: 0 },
  3: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 2000, inp: 0, impactFraction: 0, distanceFraction: 0 },
  4: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 3000, inp: 0, impactFraction: 0, distanceFraction: 0 },
  5: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 4000, inp: 0, impactFraction: 0, distanceFraction: 0 },
};

// Konfiguracje dla porównań par metryk
export type ComparisonButtonId = 1 | 2;

export const lcpVsFcpConfigs: Record<ComparisonButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 3000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
  2: { fcp: 3000, lcp: 3100, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
};

export const ttiVsInpConfigs: Record<ComparisonButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 3000, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
  2: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 0, inp: 500, impactFraction: 0, distanceFraction: 0 }, 
};

export const clsVsTtiConfigs: Record<ComparisonButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: true, tbt: 0, tti: 0, inp: 0, impactFraction: 0.4, distanceFraction: 0.3 }, 
  2: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 3000, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
};

export const lcpVsClsConfigs: Record<ComparisonButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 3000, cls: false, tbt: 0, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
  2: { fcp: 0, lcp: 0, cls: true, tbt: 0, tti: 0, inp: 0, impactFraction: 0.4, distanceFraction: 0.3 }, 
};

export const tbtVsTtiConfigs: Record<ComparisonButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 1000, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
  2: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 3000, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
};

export const inpVsClsConfigs: Record<ComparisonButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 0, inp: 500, impactFraction: 0, distanceFraction: 0 }, 
  2: { fcp: 0, lcp: 0, cls: true, tbt: 0, tti: 0, inp: 0, impactFraction: 0.4, distanceFraction: 0.3 }, 
};

export const tbtVsInpConfigs: Record<ComparisonButtonId, TestConfig> = {
  1: { fcp: 0, lcp: 0, cls: false, tbt: 1000, tti: 0, inp: 0, impactFraction: 0, distanceFraction: 0 }, 
  2: { fcp: 0, lcp: 0, cls: false, tbt: 0, tti: 0, inp: 500, impactFraction: 0, distanceFraction: 0 }, 
};
