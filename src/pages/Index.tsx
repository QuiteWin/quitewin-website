import Hero from "@/components/landing/Hero";
import HybridToggle from "@/components/landing/HybridToggle";
import GhostDemo from "@/components/landing/GhostDemo";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Comparison from "@/components/landing/Comparison";
import Support from "@/components/landing/Support";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Grid pattern background */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      
      {/* Noise overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none" />
      
      {/* Gradient overlays */}
      <div 
        className="fixed top-0 left-0 w-full h-[50vh] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, hsl(263 70% 66% / 0.08) 0%, transparent 60%)"
        }}
      />
      <div 
        className="fixed bottom-0 left-0 w-full h-[30vh] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom, hsl(160 84% 39% / 0.05) 0%, transparent 60%)"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <HybridToggle />
        <GhostDemo />
        <Features />
        <UseCases />
        <Comparison />
        <Support />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
