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

  /* CLS - Cumulative Layout Shift
   *
   * Fundamentalne pojęcie: "Przesuwający się element"
   * - Każdy element DOM ma pozycję (X, Y) na stronie
   * - Przesunięcie układu = zmiana położenia elementu względem początku dokumentu
   *   między kolejnymi wyrenderowanymi klatkami
   * - Monitorowane przez Layout Shift API
   *
   * Wartość przesunięcia = Impact Fraction × Distance Fraction
   *
   * Impact Fraction (współczynnik wpływu):
   *   - Określa, jaką część obszaru widzenia (viewport) zajmuje niestabilny element
   *   - Jest to unia widocznych obszarów wszystkich niestabilnych elementów w obu klatkach
   *
   * Distance Fraction (współczynnik dystansu):
   *   - Określa, jak daleko element przesunął się względem swojej pozycji początkowej
   *   - Jest to maksymalna odległość, jaką przesunął się dowolny niestabilny element
   *     (jako ułamek wysokości viewport)
   *
   * Przyczyny wysokiego CLS:
   * 1. Opóźnione ładowanie zasobów (obrazy, wideo, skrypty JS)
   * 2. Brak zarezerwowanej przestrzeni dla elementów multimedialnych
   * 3. Późno wykonywane skrypty JavaScript modyfikujące DOM po początkowym renderowaniu
   *
   * W tej implementacji:
   * - Parametr URL 'cls' bezpośrednio określa docelową wartość CLS (np. cls=0.15)
   * - Element reklamy zajmuje pełną szerokość viewportu (Impact Fraction ≈ 1.0)
   * - Wysokość reklamy = cls × wysokość viewportu (Distance Fraction = cls)
   * - Wynik: CLS ≈ 1.0 × cls = cls
   */
  const clsEnabled = clsParam > 0;

  // CLS - Obliczanie przesunięcia z korekcją szerokości viewport
  //
  // Problem: Impact Fraction zależy od SZEROKOŚCI treści względem viewport
  //
  // Na mobile (430px szerokości):
  // - Kontener Bootstrap zajmuje ~100% szerokości viewport
  // - Impact Fraction ≈ 1.0
  // - CLS = 1.0 × Distance Fraction = Distance Fraction
  //
  // Na desktop (1536px szerokości):
  // - Kontener Bootstrap ma max-width ~1140px
  // - Zajmuje tylko ~74% szerokości viewport
  // - Impact Fraction ≈ 0.457 (empirycznie zmierzone)
  // - CLS = 0.457 × Distance Fraction
  // - Aby uzyskać docelowe CLS, musimy zwiększyć Distance Fraction
  //
  // Rozwiązanie: Współczynnik korekcyjny bazujący na szerokości viewport
  // - Mobile/Tablet (≤ 768px): współczynnik = 1.0 (brak korekcji)
  // - Desktop (> 768px): współczynnik = 2.19 (1 / 0.457)
  //
  // Wzór końcowy:
  // shiftDistancePx = clsParam × viewportHeight × correctionFactor
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // Dynamiczny współczynnik korekcyjny bazujący na szerokości viewport
  //
  // Problem: Impact Fraction zależy od stosunku szerokości contenera do viewport
  // Bootstrap container ma max-width, który ogranicza szerokość treści
  //
  // Empiryczne pomiary Impact Fraction (rzeczywisty CLS / Distance Fraction):
  // Test 1 - Mobile (430px): CLS = 0.2000 / 0.2000 → Impact = 1.00 → correction = 1.00 ✅
  // Test 2 - Tablet (819px): CLS = 0.1859 / 0.2150 → Impact = 0.86 → correction = 1.16
  // Test 3 - Medium desktop (1280px): CLS = 0.2527 / 0.2660 → Impact = 0.95 → correction = 1.05
  // Test 4 - Large desktop (1536px): CLS = 0.1526 / 0.3340 → Impact = 0.457 → correction = 2.19
  //
  // Strategia: Breakpointy z empirycznie zmierzonymi wartościami
  const getImpactCorrectionFactor = (width: number): number => {
    if (width <= 768) {
      // Mobile/Small Tablet: treść zajmuje ~100% szerokości
      // Impact ≈ 1.0
      return 1.0;
    } else if (width <= 1000) {
      // Tablet/Small desktop: treść zajmuje ~86% szerokości
      // Impact ≈ 0.86 → correction = 1.16
      return 1.16;
    } else if (width <= 1400) {
      // Medium desktop: treść zajmuje ~95% szerokości
      // Impact ≈ 0.95 → correction = 1.05
      return 1.05;
    } else if (width <= 1700) {
      // Large desktop: treść zajmuje ~46% szerokości
      // Impact ≈ 0.457 → correction = 2.19
      return 2.19;
    } else {
      // Very wide desktop: treść zajmuje mniej niż 46% szerokości
      // Impact < 0.457 → correction > 2.19
      return 2.5;
    }
  };

  const impactCorrection = getImpactCorrectionFactor(viewportWidth);
  const shiftDistancePx = clsEnabled
    ? viewportHeight * clsParam * impactCorrection
    : 0;

  const blockMainThread = (ms: number) => {
    const start = performance.now();
    while (performance.now() - start < ms) {}
  };

  // FCP: Controls when content becomes visible (user perception, not Lighthouse)
  const [contentVisible, setContentVisible] = useState(false);

  // LCP: Controls when the large hero image/header becomes visible
  const [showLCP, setShowLCP] = useState(false);

  // CLS: Controls padding-top based shift
  const [topElementInjected, setTopElementInjected] = useState(false);
  const [topElementHeight, setTopElementHeight] = useState(0);

  // CLS: Track if initial content is ready (to avoid early layout shifts)
  const [initialContentReady, setInitialContentReady] = useState(false);

  // CLS: Track when the test shift is about to happen
  const clsTestStartTimeRef = useRef<number | null>(null);

  // CLS: Track the measured CLS score
  const [measuredCLS, setMeasuredCLS] = useState<number>(0);

  const [clickedButtons, setClickedButtons] = useState<Record<string, boolean>>(
    {}
  );
  const [clickedMain, setClickedMain] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // TBT tracking state
  const [fcpTime, setFcpTime] = useState<number | null>(null);
  const [ttiTime, setTtiTime] = useState<number | null>(null);

  const contentButtons = ["Zapisz artykuł", "Udostępnij", "Komentarze"];
  const sidebarItems = ["10 najlepszych miejsc na wakacje", "Jak zaoszczędzić na zakupach", "Przepisy na szybki obiad"];

  /* Update viewport dimensions on resize */
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* FCP - First Contentful Paint
   *
   * IMPORTANT: FCP cannot be measured by Lighthouse in a controlled way
   * This implementation simulates USER PERCEPTION of slow FCP
   * - User sees blank page for fcpDelay ms
   * - Lighthouse will NOT measure this as FCP (technical limitation)
   * - This is CORRECT for UX research, NOT for Lighthouse metrics
   */
  useEffect(() => {
    if (fcpDelay > 0 && !clsEnabled) {
      console.log('[FCP] Simulating FCP delay for user perception:', fcpDelay, 'ms');
      const timer = setTimeout(() => {
        console.log('[FCP] Content now visible to user');
        setContentVisible(true);
      }, fcpDelay);
      return () => clearTimeout(timer);
    }
  }, [fcpDelay, clsEnabled]);
  useEffect(() => {
    if (clsEnabled) {
      // Dla CLS: renderuj treść natychmiast, ale poczekaj chwilę na stabilizację
      setShowLCP(true);
      setContentVisible(true);

      // KRYTYCZNE: Scroll do góry strony, aby CLS był mierzony prawidłowo
      // CLS liczy tylko widoczne elementy - jeśli strona jest scrollowana,
      // Impact Fraction będzie mniejszy!
      window.scrollTo(0, 0);

      // Daj przeglądarce czas na stabilizację layoutu przed rozpoczęciem pomiaru CLS
      // 1500ms zapewnia, że wszystkie wczesne przesunięcia wystąpią przed testem
      const stabilizationTimer = setTimeout(() => {
        // Upewnij się ponownie, że jesteśmy na górze
        window.scrollTo(0, 0);
        setInitialContentReady(true);
      }, 1500); // 1500ms na stabilizację - eliminuje wczesne przesunięcia

      return () => clearTimeout(stabilizationTimer);
    } else if (fcpDelay === 0) {
      setContentVisible(true);
    }
  }, [clsEnabled, fcpDelay]);

  /* LCP - Largest Contentful Paint
   * LCP is controlled by CSS visibility - element is in DOM but hidden
   *
   * IMPORTANT: LCP timer starts AFTER content is visible (after FCP)
   * - Wait for contentVisible = true
   * - Then start LCP timer
   * - Result: Total LCP time = FCP delay + LCP delay (correct!)
   */
  useEffect(() => {
    if (clsEnabled) {
      // Already set in FCP effect
      setShowLCP(true);
      return;
    }

    // Wait for content to be visible (FCP) before starting LCP timer
    if (!contentVisible) {
      return;
    }

    console.log('[LCP] Starting LCP timer for', lcpDelay, 'ms');
    const timer = setTimeout(() => {
      setShowLCP(true);
      console.log('[LCP] LCP element now visible');
    }, lcpDelay);
    return () => clearTimeout(timer);
  }, [lcpDelay, clsEnabled, contentVisible]);

  /* Monitor FCP using PerformanceObserver */
  useEffect(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcpTimestamp = entry.startTime;
            setFcpTime(fcpTimestamp);
            console.log('[TBT] FCP detected at:', fcpTimestamp, 'ms');
          }
        }
      });

      observer.observe({ type: 'paint', buffered: true });

      return () => observer.disconnect();
    } catch (e) {
      console.error('[TBT] PerformanceObserver for paint not supported:', e);
    }
  }, []);

  /* Monitor long tasks for TBT calculation */
  useEffect(() => {
    let tbtScore = 0;
    const longTasks: Array<{ start: number; duration: number; blockingTime: number }> = [];

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const taskStart = entry.startTime;
          const taskEnd = entry.startTime + entry.duration;
          const taskDuration = entry.duration;

          // Long task is > 50ms
          if (taskDuration > 50) {
            // Calculate blocking time: duration - 50ms
            const blockingTime = taskDuration - 50;

            // Only count tasks between FCP and TTI
            const isInWindow =
              (fcpTime === null || taskStart >= fcpTime) &&
              (ttiTime === null || taskEnd <= ttiTime);

            if (isInWindow) {
              tbtScore += blockingTime;
              longTasks.push({ start: taskStart, duration: taskDuration, blockingTime });

              console.log('[TBT] Long task detected:', {
                startTime: taskStart.toFixed(2),
                duration: taskDuration.toFixed(2),
                blockingTime: blockingTime.toFixed(2),
                fcpTime: fcpTime?.toFixed(2) || 'not yet',
                ttiTime: ttiTime?.toFixed(2) || 'not yet',
                inWindow: isInWindow,
                cumulativeTBT: tbtScore.toFixed(2)
              });
            } else {
              console.log('[TBT] Long task outside FCP→TTI window (ignored):', {
                startTime: taskStart.toFixed(2),
                duration: taskDuration.toFixed(2),
                fcpTime: fcpTime?.toFixed(2) || 'not yet',
                ttiTime: ttiTime?.toFixed(2) || 'not yet'
              });
            }
          }
        }
      });

      observer.observe({ type: 'longtask', buffered: true });

      return () => observer.disconnect();
    } catch (e) {
      console.error('[TBT] PerformanceObserver for longtask not supported:', e);
      console.log('[TBT] Note: Long Task API requires Chrome 58+ or Edge 79+');
    }
  }, [fcpTime, ttiTime]);

  /* Monitor layout shifts using PerformanceObserver
   *
   * CLS (Cumulative Layout Shift) - mierzy stabilność wizualną strony
   *
   * Fundamentalne pojęcia:
   * - "Przesuwający się element" - element DOM, który zmienia pozycję (X, Y) między klatkami
   * - Layout Shift API - monitoruje zmiany współrzędnych elementów widocznych w viewport
   *
   * Rozróżnienie przesunięć:
   * - NIEOCZEKIWANE (problematyczne): zakłócają interakcję użytkownika
   *   → hadRecentInput = false → LICZĄ SIĘ do CLS
   * - OCZEKIWANE (akceptowalne): reakcja na działanie użytkownika w ciągu 500ms
   *   → hadRecentInput = true → NIE LICZĄ SIĘ do CLS
   *
   * Wartość przesunięcia = Impact Fraction × Distance Fraction
   * - Impact Fraction: jaka część viewportu zajmuje niestabilny element
   * - Distance Fraction: jak daleko element się przesunął względem pozycji początkowej
   */
  useEffect(() => {
    let clsScore = 0;
    let shiftCount = 0;
    const layoutShifts: Array<{
      time: number;
      value: number;
      hadRecentInput: boolean;
    }> = [];

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          shiftCount++;
          const layoutShift = entry as any;

          // Rozróżnienie: przesunięcia nieoczekiwane vs oczekiwane
          if (!layoutShift.hadRecentInput) {
            // Sprawdź, czy to przesunięcie jest przed czy po rozpoczęciu testu CLS
            const isBeforeTest = clsTestStartTimeRef.current === null ||
                                 layoutShift.startTime < clsTestStartTimeRef.current;

            if (isBeforeTest) {
              // Przesunięcie przed testem - ignorujemy
              console.log('[CLS] Layout shift BEFORE test (ignored):', {
                time: layoutShift.startTime.toFixed(2),
                value: layoutShift.value.toFixed(4),
                hadRecentInput: layoutShift.hadRecentInput
              });
            } else {
              // NIEOCZEKIWANE przesunięcie - zakłóca interakcję użytkownika
              clsScore += layoutShift.value;
              layoutShifts.push({
                time: layoutShift.startTime,
                value: layoutShift.value,
                hadRecentInput: false
              });

              setMeasuredCLS(clsScore);

              console.log('[CLS] Layout shift detected (COUNTED):', {
                time: layoutShift.startTime.toFixed(2),
                value: layoutShift.value.toFixed(4),
                cumulativeCLS: clsScore.toFixed(4),
                expectedCLS: clsParam.toFixed(4),
                difference: (clsScore - clsParam).toFixed(4),
                hadRecentInput: layoutShift.hadRecentInput
              });
            }
          } else {
            console.log('[CLS] Layout shift with recent input (ignored):', {
              time: layoutShift.startTime.toFixed(2),
              value: layoutShift.value.toFixed(4),
              hadRecentInput: layoutShift.hadRecentInput
            });
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      return () => {
        observer.disconnect();
      };
    } catch (e) {
      console.error('[CLS] PerformanceObserver not supported:', e);
    }
  }, [clsParam]);

  /* CLS - Symulacja opóźnionego ładowania zasobów przez padding-top na body
   *
   * NOWA STRATEGIA: Dynamiczna zmiana padding-top na <body> zamiast na kontenerze
   *
   * Sekwencja zdarzeń:
   * 1. Strona renderuje się z body padding-top = 0
   * 2. Po 600ms padding-top zmienia się na shiftDistancePx
   * 3. Przeglądarka musi ponownie przeliczyć układ strony (reflow)
   * 4. CAŁA treść przesuwa się w dół o shiftDistancePx
   *
   * Dlaczego to powoduje CLS:
   * - Zmiana padding-top na body powoduje przesunięcie CAŁEJ treści
   * - Późna modyfikacja CSS po początkowym renderowaniu
   * - Przesunięcie NIE jest reakcją na interakcję użytkownika
   *
   * Obliczanie wysokości przesunięcia:
   * - clsParam: docelowa wartość CLS z URL (np. 0.15)
   * - shiftDistancePx: padding-top = clsParam × wysokość viewportu
   * - Impact Fraction = 1.0 (CAŁA treść na stronie się przesuwa)
   * - Distance Fraction = clsParam (przesunięcie / wysokość viewportu)
   * - Wynik: CLS = 1.0 × clsParam = clsParam ✓
   *
   * PRZEWAGA tego podejścia:
   * - padding-top na body przesuwa WSZYSTKO
   * - Impact Fraction jest zawsze 1.0 (niezależnie od szerokości kontenerów)
   * - Działa uniwersalnie na mobile i desktop
   * - Precyzyjna kontrola wartości CLS
   *
   * WAŻNE: Opóźnienie > 500ms zapewnia hadRecentInput = false
   * (przesunięcie nie jest traktowane jako reakcja na interakcję użytkownika)
   */
  useEffect(() => {
    if (clsEnabled && initialContentReady) {
      // Krok 1: Ustaw padding-top = 0 na body
      setTopElementInjected(true);
      setTopElementHeight(0);
      document.body.style.paddingTop = '0px';
      document.body.style.transition = 'none';

      // Krok 2: Po 600ms zmień padding-top na shiftDistancePx
      // KRYTYCZNE: Opóźnienie > 500ms zapewnia hadRecentInput = false
      const timer = setTimeout(() => {
        clsTestStartTimeRef.current = performance.now();
        console.log('[CLS] Setting body padding-top to:', shiftDistancePx, 'px');
        console.log('[CLS] Target CLS from URL:', clsParam);
        console.log('[CLS] Viewport dimensions:', viewportWidth, 'x', viewportHeight, 'px');
        console.log('[CLS] Impact correction factor:', impactCorrection);
        console.log('[CLS] Base shift (no correction):', (clsParam * viewportHeight).toFixed(2), 'px');
        console.log('[CLS] Corrected shift:', shiftDistancePx.toFixed(2), 'px');
        console.log('[CLS] Expected Distance Fraction:', (shiftDistancePx / viewportHeight).toFixed(4));
        console.log('[CLS] Expected CLS:', clsParam, '(after impact correction)');
        document.body.style.paddingTop = `${shiftDistancePx}px`;
        setTopElementHeight(shiftDistancePx);
      }, 600);

      return () => {
        clearTimeout(timer);
        // Reset body padding when component unmounts or CLS test completes
        if (!clsEnabled) {
          document.body.style.paddingTop = '0px';
        }
      };
    }
  }, [clsEnabled, initialContentReady, shiftDistancePx, clsParam, viewportHeight]);

  /* TBT - Create long tasks between FCP and TTI */
  useEffect(() => {
    if (tbtDelay > 0) {
      console.log('[TBT] Creating long task with duration:', tbtDelay, 'ms');

      // Wait a bit after FCP to create the long task
      const timer = setTimeout(() => {
        console.log('[TBT] Executing long task NOW');
        blockMainThread(tbtDelay);
        console.log('[TBT] Long task completed');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [tbtDelay]);

  /* TTI (Time to Interactive) - Mark when page becomes interactive */
  useEffect(() => {
    if (ttiDelay > 0) {
      console.log('[TTI] Will mark TTI after:', ttiDelay, 'ms');

      const timer = setTimeout(() => {
        // Block main thread to simulate work before TTI
        blockMainThread(ttiDelay);

        // Mark TTI time
        const ttiTimestamp = performance.now();
        setTtiTime(ttiTimestamp);
        console.log('[TTI] Page is now interactive at:', ttiTimestamp, 'ms');
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // If no TTI delay, mark TTI immediately after a short delay
      const timer = setTimeout(() => {
        const ttiTimestamp = performance.now();
        setTtiTime(ttiTimestamp);
        console.log('[TTI] Page is interactive (no delay) at:', ttiTimestamp, 'ms');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [ttiDelay]);

  // Prevent default active state visual feedback
  const preventActiveState = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleClick = (id: string) => {
    // INP
    if (inpDelay > 0) {
      blockMainThread(inpDelay);
    }
    setClickedButtons((prev) => ({ ...prev, [id]: true }));
  };

  const handleMainButtonClick = () => {
    // INP
    if (inpDelay > 0) {
      blockMainThread(inpDelay);
    }
    setClickedMain((p) => !p);
  };

  const handleFollowClick = () => {
    // INP
    if (inpDelay > 0) {
      blockMainThread(inpDelay);
    }
    setIsFollowing(!isFollowing);
  };

  const handleNewsletterClick = () => {
    // INP
    if (inpDelay > 0) {
      blockMainThread(inpDelay);
    }
    setNewsletterSubscribed(true);
  };


  return (
    <div
      className="test-page min-vh-100"
      style={{
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* FCP: Content is conditionally rendered based on contentVisible
          User sees blank page until contentVisible = true
          This simulates FCP delay for user perception (not Lighthouse) */}
      {contentVisible && (
        <>
          {/* CLS TEST ELEMENT - Wyświetlany na górze gdy CLS jest włączone
           * Używamy padding-top na głównym kontenerze zamiast wstrzykiwania elementu
           *
           * DLACZEGO padding-top zamiast elementu:
           * - padding-top przesuwa CAŁĄ treść (nie ma problemu z różną szerokością kontenerów)
           * - Działa uniwersalnie na mobile i desktop
           * - Impact Fraction zawsze ≈ 1.0 (cała widoczna treść się przesuwa)
           *
           * Element wizualny pokazywany jest tylko gdy height > 0
           */}
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
