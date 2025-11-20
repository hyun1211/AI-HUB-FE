"use client";

import React from "react";
import svgPathsSidebar from "@/assets/svgs/sidebar";
import { MOCK_CHAT_HISTORY } from "@/constants/chatHistory";
import { ChatHistoryItem } from "@/types/chat";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onDashboardClick?: () => void;
}

export function Sidebar({ isOpen, onClose, onDashboardClick }: SidebarProps) {
  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[316px] bg-[#1d1f21] z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:z-0`}
      >
        {/* Header */}
        <div className="h-[54px] border-b border-[#2c2e30]" />

        {/* New Chat Section */}
        <div className="h-[57px] border-b border-[#2c2e30] relative">
          <p className="absolute font-['Pretendard:SemiBold',sans-serif] leading-[normal] left-[5rem] not-italic text-[#ff7600] text-[16px] text-nowrap top-[1.7rem] whitespace-pre">
            new 채팅
          </p>
          <img src="/pencil.svg" alt="pencil" className="absolute left-[7px] top-[10px]" />
        </div>

        {/* Previous Chats Section */}
        <div className="h-[57px] border-b border-[#2c2e30] relative">
          <p className="absolute font-['Pretendard:Regular',sans-serif] leading-[normal] left-[calc(12.5%+2.75px)] not-italic text-[16px] text-neutral-100 text-nowrap top-[20px] whitespace-pre">
            이전 기록
          </p>
          <div className="absolute left-[5px] size-[30px] top-[13px]" data-name="message-circle">
            <div className="absolute inset-[12.5%]" data-name="Icon">
              <div className="absolute inset-[-4.44%]" style={{ "--stroke-0": "rgba(245, 245, 245, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
                  <path d={svgPathsSidebar.p2874a000} id="Icon" stroke="var(--stroke-0, #F5F5F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* AI Usage Section */}
        <button
          onClick={onDashboardClick}
          className="h-[57px] border-b border-[#2c2e30] relative w-full hover:bg-[#2c2e30] transition-colors"
        >
          <p className="absolute font-['Pretendard:Regular',sans-serif] leading-[normal] left-[calc(12.5%+2.75px)] not-italic text-[16px] text-neutral-100 text-nowrap top-[19px] whitespace-pre">
            이번 달 AI 사용량
          </p>
          <div className="absolute left-[5px] size-[30px] top-[13px]" data-name="bar-group-02">
            <div className="absolute flex inset-[12.5%] items-center justify-center">
              <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[18px]">
                <div className="relative size-full" data-name="Icon">
                  <div className="absolute inset-[-4.444%]" style={{ "--stroke-0": "rgba(245, 245, 245, 1)" } as React.CSSProperties}>
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
                      <path d={svgPathsSidebar.p1c82b380} id="Icon" stroke="var(--stroke-0, #F5F5F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-[28px] size-[10px] top-[35px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
              <circle cx="5" cy="5" fill="url(#paint0_linear_1_238)" id="Ellipse 2" r="5" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_238" x1="5" x2="5" y1="0" y2="10">
                  <stop stopColor="#FF983F" />
                  <stop offset="1" stopColor="#FF983F" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </button>

        {/* Recent Chat Header */}
        <div className="px-4 py-3">
          <p className="font-['Pretendard:Regular',sans-serif] text-[16px]">
            <span className="text-neutral-100">최근</span>
            <span className="text-white"> 채팅</span>
          </p>
        </div>

        {/* Chat History List */}
        <div className="overflow-y-auto">
          {MOCK_CHAT_HISTORY.map((chat: ChatHistoryItem) => (
            <div key={chat.id} className="h-[45px] relative hover:bg-[#2c2e30] cursor-pointer">
              <p className="absolute font-['Pretendard:Regular',sans-serif] leading-[normal] left-[17px] not-italic text-[16px] text-neutral-100 top-[10px] w-[149px] truncate">
                {chat.title}
              </p>
              <p className="absolute font-['Pretendard:Regular',sans-serif] leading-[normal] right-[17px] not-italic text-[#444648] text-[13px] text-right top-[18px]">
                {chat.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
