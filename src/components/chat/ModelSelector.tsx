"use client";

import React, { useState, useRef, useEffect } from "react";
import svgPathsModel from "@/assets/svgs/model";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getModels } from "@/lib/api/model";
import { AIModel } from "@/types/model";

interface ModelSelectorProps {
  onModelChange?: (model: AIModel) => void;
}

export function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // API에서 모델 목록 가져오기
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getModels();
        const activeModels = response.detail.filter((m) => m.isActive);
        setModels(activeModels);

        // 첫 번째 모델을 기본 선택
        if (activeModels.length > 0) {
          setSelectedModel(activeModels[0]);
          onModelChange?.(activeModels[0]);
        }
      } catch (err) {
        setError("모델 목록을 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // 모델 선택 핸들러
  const handleSelectModel = (model: AIModel) => {
    setSelectedModel(model);
    setIsOpen(false);
    onModelChange?.(model);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center">
        <div className="h-[35px] rounded-[5px] min-w-[140px] px-3 border border-[#444648] flex items-center justify-center">
          <p className="font-['Pretendard:Regular',sans-serif] text-[#898991] text-[15px]">
            로딩 중...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || models.length === 0) {
    return (
      <div className="flex-1 flex justify-center">
        <div className="h-[35px] rounded-[5px] min-w-[140px] px-3 border border-red-500/50 flex items-center justify-center">
          <p className="font-['Pretendard:Regular',sans-serif] text-red-400 text-[13px]">
            {error || "사용 가능한 모델이 없습니다"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center">
      <div className="flex items-center relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-[35px] rounded-[5px] min-w-[140px] px-3 border border-[#444648] flex items-center! justify-between gap-2 hover:border-[#666] transition-colors"
        >
          <p className="font-['Pretendard:Regular',sans-serif] text-[#e0e0e0] text-[15px] truncate">
            {selectedModel?.displayName || "모델 선택"}
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
              {models.map((model) => (
                <button
                  key={model.modelId}
                  onClick={() => handleSelectModel(model)}
                  className={`bg-zinc-900/50 min-h-[7rem] w-full text-left pl-[2.7rem] py-[1.4rem] hover:bg-zinc-800 transition-colors rounded-md ${
                    selectedModel?.modelId === model.modelId
                      ? "ring-2 ring-[#ff983f] bg-zinc-800 relative z-10"
                      : ""
                  }`}
                >
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-neutral-50 mb-1">
                    {model.displayName}
                  </p>
                  <p className="font-['Pretendard:Regular',sans-serif] text-[#898991] text-[13px] leading-relaxed">
                    {model.displayExplain}
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
