"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 새 메시지가 추가되면 스크롤을 하단으로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 클립보드 복사 함수
  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000); // 2초 후 복사 상태 초기화
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-[75px] bottom-[120px] left-0 right-0 overflow-y-auto px-[21px] z-20 scrollbar-hide">
      <div className="max-w-[800px] mx-auto space-y-6 py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[100%] rounded-[12px]  py-3 relative group ${
                message.role === "user"
                  ? "bg-[#ff983f] text-white px-3"
                  : "bg-transparent text-white"
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

              {/* 복사 버튼 - AI 응답에만 표시 */}
              {message.role === "assistant" && (
                <button
                  onClick={() => handleCopy(message.content, message.id)}
                  className="absolute bottom-[-1rem] left-2 p-1.5 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all"
                  title="복사"
                >
                  {copiedId === message.id ? (
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <img src="/copy-left.svg" alt="복사" className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* 메시지 내용 */}
              {message.content && (
                <div className="font-['Pretendard:Regular',sans-serif] !text-[1.6rem] break-words markdown-content">
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        // 코드 블록 스타일링
                        code: ({ node, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || "");
                          const isInline = !match;
                          return isInline ? (
                            <code
                              className="bg-[rgba(255,255,255,0.1)] px-1.5 py-0.5 rounded text-[#ff983f] !text-[1.6rem]"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <code className={`${className} !text-[1.6rem]`} {...props}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="bg-[rgba(0,0,0,0.3)] p-3 rounded-lg overflow-x-auto my-2 border border-[#444648]">
                            {children}
                          </pre>
                        ),
                        // 링크 스타일링
                        a: ({ children, ...props }) => (
                          <a
                            className="text-[#ff983f] hover:underline !text-[1.6rem]"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          >
                            {children}
                          </a>
                        ),
                        // 리스트 스타일링
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside my-2 space-y-1 !text-[1.6rem]">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside my-2 space-y-1 !text-[1.6rem]">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="!text-[1.6rem]">{children}</li>
                        ),
                        // 인용구 스타일링
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-[#ff983f] pl-4 my-2 italic opacity-80 !text-[1.6rem]">
                            {children}
                          </blockquote>
                        ),
                        // 제목 스타일링
                        h1: ({ children }) => (
                          <h1 className="!text-[2.4rem] font-bold mt-4 mb-2">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="!text-[2rem] font-bold mt-3 mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="!text-[1.8rem] font-bold mt-2 mb-1">
                            {children}
                          </h3>
                        ),
                        // 테이블 스타일링
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-2">
                            <table className="border-collapse border border-[#444648] w-full !text-[1.6rem]">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-[#444648] px-3 py-2 bg-[rgba(255,255,255,0.05)] !text-[1.6rem]">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-[#444648] px-3 py-2 !text-[1.6rem]">
                            {children}
                          </td>
                        ),
                        // 수평선 스타일링
                        hr: () => (
                          <hr className="my-4 border-t border-[#444648]" />
                        ),
                        // 단락 스타일링
                        p: ({ children }) => <p className="my-2 !text-[1.6rem]">{children}</p>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">
                      {message.content}
                    </span>
                  )}
                  {message.role === "assistant" &&
                    isStreaming &&
                    message.id === messages[messages.length - 1]?.id && (
                      <span className="inline-block w-[2px] h-[16px] bg-white ml-1 animate-pulse" />
                    )}
                </div>
              )}

              {/* 메시지 하단 정보 (시간, 토큰) */}
              <div className={`flex items-center gap-2 mt-2 text-[11px] ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}>
                {/* 토큰 표시 - 사용자 메시지 (흰색) */}
                {message.role === "user" && message.metadata?.inputTokens && (
                  <span className="text-[10px] text-white/80">
                    {message.metadata.inputTokens.toLocaleString()} tokens
                  </span>
                )}

                {/* 토큰 표시 - AI 응답 (회색) */}
                {message.role === "assistant" && message.metadata?.outputTokens && (
                  <span className="text-[10px] text-[#929292]">
                    {message.metadata.outputTokens.toLocaleString()} tokens
                  </span>
                )}

                {/* 시간 표시 - 사용자 메시지에만 (흰색) */}
                {message.role === "user" && (
                  <span className="text-white/80">
                    {message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
