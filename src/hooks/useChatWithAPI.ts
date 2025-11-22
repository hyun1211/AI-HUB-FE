import { useState, useCallback, useRef } from "react";
import { Message } from "@/types/chat";
import { sendMessageWithStreaming } from "@/lib/api/message";
import { uploadFile } from "@/lib/api/upload";
import { SSECompletedData } from "@/types/message";

interface UseChatOptions {
  roomId: string;
  modelId: number;
  onError?: (error: Error) => void;
}

export function useChatWithAPI(options: UseChatOptions) {
  const { roomId, modelId, onError } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 파일 업로드 처리
  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploadingFile(true);
      try {
        const response = await uploadFile(file, modelId);
        // AI 서버에서 발급한 fileId 반환
        const fileId = response.detail.fileId;
        setUploadedFileId(fileId);
        return fileId;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("파일 업로드 실패");
        onError?.(error);
        throw error;
      } finally {
        setIsUploadingFile(false);
      }
    },
    [modelId, onError]
  );

  // 이미지 데이터를 파일로 변환하여 업로드
  const uploadImageData = useCallback(
    async (imageData: string) => {
      // base64 데이터를 Blob으로 변환
      const base64Data = imageData.split(",")[1];
      const mimeType = imageData.split(",")[0].split(":")[1].split(";")[0];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], `pasted-image-${Date.now()}.png`, {
        type: mimeType,
      });

      return handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // SSE 스트리밍으로 메시지 전송
  const handleSendMessage = useCallback(
    async (
      msg: string,
      imageData?: string | null,
      previousResponseId?: string
    ) => {
      if ((!msg.trim() && !imageData) || isStreaming) return;

      let fileId: string | null = null;

      // 이미지가 있으면 먼저 업로드
      if (imageData) {
        try {
          fileId = await uploadImageData(imageData);
        } catch (error) {
          console.error("Image upload failed:", error);
          return;
        }
      }

      // 사용자 메시지 추가
      const userMessageId = Date.now().toString();
      const userMessage: Message = {
        id: userMessageId,
        content: msg,
        role: "user",
        timestamp: new Date(),
        image: imageData || undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setPastedImage(null);
      setUploadedFileId(null);

      // AI 응답 메시지 생성 (빈 내용으로 시작)
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let accumulatedContent = "";

      try {
        // AbortController 생성
        abortControllerRef.current = new AbortController();

        await sendMessageWithStreaming(
          roomId,
          {
            message: msg,
            modelId,
            fileId: fileId || undefined,
            previousResponseId,
          },
          {
            onStart: () => {
              console.log("Streaming started");
            },
            onDelta: (text) => {
              accumulatedContent += text;

              // 메시지 업데이트
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedContent }
                    : m
                )
              );
            },
            onCompleted: (data: SSECompletedData) => {
              console.log("Streaming completed:", data);

              // 최종 메시지에 메타데이터 추가
              setMessages((prev) =>
                prev.map((m) => {
                  if (m.id === assistantMessageId) {
                    return {
                      ...m,
                      metadata: {
                        aiResponseId: data.aiResponseId,
                        inputTokens: data.inputTokens,
                        outputTokens: data.outputTokens,
                      },
                    };
                  }
                  if (m.id === userMessageId) {
                    return {
                      ...m,
                      metadata: {
                        userMessageId: data.userMessageId,
                      },
                    };
                  }
                  return m;
                })
              );

              setIsStreaming(false);
            },
            onError: (error) => {
              console.error("Streaming error:", error);

              // 에러 메시지 표시
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        content: `오류: ${error.message}`,
                      }
                    : m
                )
              );

              setIsStreaming(false);
              onError?.(error);
            },
          },
          abortControllerRef.current.signal
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Stream aborted");
        } else {
          console.error("Error streaming message:", error);

          const err = error instanceof Error ? error : new Error("전송 실패");

          // 에러 발생 시 에러 메시지 표시
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: `오류: ${err.message}`,
                  }
                : m
            )
          );

          onError?.(err);
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [
      isStreaming,
      roomId,
      modelId,
      uploadImageData,
      onError,
    ]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if ((message.trim() || pastedImage) && !isStreaming && !isUploadingFile) {
        handleSendMessage(message, pastedImage);
        setMessage("");
      }
    },
    [message, pastedImage, isStreaming, isUploadingFile, handleSendMessage]
  );

  // 스트리밍 중단
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  // 이미지 붙여넣기 처리
  const handlePasteImage = useCallback((imageData: string) => {
    setPastedImage(imageData);
  }, []);

  // 이미지 제거
  const removePastedImage = useCallback(() => {
    setPastedImage(null);
    setUploadedFileId(null);
  }, []);

  return {
    messages,
    message,
    setMessage,
    handleSendMessage,
    handleSubmit,
    isStreaming,
    isUploadingFile,
    stopStreaming,
    pastedImage,
    handlePasteImage,
    removePastedImage,
    handleFileUpload,
  };
}
