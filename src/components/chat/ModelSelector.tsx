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
    <div className="flex-1 flex justify-center ml-4">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-[35px] rounded-[5px] w-[128px] border border-[#444648] flex items-center justify-center gap-2 hover:border-[#666] transition-colors"
        >
          <p className="font-['Pretendard:Regular',sans-serif] text-[#e0e0e0] text-[15px]">
            Chat Model
          </p>
          <div className="h-[17px] w-[13px]">
            <div className={`h-[4.58px] w-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
                <path d={svgPathsModel.p275eec80} stroke="#F5F5F5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-[39px] left-0 bg-zinc-950 rounded-[5px] border border-zinc-800 overflow-hidden z-50 shadow-lg">
            <div className="flex flex-col gap-[10px] p-[10px]">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setIsOpen(false);
                  }}
                  className={`bg-zinc-950 h-[70px] w-[300px] text-left px-[17px] py-[14px] hover:bg-zinc-900 transition-colors rounded ${
                    selectedModel.id === model.id ? "ring-1 ring-[#ff983f]" : ""
                  }`}
                >
                  <p className="font-['Pretendard:Regular',sans-serif] text-[16px] text-neutral-50 mb-1">
                    {model.name}
                  </p>
                  <p className="font-['Pretendard:Regular',sans-serif] text-[#898991] text-[13px]">
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
