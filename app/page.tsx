"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Hook for scroll-triggered animations
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated section wrapper
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [wasteCount, setWasteCount] = useState(92000000);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCount((prev) => prev + 3);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  // FAQ data
  const faqs = [
    {
      q: "What types of damage can RETHREAD detect?",
      a: "Our AI can identify tears, holes, stains, loose seams, worn fabric, missing buttons, broken zippers, and more. It works on most fabric types including cotton, denim, silk, and synthetics.",
    },
    {
      q: "How does the repair matching work?",
      a: "After scanning your garment, our AI generates multiple repair options — from simple DIY fixes to professional-grade repairs. If you choose vendor repair, we match you with local tailors who specialize in that type of fix.",
    },
    {
      q: "Can I repair it myself?",
      a: "Absolutely! Every repair plan includes DIY instructions with difficulty ratings. Basic repairs like button replacement or small tears are perfect for beginners. We believe everyone can learn to mend.",
    },
    {
      q: "Why repair instead of buying new?",
      a: "Repairing extends the life of your clothes by years, keeps textiles out of landfills, reduces carbon emissions from manufacturing, and saves you money. One repair can prevent 20+ kg of CO₂ emissions.",
    },
  ];

  // Impact scenarios
  const impactScenarios = [
    {
      icon: "👕",
      item: "One T-Shirt",
      co2: "20 kg CO₂",
      water: "2,700L water",
      desc: "Repairing instead of replacing one cotton t-shirt saves the equivalent of driving 80km.",
    },
    {
      icon: "👖",
      item: "One Pair of Jeans",
      co2: "33 kg CO₂",
      water: "7,500L water",
      desc: "A single pair of jeans uses enough water for one person to drink for 7 years.",
    },
    {
      icon: "🧥",
      item: "One Jacket",
      co2: "39 kg CO₂",
      water: "3,000L water",
      desc: "Extending a jacket's life by just 9 months reduces its carbon footprint by 20-30%.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      {/* ============================================ */}
      {/* NAV BAR */}
      {/* ============================================ */}
      <nav
        className="bg-white border-b-2 sticky top-0 z-50"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-sm"
                style={{ background: "#124191" }}
              >
                <span className="text-white text-lg font-bold">R</span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold tracking-wider leading-none font-pixel"
                  style={{ color: "#1A1A1A" }}
                >
                  RETHREAD
                </span>
                <span
                  className="text-[10px] tracking-widest"
                  style={{ color: "#A1A1C2" }}
                >
                  × NOKIA INNOVATION
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/scan"
                className="text-sm font-bold tracking-wider px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors hidden sm:block"
                style={{ color: "#124191" }}
              >
                SCAN
              </Link>
              <Link
                href="/profile"
                className="text-sm font-bold tracking-wider px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors hidden sm:block"
                style={{ color: "#124191" }}
              >
                PROFILE
              </Link>
              <Link href="/scan">
                <Button className="nokia-btn nokia-btn-primary px-5 py-2 text-xs tracking-wider font-pixel rounded-sm">
                  TRY IT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO SECTION - Mission Driven */}
      {/* ============================================ */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className={`transition-all duration-700 ${
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Hero Card */}
            <div className="tech-card mb-8">
              <div className="tech-card-header">/// OUR_MISSION</div>
              <div className="tech-card-body p-6 md:p-10 text-center dot-grid-bg-white">
                {/* Mission Badge */}
                <div className="flex justify-center mb-6">
                  <div className="tech-badge tech-badge-green">
                    <span className="mr-2">🌍</span>
                    BUILDING FOR A SUSTAINABLE FUTURE
                  </div>
                </div>

                {/* THE TAGLINE */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight font-pixel">
                  <span style={{ color: "#124191" }}>REPAIR.</span>{" "}
                  <span style={{ color: "#166534" }}>REUSE.</span>{" "}
                  <span style={{ color: "#DC2626" }}>REDUCE.</span>
                </h1>

                {/* Mission Statement */}
                <p
                  className="text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-mono-tech"
                  style={{ color: "#4B5563" }}
                >
                  <strong style={{ color: "#1A1A1A" }}>
                    What if your next repair could help save the planet?
                  </strong>
                  <br />
                  <br />
                  Scan any damaged garment, get a professional repair plan, and
                  connect with local tailors who can bring it back to life.
                </p>

                {/* CTA */}
                <Link href="/scan">
                  <Button className="nokia-btn nokia-btn-primary px-8 py-5 text-base tracking-wider font-pixel rounded-sm">
                    TRY THE SCANNER →
                  </Button>
                </Link>
                <p
                  className="text-sm mt-4 font-mono-tech"
                  style={{ color: "#A1A1C2" }}
                >
                  Every repair counts. Every item saved matters.
                </p>
              </div>
            </div>

            {/* Preview Window */}
            <div className="tech-card">
              <div className="tech-card-header flex items-center justify-between">
                <span>/// HOW_IT_WORKS</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse-tech"
                    style={{ background: "#22C55E" }}
                  />
                  <span className="text-[10px]">AI POWERED</span>
                </div>
              </div>

              <div className="lcd-display p-4">
                <div className="aspect-video flex items-center justify-center relative">
                  {/* Grid overlay */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(18, 65, 145, 0.2) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(18, 65, 145, 0.2) 1px, transparent 1px)
                      `,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Shirt Visual */}
                  <div
                    className="w-28 h-32 relative z-10"
                    style={{
                      background:
                        "linear-gradient(180deg, #6B7280 0%, #4B5563 100%)",
                      clipPath:
                        "polygon(20% 0%, 80% 0%, 85% 10%, 100% 10%, 100% 100%, 0% 100%, 0% 10%, 15% 10%)",
                      border: "2px solid #1A1A1A",
                    }}
                  >
                    <div
                      className="absolute top-5 left-2 w-5 h-4 animate-pulse-tech"
                      style={{
                        border: "2px dashed #DC2626",
                        background: "rgba(220, 38, 38, 0.1)",
                      }}
                    />
                    <div
                      className="absolute bottom-10 right-2 w-4 h-3 animate-pulse-tech"
                      style={{
                        border: "2px dashed #124191",
                        background: "rgba(18, 65, 145, 0.1)",
                      }}
                    />
                  </div>

                  <div
                    className="absolute top-3 left-3 text-xs font-mono-tech flex items-center gap-2"
                    style={{ color: "#1A1A1A" }}
                  >
                    <span className="animate-blink-cursor">▶</span> ANALYZING...
                  </div>
                  <div
                    className="absolute top-3 right-3 text-xs font-bold font-mono-tech"
                    style={{ color: "#166534" }}
                  >
                    ✓ REPAIRABLE
                  </div>
                  <div
                    className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] font-mono-tech"
                    style={{ color: "#4B5563" }}
                  >
                    <span>COTTON_BLEND</span>
                    <span style={{ color: "#DC2626" }}>2 DAMAGE ZONES</span>
                  </div>
                </div>
              </div>

              <div
                className="p-4 flex items-center gap-4 bg-white border-t-2"
                style={{ borderColor: "#1A1A1A" }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0 rounded-sm"
                  style={{ background: "#DCFCE7", border: "2px solid #166534" }}
                >
                  <span className="text-lg">✓</span>
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-bold tracking-wider font-mono-tech"
                    style={{ color: "#166534" }}
                  >
                    REPAIR PLAN GENERATED
                  </p>
                  <p
                    className="text-sm font-mono-tech"
                    style={{ color: "#4B5563" }}
                  >
                    Visible mending + seam repair •{" "}
                    <strong>Saves ~20kg CO₂</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* THE PROBLEM - Why This Matters */}
      {/* ============================================ */}
      <AnimatedSection className="py-16 px-6 relative overflow-hidden">
        {/* Crisis Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #DC2626 0px,
              #DC2626 2px,
              transparent 2px,
              transparent 20px
            )`,
          }}
        />

        <div className="max-w-5xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm mb-4"
              style={{
                background: "#DC2626",
                border: "2px solid #991B1B",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#FEF2F2" }}
              />
              <span className="text-white text-xs font-bold tracking-widest font-pixel">
                CRITICAL ALERT
              </span>
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#FEF2F2" }}
              />
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              Fashion&apos;s Hidden Crisis
            </h2>
            <p className="text-sm font-mono-tech" style={{ color: "#6B7280" }}>
              The numbers that the industry doesn&apos;t want you to see
            </p>
          </div>

          {/* Live Waste Counter - Hero Element */}
          <div className="tech-card mb-8">
            <div
              className="tech-card-header flex items-center justify-between"
              style={{ background: "#DC2626" }}
            >
              <span>/// LIVE_WASTE_COUNTER</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#FEF2F2" }}
                />
                <span className="text-[10px]">REAL-TIME</span>
              </div>
            </div>
            <div
              className="p-8 text-center relative"
              style={{
                background: "linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)",
              }}
            >
              {/* Scanlines Effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
                }}
              />

              <p
                className="text-xs font-mono-tech mb-4 tracking-widest"
                style={{ color: "#A1A1C2" }}
              >
                TEXTILE WASTE THIS YEAR (TONNES)
              </p>

              {/* Main Counter Display */}
              <div
                className="text-5xl sm:text-6xl md:text-7xl font-bold font-pixel mb-4 relative"
                style={{
                  color: "#DC2626",
                  textShadow: "0 0 30px rgba(220, 38, 38, 0.5)",
                }}
              >
                {formatNumber(wasteCount)}
              </div>

              {/* Sub-stats Row */}
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className="text-2xl animate-bounce"
                    style={{ animationDuration: "2s" }}
                  >
                    🚛
                  </span>
                  <div className="text-left">
                    <p
                      className="text-lg font-bold font-pixel"
                      style={{ color: "#FF6B6B" }}
                    >
                      +1
                    </p>
                    <p
                      className="text-[10px] font-mono-tech"
                      style={{ color: "#6B7280" }}
                    >
                      truck/second
                    </p>
                  </div>
                </div>
                <div className="w-px h-10" style={{ background: "#4B5563" }} />
                <div className="text-center">
                  <p
                    className="text-sm font-mono-tech"
                    style={{ color: "#FEF2F2" }}
                  >
                    That&apos;s{" "}
                    <span className="font-bold" style={{ color: "#DC2626" }}>
                      {Math.floor(wasteCount / 86400).toLocaleString()}
                    </span>{" "}
                    trucks today alone
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Improved Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: "🌡️",
                stat: "10%",
                label: "Global CO₂ Emissions",
                detail: "More than aviation + shipping",
                isAlert: true,
              },
              {
                icon: "💧",
                stat: "93B m³",
                label: "Water Used Yearly",
                detail: "Could fill 37M Olympic pools",
                isAlert: true,
              },
              {
                icon: "👔",
                stat: "100B",
                label: "Items Made Per Year",
                detail: "12 items per person on Earth",
                isAlert: true,
              },
              {
                icon: "🔧",
                stat: "73%",
                label: "Could Be Repaired",
                detail: "Simple fixes, big impact",
                isAlert: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-sm transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default"
                style={{
                  background: item.isAlert ? "#1A1A1A" : "#166534",
                  border: `2px solid ${item.isAlert ? "#DC2626" : "#22C55E"}`,
                }}
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: item.isAlert
                      ? "radial-gradient(circle at center, rgba(220, 38, 38, 0.2) 0%, transparent 70%)"
                      : "radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%)",
                  }}
                />

                <div className="p-4 relative">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    {item.isAlert && (
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "#DC2626" }}
                      />
                    )}
                  </div>
                  <p
                    className="text-2xl sm:text-3xl font-bold font-pixel mb-1"
                    style={{
                      color: item.isAlert ? "#DC2626" : "#22C55E",
                    }}
                  >
                    {item.stat}
                  </p>
                  <p
                    className="text-xs font-bold font-mono-tech mb-1"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[10px] font-mono-tech"
                    style={{ color: "#9CA3AF" }}
                  >
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* The Hope Message */}
          <div className="tech-card" style={{ borderColor: "#166534" }}>
            <div className="tech-card-header" style={{ background: "#166534" }}>
              /// BUT_THERE_IS_HOPE
            </div>
            <div className="tech-card-body p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-sm shrink-0"
                  style={{
                    background: "#DCFCE7",
                    border: "3px solid #166534",
                  }}
                >
                  <span className="text-4xl">♻️</span>
                </div>
                <div className="text-center md:text-left">
                  <p
                    className="text-lg font-bold font-pixel mb-2"
                    style={{ color: "#166534" }}
                  >
                    Most discarded clothes don&apos;t need to be thrown away
                  </p>
                  <p
                    className="text-sm font-mono-tech leading-relaxed"
                    style={{ color: "#4B5563" }}
                  >
                    Simple repairs like fixing a button, mending a seam, or
                    patching a small hole can extend a garment&apos;s life by{" "}
                    <span className="font-bold" style={{ color: "#166534" }}>
                      years
                    </span>
                    . RETHREAD makes finding and executing these repairs
                    effortless.
                  </p>
                </div>
                <div className="shrink-0">
                  <Link href="/scan">
                    <Button className="nokia-btn nokia-btn-success px-6 py-3 text-xs tracking-wider font-pixel rounded-sm">
                      START REPAIRING
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Data Source */}
          <p
            className="text-center text-[10px] font-mono-tech mt-6"
            style={{ color: "#A1A1C2" }}
          >
            Data: WRAP UK, Ellen MacArthur Foundation, UNEP Fashion Charter
          </p>
        </div>
      </AnimatedSection>

      {/* Technical Divider */}
      <div className="max-w-5xl mx-auto w-full px-6">
        <div className="tech-divider" />
      </div>

      {/* ============================================ */}
      {/* THE SOLUTION - What We're Building */}
      {/* ============================================ */}
      <AnimatedSection className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="tech-badge tech-badge-blue mb-4">THE SOLUTION</div>
            <h2
              className="text-2xl md:text-3xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              What We&apos;re Building
            </h2>
            <p
              className="text-sm font-mono-tech max-w-xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              RETHREAD makes clothing repair accessible to everyone — whether
              you&apos;re a complete beginner or want professional help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "AI SCAN",
                icon: "📱",
                headline: "Instant Analysis",
                desc: "Point your phone at any damaged garment. Our AI identifies the fabric type, damage severity, and suggests the best repair methods — in seconds.",
                color: "#124191",
              },
              {
                step: "02",
                title: "REPAIR PLAN",
                icon: "📋",
                headline: "Your Blueprint",
                desc: "Get a detailed repair guide with step-by-step instructions, difficulty ratings, and visual previews. Know exactly what to do before you start.",
                color: "#DC2626",
              },
              {
                step: "03",
                title: "DIY OR VENDOR",
                icon: "✨",
                headline: "Your Choice",
                desc: "Fix it yourself with our guides, or connect with local tailors who specialize in that exact repair. We&apos;re building a network of verified vendors.",
                color: "#166534",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="tech-card h-full hover:shadow-hard-blue transition-shadow">
                  <div
                    className="tech-card-header"
                    style={{ background: item.color }}
                  >
                    /// STEP_{item.step}
                  </div>
                  <div className="tech-card-body p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 flex items-center justify-center text-3xl rounded-sm"
                        style={{
                          background: "#F3F4F6",
                          border: `2px solid ${item.color}`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <span
                          className="font-bold tracking-wider text-lg font-pixel"
                          style={{ color: item.color }}
                        >
                          {item.title}
                        </span>
                        <p
                          className="text-xs font-mono-tech"
                          style={{ color: "#6B7280" }}
                        >
                          {item.headline}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed font-mono-tech"
                      style={{ color: "#4B5563" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================ */}
      {/* IMPACT - Why Repair Matters */}
      {/* ============================================ */}
      <AnimatedSection className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="tech-badge tech-badge-green mb-4">THE IMPACT</div>
            <h2
              className="text-2xl md:text-3xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              Every Repair Makes a Difference
            </h2>
            <p
              className="text-sm font-mono-tech max-w-xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              When you repair instead of replace, you&apos;re directly reducing
              the environmental cost of making new clothes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {impactScenarios.map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="tech-card h-full hover:shadow-hard-blue transition-shadow">
                  <div
                    className="tech-card-header"
                    style={{ background: "#166534" }}
                  >
                    /// REPAIR_IMPACT
                  </div>
                  <div className="tech-card-body p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{item.icon}</span>
                      <div>
                        <h3
                          className="font-bold font-pixel"
                          style={{ color: "#1A1A1A" }}
                        >
                          {item.item}
                        </h3>
                        <div className="flex gap-3 text-xs font-mono-tech">
                          <span style={{ color: "#DC2626" }}>↓ {item.co2}</span>
                          <span style={{ color: "#124191" }}>
                            ↓ {item.water}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed font-mono-tech"
                      style={{ color: "#4B5563" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-8 text-center">
            <p className="text-xs font-mono-tech" style={{ color: "#A1A1C2" }}>
              Data sources: WRAP UK, Ellen MacArthur Foundation, UNEP
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================ */}
      {/* FEATURES - What the App Does */}
      {/* ============================================ */}
      <AnimatedSection className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="tech-badge tech-badge-grey mb-4">FEATURES</div>
            <h2
              className="text-2xl md:text-3xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              What RETHREAD Can Do
            </h2>
            <p
              className="text-sm font-mono-tech max-w-xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              We&apos;re building tools that make repair the easy choice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "🔍",
                title: "AI Damage Detection",
                desc: "Identifies tears, stains, worn spots, loose threads — even damage you might miss",
                color: "#124191",
              },
              {
                icon: "🧵",
                title: "Multiple Repair Options",
                desc: "From invisible fixes to trendy visible mending. Choose the style that fits you",
                color: "#DC2626",
              },
              {
                icon: "📊",
                title: "Difficulty Ratings",
                desc: "Know if a repair is beginner-friendly or needs professional help before you start",
                color: "#166534",
              },
              {
                icon: "👁️",
                title: "Visual Preview",
                desc: "See how different repair methods will look on your actual garment",
                color: "#7C3AED",
              },
              {
                icon: "🏭",
                title: "Vendor Network",
                desc: "We&apos;re partnering with local tailors to offer professional repairs with doorstep pickup",
                color: "#124191",
              },
              {
                icon: "📚",
                title: "DIY Guides",
                desc: "Step-by-step tutorials for common repairs. Learn to mend and reduce waste",
                color: "#FF5500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-sm hover:shadow-hard transition-shadow cursor-default"
                style={{
                  background: "#F9FAFB",
                  border: "2px solid #E5E7EB",
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3
                    className="font-bold text-sm mb-1 font-mono-tech"
                    style={{ color: "#1A1A1A" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm font-mono-tech"
                    style={{ color: "#6B7280" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================ */}
      {/* FAQ */}
      {/* ============================================ */}
      <AnimatedSection className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="tech-badge tech-badge-blue mb-4">FAQ</div>
            <h2
              className="text-2xl md:text-3xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              Questions About RETHREAD
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="tech-card cursor-pointer hover:shadow-hard-blue transition-shadow"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <div className="p-4 flex items-center justify-between">
                  <h3
                    className="font-bold text-sm font-mono-tech"
                    style={{ color: "#1A1A1A" }}
                  >
                    {faq.q}
                  </h3>
                  <span
                    className="text-lg transition-transform duration-200"
                    style={{
                      color: "#124191",
                      transform:
                        expandedFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                </div>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: expandedFaq === i ? "200px" : "0px",
                    opacity: expandedFaq === i ? 1 : 0,
                  }}
                >
                  <div
                    className="px-4 pb-4 text-sm font-mono-tech"
                    style={{
                      color: "#4B5563",
                      borderTop: "1px solid #E5E7EB",
                      paddingTop: "1rem",
                    }}
                  >
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================ */}
      {/* FINAL CTA - Join the Movement */}
      {/* ============================================ */}
      <section className="py-16 px-6" style={{ background: "#124191" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-sm font-mono-tech mb-4"
            style={{ color: "#93C5FD" }}
          >
            EVERY REPAIR IS AN ACT OF RESISTANCE AGAINST FAST FASHION
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-pixel">
            Join Us in Building a<br />
            <span style={{ color: "#22C55E" }}>More Sustainable Future</span>
          </h2>
          <p
            className="text-base mb-8 font-mono-tech"
            style={{ color: "#A5B4FC" }}
          >
            We believe the best way to reduce textile waste is to make repair
            easy, accessible, and even fun. Try RETHREAD and see what&apos;s
            possible.
          </p>
          <Link href="/scan">
            <Button className="nokia-btn nokia-btn-success px-12 py-6 text-lg tracking-wider font-pixel rounded-sm">
              TRY THE SCANNER →
            </Button>
          </Link>
          <p
            className="text-sm mt-6 font-mono-tech"
            style={{ color: "#93C5FD" }}
          >
            Built with 💚 for the planet
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer
        className="bg-white border-t-2 py-6 px-6"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-sm"
                style={{ background: "#124191" }}
              >
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span
                className="font-bold tracking-wider font-pixel"
                style={{ color: "#1A1A1A" }}
              >
                RETHREAD
              </span>
              <span style={{ color: "#D1D5DB" }}>×</span>
              <span
                className="text-sm font-mono-tech"
                style={{ color: "#6B7280" }}
              >
                Nokia Innovation
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm font-mono-tech">
              <Link
                href="/scan"
                className="font-bold tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "#124191" }}
              >
                Scanner
              </Link>
              <Link
                href="/profile"
                className="font-bold tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "#7C3AED" }}
              >
                Profile
              </Link>
              <span style={{ color: "#D1D5DB" }}>|</span>
              <span className="font-bold" style={{ color: "#166534" }}>
                🌍 For the Planet
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================ */}
      {/* STICKY MOBILE CTA */}
      {/* ============================================ */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 sm:hidden z-50"
        style={{ borderColor: "#1A1A1A" }}
      >
        <Link href="/scan" className="block">
          <Button className="nokia-btn nokia-btn-primary w-full py-4 text-sm tracking-wider font-pixel rounded-sm">
            TRY THE SCANNER
          </Button>
        </Link>
      </div>
    </main>
  );
}
