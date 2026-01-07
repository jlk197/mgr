import { useState } from "react";
import type { ButtonId } from "../ParamsConfig";

type ShowColorState = Record<ButtonId, boolean>;

const ButtonsWithDelayedAction = () => {
  const [showColor, setShowColor] = useState<ShowColorState>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const handleClick = (buttonId: ButtonId, delay: number) => {
    setTimeout(() => {
      setShowColor((prev) => ({
        ...prev,
        [buttonId]: !prev[buttonId],
      }));
    }, delay);
  };

  const buttons: Array<{id: ButtonId, color: string, delay: number}> = [
    {id: 1, color: "btn-danger", delay: 0},
    {id: 2, color: "btn-success", delay: 200},
    {id: 3, color: "btn-primary", delay: 300},
    {id: 4, color: "btn-warning", delay: 500},
    {id: 5, color: "btn-info", delay: 700}
  ];

  return (
    <div className="d-flex flex-wrap justify-content-center my-4 gap-3">
      {
        buttons.map(({id, color, delay}) => (
          <button
            key={id}
            className={`btn ${showColor[id as ButtonId] ? color : "btn-secondary"} flex-fill`}
            onClick={() => handleClick(id, delay)}
          >
            Przycisk {id}
          </button>
        ))
      }
    </div>
  );
};

export default ButtonsWithDelayedAction;
