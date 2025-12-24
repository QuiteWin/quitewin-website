import Hero from "@/components/landing/Hero";
import HybridToggle from "@/components/landing/HybridToggle";
import VisibilityDemo from "@/components/landing/VisibilityDemo";
import GhostDemo from "@/components/landing/GhostDemo";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Comparison from "@/components/landing/Comparison";
import Support from "@/components/landing/Support";
import Footer from "@/components/landing/Footer";
import ThemeToggle from "@/components/landing/ThemeToggle";
import GhostCursor from "@/components/landing/GhostCursor";
import LogoLoop from "@/components/landing/LogoLoop";
import Dock from "@/components/landing/Dock";
import MiniGame from "@/components/landing/MiniGame";
import StealthScore from "@/components/landing/StealthScore";
import ScreenShareScanner from "@/components/landing/ScreenShareScanner";
import { PanicProvider } from "@/components/landing/PanicMode";
import StealthTimeline from "@/components/landing/StealthTimeline";
import { TrustModeProvider, TrustModeToggle } from "@/components/landing/TrustMode";
import { SilenceModeProvider, SilenceModeToggle } from "@/components/landing/SilenceMode";
import EasterEggs from "@/components/landing/EasterEggs";
import SystemSignalHUD from "@/components/landing/SystemSignalHUD";
import ExitMoment from "@/components/landing/ExitMoment";
import SessionCodename from "@/components/landing/SessionCodename";
import { ObserverModeProvider, ObserverModeToggle } from "@/components/landing/ObserverMode";
import { IdleProvider } from "@/components/landing/IdleBehavior";
import TrustProof from "@/components/landing/TrustProof";
import SelfDestruct from "@/components/landing/SelfDestruct";
import PhilosophicalClose from "@/components/landing/PhilosophicalClose";
import LetterGlitch from "@/components/landing/LetterGlitch";

const Index = () => {
  return (
    <TrustModeProvider>
      <SilenceModeProvider>
        <ObserverModeProvider>
          <IdleProvider>
            <PanicProvider>
              <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
                {/* Ambient Background Layer */}
                <LetterGlitch opacity={0.07} glitchSpeed={60} />
                
                {/* Global Effects */}
                <GhostCursor />
                <ScreenShareScanner />
                <EasterEggs />
                <ExitMoment />
                
                {/* Fixed UI Elements */}
                <ThemeToggle />
                <TrustModeToggle />
                <SilenceModeToggle />
                <ObserverModeToggle />
                <Dock />
                <StealthScore />
                <SystemSignalHUD />
                <SessionCodename />
                <SelfDestruct />
                
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

                {/* Content */}
                <div className="relative z-10">
                  <Hero />
                  <LogoLoop />
                  <VisibilityDemo />
                  <HybridToggle />
                  <GhostDemo />
                  <StealthTimeline />
                  <Features />
                  <MiniGame />
                  <UseCases />
                  <Comparison />
                  <TrustProof />
                  <Support />
                  <Footer />
                  <PhilosophicalClose />
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
