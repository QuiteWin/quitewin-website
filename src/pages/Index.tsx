import { lazy, Suspense, useState, useEffect, memo } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/landing/Hero";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { PanicProvider } from "@/components/landing/PanicMode";
import { TrustModeProvider } from "@/components/landing/TrustMode";
import { SilenceModeProvider } from "@/components/landing/SilenceMode";
import { ObserverModeProvider } from "@/components/landing/ObserverMode";
import { IdleProvider } from "@/components/landing/IdleBehavior";
import { AmbientProvider } from "@/components/landing/AmbientProvider";
import ModeBar from "@/components/landing/ModeBar";
import LoadingScreen from "@/components/landing/LoadingScreen";
import SectionLoader from "@/components/landing/SectionLoader";
import useRandomTheme from "@/hooks/useRandomTheme";

// Premium interaction components
import { CursorGlow } from "@/components/landing/CursorAwareness";
import { FloatingAccents } from "@/components/landing/DepthParallax";
import { FocusModeOverlay, FocusIndicator } from "@/components/landing/FocusMode";
import { PageBreath, SectionPulse } from "@/components/landing/SignatureMoment";
import { SmartMicrocopy, ScrollWhisper } from "@/components/landing/SmartMicrocopy";
import { EasterEggSystem } from "@/components/landing/EasterEggSystem";

// Lazy load components - grouped by priority
const LetterGlitch = lazy(() => import("@/components/landing/LetterGlitch"));
const AmbientSound = lazy(() => import("@/components/landing/AmbientSound").then(m => ({ default: m.AmbientSound })));

// Below-fold sections
const LogoLoop = lazy(() => import("@/components/landing/LogoLoop"));
const VisibilityDemo = lazy(() => import("@/components/landing/VisibilityDemo"));
const HybridToggle = lazy(() => import("@/components/landing/HybridToggle"));
const GhostDemo = lazy(() => import("@/components/landing/GhostDemo"));
const Features = lazy(() => import("@/components/landing/Features"));
const USPs = lazy(() => import("@/components/landing/USPs"));
const DailyDriver = lazy(() => import("@/components/landing/DailyDriver"));
const FeatureBreakdown = lazy(() => import("@/components/landing/FeatureBreakdown"));
const WhyBuy = lazy(() => import("@/components/landing/WhyBuy"));
const UseCases = lazy(() => import("@/components/landing/UseCases"));
const Comparison = lazy(() => import("@/components/landing/Comparison"));
const Support = lazy(() => import("@/components/landing/Support"));
const Footer = lazy(() => import("@/components/landing/Footer"));
const StealthTimeline = lazy(() => import("@/components/landing/StealthTimeline"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const TrustProof = lazy(() => import("@/components/landing/TrustProof"));
const PhilosophicalClose = lazy(() => import("@/components/landing/PhilosophicalClose"));
const MiniGame = lazy(() => import("@/components/landing/MiniGame"));
const SecurityLayers = lazy(() => import("@/components/landing/SecurityLayers"));

// Heavy optional elements - load last
const GhostRobotDuo = lazy(() => import("@/components/landing/GhostRobotDuo"));
const GhostCursor = lazy(() => import("@/components/landing/GhostCursor"));
const Dock = lazy(() => import("@/components/landing/Dock"));
const StealthScore = lazy(() => import("@/components/landing/StealthScore"));
const SystemSignalHUD = lazy(() => import("@/components/landing/SystemSignalHUD"));
const ScreenShareScanner = lazy(() => import("@/components/landing/ScreenShareScanner"));
const EasterEggs = lazy(() => import("@/components/landing/EasterEggs"));
const ExitMoment = lazy(() => import("@/components/landing/ExitMoment"));
const SelfDestruct = lazy(() => import("@/components/landing/SelfDestruct"));

// Memoized background component with parallax support
const BackgroundLayers = memo(() => (
  <>
    <div className="fixed inset-0 grid-pattern pointer-events-none" />
    <div className="fixed inset-0 noise-overlay pointer-events-none" />
    <div 
      className="fixed top-0 left-0 w-full h-[50vh] pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at top, hsl(var(--neon-purple) / 0.08) 0%, transparent 60%)"
      }}
    />
    <div 
      className="fixed bottom-0 left-0 w-full h-[30vh] pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at bottom, hsl(var(--neon-green) / 0.05) 0%, transparent 60%)"
      }}
    />
  </>
));
BackgroundLayers.displayName = "BackgroundLayers";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showHeavyElements, setShowHeavyElements] = useState(false);
  
  // Apply random color theme on each page load
  useRandomTheme();

  useEffect(() => {
    // Quick initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Delay heavy elements
    const heavyTimer = setTimeout(() => {
      setShowHeavyElements(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(heavyTimer);
    };
  }, []);

  return (
    <AmbientProvider>
      <TrustModeProvider>
        <SilenceModeProvider>
          <ObserverModeProvider>
            <IdleProvider>
              <PanicProvider>
                {/* Centered Loading Screen */}
                <AnimatePresence mode="wait">
                  {isLoading && <LoadingScreen key="loading" />}
                </AnimatePresence>

                <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
                  {/* Signature page breath effect */}
                  <PageBreath />
                  <SectionPulse />
                  
                  {/* Cursor awareness glow */}
                  <CursorGlow />
                  
                  {/* Focus mode overlay */}
                  <FocusModeOverlay />
                  
                  {/* Floating parallax accents */}
                  <FloatingAccents />
                  
                  {/* Scroll whisper text */}
                  <ScrollWhisper />
                  
                  {/* Modular Easter Egg System */}
                  <EasterEggSystem />
                  
                  {/* Optimized ambient background */}
                  <Suspense fallback={null}>
                    <LetterGlitch opacity={0.06} glitchSpeed={50} />
                  </Suspense>
                  
                  {/* Heavy effects - delayed load */}
                  {showHeavyElements && (
                    <Suspense fallback={null}>
                      <GhostRobotDuo />
                      <GhostCursor />
                      <ScreenShareScanner />
                      <EasterEggs />
                      <ExitMoment />
                      <AmbientSound />
                    </Suspense>
                  )}
                  
                  {/* Essential UI Elements */}
                  <ThemeToggle />
                  <ModeBar />
                  
                  {/* Focus indicator */}
                  <FocusIndicator />
                  
                  {/* Smart microcopy - top right */}
                  <div className="fixed top-4 right-24 z-50 hidden md:block">
                    <SmartMicrocopy />
                  </div>
                  
                  {/* Secondary UI - delayed */}
                  {showHeavyElements && (
                    <Suspense fallback={null}>
                      <StealthScore />
                      <SystemSignalHUD />
                      <SelfDestruct />
                    </Suspense>
                  )}
                  
                  {/* Static backgrounds - memoized */}
                  <BackgroundLayers />

                  {/* Content sections - Blueprint Order */}
                  <div className="relative z-10">
                    {/* 1. Hero Section */}
                    <Hero />
                    
                    {/* Logo Loop / Partners */}
                    <Suspense fallback={<SectionLoader />}>
                      <LogoLoop />
                    </Suspense>
                    
                    {/* 2. The Reveal - What You See vs What They See */}
                    <Suspense fallback={<SectionLoader />}>
                      <VisibilityDemo />
                    </Suspense>
                    
                    {/* 3. The Big Four USPs */}
                    <Suspense fallback={<SectionLoader />}>
                      <USPs />
                    </Suspense>
                    
                    {/* 4. Interactive Demo - Magnetic HUD */}
                    <Suspense fallback={<SectionLoader />}>
                      <HybridToggle />
                      <GhostDemo />
                    </Suspense>
                    
                    {/* 5. Daily Driver - Productivity Pivot */}
                    <Suspense fallback={<SectionLoader />}>
                      <DailyDriver />
                    </Suspense>
                    
                    {/* 6. Five Layers of Protection */}
                    <Suspense fallback={<SectionLoader />}>
                      <SecurityLayers />
                    </Suspense>
                    
                    {/* 7. Comparison - QuiteWin vs The Others */}
                    <Suspense fallback={<SectionLoader />}>
                      <Comparison />
                    </Suspense>
                    
                    {/* 8. ROI / Why Buy */}
                    <Suspense fallback={<SectionLoader />}>
                      <WhyBuy />
                    </Suspense>
                    
                    {/* Additional sections */}
                    <Suspense fallback={<SectionLoader />}>
                      <FeatureBreakdown />
                      <StealthTimeline />
                      <Features />
                      <HowItWorks />
                    </Suspense>
                    
                    <Suspense fallback={<SectionLoader />}>
                      <MiniGame />
                      <UseCases />
                      <TrustProof />
                    </Suspense>
                    
                    {/* 9. Footer */}
                    <Suspense fallback={<SectionLoader />}>
                      <Support />
                      <Footer />
                      <Dock />
                      <PhilosophicalClose />
                    </Suspense>
                  </div>
                </main>
              </PanicProvider>
            </IdleProvider>
          </ObserverModeProvider>
        </SilenceModeProvider>
      </TrustModeProvider>
    </AmbientProvider>
  );
};

export default Index;