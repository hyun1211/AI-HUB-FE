import { useState, useCallback, useEffect } from "react";
import { getRoomDetail, updateChatRoom } from "@/lib/api/room";
import { RoomDetail, UpdateChatRoomRequest } from "@/types/room";

interface UseRoomDetailOptions {
  roomId: string;
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useRoomDetail(options: UseRoomDetailOptions) {
  const { roomId, autoFetch = true, onError } = options;

  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 채팅방 상세 조회
  const fetchRoomDetail = useCallback(async () => {
    if (!roomId) {
      setError(new Error("채팅방 ID가 필요합니다."));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getRoomDetail(roomId);
      setRoomDetail(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setRoomDetail(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchRoomDetail();
  }, [fetchRoomDetail]);

  // 채팅방 제목 수정
  const updateTitle = useCallback(
    async (request: UpdateChatRoomRequest) => {
      if (!roomId) {
        const error = new Error("채팅방 ID가 필요합니다.");
        setError(error);
        throw error;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await updateChatRoom(roomId, request);
        setRoomDetail(response.detail);
        return response.detail;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("수정 실패");
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, onError]
  );

  // 초기 로드
  useEffect(() => {
    if (autoFetch && roomId) {
      fetchRoomDetail();
    }
  }, [autoFetch, roomId, fetchRoomDetail]);

  return {
    roomDetail,
    isLoading,
    error,
    fetchRoomDetail,
    refresh,
    updateTitle,
  };
}
