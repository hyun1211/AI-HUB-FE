import { useState, useCallback, useRef } from "react";
import { Message } from "@/types/chat";
import { sendMessageWithStreaming, getMessages, convertToUIMessages } from "@/lib/api/message";
import { uploadFile } from "@/lib/api/upload";
import { SSECompletedData } from "@/types/message";
import { ALLOWED_IMAGE_TYPES } from "@/types/upload";

interface UseChatOptions {
  roomId: string;
  modelId: number;
  onError?: (error: Error) => void;
  createRoom?: () => Promise<string>;
  onRoomCreated?: (roomId: string) => void;
}

export function useChatWithAPI(options: UseChatOptions) {
  const { roomId, modelId, onError, createRoom, onRoomCreated } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 파일 업로드 처리 (즉시 업로드하고 fileId 저장)
  const handleFileUpload = useCallback(
    async (file: File): Promise<{ fileId: string; fileUrl: string } | null> => {
      if (!modelId) {
        const error = new Error("AI 모델이 선택되지 않았습니다.");
        onError?.(error);
        return null;
      }

      // 이미지 형식 검증 (jpg, jpeg, png, webp만 허용)
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
        const error = new Error("지원하지 않는 파일 형식입니다. jpg, jpeg, png, webp 이미지만 업로드 가능합니다.");
        onError?.(error);
        return null;
      }

      setIsUploadingFile(true);
      try {
        const response = await uploadFile(file, modelId);
        // 업로드된 파일 ID 저장 (메시지 전송 시 사용)
        const fileId = response.detail.fileId;
        const fileUrl = response.detail.fileUrl;
        setUploadedFileId(fileId);
        return { fileId, fileUrl };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("파일 업로드 실패");
        onError?.(error);
        return null;
      } finally {
        setIsUploadingFile(false);
      }
    },
    [modelId, onError]
  );

  // 이미지 데이터(base64)를 파일로 변환하여 즉시 업로드
  const uploadImageData = useCallback(
    async (imageData: string): Promise<{ fileId: string; fileUrl: string } | null> => {
      // base64 데이터를 Blob으로 변환
      const base64Data = imageData.split(",")[1];
      const mimeType = imageData.split(",")[0].split(":")[1].split(";")[0];

      // 이미지 형식 검증
      if (!ALLOWED_IMAGE_TYPES.includes(mimeType as typeof ALLOWED_IMAGE_TYPES[number])) {
        const error = new Error("지원하지 않는 파일 형식입니다. jpg, jpeg, png, webp 이미지만 업로드 가능합니다.");
        onError?.(error);
        return null;
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // 파일 확장자 결정
      const ext = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
      const file = new File([blob], `pasted-image-${Date.now()}.${ext}`, {
        type: mimeType,
      });

      return handleFileUpload(file);
    },
    [handleFileUpload, onError]
  );

  // SSE 스트리밍으로 메시지 전송
  const handleSendMessage = useCallback(
    async (
      msg: string,
      imageData?: string | null,
      previousResponseId?: string
    ) => {
      // 메시지가 없고 이미지도 없으면 전송 불가
      if ((!msg.trim() && !imageData && !uploadedFileId) || isStreaming) return;

      // roomId가 없으면 먼저 채팅방 생성
      let currentRoomId = roomId;
      if (!currentRoomId && createRoom) {
        try {
          currentRoomId = await createRoom();
          onRoomCreated?.(currentRoomId);
        } catch (error) {
          console.error("Failed to create room:", error);
          onError?.(error instanceof Error ? error : new Error("채팅방 생성 실패"));
          return;
        }
      }

      if (!currentRoomId) {
        onError?.(new Error("채팅방이 없습니다."));
        return;
      }

      // 이미 업로드된 fileId 사용 (이미지 선택/붙여넣기 시 즉시 업로드됨)
      const fileIdToSend = uploadedFileId;

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
          currentRoomId,
          {
            message: msg,
            modelId,
            fileId: fileIdToSend || undefined,
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
                        outputTokens: data.outputTokens,
                      },
                    };
                  }
                  if (m.id === userMessageId) {
                    return {
                      ...m,
                      metadata: {
                        userMessageId: data.userMessageId,
                        inputTokens: data.inputTokens,
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
      uploadedFileId,
      onError,
      createRoom,
      onRoomCreated,
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

  // 이미지 붙여넣기 처리 (미리보기 설정 + 즉시 업로드)
  const handlePasteImage = useCallback(async (imageData: string) => {
    setPastedImage(imageData);
    // 이미지를 붙여넣으면 즉시 업로드
    await uploadImageData(imageData);
  }, [uploadImageData]);

  // 이미지 제거 (삭제 시 fileId도 함께 제거)
  const removePastedImage = useCallback(() => {
    setPastedImage(null);
    setUploadedFileId(null);
  }, []);

  // 특정 채팅방의 메시지 로드
  const loadMessagesForRoom = useCallback(async (targetRoomId: string) => {
    try {
      const response = await getMessages({ roomId: targetRoomId, page: 0, size: 100, sort: "createdAt,asc" });
      const uiMessages = convertToUIMessages(response.detail.content);
      setMessages(uiMessages as Message[]);
    } catch (error) {
      console.error("Failed to load messages:", error);
      onError?.(error instanceof Error ? error : new Error("메시지 로드 실패"));
    }
  }, [onError]);

  // 메시지 초기화
  const clearMessages = useCallback(() => {
    setMessages([]);
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
    loadMessagesForRoom,
    clearMessages,
  };
}
