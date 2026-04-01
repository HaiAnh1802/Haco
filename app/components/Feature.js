"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const FALLBACK = {
  image: "/images/lip-case.png",
  label: "Phiên Bản Giới Hạn",
  title: "Kết nối tức thì.",
  desc: "Chúng tôi cũng đã tạo ra những chiếc Lip Case mới để phối hợp. Cả Signature và Snap-On Lip Case đều có các màu phiên bản giới hạn để kết hợp với Peptide Lip Tint màu Sweet Pea và Pretzel.",
  cta: "Mua ngay",
};

export default function Feature() {
  const [data, setData] = useState(FALLBACK);
  const [active, setActive] = useState(true);

  useEffect(() => {
    async function fetchFeature() {
      try {
        const { data: section } = await supabase
          .from("featured_sections")
          .select("*")
          .eq("section_key", "feature")
          .maybeSingle();

        if (section) {
          if (section.is_active === false) {
            setActive(false);
            return;
          }
          setData({
            image: section.banner_image || FALLBACK.image,
            label: section.banner_title || FALLBACK.label,
            title: section.title || FALLBACK.title,
            desc: section.description || FALLBACK.desc,
            cta: section.banner_cta || FALLBACK.cta,
          });
        }
      } catch (err) {
        console.error("Error fetching feature:", err);
      }
    }
    fetchFeature();
  }, []);

  if (!active) return null;

  return (
    <section className="feature">
      <div className="feature__inner">
        <img
          src={data.image}
          alt={data.title}
          className="feature__image"
        />
        <div className="feature__content">
          <p className="feature__label">{data.label}</p>
          <h2 className="feature__title">{data.title}</h2>
          <p className="feature__desc">{data.desc}</p>
          <a href="#shop" className="feature__cta">
            {data.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
