import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./TestPage.css";

const TestPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const fcpDelay = parseInt(params.get("fcp") || "0", 10);
  const lcpDelay = parseInt(params.get("lcp") || "0", 10);
  const clsParam = parseFloat(params.get("cls") || "0");
  const tbtDelay = parseInt(params.get("tbt") || "0", 10);
  const ttiDelay = parseInt(params.get("tti") || "0", 10);
  const inpDelay = parseInt(params.get("inp") || "0", 10);

  const clsEnabled = clsParam > 0;

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const getImpactCorrectionFactor = (width: number): number => {
    if (width <= 768) return 1.0;
    else if (width <= 1000) return 1.16;
    else if (width <= 1400) return 1.05;
    else if (width <= 1700) return 2.19;
    else return 2.0;
  };

  const impactCorrection = getImpactCorrectionFactor(viewportWidth);
  const shiftDistancePx = clsEnabled
    ? viewportHeight * clsParam * impactCorrection
    : 0;

  const blockMainThread = (ms: number) => {
    const start = performance.now();
    while (performance.now() - start < ms) {}
  };

  const [contentVisible, setContentVisible] = useState(false);
  const [showLCP, setShowLCP] = useState(false);
  const [topElementInjected, setTopElementInjected] = useState(false);
  const [topElementHeight, setTopElementHeight] = useState(0);
  const [initialContentReady, setInitialContentReady] = useState(false);
  const clsTestStartTimeRef = useRef<number | null>(null);
  const [_, setMeasuredCLS] = useState<number>(0);

  const [clickedButtons, setClickedButtons] = useState<Record<string, boolean>>({});
  const [clickedMain, setClickedMain] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [fcpTime, setFcpTime] = useState<number | null>(null);

  const contentButtons = ["Zapisz artykuł", "Udostępnij", "Komentarze"];
  const sidebarItems = ["10 najlepszych miejsc na wakacje", "Jak zaoszczędzić na zakupach", "Przepisy na szybki obiad"];

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (fcpDelay > 0 && !clsEnabled) {
      const timer = setTimeout(() => setContentVisible(true), fcpDelay);
      return () => clearTimeout(timer);
    }
  }, [fcpDelay, clsEnabled]);
  useEffect(() => {
    if (clsEnabled) {
      setShowLCP(true);
      setContentVisible(true);
      window.scrollTo(0, 0);
      const stabilizationTimer = setTimeout(() => {
        window.scrollTo(0, 0);
        setInitialContentReady(true);
      }, 1500);
      return () => clearTimeout(stabilizationTimer);
    } else if (fcpDelay === 0) {
      setContentVisible(true);
    }
  }, [clsEnabled, fcpDelay]);

  useEffect(() => {
    if (clsEnabled) {
      setShowLCP(true);
      return;
    }
    if (!contentVisible) return;
    const timer = setTimeout(() => setShowLCP(true), lcpDelay);
    return () => clearTimeout(timer);
  }, [lcpDelay, clsEnabled, contentVisible]);

  useEffect(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setFcpTime(entry.startTime);
          }
        }
      });
      observer.observe({ type: 'paint', buffered: true });
      return () => observer.disconnect();
    } catch (e) {
      console.error('[TBT] PerformanceObserver for paint not supported:', e);
    }
  }, []);

  useEffect(() => {
    if (tbtDelay > 0 && fcpTime !== null) {
      const timer = setTimeout(() => blockMainThread(tbtDelay), 50);
      return () => clearTimeout(timer);
    }
  }, [tbtDelay, fcpTime]);

  useEffect(() => {
    let clsScore = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            const isBeforeTest = clsTestStartTimeRef.current === null ||
                                 layoutShift.startTime < clsTestStartTimeRef.current;
            if (!isBeforeTest) {
              clsScore += layoutShift.value;
              setMeasuredCLS(clsScore);
            }
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      return () => observer.disconnect();
    } catch (e) {
      console.error('[CLS] PerformanceObserver not supported:', e);
    }
  }, [clsParam]);

  useEffect(() => {
    if (clsEnabled && initialContentReady) {
      setTopElementInjected(true);
      setTopElementHeight(0);
      document.body.style.paddingTop = '0px';
      document.body.style.transition = 'none';

      const timer = setTimeout(() => {
        clsTestStartTimeRef.current = performance.now();
        document.body.style.paddingTop = `${shiftDistancePx}px`;
        setTopElementHeight(shiftDistancePx);
      }, 600);

      return () => {
        clearTimeout(timer);
        if (!clsEnabled) {
          document.body.style.paddingTop = '0px';
        }
      };
    }
  }, [clsEnabled, initialContentReady, shiftDistancePx, clsParam, viewportHeight, viewportWidth, impactCorrection]);

  useEffect(() => {
    if (tbtDelay > 0) {
      const timer = setTimeout(() => blockMainThread(tbtDelay), 100);
      return () => clearTimeout(timer);
    }
  }, [tbtDelay]);

  useEffect(() => {
    if (ttiDelay > 0) {
      const timer = setTimeout(() => blockMainThread(ttiDelay), 500);
      return () => clearTimeout(timer);
    }
  }, [ttiDelay]);

  // Prevent default active state visual feedback
  const preventActiveState = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleClick = (id: string) => {
    if (inpDelay > 0) blockMainThread(inpDelay);
    setClickedButtons((prev) => ({ ...prev, [id]: true }));
  };

  const handleMainButtonClick = () => {
    if (inpDelay > 0) blockMainThread(inpDelay);
    setClickedMain((p) => !p);
  };

  const handleFollowClick = () => {
    if (inpDelay > 0) blockMainThread(inpDelay);
    setIsFollowing(!isFollowing);
  };

  const handleNewsletterClick = () => {
    if (inpDelay > 0) blockMainThread(inpDelay);
    setNewsletterSubscribed(true);
  };


  return (
    <div
      className="test-page min-vh-100"
      style={{
        backgroundColor: "#f8f9fa",
      }}
    >
      {contentVisible && (
        <>
          {clsEnabled && topElementInjected && topElementHeight > 0 && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: topElementHeight,
                width: '100vw',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div style={{ color: 'white', textAlign: 'center', padding: '1rem' }}>
                <h4 style={{ margin: 0 }}>🎯 Specjalna oferta!</h4>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Zapisz się na newsletter i otrzymaj 20% rabatu</p>
              </div>
            </div>
          )}

          <header
            className="container mt-4 mb-4"
            style={{ opacity: showLCP ? 1 : 0, visibility: showLCP ? 'visible' : 'hidden' }}
          >
          <h1 className="fw-bold display-5 mb-3">7 prostych nawyków, które zmienią Twoje życie na lepsze</h1>
          <p className="lead text-muted">
            Odkryj sprawdzone sposoby na poprawę samopoczucia, zwiększenie energii i osiągnięcie lepszej równowagi między pracą a życiem prywatnym.
          </p>
        </header>

        <main className="container pb-5">
            <div className="row g-4">
              <div className="col-12 col-lg-8">
                <article className="bg-white rounded p-4 shadow-sm">
                  <h3 className="h4 fw-bold mb-3">Małe kroki, wielkie zmiany</h3>
                  <p className="mb-3">Nie musisz całkowicie zmieniać swojego życia z dnia na dzień. Badania pokazują, że małe, konsekwentne nawyki mają znacznie większy wpływ na nasze samopoczucie niż radykalne zmiany, które trudno utrzymać.</p>

              <div className="d-flex gap-2 flex-wrap mb-4">
                {contentButtons.map((btn) => (
                  <button
                    key={btn}
                    className={`btn ${clickedButtons[btn] ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                    style={{ minWidth: 120 }}
                    onClick={() => handleClick(btn)}
                    onMouseDown={preventActiveState}
                  >
                    {btn === "Zapisz artykuł" && "🔖 "}
                    {btn === "Udostępnij" && "📤 "}
                    {btn === "Komentarze" && "💬 "}
                    {btn}
                    {clickedButtons[btn] && " ✓"}
                  </button>
                ))}
              </div>

              <button
                className="btn px-4"
                style={{ backgroundColor: "#ff6b6b", color: "white", border: "none" }}
                onClick={handleMainButtonClick}
                onMouseDown={preventActiveState}
              >
                {clickedMain ? "Zwiń listę ▲" : "Zobacz 7 nawyków ▼"}
              </button>

              {clickedMain && (
                <div className="mt-4 p-4 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                  <h4 className="h5 fw-bold mb-4">7 nawyków, które warto wprowadzić</h4>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-3">
                      <span className="fw-bold" style={{ color: "#ff6b6b" }}>1.</span>
                      <div>
                        <strong>Pij wodę zaraz po przebudzeniu</strong> - Nawodnienie organizmu rano poprawia metabolizm i dodaje energii na cały dzień.
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <span className="fw-bold" style={{ color: "#ff6b6b" }}>2.</span>
                      <div>
                        <strong>15 minut ruchu każdego dnia</strong> - Nawet krótki spacer lub rozciąganie znacząco poprawia samopoczucie i zdrowie.
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <span className="fw-bold" style={{ color: "#ff6b6b" }}>3.</span>
                      <div>
                        <strong>Jedz więcej warzyw i owoców</strong> - Kolorowe warzywa dostarczają witamin i minerałów niezbędnych do prawidłowego funkcjonowania.
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <span className="fw-bold" style={{ color: "#ff6b6b" }}>4.</span>
                      <div>
                        <strong>Regularny sen o stałych porach</strong> - Zasypianie i budzenie się o tej samej porze reguluje rytm dobowy.
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <span className="fw-bold" style={{ color: "#ff6b6b" }}>5.</span>
                      <div>
                        <strong>Ogranicz czas przed ekranem</strong> - Zwłaszcza wieczorem - niebieskie światło zakłóca produkcję melatoniny.
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <span className="fw-bold" style={{ color: "#ff6b6b" }}>6.</span>
                      <div>
                        <strong>Praktykuj wdzięczność</strong> - Zapisuj 3 rzeczy, za które jesteś wdzięczny - to poprawia nastrój i perspektywę.
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <span className="fw-bold" style={{ color: "#ff6b6b" }}>7.</span>
                      <div>
                        <strong>Spędzaj czas z bliskimi</strong> - Relacje społeczne są kluczowe dla zdrowia psychicznego i długowieczności.
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </article>
              </div>

              <aside className="col-12 col-lg-4">
                {/* Sidebar content - rendered as part of FCP */}
                <div>
              {/* Author Card */}
              <div className="bg-white rounded p-4 shadow-sm mb-3">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted">O autorce</h6>
                <div className="text-center">
                  <img
                    src="https://ui-avatars.com/api/?name=Anna+Nowak&background=ff6b6b&color=fff&size=80"
                    alt="Autor"
                    className="rounded-circle mb-3"
                    width="80"
                    height="80"
                  />
                  <h6 className="fw-bold mb-1">Anna Nowak</h6>
                  <p className="text-muted small mb-3">Trenerka stylu życia i wellness. Pomaga ludziom wprowadzać pozytywne zmiany w codziennym życiu.</p>
                  <button
                    className="btn btn-sm w-100"
                    style={{
                      backgroundColor: isFollowing ? "#6c757d" : "#ff6b6b",
                      color: "white",
                      border: "none"
                    }}
                    onClick={handleFollowClick}
                    onMouseDown={preventActiveState}
                  >
                    {isFollowing ? "Obserwujesz ✓" : "Obserwuj"}
                  </button>
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-white rounded p-4 shadow-sm mb-3">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted">Powiązane artykuły</h6>
                <div className="d-flex flex-column gap-2">
                  {sidebarItems.map((item, idx) => (
                    <div key={item} className="border-bottom pb-2">
                      <button
                        className="btn btn-link text-decoration-none text-dark p-0 text-start w-100"
                        onClick={() => handleClick(item)}
                        onMouseDown={preventActiveState}
                      >
                        <div className="d-flex align-items-start gap-2">
                          <span className="badge bg-primary rounded-circle" style={{ width: 24, height: 24, paddingTop: 4 }}>{idx + 1}</span>
                          <span className="flex-grow-1">{item}</span>
                          {clickedButtons[item] && <span className="text-success">✓</span>}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="newsletter-box text-white rounded p-4 shadow-sm mb-3" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <h6 className="fw-bold mb-2">📧 Newsletter</h6>
                <p className="small mb-3">Otrzymuj inspirujące artykuły o zdrowiu i stylu życia prosto na swoją skrzynkę!</p>
                <input type="email" className="form-control form-control-sm mb-2" placeholder="Twój email" />
                <button
                  className="btn btn-sm w-100"
                  style={{
                    backgroundColor: newsletterSubscribed ? "#28a745" : "#f8f9fa",
                    color: newsletterSubscribed ? "white" : "#212529",
                    borderColor: newsletterSubscribed ? "#28a745" : "#f8f9fa"
                  }}
                  onClick={handleNewsletterClick}
                  onMouseDown={preventActiveState}
                >
                  {newsletterSubscribed ? "Zapisano! ✓" : "Zapisz się"}
                </button>
              </div>
            </div>
          </aside>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default TestPage; // Fixed FCP implementation
