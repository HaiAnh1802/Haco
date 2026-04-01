"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const FALLBACK = {
  banner_image: "/images/hero.png",
  banner_title: "Khám phá bộ sưu tập mùa xuân.",
  banner_subtitle: "Xuân 2026",
  banner_cta: "Sắc màu mới đã có mặt",
};

export default function Hero() {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data: section } = await supabase
          .from("featured_sections")
          .select("banner_image, banner_title, banner_subtitle, banner_cta")
          .eq("section_key", "editorial")
          .maybeSingle();

        if (section) {
          setData({
            banner_image: section.banner_image || FALLBACK.banner_image,
            banner_title: section.banner_title || FALLBACK.banner_title,
            banner_subtitle: section.banner_subtitle || FALLBACK.banner_subtitle,
            banner_cta: section.banner_cta || FALLBACK.banner_cta,
          });
        }
      } catch (err) {
        console.error("Error fetching hero:", err);
      }
    }
    fetchHero();
  }, []);

  return (
    <section className="hero">
      <div className="hero__media">
        <img
          src={data.banner_image}
          alt={data.banner_title}
          className="hero__image"
        />
        <div className="hero__overlay"></div>
      </div>
      <div className="hero__content">
        <p className="hero__subtitle">{data.banner_subtitle}</p>
        <h1 className="hero__title">{data.banner_title}</h1>
        <a href="#shop" className="hero__cta">
          <span>{data.banner_cta}</span>
          <svg className="hero__cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
