"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const FALLBACK_TITLE = "rhode + bạn";
const FALLBACK_VALUES = [
  {
    icon: "✦",
    title: "Giá Trị Của Chúng Tôi",
    desc: "PHỤC HỒI, BẢO VỆ và NUÔI DƯỠNG làn da hiện tại của bạn để có kết quả lâu dài theo thời gian.",
    link: "Giá Trị",
  },
  {
    icon: "♡",
    title: "Rhode Futures",
    desc: "QUỸ RHODE FUTURES hỗ trợ các tổ chức hoạt động nhằm xóa bỏ rào cản kìm hãm phụ nữ.",
    link: "Tác Động",
  },
  {
    icon: "◎",
    title: "Bền Vững",
    desc: "Từ nguyên liệu có nguồn gốc có ý thức đến bao bì làm từ vật liệu tái chế, chúng tôi cam kết CHĂM SÓC DA CÓ TRÁCH NHIỆM.",
    link: "Dấu Chân Xanh",
  },
];

export default function BrandValues() {
  const [sectionTitle, setSectionTitle] = useState(FALLBACK_TITLE);
  const [values, setValues] = useState(FALLBACK_VALUES);
  const [active, setActive] = useState(true);

  useEffect(() => {
    async function fetchBrandValues() {
      try {
        const { data: section } = await supabase
          .from("featured_sections")
          .select("*")
          .eq("section_key", "brand_values")
          .maybeSingle();

        if (section) {
          if (section.is_active === false) {
            setActive(false);
            return;
          }
          setSectionTitle(section.title || FALLBACK_TITLE);
          if (section.brand_values_data && section.brand_values_data.length > 0) {
            setValues(section.brand_values_data);
          }
        }
      } catch (err) {
        console.error("Error fetching brand values:", err);
      }
    }
    fetchBrandValues();
  }, []);

  if (!active) return null;

  return (
    <section className="brand-values" id="about">
      <div className="brand-values__inner">
        <div className="brand-values__header">
          <h2 className="brand-values__title">{sectionTitle}</h2>
        </div>

        <div className="brand-values__grid">
          {values.map((value, idx) => (
            <div key={idx} className="brand-values__card">
              <div className="brand-values__card-icon">{value.icon}</div>
              <h3 className="brand-values__card-title">{value.title}</h3>
              <p className="brand-values__card-desc">{value.desc}</p>
              <a href="#" className="brand-values__card-link">
                {value.link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
