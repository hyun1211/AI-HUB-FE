import { useState, useCallback, useEffect } from "react";
import { getMessageDetail } from "@/lib/api/message";
import { MessageDetail } from "@/types/message";

interface UseMessageDetailOptions {
  messageId: string;
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useMessageDetail(options: UseMessageDetailOptions) {
  const { messageId, autoFetch = true, onError } = options;

  const [messageDetail, setMessageDetail] = useState<MessageDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 메시지 상세 조회
  const fetchMessageDetail = useCallback(async () => {
    if (!messageId) {
      setError(new Error("메시지 ID가 필요합니다."));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getMessageDetail(messageId);
      setMessageDetail(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setMessageDetail(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [messageId, onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchMessageDetail();
  }, [fetchMessageDetail]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch && messageId) {
      fetchMessageDetail();
    }
  }, [autoFetch, messageId, fetchMessageDetail]);

  return {
    messageDetail,
    isLoading,
    error,
    fetchMessageDetail,
    refresh,
  };
}
