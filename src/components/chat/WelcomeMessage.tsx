"use client";

import React from "react";

interface WelcomeMessageProps {
  username?: string;
}

export function WelcomeMessage({ username = "이용자" }: WelcomeMessageProps) {
  return (
    <div className="absolute top-[12rem] sm:top-[15rem] md:top-[20rem] left-4 sm:left-8 md:left-[53px] right-4 sm:right-8 md:right-[53px] z-20">
      <p className="font-['Pretendard:SemiBold',sans-serif] text-[24px] sm:text-[30px] md:text-[36px] text-neutral-100 mb-3 sm:mb-4 md:mb-[16px]">
        반가워요, {username} 님.
      </p>
      <p className="font-['Pretendard:Regular',sans-serif] text-[#929292] text-[16px] sm:text-[20px] md:text-[24px]">
        오늘은 무엇을 도와드릴까요?
      </p>
    </div>
  );
}
