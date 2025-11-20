"use client";

import React, { useState, useRef } from "react";
import svgPathsModel from "@/assets/svgs/model";
import { AI_MODELS, DEFAULT_MODEL } from "@/constants/aiModels";
import { AIModel } from "@/types/chat";
import { useClickOutside } from "@/hooks/useClickOutside";

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_MODEL);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="flex-1 flex justify-center">
      <div className="flex items-center relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-[35px] rounded-[5px] min-w-[140px] px-3 border border-[#444648] flex items-center! justify-between gap-2 hover:border-[#666] transition-colors"
        >
          <p className="font-['Pretendard:Regular',sans-serif] text-[#e0e0e0] text-[15px] truncate">
            {selectedModel.name}
          </p>
          <div className="h-[17px] w-[13px] flex-shrink-0 relative flex items-center justify-center">
            <div
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              <svg
                className="block w-[10px] h-[6px]"
                fill="none"
                viewBox="0 0 12 7"
              >
                <path
                  d={svgPathsModel.p275eec80}
                  stroke="#F5F5F5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-[3.5rem] left-0 bg-zinc-950 rounded-[8px] border border-zinc-800 z-50 shadow-lg w-[calc(100vw-4rem)] max-w-[30rem] p-3">
            <div className="flex flex-col gap-2">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setIsOpen(false);
                  }}
                  className={`bg-zinc-900/50 min-h-[7rem] w-full text-left pl-[2.7rem] py-[1.4rem] hover:bg-zinc-800 transition-colors rounded-md ${
                    selectedModel.id === model.id
                      ? "ring-2 ring-[#ff983f] bg-zinc-800 relative z-10"
                      : ""
                  }`}
                >
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-neutral-50 mb-1">
                    {model.name}
                  </p>
                  <p className="font-['Pretendard:Regular',sans-serif] text-[#898991] text-[13px] leading-relaxed">
                    {model.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
