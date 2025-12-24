import { lazy, Suspense, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/landing/Hero";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { PanicProvider } from "@/components/landing/PanicMode";
import { TrustModeProvider } from "@/components/landing/TrustMode";
import { SilenceModeProvider } from "@/components/landing/SilenceMode";
import { ObserverModeProvider } from "@/components/landing/ObserverMode";
import { IdleProvider } from "@/components/landing/IdleBehavior";
import ModeBar from "@/components/landing/ModeBar";
import LoadingScreen from "@/components/landing/LoadingScreen";
import SectionLoader from "@/components/landing/SectionLoader";

// Lazy load below-fold and heavy components with prefetch hints
const LogoLoop = lazy(() => import("@/components/landing/LogoLoop"));
const VisibilityDemo = lazy(() => import("@/components/landing/VisibilityDemo"));
const HybridToggle = lazy(() => import("@/components/landing/HybridToggle"));
const GhostDemo = lazy(() => import("@/components/landing/GhostDemo"));
const Features = lazy(() => import("@/components/landing/Features"));
const UseCases = lazy(() => import("@/components/landing/UseCases"));
const Comparison = lazy(() => import("@/components/landing/Comparison"));
const Support = lazy(() => import("@/components/landing/Support"));
const Footer = lazy(() => import("@/components/landing/Footer"));
const StealthTimeline = lazy(() => import("@/components/landing/StealthTimeline"));
const TrustProof = lazy(() => import("@/components/landing/TrustProof"));
const PhilosophicalClose = lazy(() => import("@/components/landing/PhilosophicalClose"));
const MiniGame = lazy(() => import("@/components/landing/MiniGame"));

// Lazy load heavy fixed elements
const GhostCursor = lazy(() => import("@/components/landing/GhostCursor"));
const LetterGlitch = lazy(() => import("@/components/landing/LetterGlitch"));
const Dock = lazy(() => import("@/components/landing/Dock"));
const StealthScore = lazy(() => import("@/components/landing/StealthScore"));
const SystemSignalHUD = lazy(() => import("@/components/landing/SystemSignalHUD"));
const ScreenShareScanner = lazy(() => import("@/components/landing/ScreenShareScanner"));
const EasterEggs = lazy(() => import("@/components/landing/EasterEggs"));
const ExitMoment = lazy(() => import("@/components/landing/ExitMoment"));
const SelfDestruct = lazy(() => import("@/components/landing/SelfDestruct"));

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prefetch critical components
    const prefetchComponents = async () => {
      // Minimal loading time for smooth animation
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 1200));
      
      // Prefetch above-fold essentials
      await Promise.all([
        import("@/components/landing/LetterGlitch"),
        import("@/components/landing/GhostCursor"),
        minLoadTime
      ]);
      
      setIsLoading(false);

      // Prefetch below-fold components after initial load
      requestIdleCallback(() => {
        import("@/components/landing/LogoLoop");
        import("@/components/landing/VisibilityDemo");
        import("@/components/landing/HybridToggle");
        import("@/components/landing/Features");
      });
    };

    prefetchComponents();
  }, []);

  return (
    <TrustModeProvider>
      <SilenceModeProvider>
        <ObserverModeProvider>
          <IdleProvider>
            <PanicProvider>
              {/* Loading Screen */}
              <AnimatePresence mode="wait">
                {isLoading && <LoadingScreen key="loading" />}
              </AnimatePresence>

              <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
                {/* Ambient Background Layer - lazy loaded */}
                <Suspense fallback={null}>
                  <LetterGlitch opacity={0.07} glitchSpeed={60} />
                </Suspense>
                
                {/* Global Effects - lazy loaded */}
                <Suspense fallback={null}>
                  <GhostCursor />
                  <ScreenShareScanner />
                  <EasterEggs />
                  <ExitMoment />
                </Suspense>
                
                {/* Fixed UI Elements */}
                <ThemeToggle />
                <ModeBar />
                <Suspense fallback={null}>
                  <Dock />
                  <StealthScore />
                  <SystemSignalHUD />
                  <SelfDestruct />
                </Suspense>
                
                {/* Grid pattern background */}
                <div className="fixed inset-0 grid-pattern pointer-events-none" />
                
                {/* Noise overlay */}
                <div className="fixed inset-0 noise-overlay pointer-events-none" />
                
                {/* Gradient overlays */}
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

                {/* Content - lazy loaded sections */}
                <div className="relative z-10">
                  <Hero />
                  <Suspense fallback={<SectionLoader />}>
                    <LogoLoop />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <VisibilityDemo />
                    <HybridToggle />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <GhostDemo />
                    <StealthTimeline />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <Features />
                    <MiniGame />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <UseCases />
                    <Comparison />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <TrustProof />
                    <Support />
                    <Footer />
                    <PhilosophicalClose />
                  </Suspense>
                </div>
              </main>
            </PanicProvider>
          </IdleProvider>
        </ObserverModeProvider>
      </SilenceModeProvider>
    </TrustModeProvider>
  );
};

export default Index;
