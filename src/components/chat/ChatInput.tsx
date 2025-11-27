"use client";

import React, { useEffect, useRef, useState } from "react";
import svgPathsMain from "@/assets/svgs/main";
import { ALLOWED_EXTENSIONS, ALLOWED_IMAGE_TYPES } from "@/types/upload";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isStreaming?: boolean;
  pastedImage?: string | null;
  onPasteImage?: (imageData: string) => void;
  onRemoveImage?: () => void;
  onFileSelect?: (file: File) => void;
  isUploadingFile?: boolean;
  hasInsufficientBalance?: boolean;
}

export function ChatInput({
  message,
  setMessage,
  onSubmit,
  isStreaming,
  pastedImage,
  onPasteImage,
  onRemoveImage,
  onFileSelect,
  isUploadingFile,
  hasInsufficientBalance,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dots, setDots] = useState(".");

  // 로딩 중일 때 점 애니메이션
  useEffect(() => {
    if (!isStreaming) {
      setDots(".");
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  // 파일 선택 처리 (이미지 형식만 허용)
  // onPasteImage를 통해 미리보기 + 즉시 업로드가 처리됨
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 형식 검증 (jpg, jpeg, png, webp만 허용)
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
        alert("지원하지 않는 파일 형식입니다. jpg, jpeg, png, webp 이미지만 업로드 가능합니다.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // 파일을 base64로 변환 후 onPasteImage 호출 (미리보기 + 즉시 업로드)
      if (onPasteImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          onPasteImage(base64);
        };
        reader.readAsDataURL(file);
      }
    }
    // input 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 첨부 버튼 클릭
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // 클립보드 붙여넣기 처리 (이미지 형식만 허용)
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // 이미지 타입인 경우
      if (item.type.indexOf("image") !== -1) {
        // 이미지 형식 검증 (jpg, jpeg, png, webp만 허용)
        if (!ALLOWED_IMAGE_TYPES.includes(item.type as typeof ALLOWED_IMAGE_TYPES[number])) {
          e.preventDefault();
          alert("지원하지 않는 파일 형식입니다. jpg, jpeg, png, webp 이미지만 업로드 가능합니다.");
          return;
        }

        e.preventDefault();
        const blob = item.getAsFile();
        if (blob && onPasteImage) {
          // Blob을 base64로 변환 후 onPasteImage 호출 (즉시 업로드됨)
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            onPasteImage(base64);
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  };

  return (
    <div className="absolute bottom-[17px] left-[21px] right-[21px]">
      {/* 이미지 미리보기 */}
      {pastedImage && (
        <div className="mb-2 bg-[rgba(245,245,245,0.15)] rounded-[8px] border border-[#444648] p-2 relative inline-block">
          <img
            src={pastedImage}
            alt="Pasted"
            className="max-h-[100px] max-w-[150px] rounded-[4px]"
          />
          {/* 제거 버튼 */}
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute -top-2 -right-2 size-[20px] bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <svg className="size-[12px]" fill="none" viewBox="0 0 12 12">
              <path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="bg-[rgba(245,245,245,0.15)] rounded-[12px] border border-[#444648] relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={handlePaste}
            placeholder={isStreaming ? `AI가 응답 중입니다${dots}` : "궁금한 걸 입력해주세요..."}
            className="w-full h-[87px] bg-transparent px-[10px] py-[15px] text-white font-['Pretendard:Regular',sans-serif] text-[15px] resize-none focus:outline-none placeholder:text-white disabled:opacity-50"
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Attachment button */}
          <button
            type="button"
            onClick={handleAttachClick}
            disabled={isStreaming || isUploadingFile}
            className="absolute left-[8px] bottom-[15px] size-[24px] hover:opacity-70 transition-opacity disabled:opacity-30"
            data-name="paperclip-02"
            title="파일 첨부"
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
            className="absolute right-[8px] bottom-[15px] size-[31px] hover:opacity-80 transition-opacity disabled:opacity-50"
            disabled={(!message.trim() && !pastedImage) || isStreaming || hasInsufficientBalance}
            title={hasInsufficientBalance ? "토큰이 부족합니다" : undefined}
          >
            <div className="absolute inset-[-3.333%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <g>
                  <path d={svgPathsMain.p34245700} fill={(message.trim() || pastedImage) && !hasInsufficientBalance ? "#E0E0E0" : "rgba(224, 224, 224, 0.3)"} fillOpacity={(message.trim() || pastedImage) && !hasInsufficientBalance ? "1" : "0.5"} />
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
