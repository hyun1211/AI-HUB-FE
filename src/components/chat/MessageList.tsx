"use client";

import React, { useEffect, useRef } from "react";
import { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가되면 스크롤을 하단으로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-[75px] bottom-[120px] left-0 right-0 overflow-y-auto px-[21px] z-20">
      <div className="max-w-[800px] mx-auto space-y-6 py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-[12px] px-4 py-3 ${
                message.role === "user"
                  ? "bg-[#ff983f] text-white"
                  : "bg-[rgba(245,245,245,0.15)] text-white border border-[#444648]"
              }`}
            >
              {/* 이미지가 있으면 표시 */}
              {message.image && (
                <div className="mb-2">
                  <img
                    src={message.image}
                    alt="Attached"
                    className="max-w-full max-h-[200px] rounded-[8px]"
                  />
                </div>
              )}

              {/* 메시지 내용 */}
              {message.content && (
                <div className="font-['Pretendard:Regular',sans-serif] text-[15px] whitespace-pre-wrap break-words">
                  {message.content}
                  {message.role === "assistant" &&
                    isStreaming &&
                    message.id === messages[messages.length - 1]?.id && (
                      <span className="inline-block w-[2px] h-[16px] bg-white ml-1 animate-pulse" />
                    )}
                </div>
              )}

              <div className="text-[11px] opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
