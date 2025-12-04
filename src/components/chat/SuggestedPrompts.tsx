"use client";

import React from "react";
import { SUGGESTED_PROMPTS } from "@/constants/prompts";

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

export function SuggestedPrompts({ onPromptClick }: SuggestedPromptsProps) {
  return (
    <div className="absolute left-3 sm:left-4 md:left-[21px] right-3 sm:right-4 md:right-[21px] bottom-[11rem] sm:bottom-[12.5rem] md:bottom-[14rem] flex flex-col gap-2 sm:gap-3 md:gap-[17px]">
      {SUGGESTED_PROMPTS.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="min-h-[38px] sm:min-h-[42px] md:h-[46px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:border-[#666] transition-colors text-left px-3 sm:px-4 md:px-[16.28px] flex items-center py-2"
        >
          <p className="font-['Pretendard:Regular',sans-serif] text-[13px] sm:text-[14px] md:text-[15px] text-white leading-[normal]">
            {prompt}
          </p>
        </button>
      ))}
    </div>
  );
}
