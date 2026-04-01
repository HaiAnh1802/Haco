"use client";

import { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const message = "MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 1.000.000₫";
  
  return (
    <div className="announcement-bar">
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
