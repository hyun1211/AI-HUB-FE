"use client";

import React from "react";
import { SUGGESTED_PROMPTS } from "@/constants/prompts";

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
}

export function SuggestedPrompts({ onPromptClick }: SuggestedPromptsProps) {
  return (
    <div className="absolute left-[21px] right-[21px] bottom-[14rem] flex flex-col gap-[17px]">
      {SUGGESTED_PROMPTS.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="h-[46px] rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:border-[#666] transition-colors text-left px-[16.28px] flex items-center"
        >
          <p className="font-['Pretendard:Regular',sans-serif] text-[15px] text-white leading-[normal]">
            {prompt}
          </p>
        </button>
      ))}
    </div>
  );
}
