import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const TestPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const fcpDelay = parseInt(params.get("fcp") || "0", 10);
  const lcpDelay = parseInt(params.get("lcp") || "0", 10);
  const clsEnabled = params.get("cls") === "1";
  const tbtDelay = parseInt(params.get("tbt") || "0", 10);
  const ttiDelay = parseInt(params.get("tti") || "0", 10);
  const inpDelay = parseInt(params.get("inp") || "0", 10);
  const impactFraction = parseFloat(params.get("impactFraction") || "0");
  const distanceFraction = parseFloat(params.get("distanceFraction") || "0");

  /*  CLS */
  const viewportHeight = window.innerHeight;

  // ELEMENT, NA KTÓRYM LICZY SIĘ CLS 
  const shiftedElementHeightPx =
    impactFraction > 0 ? viewportHeight * impactFraction : 200;

  // ELEMENT, KTÓRY POJAWIA SIĘ NAD NIM 
  const injectedHeightPx =
    distanceFraction > 0 ? viewportHeight * distanceFraction : 100;

  const [showFCP, setShowFCP] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showLCP, setShowLCP] = useState(false);
  const [showInjectedAbove, setShowInjectedAbove] = useState(false);

  const [clickedButtons, setClickedButtons] = useState<Record<string, boolean>>(
    {}
  );
  const [clickedMain, setClickedMain] = useState(false);

  const clsTargetRef = useRef<HTMLDivElement>(null);

  const contentButtons = ["Polub", "Udostępnij", "Zobacz więcej"];
  const sidebarItems = ["Artykuł powiązany", "Popularny wpis", "Inna treść"];

  const blockMainThread = (ms: number) => {
    const start = performance.now();
    while (performance.now() - start < ms) {}
  };

  /* FCP */
  useEffect(() => {
    if (fcpDelay > 0) {
      const timer = setTimeout(() => {
        setShowFCP(true);
        setTimeout(() => setShowContent(true), 400);
      }, fcpDelay);
      return () => clearTimeout(timer);
    } else {
      setShowFCP(true);
      setShowContent(true);
    }
  }, [fcpDelay]);

  /* LCP */
  useEffect(() => {
    const timer = setTimeout(() => setShowLCP(true), lcpDelay);
    return () => clearTimeout(timer);
  }, [lcpDelay]);

  /* CLS injection */
  useEffect(() => {
    if (clsEnabled) {
      const timer = setTimeout(() => {
        setShowInjectedAbove(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [clsEnabled]);

  /* TBT  */
  useEffect(() => {
    if (tbtDelay > 0) {
      const timer = setTimeout(() => {
        blockMainThread(tbtDelay);
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [tbtDelay]);

  /* TTI (Time to Interactive) */
  useEffect(() => {
    if (ttiDelay > 0) {
      const timer = setTimeout(() => {
        blockMainThread(ttiDelay);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [ttiDelay]);

  const handleClick = (id: string) => {
    // INP
    if (inpDelay > 0) {
      blockMainThread(inpDelay);
    }
    setClickedButtons((prev) => ({ ...prev, [id]: true }));
  };


  return (
    <div className="container-fluid min-vh-100 bg-white py-4">
      <header
        className="container mb-4 w-100"
        style={{ opacity: showLCP ? 1 : 0 }}
      >
        <h1 className="fw-bold">Przykładowy artykuł informacyjny</h1>
        <p className="text-muted mb-0">
          Krótki opis strony, który wygląda jak prawdziwy wstęp.
        </p>
      </header>

      <main
        className={`container bg-white rounded p-4 w-100 ${
          showContent ? "shadow" : ""
        }`}
      >
        <div className="row g-4">
          <div className="col-12 col-md-8 d-flex flex-column gap-3">
            <div
              className="rounded d-flex justify-content-center align-items-center w-100"
              style={{ height: 260, backgroundColor: "#198754", opacity: showContent ? 1 : 0 }}
            >
              <h2 className="text-white text-center">Główny element strony</h2>
            </div>

            <div style={{ opacity: showContent ? 1 : 0 }}>
              <p>To jest przykładowy akapit treści artykułu.</p>
              <p>Kolejny fragment tekstu, aby strona wyglądała naturalnie.</p>

              <div className="d-flex gap-2 flex-wrap mt-2">
                {contentButtons.map((btn) => (
                  <button
                    key={btn}
                    className="btn btn-outline-primary btn-sm"
                    style={{ minWidth: 80 }}
                    onClick={() => handleClick(btn)}
                  >
                    {btn}
                    {clickedButtons[btn] && " ✓"}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-primary mt-3"
                style={{ minWidth: 140 }}
                onClick={() => setClickedMain((p) => !p)}
              >
                {clickedMain ? "Zwiń" : "Czytaj więcej"}
              </button>

              <div
                className="mt-2 text-success"
                style={{ opacity: clickedMain ? 1 : 0 }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam porta ligula urna, id porttitor justo lacinia maximus.
                </p>
              </div>
            </div>
          </div>

          <aside className="col-12 col-md-4" style={{ opacity: showFCP ? 1 : 0 }}>
            <div className="p-3 border rounded mb-3">
              <h6 className="fw-bold">Polecane</h6>
              <ul className="list-unstyled mb-0">
                {sidebarItems.map((item) => (
                  <li key={item} className="mb-1">
                    <button
                      className="btn btn-outline-secondary btn-sm w-100 text-start"
                      onClick={() => handleClick(item)}
                    >
                      {item}
                      {clickedButtons[item] && " ✓"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {showInjectedAbove && (
              <div
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{
                  height: injectedHeightPx,
                  backgroundColor: "white",
                }}
              >
              
              </div>
            )}

            <div
              ref={clsTargetRef}
              className="d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                height: shiftedElementHeightPx,
                backgroundColor: "#dc3545",
                borderRadius: 6,
              }}
            >
              Element przesuwany (CLS target)
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
