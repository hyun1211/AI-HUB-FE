"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import svgPathsDashboard from "@/assets/svgs/dashboard";
import svgPathsModelUsage from "@/assets/svgs/modelUsage";
import svgPathsMonthlyUsage from "@/assets/svgs/monthlyUsage";

interface DashboardProps {
  onClose: () => void;
}

const slides = [
  { id: 0, title: "내 총 코인량" },
  { id: 1, title: "AI모델별 코인 사용량" },
  { id: 2, title: "월별 사용 코인량" },
];

export function Dashboard({ onClose }: DashboardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const paginate = (newDirection: number) => {
    setCurrentSlide((prev) => {
      const next = prev + newDirection;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#09090B] overflow-y-auto" data-name="대시보드 UI">
      <div className="max-w-[508px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="h-[35px] rounded-[5px] w-[48px] hover:bg-[#2c2e30] transition-colors border border-[#444648] flex items-center justify-center"
          >
            <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
              <path
                d={svgPathsDashboard.p20b2fe00}
                stroke="#F5F5F5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-[#1d1f21] h-[71px] rounded-lg flex items-center justify-center gap-3 sm:gap-4 px-4">
          <button className="bg-gradient-to-b from-[#ff7600] from-[29.808%] to-[#ff983f] rounded-[7px] h-[53px] flex-1 max-w-[200px] font-['Pretendard:Regular',sans-serif] text-white text-[18px] sm:text-[22px] whitespace-nowrap">
            DashBoard
          </button>
          <button className="bg-transparent rounded-[7px] h-[53px] flex-1 max-w-[200px] font-['Pretendard:Regular',sans-serif] text-white text-[18px] sm:text-[22px] whitespace-nowrap hover:bg-[#2c2e30] transition-colors">
            모델당 가격
          </button>
        </div>

        {/* Cards Carousel Section */}
        <div className="relative w-full h-[280px] sm:h-[300px] overflow-hidden">
          <motion.div
            key={currentSlide}
            custom={currentSlide}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                paginate(1);
              } else if (swipe > 10000) {
                paginate(-1);
              }
            }}
            className="w-full h-full"
          >
            {currentSlide === 0 && (
              <div className="relative h-full w-full bg-[rgba(29,31,33,0.95)] rounded-[15px] p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-neutral-100 text-[20px] sm:text-[24px]">
                    내 총 코인량
                  </p>
                  <div className="h-[27px] rounded-[4px] px-2 border border-[#929292] flex items-center gap-2">
                    <svg className="w-[17px] h-[19px]" fill="none" viewBox="0 0 19 22">
                      <path
                        d={svgPathsDashboard.p25bbfa00}
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <p className="font-['Pretendard:Regular',sans-serif] text-[#e0e0e0] text-[13px] sm:text-[15px]">
                      monthly
                    </p>
                    <svg className="w-[13px] h-[17px]" fill="none" viewBox="0 0 13 17">
                      <path
                        d="M2 7L7.00081 11.58L12 7"
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Chart container */}
                <div className="relative h-[180px] sm:h-[200px] w-full flex">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between py-2 pr-2 text-white font-['Pretendard:SemiBold',sans-serif] text-[12px] sm:text-[14px]">
                    <span>20k</span>
                    <span>10k</span>
                    <span>5k</span>
                  </div>

                  {/* Chart */}
                  <div className="flex-1 relative">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 340 116"
                    >
                      <path d={svgPathsDashboard.p23627680} stroke="#FF7600" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-8 text-white font-['Pretendard:SemiBold',sans-serif] text-[13px] sm:text-[16px]">
                  <span>6월</span>
                  <span>7월</span>
                  <span>8월</span>
                  <span>9월</span>
                  <span>10월</span>
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="relative h-full w-full bg-[rgba(29,31,33,0.95)] rounded-[15px] p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-neutral-100 text-[18px] sm:text-[24px]">
                    AI모델별 코인 사용량
                  </p>
                  <div className="h-[27px] rounded-[4px] px-2 border border-[#929292] flex items-center gap-2">
                    <svg className="w-[17px] h-[19px]" fill="none" viewBox="0 0 19 22">
                      <path
                        d={svgPathsModelUsage.p25bbfa00}
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <p className="font-['Pretendard:Regular',sans-serif] text-[#e0e0e0] text-[13px] sm:text-[15px]">
                      monthly
                    </p>
                    <svg className="w-[13px] h-[17px]" fill="none" viewBox="0 0 13 17">
                      <path
                        d="M2 7L7.00081 11.58L12 7"
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Horizontal bar chart */}
                <div className="space-y-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-['Pretendard:SemiBold',sans-serif] text-white text-[11px] sm:text-[12px] w-[60px]">
                      chatGPT
                    </span>
                    <div
                      className="flex-1 bg-[#ff7600] h-[18px] sm:h-[21px] rounded-br-[8px] rounded-tr-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Pretendard:SemiBold',sans-serif] text-white text-[11px] sm:text-[12px] w-[60px]">
                      Claude
                    </span>
                    <div
                      className="flex-1 bg-[#e0e0e0] h-[18px] sm:h-[21px] rounded-br-[8px] rounded-tr-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                      style={{ width: "20%" }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Pretendard:SemiBold',sans-serif] text-white text-[11px] sm:text-[12px] w-[60px]">
                      Grok
                    </span>
                    <div
                      className="flex-1 bg-[#e0e0e0] h-[18px] sm:h-[21px] rounded-br-[8px] rounded-tr-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                      style={{ width: "65%" }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Pretendard:SemiBold',sans-serif] text-white text-[11px] sm:text-[12px] w-[60px]">
                      Gemini
                    </span>
                    <div
                      className="flex-1 bg-[#e0e0e0] h-[18px] sm:h-[21px] rounded-br-[8px] rounded-tr-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                      style={{ width: "40%" }}
                    />
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between pl-[68px] mt-2 text-white font-['Pretendard:SemiBold',sans-serif] text-[13px] sm:text-[16px]">
                  <span>0</span>
                  <span>1K</span>
                  <span>2K</span>
                  <span>3K</span>
                  <span>4K</span>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="relative h-full w-full bg-[rgba(29,31,33,0.95)] rounded-[15px] p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-neutral-100 text-[20px] sm:text-[24px]">
                    월별 사용 코인량
                  </p>
                  <div className="h-[27px] rounded-[4px] px-2 border border-[#929292] flex items-center gap-2">
                    <svg className="w-[17px] h-[19px]" fill="none" viewBox="0 0 19 22">
                      <path
                        d={svgPathsMonthlyUsage.p25bbfa00}
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <p className="font-['Pretendard:Regular',sans-serif] text-[#e0e0e0] text-[13px] sm:text-[15px]">
                      monthly
                    </p>
                    <svg className="w-[13px] h-[17px]" fill="none" viewBox="0 0 13 17">
                      <path
                        d="M2 7L7.00081 11.58L12 7"
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Chart container */}
                <div className="relative h-[180px] sm:h-[200px] w-full flex">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between py-2 pr-2 text-white font-['Pretendard:SemiBold',sans-serif] text-[12px] sm:text-[14px]">
                    <span>20k</span>
                    <span>10k</span>
                    <span>5k</span>
                  </div>

                  {/* Chart */}
                  <div className="flex-1 relative">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 350 144"
                    >
                      <path d={svgPathsMonthlyUsage.pdb717e8} stroke="#FF7600" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-8 text-white font-['Pretendard:SemiBold',sans-serif] text-[13px] sm:text-[16px]">
                  <span>6월</span>
                  <span>7월</span>
                  <span>8월</span>
                  <span>9월</span>
                  <span>10월</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Pagination dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(slide.id)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === slide.id ? "w-6 bg-[#ff7600]" : "w-2 bg-gray-400"
                }`}
                aria-label={`Go to slide ${slide.id + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 채팅별 사용 코인량 Section */}
        <div className="bg-[rgba(29,31,33,0.95)] rounded-[15px] p-4 sm:p-6">
          <h2 className="font-['Pretendard:SemiBold',sans-serif] text-neutral-100 text-[20px] sm:text-[24px] mb-4">
            채팅별 사용 코인량
          </h2>

          {/* Table */}
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 sm:gap-4 text-white font-['Pretendard:Regular',sans-serif] text-[14px] sm:text-[16px] px-2">
              <div>Date</div>
              <div>Topic</div>
              <div>amount</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-2">
              {[
                { date: "2025/10/10", topic: "컴퓨터구조 빠르게 공부하는 법", amount: "-3$" },
                { date: "2025/10/10", topic: "컴퓨터구조 느리게 공부하는 법", amount: "-5$" },
                { date: "2025/10/10", topic: "컴퓨터구조 재밌게 공부하는 법", amount: "-10$" },
              ].map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_2fr_auto] gap-2 sm:gap-4 border border-[#444648] rounded-[8px] p-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-white font-['Pretendard:Regular',sans-serif] text-[12px] sm:text-[13px]"
                >
                  <div className="truncate">{row.date}</div>
                  <div className="truncate">{row.topic}</div>
                  <div className="text-right">{row.amount}</div>
                </div>
              ))}

              {/* Dots row */}
              <div className="border border-[#444648] rounded-[8px] p-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
                <p className="font-['Pretendard:Regular',sans-serif] text-[13px] text-white rotate-90">
                  ...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
