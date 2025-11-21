"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ModelSelector } from "./ModelSelector";
import { ChatInput } from "./ChatInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { MessageList } from "./MessageList";
import { Dashboard } from "../dashboard/Dashboard";
import { useChat } from "@/hooks/useChat";
import svgPathsMain from "@/assets/svgs/main";

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const {
    messages,
    message,
    setMessage,
    handleSendMessage,
    handleSubmit,
    isStreaming,
    pastedImage,
    handlePasteImage,
    removePastedImage,
  } = useChat();

  // Dashboard를 보여줄 때
  if (showDashboard) {
    return <Dashboard onClose={() => setShowDashboard(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onDashboardClick={() => {
          setShowDashboard(true);
          setSidebarOpen(false);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
          }}
        />
        <div className="absolute bg-zinc-950 inset-0" />

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 h-[75px] flex items-center px-[21px] z-30">
          {/* Left Section: Menu Button and Model Selector */}
          <div className="flex  gap-[36px]">
            {/* Menu Button */}
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
              className="h-[35px] w-[48px] hover:opacity-80 transition-opacity"
            >
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 35">
                <g>
                  <path d={svgPathsMain.p3902ef00} stroke="#444648" />
                  <path d={svgPathsMain.p38192d70} stroke="#929292" strokeWidth="2" />
                </g>
              </svg>
            </button>

            {/* Model Selector */}
            <ModelSelector />
          </div>

          {/* New Chat Button */}
          <button className="h-[35px] rounded-[5px] px-4 border border-[#ff983f] flex items-center gap-2 hover:bg-[#ff983f]/10 transition-colors ml-auto">
            <div className="size-[11px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                <path d="M6.5 1L6.5 12M12 6.5L1 6.5" stroke="url(#paint0_linear_new_chat)" strokeLinecap="round" strokeWidth="2" />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_new_chat" x1="6.5" x2="6.5" y1="1" y2="12">
                    <stop stopColor="#FF983F" />
                    <stop offset="1" stopColor="#FF983F" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="bg-[#ff983f] bg-clip-text font-['Pretendard:Regular',sans-serif] text-[15px] hidden sm:inline" style={{ WebkitTextFillColor: "transparent" }}>
              New Chat
            </span>
          </button>
        </div>

        {/* Welcome Message and Suggested Prompts - only show when no messages */}
        {messages.length === 0 && (
          <>
            <WelcomeMessage />
            <SuggestedPrompts onPromptClick={handleSendMessage} />
          </>
        )}

        {/* Message List - show when there are messages */}
        <MessageList messages={messages} isStreaming={isStreaming} />

        {/* Chat Input */}
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSubmit={handleSubmit}
          isStreaming={isStreaming}
          pastedImage={pastedImage}
          onPasteImage={handlePasteImage}
          onRemoveImage={removePastedImage}
        />
      </div>
    </div>
  );
}
