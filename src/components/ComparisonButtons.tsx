import React from "react";
import type { ComparisonButtonId, TestConfig } from "../ParamsConfig";


type ComparisonButtonsProps = {
  configs: Record<ComparisonButtonId, TestConfig>;
};

const ComparisonButtons: React.FC<ComparisonButtonsProps> = ({ configs }) => {
  const handleClick = (buttonId: ComparisonButtonId) => {
    const { fcp, lcp, cls, tbt, tti, inp, impactFraction, distanceFraction } = configs[buttonId];

    const url =
      `${window.location.origin}/testpage` +
      `?fcp=${fcp}&lcp=${lcp}&cls=${cls ? 1 : 0}&tbt=${tbt}&tti=${tti}&inp=${inp}&impactFraction=${impactFraction}&distanceFraction=${distanceFraction}`;
    window.open(url, "_blank");
  };

  return (
    <div className="d-flex flex-wrap justify-content-center my-4 gap-3">
      {(Object.keys(configs) as string[]).map((key) => {
        const id = Number(key) as ComparisonButtonId;
        return (
          <button
            key={id}
            className={`btn ${
              ["btn-danger", "btn-success"][id - 1]
            } flex-fill`}
            style={{ minWidth: "120px" }}
            onClick={() => handleClick(id)}
          >
            Test {id}
          </button>
        );
      })}
    </div>
  );
};

export default ComparisonButtons;

