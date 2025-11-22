"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { ModelSelector } from "./ModelSelector";
import { ChatInput } from "./ChatInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { MessageList } from "./MessageList";
import { Dashboard } from "../dashboard/Dashboard";
import { Balance } from "../balance/Balance";
import { useChatWithAPI } from "@/hooks/useChatWithAPI";
import { createChatRoom } from "@/lib/api/room";
import svgPathsMain from "@/assets/svgs/main";

// 채팅방 제목 생성 함수 (현재 시간 기반)
function generateChatRoomTitle(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `새 대화 ${month}/${day} ${hours}:${minutes}`;
}

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(1);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // 채팅방 생성 함수
  const createNewChatRoom = useCallback(async (modelId: number) => {
    setIsCreatingRoom(true);
    try {
      const response = await createChatRoom({
        title: generateChatRoomTitle(),
        modelId,
      });
      const newRoomId = response.detail.roomId;
      setRoomId(newRoomId);
      console.log(`Chat room created: ${newRoomId}`);
      return newRoomId;
    } catch (error) {
      console.error("Failed to create chat room:", error);
      throw error;
    } finally {
      setIsCreatingRoom(false);
    }
  }, []);

  // 초기 채팅방 생성
  useEffect(() => {
    if (!roomId && selectedModelId > 0) {
      createNewChatRoom(selectedModelId);
    }
  }, [roomId, selectedModelId, createNewChatRoom]);

  const {
    messages,
    message,
    setMessage,
    handleSendMessage,
    handleSubmit,
    isStreaming,
    isUploadingFile,
    pastedImage,
    handlePasteImage,
    removePastedImage,
    handleFileUpload,
  } = useChatWithAPI({
    roomId: roomId || "",
    modelId: selectedModelId,
    onError: (error) => {
      console.error("Chat error:", error.message);
    },
  });

  // New Chat 버튼 클릭 핸들러
  const handleNewChat = useCallback(async () => {
    if (isCreatingRoom) return;
    try {
      await createNewChatRoom(selectedModelId);
      // 메시지 초기화는 useChatWithAPI에서 roomId 변경 시 처리
      window.location.reload(); // 간단하게 새로고침으로 상태 초기화
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  }, [selectedModelId, isCreatingRoom, createNewChatRoom]);

  // Dashboard를 보여줄 때
  if (showDashboard) {
    return <Dashboard onClose={() => setShowDashboard(false)} />;
  }

  // Balance를 보여줄 때
  if (showBalance) {
    return <Balance onBack={() => setShowBalance(false)} />;
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
        onBalanceClick={() => {
          setShowBalance(true);
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
            <ModelSelector
              onModelChange={(model, modelId) => {
                setSelectedModelId(modelId);
                console.log(`Model changed: ${model.name} (ID: ${modelId})`);
              }}
            />
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            disabled={isCreatingRoom}
            className="h-[35px] rounded-[5px] px-4 border border-[#ff983f] flex items-center gap-2 hover:bg-[#ff983f]/10 transition-colors ml-auto disabled:opacity-50"
          >
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
          isStreaming={isStreaming || isCreatingRoom || !roomId}
          pastedImage={pastedImage}
          onPasteImage={handlePasteImage}
          onRemoveImage={removePastedImage}
          onFileSelect={handleFileUpload}
          isUploadingFile={isUploadingFile}
        />
      </div>
    </div>
  );
}
