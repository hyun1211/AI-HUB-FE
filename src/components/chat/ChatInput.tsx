"use client";

import React from "react";
import svgPathsMain from "@/assets/svgs/main";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ message, setMessage, onSubmit }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-[17px] left-[21px] right-[21px]">
      <form onSubmit={onSubmit}>
        <div className="bg-[rgba(245,245,245,0.15)] rounded-[12px] border border-[#444648] relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="궁금한 걸 입력해주세요..."
            className="w-full h-[87px] bg-transparent px-[10px] py-[15px] text-white font-['Pretendard:Regular',sans-serif] text-[15px] resize-none focus:outline-none placeholder:text-white"
            onKeyDown={handleKeyDown}
          />

          {/* Attachment button */}
          <button
            type="button"
            className="absolute left-[8px] bottom-[15px] size-[24px]"
            data-name="paperclip-02"
          >
            <div className="absolute flex inset-[8.253%] items-center justify-center">
              <div className="flex-none h-[9.139px] rotate-[315deg] w-[19.2px]">
                <div className="relative size-full">
                  <div className="absolute inset-[-10.94%_-5.21%]" style={{ "--stroke-0": "rgba(146, 146, 146, 1)" } as React.CSSProperties}>
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 12">
                      <path d={svgPathsMain.p2e6ff880} stroke="var(--stroke-0, #929292)" strokeLinecap="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Send button */}
          <button
            type="submit"
            className="absolute right-[8px] bottom-[15px] size-[31px] hover:opacity-80 transition-opacity"
            disabled={!message.trim()}
          >
            <div className="absolute inset-[-3.333%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <g>
                  <path d={svgPathsMain.p34245700} fill={message.trim() ? "#E0E0E0" : "rgba(224, 224, 224, 0.3)"} fillOpacity={message.trim() ? "1" : "0.5"} />
                  <path d={svgPathsMain.p362c24f0} fill="#444648" />
                </g>
              </svg>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
