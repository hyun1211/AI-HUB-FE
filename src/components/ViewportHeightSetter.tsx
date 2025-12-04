"use client";

import { useEffect } from "react";

/**
 * 실제 viewport 높이를 계산하여 CSS 변수로 설정
 * 카카오톡 인앱 브라우저 등에서 상단/하단바로 인한 높이 변화 대응
 */
export function ViewportHeightSetter() {
  useEffect(() => {
    const setViewportHeight = () => {
      // 1vh = window.innerHeight의 1%
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      // 실제 viewport 높이도 저장
      document.documentElement.style.setProperty("--real-vh", `${window.innerHeight}px`);
    };

    // 초기 설정
    setViewportHeight();

    // resize 이벤트 리스너 추가
    window.addEventListener("resize", setViewportHeight);
    // 모바일에서 orientation 변경 대응
    window.addEventListener("orientationchange", setViewportHeight);

    return () => {
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("orientationchange", setViewportHeight);
    };
  }, []);

  return null;
}
