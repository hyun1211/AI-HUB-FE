import { useState, useCallback, useRef } from "react";
import { Message } from "@/types/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // SSE 스트리밍으로 메시지 전송
  const handleSendMessage = useCallback(
    async (msg: string, imageData?: string | null) => {
      if ((!msg.trim() && !imageData) || isStreaming) return;

      // 사용자 메시지 추가
      const userMessage: Message = {
        id: Date.now().toString(),
        content: msg,
        role: "user",
        timestamp: new Date(),
        image: imageData || undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setPastedImage(null); // 이미지 초기화

      // AI 응답 메시지 생성 (빈 내용으로 시작)
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // AbortController 생성
        abortControllerRef.current = new AbortController();

        // SSE 요청
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: msg,
            hasImage: !!imageData
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Stream request failed");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                setIsStreaming(false);
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;

                  // 메시지 업데이트
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, content: accumulatedContent }
                        : m
                    )
                  );
                }
              } catch (e) {
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
        } else {
          // 에러 발생 시 에러 메시지 표시
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: "죄송합니다. 메시지 전송 중 오류가 발생했습니다.",
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if ((message.trim() || pastedImage) && !isStreaming) {
        handleSendMessage(message, pastedImage);
        setMessage("");
      }
    },
    [message, pastedImage, isStreaming, handleSendMessage]
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
  }, []);

  return {
    messages,
    message,
    setMessage,
    handleSendMessage,
    handleSubmit,
    isStreaming,
    stopStreaming,
    pastedImage,
    handlePasteImage,
    removePastedImage,
  };
}
