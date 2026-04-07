"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AnnouncementBar() {
  const [message, setMessage] = useState(null);
  const [bgColor, setBgColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("featured_sections")
      .select("announcement_text, announcement_bg, announcement_text_color")
      .eq("section_key", "announcement")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setMessage(data.announcement_text || null);
          if (data.announcement_bg) setBgColor(data.announcement_bg);
          if (data.announcement_text_color) setTextColor(data.announcement_text_color);
        }
        setLoaded(true);
      });
  }, []);

  // Không hiển thị gì nếu chưa load xong hoặc text rỗng
  if (!loaded || !message) return null;

  return (
    <div className="announcement-bar" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="announcement-bar__track">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="announcement-bar__text">
            {message} &nbsp;•&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
