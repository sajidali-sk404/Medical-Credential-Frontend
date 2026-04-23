"use client";
import { useState, useEffect, useRef } from "react";

const PARTNERS = [
  "METRO HEALTH", "ST. JUVÉ NETWORK", "VITALIS CORE",
  "PHARMA-LEDGER", "CARE ALLIANCE",
];

const FEATURES = [
  {
    icon: "🔐",
    title: "Secure Document Vault",
    desc: "Military-grade AES-256 encryption for EHR systems, credentialing documents, and sensitive compliance records.",
    accent: "#0d3d3d",
    light: "#e1f5ee",
  },
  {
    icon: "⚡",
    title: "Real-Time Status",
    desc: "Live credentialing pipeline visibility. Know exactly where every provider stands at every moment.",
    accent: "#1D9E75",
    light: "#e1f5ee",
    featured: true,
  },
  {
    icon: "🔗",
    title: "Interoperable API",
    desc: "Connect Vitalis Ledger directly to your HRIS, EMR and medical board verification endpoints.",
    accent: "#0d3d3d",
    light: "#e1f5ee",
  },
  {
    icon: "💬",
    title: "Professional Support",
    desc: "Dedicated credentialing specialists available for the duration of all enterprise and multi-party contracts.",
    accent: "#0d3d3d",
    light: "#e1f5ee",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Register Profile",
    desc: "Set up your provider or institution profile with verified credentials and licensing information.",
  },
  {
    n: "02",
    title: "Submit Request",
    desc: "Submit your credentialing application with supporting documents for review.",
  },
  {
    n: "03",
    title: "Track Approval",
    desc: "Monitor your application status in real-time and receive instant notifications on updates.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroIn] = useInView(0.1);
  const [featRef, featIn] = useInView(0.1);
  const [stepsRef, stepsIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#0d1f1f", background: "rgba(29,158,117,.1)", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .fade-up.in {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-up.d1 { transition-delay: .1s; }
        .fade-up.d2 { transition-delay: .2s; }
        .fade-up.d3 { transition-delay: .3s; }
        .fade-up.d4 { transition-delay: .4s; }
        .fade-up.d5 { transition-delay: .5s; }

        .nav-link {
          font-size: 13px;
          color: rgba(255,255,255,.75);
          text-decoration: none;
          transition: color .2s;
        }
        .nav-link:hover { color: #fff; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 22px; border-radius: 8px;
          background: #1D9E75; color: #fff;
          font-size: 13px; font-weight: 500;
          border: none; cursor: pointer;
          transition: background .2s, transform .15s;
          text-decoration: none;
        }
        .btn-primary:hover { background: #17896a; transform: translateY(-1px); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 22px; border-radius: 8px;
          background: transparent; color: #fff;
          font-size: 13px; font-weight: 500;
          border: 1px solid rgba(255,255,255,.25); cursor: pointer;
          transition: background .2s, border-color .2s;
          text-decoration: none;
        }
        .btn-ghost:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.5); }

        .feature-card {
          background: #fff;
          border: 1px solid #e4ede9;
          border-radius: 14px;
          padding: 24px;
          transition: transform .25s, box-shadow .25s;
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(13,61,61,.08);
        }
        .feature-card.featured {
          background: #0a3030;
          border-color: #0a3030;
          color: #fff;
        }

        .partner-item {
          font-size: 11px; font-weight: 600; letter-spacing: .1em;
          color: rgba(255,255,255,.4);
          white-space: nowrap;
          transition: color .2s;
        }
        .partner-item:hover { color: rgba(255,255,255,.75); }

        .step-card {
          position: relative;
          padding: 32px 28px;
          background: #fff;
          border: 1px solid #e4ede9;
          border-radius: 14px;
          transition: transform .25s, box-shadow .25s;
        }
        .step-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(13,61,61,.07);
        }

        .stat-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 20px;
          background: rgba(29,158,117,.15);
          color: #1D9E75; font-size: 11px; font-weight: 600;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 4s ease-in-out infinite; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .6; transform: scale(.85); }
        }
        .pulse { animation: pulse-dot 2s ease-in-out infinite; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex; gap: 60px; align-items: center;
          width: max-content;
          animation: marquee 18s linear infinite;
        }
        .marquee-inner:hover { animation-play-state: paused; }

        .hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #051818 0%, #0a3030 45%, #0d4040 100%);
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(29,158,117,.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(29,158,117,.08) 0%, transparent 40%);
        }
        .hero-grid {
          position: absolute; inset: 0; opacity: .06;
          background-image:
            linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .mock-window {
          background: #0a2a2a;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          overflow: hidden;
        }
        .mock-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 14px;
          background: rgba(255,255,255,.04);
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .mock-dot { width: 8px; height: 8px; border-radius: 50%; }

        footer a { color: rgba(255,255,255,.5); text-decoration: none; font-size: 13px; transition: color .2s; }
        footer a:hover { color: rgba(255,255,255,.85); }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "background .3s, backdrop-filter .3s",
        background: scrolled ? "rgba(5,24,24,.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>C</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 15, letterSpacing: "-.01em" }}>CredFlow</span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="/sign-in" className="nav-link" style={{ padding: "8px 16px" }}>Sign in</a>
            <a href="/sign-up" className="btn-primary" style={{ padding: "8px 18px", fontSize: 12 }}>Get started</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 80 }}>
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

          {/* Left */}
          <div ref={heroRef}>
            <div className={`fade-up ${heroIn ? "in" : ""}`}>
              <span className="stat-chip">
                <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
                Credentialing infrastructure
              </span>
            </div>

            <h1 className={`fade-up d1 ${heroIn ? "in" : ""}`} style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.1,
              marginTop: 20,
              letterSpacing: "-.02em",
            }}>
              Credentialing<br />
              <span style={{ color: "#1D9E75", fontStyle: "italic" }}>with Integrity.</span>
            </h1>

            <p className={`fade-up d2 ${heroIn ? "in" : ""}`} style={{
              color: "rgba(255,255,255,.6)",
              fontSize: 15,
              lineHeight: 1.7,
              marginTop: 20,
              maxWidth: 440,
            }}>
              Vitalis Ledger provides an authoritative framework for medical credentialing. We transform complex verification workflows into seamless digital experiences for modern healthcare providers.
            </p>

            <div className={`fade-up d3 ${heroIn ? "in" : ""}`} style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <a href="/sign-up" className="btn-primary">
                Get Started ✓
              </a>
              <a href="#features" className="btn-ghost">
                Show More
              </a>
            </div>

            <div className={`fade-up d4 ${heroIn ? "in" : ""}`} style={{
              marginTop: 40,
              display: "flex", alignItems: "center", gap: 20,
            }}>
              {[["16,500+", "providers"], ["99.8%", "uptime"], ["< 24h", "avg approval"]].map(([v, l]) => (
                <div key={l}>
                  <p style={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>{v}</p>
                  <p style={{ color: "rgba(255,255,255,.4)", fontSize: 11, marginTop: 2 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className={`fade-up d2 float ${heroIn ? "in" : ""}`}>
            <div className="mock-window" style={{ boxShadow: "0 40px 100px rgba(0,0,0,.4)" }}>
              <div className="mock-bar">
                <div className="mock-dot" style={{ background: "#ff5f57" }} />
                <div className="mock-dot" style={{ background: "#febc2e" }} />
                <div className="mock-dot" style={{ background: "#28c840" }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,.3)" }}>credflow.io/dashboard</span>
              </div>
              <div style={{ padding: 16 }}>
                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                  {[["1,244", "Total", "#1D9E75"], ["108", "Pending", "#F59E0B"], ["48", "Approved", "#10B981"]].map(([n, l, c]) => (
                    <div key={l} style={{ background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,.06)" }}>
                      <p style={{ color: c, fontSize: 18, fontWeight: 600 }}>{n}</p>
                      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 10, marginTop: 2 }}>{l}</p>
                    </div>
                  ))}
                </div>

                {/* Recent requests */}
                <div style={{ background: "rgba(255,255,255,.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)", overflow: "hidden" }}>
                  <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>Recent requests</span>
                    <span style={{ fontSize: 10, color: "#1D9E75" }}>View all →</span>
                  </div>
                  {[
                    ["Dr. Bilal Raza", "Cardiology", "approved"],
                    ["Dr. Sara Malik", "Radiology", "in_review"],
                    ["Dr. Tariq Shah", "Neurology", "pending"],
                  ].map(([name, spec, status]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                      <div>
                        <p style={{ color: "rgba(255,255,255,.8)", fontSize: 11, fontWeight: 500 }}>{name}</p>
                        <p style={{ color: "rgba(255,255,255,.3)", fontSize: 10 }}>{spec}</p>
                      </div>
                      <span style={{
                        fontSize: 9, padding: "3px 8px", borderRadius: 20, fontWeight: 600,
                        background: status === "approved" ? "rgba(16,185,129,.15)" : status === "in_review" ? "rgba(59,130,246,.15)" : "rgba(245,158,11,.15)",
                        color: status === "approved" ? "#10B981" : status === "in_review" ? "#3B82F6" : "#F59E0B",
                      }}>
                        {status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status chip at bottom */}
                <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(29,158,117,.1)", borderRadius: 8, border: "1px solid rgba(29,158,117,.2)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75", display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
                    <span style={{ color: "#1D9E75", fontWeight: 600 }}>System Verified</span> — Secure AES-256 channel active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(transparent, #f8faf9)" }} />
      </section>

      {/* ── PARTNERS ─────────────────────────────────────────────── */}
      <section style={{ background: "#0a2a2a", padding: "20px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="marquee-inner">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(29,158,117,.5)" }} />
                <span className="partner-item">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div ref={featRef} style={{ textAlign: "center", marginBottom: 60 }}>
            <p className={`fade-up ${featIn ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 600, color: "#1D9E75", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
              Built for precision
            </p>
            <h2 className={`fade-up d1 ${featIn ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, lineHeight: 1.2, letterSpacing: "-.02em" }}>
              Precision Architecture
            </h2>
            <p className={`fade-up d2 ${featIn ? "in" : ""}`} style={{ color: "#6b8b8b", fontSize: 15, lineHeight: 1.7, marginTop: 16, maxWidth: 520, margin: "16px auto 0" }}>
              Our platform is designed for the rigorous demands of medical administrative excellence — combining compliance and enterprise resilience.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`feature-card fade-up d${i + 1} ${featIn ? "in" : ""} ${f.featured ? "featured" : ""}`}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: f.featured ? "rgba(29,158,117,.2)" : f.light,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, marginBottom: 16,
                  border: f.featured ? "1px solid rgba(29,158,117,.3)" : `1px solid ${f.accent}20`,
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontSize: 16, fontWeight: 600,
                  color: f.featured ? "#fff" : "#0d1f1f",
                  marginBottom: 10,
                  letterSpacing: "-.01em",
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: 13, lineHeight: 1.65,
                  color: f.featured ? "rgba(255,255,255,.6)" : "#6b8b8b",
                }}>
                  {f.desc}
                </p>
                {f.featured && (
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>Live updates active</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 STEPS ──────────────────────────────────────────────── */}
      <section style={{ background: "#0a2a2a", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div ref={stepsRef} style={{ textAlign: "center", marginBottom: 60 }}>
            <p className={`fade-up ${stepsIn ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 600, color: "#1D9E75", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>
              Simple process
            </p>
            <h2 className={`fade-up d1 ${stepsIn ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: "#fff", lineHeight: 1.2, letterSpacing: "-.02em" }}>
              Three Steps to<br />
              <span style={{ fontStyle: "italic", color: "#1D9E75" }}>Clinical Verification</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`step-card fade-up d${i + 1} ${stepsIn ? "in" : ""}`}
                style={{ background: "#0d3535", border: "1px solid rgba(255,255,255,.07)" }}
              >
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 48, fontWeight: 400,
                  color: "rgba(29,158,117,.25)",
                  lineHeight: 1, display: "block",
                  marginBottom: 16,
                }}>
                  {s.n}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 10, letterSpacing: "-.01em" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.65 }}>
                  {s.desc}
                </p>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute", top: "50%", right: -24,
                    transform: "translateY(-50%)",
                    color: "rgba(29,158,117,.4)", fontSize: 20, zIndex: 2,
                    display: "none",
                  }}>→</div>
                )}
              </div>
            ))}
          </div>

          <div className={`fade-up d4 ${stepsIn ? "in" : ""}`} style={{ marginTop: 20 }}>
            <a href="#" style={{ color: "#1D9E75", fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Learn our methodology →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section ref={ctaRef} style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            className={`fade-up ${ctaIn ? "in" : ""}`}
            style={{
              background: "linear-gradient(135deg, #0a3030 0%, #0d4a3a 100%)",
              borderRadius: 20,
              padding: "60px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(29,158,117,.15)",
            }}
          >
            {/* Background dots */}
            <div style={{
              position: "absolute", inset: 0, opacity: .04,
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 className={`fade-up d1 ${ctaIn ? "in" : ""}`} style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(26px, 4vw, 38px)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1.2,
                letterSpacing: "-.02em",
                marginBottom: 16,
              }}>
                Ready to streamline<br />your authority?
              </h2>
              <p className={`fade-up d2 ${ctaIn ? "in" : ""}`} style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.6, marginBottom: 32, maxWidth: 460, margin: "0 auto 32px" }}>
                Join over 16,500 healthcare professionals who trust Vitalis Ledger for their secure credentialing needs.
              </p>
              <div className={`fade-up d3 ${ctaIn ? "in" : ""}`} style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <a href="/sign-up" className="btn-primary">Create Free Account</a>
                <a href="#" className="btn-ghost">Schedule Enterprise Demo</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background: "#051818", padding: "60px 24px 32px", color: "rgba(255,255,255,.5)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>C</span>
                </div>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>CredFlow</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, maxWidth: 260, color: "rgba(255,255,255,.4)" }}>
                Secure, immutable, and precise credentialing infrastructure built for high-stakes medical institutions.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: ["Features", "Security", "Pricing", "Changelog"] },
              { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>
                  {col.title}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => <a key={l} href="#">{l}</a>)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24 }}>
            <p style={{ fontSize: 12 }}>
              © 2024 CredFlow Clinical Network. All rights reserved.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
              <span style={{ color: "#1D9E75" }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}