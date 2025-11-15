"use client";

import React from "react";

interface WelcomeMessageProps {
  username?: string;
}

export function WelcomeMessage({ username = "chabin37" }: WelcomeMessageProps) {
  return (
    <div className="absolute top-[319px] left-[53px] right-[53px] z-20">
      <p className="font-['Pretendard:SemiBold',sans-serif] text-[36px] text-neutral-100 mb-[16px]">
        반가워요, {username}.
      </p>
      <p className="font-['Pretendard:Regular',sans-serif] text-[#929292] text-[24px]">
        오늘은 무엇을 도와드릴까요?
      </p>
    </div>
  );
}
