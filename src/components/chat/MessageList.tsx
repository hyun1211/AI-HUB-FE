"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "@/types/chat";
import "katex/dist/katex.min.css";

/**
 * 서버에서 누락된 마크다운 공백을 자동으로 추가하는 함수
 */
function fixMarkdownSpacing(content: string): string {
  const lines = content.split('\n');
  const fixedLines = lines.map((line) => {
    // 1. 제목: #제목 → # 제목
    line = line.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');

    // 2. 순서 리스트: 1.항목 → 1. 항목
    line = line.replace(/^(\s*)(\d+\.)([^\s])/gm, '$1$2 $3');

    // 3. 체크박스: -[x]항목 → - [x] 항목, -[]항목 → - [ ] 항목
    line = line.replace(/^(\s*)-\[x\]([^\s])/gm, '$1- [x] $2');
    line = line.replace(/^(\s*)-\[x\]$/gm, '$1- [x]');
    line = line.replace(/^(\s*)-\[\]([^\s])/gm, '$1- [ ] $2');
    line = line.replace(/^(\s*)-\[\]$/gm, '$1- [ ]');

    // 4. 일반 리스트: -항목 → - 항목 (체크박스가 아닌 경우만)
    line = line.replace(/^(\s*)-([^\s\[])/gm, '$1- $2');

    return line;
  });

  return fixedLines.join('\n');
}

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
    }
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-[58px] sm:top-[65px] md:top-[75px] bottom-[90px] sm:bottom-[105px] md:bottom-[120px] left-0 right-0 overflow-y-auto px-3 sm:px-4 md:px-[21px] z-20 scrollbar-hide">
      <div className="max-w-[800px] mx-auto space-y-4 sm:space-y-5 md:space-y-6 py-4 sm:py-5 md:py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[100%] rounded-[8px] sm:rounded-[10px] md:rounded-[12px] py-2 sm:py-2.5 md:py-3 relative group ${
                message.role === "user"
                  ? "bg-[#ff983f] text-white px-2 sm:px-2.5 md:px-3"
                  : "bg-transparent text-white"
              }`}
            >
              {/* 이미지가 있으면 표시 */}
              {message.image && (
                <div className="mb-1.5 sm:mb-2">
                  <img
                    src={message.image}
                    alt="Attached"
                    className="max-w-full max-h-[150px] sm:max-h-[180px] md:max-h-[200px] rounded-[6px] sm:rounded-[8px]"
                  />
                </div>
              )}

              {/* 복사 버튼 - AI 응답에만 표시 */}
              {message.role === "assistant" && (
                <button
                  onClick={() => handleCopy(message.content, message.id)}
                  className="absolute bottom-[-0.8rem] sm:bottom-[-1rem] left-1 sm:left-2 p-1 sm:p-1.5 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all"
                  title="복사"
                >
                  {copiedId === message.id ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-400"
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
                    <img src="/copy-left.svg" alt="복사" className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              )}

              {/* 메시지 내용 */}
              {message.content && (
                <div className="font-['Pretendard:Regular',sans-serif] text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem] break-words markdown-content">
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      key={`md-${message.id}-${message.content.length}`}
                      remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        // 코드 블록 스타일링 (react-syntax-highlighter 사용)
                        code: ({ node, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || "");
                          const isInline = !match;
                          return isInline ? (
                            <code
                              className="bg-[rgba(255,255,255,0.1)] px-1 sm:px-1.5 py-0.5 rounded text-[#ff983f] text-[1.2rem] sm:text-[1.4rem] md:text-[1.6rem]"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match ? match[1] : "text"}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                borderRadius: "0.5rem",
                                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                              }}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          );
                        },
                        pre: ({ children }) => (
                          <div className="my-2 overflow-x-auto">
                            {children}
                          </div>
                        ),
                        // 링크 스타일링
                        a: ({ children, ...props }) => (
                          <a
                            className="text-[#ff983f] hover:underline text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          >
                            {children}
                          </a>
                        ),
                        // 리스트 스타일링
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside my-1.5 sm:my-2 space-y-0.5 sm:space-y-1 text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside my-1.5 sm:my-2 space-y-0.5 sm:space-y-1 text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">{children}</li>
                        ),
                        // 인용구 스타일링
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 sm:border-l-4 border-[#ff983f] pl-2 sm:pl-4 my-1.5 sm:my-2 italic opacity-80 text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">
                            {children}
                          </blockquote>
                        ),
                        // 제목 스타일링
                        h1: ({ children }) => (
                          <h1 className="text-[1.8rem] sm:text-[2.1rem] md:text-[2.4rem] font-bold mt-3 sm:mt-4 mb-1.5 sm:mb-2">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-[1.6rem] sm:text-[1.8rem] md:text-[2rem] font-bold mt-2.5 sm:mt-3 mb-1.5 sm:mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-[1.5rem] sm:text-[1.65rem] md:text-[1.8rem] font-bold mt-2 mb-1">
                            {children}
                          </h3>
                        ),
                        // 테이블 스타일링
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-1.5 sm:my-2">
                            <table className="border-collapse border border-[#444648] w-full text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-[#444648] px-2 sm:px-3 py-1.5 sm:py-2 bg-[rgba(255,255,255,0.05)] text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-[#444648] px-2 sm:px-3 py-1.5 sm:py-2 text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">
                            {children}
                          </td>
                        ),
                        // 수평선 스타일링
                        hr: () => (
                          <hr className="my-3 sm:my-4 border-t border-[#444648]" />
                        ),
                        // 단락 스타일링
                        p: ({ children }) => <p className="my-1.5 sm:my-2 text-[1.3rem] sm:text-[1.45rem] md:text-[1.6rem]">{children}</p>,
                      }}
                    >
                      {fixMarkdownSpacing(message.content)}
                    </ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">
                      {message.content}
                    </span>
                  )}
                  {message.role === "assistant" &&
                    isStreaming &&
                    message.id === messages[messages.length - 1]?.id && (
                      <span className="inline-flex gap-0.5 sm:gap-1 ml-1.5 sm:ml-2">
                        <span
                          className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-white rounded-full"
                          style={{
                            animation: 'dotBlink 1.4s infinite',
                            animationDelay: '0s'
                          }}
                        />
                        <span
                          className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-white rounded-full"
                          style={{
                            animation: 'dotBlink 1.4s infinite',
                            animationDelay: '0.2s'
                          }}
                        />
                        <span
                          className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-white rounded-full"
                          style={{
                            animation: 'dotBlink 1.4s infinite',
                            animationDelay: '0.4s'
                          }}
                        />
                        <style jsx>{`
                          @keyframes dotBlink {
                            0%, 60%, 100% {
                              opacity: 0;
                            }
                            30% {
                              opacity: 1;
                            }
                          }
                        `}</style>
                      </span>
                    )}
                </div>
              )}

              {/* 메시지 하단 정보 (시간, 토큰) */}
              <div className={`flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] md:text-[11px] ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}>
                {/* 토큰 표시 - 사용자 메시지 (흰색) */}
                {message.role === "user" && message.metadata?.inputTokens && (
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] text-white/80">
                    {message.metadata.inputTokens.toLocaleString()} tokens
                  </span>
                )}

                {/* 토큰 표시 - AI 응답 (회색) */}
                {message.role === "assistant" && message.metadata?.outputTokens && (
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] text-[#929292]">
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
