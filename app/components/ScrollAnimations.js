"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    // Scroll progress bar
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    };

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all existing fade-in elements
    const observeAll = () => {
      document.querySelectorAll(".fade-in:not(.visible)").forEach((el) => {
        observer.observe(el);
      });
    };
    observeAll();

    // Watch for dynamically-added fade-in elements (e.g. async-loaded sections)
    const mutationObserver = new MutationObserver((mutations) => {
      let hasNew = false;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            if (node.classList?.contains("fade-in") || node.querySelector?.(".fade-in")) {
              hasNew = true;
              break;
            }
          }
        }
        if (hasNew) break;
      }
      if (hasNew) observeAll();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      observer.disconnect();
      mutationObserver.disconnect();
      progressBar.remove();
    };
  }, []);

  return null;
}
