
import { useState, useEffect } from "react";

export default function BullIntro() {
  const [stage, setStage] = useState("video");

  useEffect(() => {
    if (stage !== "logo") return;

    const timer = setTimeout(() => {
      setStage("exit");
    }, 1000);

    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#020202",
        overflow: "hidden",
        opacity: stage === "exit" ? 0 : 1,
        transition: "opacity 1.4s ease",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes logoReveal {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.94);
            letter-spacing: 14px;
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            letter-spacing: 5px;
          }
        }

        @keyframes coralGlow {
          0%, 100% {
            text-shadow: 0 0 15px rgba(255,90,80,0.25);
          }
          50% {
            text-shadow: 0 0 40px rgba(255,90,80,0.8);
          }
        }
      `}</style>

      {stage === "video" && (
        <>
          <video
            autoPlay
            muted
            playsInline
            onEnded={() => setStage("logo")}
            src="/videos/bull-intro.mp4"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.58) contrast(1.15) saturate(0.7)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
                radial-gradient(
                  ellipse at center,
                  transparent 25%,
                  rgba(0,0,0,0.85) 100%
                ),
                linear-gradient(
                  90deg,
                  rgba(0,0,0,0.35),
                  transparent 45%,
                  rgba(0,0,0,0.45)
                )
              `,
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 120px #000",
              background:
                "linear-gradient(0deg, rgba(255,75,65,0.12), transparent 45%)",
            }}
          />
        </>
      )}

      {stage === "logo" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            animation: "logoReveal 1.5s ease forwards",
          }}
        >
          <div
            style={{
              color: "#f4f0eb",
              fontSize: "clamp(36px, 7vw, 82px)",
              fontWeight: 800,
              letterSpacing: "5px",
              animation: "coralGlow 2s infinite",
            }}
          >
            HIRE<span style={{ color: "#ff746b" }}>ME</span>GENT
          </div>

          <p
            style={{
              color: "#aaa09e",
              fontSize: "11px",
              letterSpacing: "7px",
              marginTop: "18px",
            }}
          >
            INTELLIGENCE. AMBITION. EXECUTION.
          </p>
        </div>
      )}
    </div>
  );
}
