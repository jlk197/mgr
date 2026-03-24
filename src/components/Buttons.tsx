import React from "react";
import type {TestConfig } from "../ParamsConfig";


type ButtonsProps = {
  config: TestConfig;
};

const Buttons: React.FC<ButtonsProps> = ({ config }) => {
  const handleClick = () => {
    const { fcp, lcp, cls, tbt, tti, inp } = config;

    const url =
      `${window.location.origin}/testpage` +
      `?fcp=${fcp}&lcp=${lcp}&cls=${cls}&tbt=${tbt}&tti=${tti}&inp=${inp}`;
    window.open(url, "_blank");
  };

  return (
    <div className="d-flex flex-wrap justify-content-center my-4 gap-3">
          <button
            className={`btn btn-info flex-fill`}
            style={{ minWidth: "120px" }}
            onClick={() => handleClick()}
          >
            Otwórz stronę testową
          </button>
    </div>
  );
};

export default Buttons;
