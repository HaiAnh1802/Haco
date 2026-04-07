"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Map vị trí → CSS style
function getAlignStyle(align) {
  const base = { position: "absolute", zIndex: 2, padding: "0 1.5rem", lineHeight: "normal" };
  switch (align) {
    case "top-left":      return { ...base, top: "8%",    left: "4%",  right: "auto", bottom: "auto", textAlign: "left" };
    case "top-center":    return { ...base, top: "8%",    left: 0,     right: 0,      bottom: "auto", textAlign: "center" };
    case "top-right":     return { ...base, top: "8%",    right: "4%", left: "auto",  bottom: "auto", textAlign: "right" };
    case "middle-left":   return { ...base, top: "50%",   left: "4%",  right: "auto", bottom: "auto", textAlign: "left",   transform: "translateY(-50%)" };
    case "middle-center": return { ...base, top: "50%",   left: 0,     right: 0,      bottom: "auto", textAlign: "center", transform: "translateY(-50%)" };
    case "middle-right":  return { ...base, top: "50%",   right: "4%", left: "auto",  bottom: "auto", textAlign: "right",  transform: "translateY(-50%)" };
    case "bottom-left":   return { ...base, bottom: "8%", left: "4%",  right: "auto", top: "auto",    textAlign: "left" };
    case "bottom-right":  return { ...base, bottom: "8%", right: "4%", left: "auto",  top: "auto",    textAlign: "right" };
    default:              return { ...base, bottom: "8%", left: 0,     right: 0,      top: "auto",    textAlign: "center" }; // bottom-center
  }
}

export default function Hero() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data: section } = await supabase
          .from("featured_sections")
          .select("banner_image, banner_title, banner_subtitle, banner_cta, banner_cta_align")
          .eq("section_key", "editorial")
          .maybeSingle();

        if (section) {
          setData({
            banner_image: section.banner_image || "/images/hero.png",
            banner_title: section.banner_title || "",
            banner_subtitle: section.banner_subtitle || "",
            banner_cta: section.banner_cta || "",
            banner_cta_align: section.banner_cta_align || "bottom-center",
          });
        } else {
          setData({ banner_image: "/images/hero.png", banner_title: "", banner_subtitle: "", banner_cta: "", banner_cta_align: "bottom-center" });
        }
      } catch (err) {
        console.error("Error fetching hero:", err);
        setData({ banner_image: "/images/hero.png", banner_title: "", banner_subtitle: "", banner_cta: "", banner_cta_align: "bottom-center" });
      }
    }
    fetchHero();
  }, []);

  if (!data) return null;

  const hasContent = data.banner_subtitle || data.banner_title || data.banner_cta;
  const alignStyle = getAlignStyle(data.banner_cta_align);

  return (
    <section style={{ position: "relative", width: "100%", overflow: "hidden", lineHeight: 0 }}>
      <img
        src={data.banner_image}
        alt={data.banner_title || "Banner"}
        style={{ width: "100%", height: "auto", display: "block" }}
      />
      {hasContent && (
        <div style={alignStyle}>
          {data.banner_subtitle && (
            <p style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", fontWeight: 500, marginBottom: "12px", color: "inherit" }}>
              {data.banner_subtitle}
            </p>
          )}
          {data.banner_title && (
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)", fontWeight: 300, fontStyle: "italic", marginBottom: "24px", color: "inherit" }}>
              {data.banner_title}
            </h1>
          )}
          {data.banner_cta && (
            <a href="#shop" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "#1B2A1B",
              border: "1px solid rgba(27,42,27,0.6)",
              padding: "12px 28px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              textDecoration: "none",
            }}>
              <span>{data.banner_cta}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      )}
    </section>
  );
}
