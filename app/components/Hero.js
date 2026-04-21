"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);
  const touchStartRef = useRef(0);

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data: section } = await supabase
          .from("featured_sections")
          .select("banner_image, banner_title, banner_subtitle, banner_cta, banner_cta_align, banner_slides")
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

          // Use banner_slides if available, otherwise fallback to single banner_image
          const slideList = section.banner_slides && section.banner_slides.length > 0
            ? section.banner_slides.map(s => s.url)
            : [section.banner_image || "/images/hero.png"];
          setSlides(slideList);
        } else {
          setData({ banner_image: "/images/hero.png", banner_title: "", banner_subtitle: "", banner_cta: "", banner_cta_align: "bottom-center" });
          setSlides(["/images/hero.png"]);
        }
      } catch (err) {
        console.error("Error fetching hero:", err);
        setData({ banner_image: "/images/hero.png", banner_title: "", banner_subtitle: "", banner_cta: "", banner_cta_align: "bottom-center" });
        setSlides(["/images/hero.png"]);
      }
    }
    fetchHero();
  }, []);

  // Auto-advance slides
  const goToSlide = useCallback((idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(timerRef.current);
  }, [slides.length, nextSlide]);

  // Đo aspect-ratio của ảnh đầu tiên để áp dụng cho tất cả slide (đồng đều kích thước)
  useEffect(() => {
    if (slides.length === 0) return;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = slides[0];
  }, [slides]);

  // Touch handlers for mobile swipe
  function handleTouchStart(e) {
    touchStartRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }

  if (!data) return null;

  const hasContent = data.banner_subtitle || data.banner_title || data.banner_cta;
  const alignStyle = getAlignStyle(data.banner_cta_align);
  const showControls = slides.length > 1;

  return (
    <section
      className="hero-slider"
      style={{ position: "relative", width: "100%", overflow: "hidden", lineHeight: 0 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="hero-slider__track" style={{
        display: "flex",
        width: `${slides.length * 100}%`,
        transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {slides.map((url, i) => (
          <div
            key={i}
            style={{
              width: `${100 / slides.length}%`,
              flexShrink: 0,
              aspectRatio: aspectRatio || "16 / 9",
              maxHeight: "70vh",
              overflow: "hidden",
              background: "#f5f5f5",
            }}
          >
            <img
              src={url}
              alt={`Banner ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* Text overlay */}
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
          {data.banner_cta && false && (
            <a href="#shop" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 800,
              border: "none",
              padding: "12px 28px",
              background: "transparent",
              textDecoration: "none",
            }}>
              <span style={{
                backgroundImage: "linear-gradient(90deg, #FF0844 0%, #FF6A00 50%, #FFB800 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}>{data.banner_cta}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0844" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Arrow Controls */}
      {showControls && (
        <>
          <button
            className="hero-slider__arrow hero-slider__arrow--prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="hero-slider__arrow hero-slider__arrow--next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showControls && (
        <div className="hero-slider__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-slider__dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
