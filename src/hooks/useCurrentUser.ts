import { useState, useCallback, useEffect } from "react";
import {
  getCurrentUser,
  deleteCurrentUser,
  updateCurrentUser,
} from "@/lib/api/user";
import { UserInfo, UpdateUserRequest } from "@/types/user";

interface UseCurrentUserOptions {
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { autoFetch = true, onError } = options;

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 사용자 정보 조회
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCurrentUser();
      setUser(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setUser(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // 회원 탈퇴
  const deleteUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteCurrentUser();
      // 탈퇴 후 사용자 정보 초기화
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("탈퇴 실패");
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // 정보 수정
  const updateUser = useCallback(
    async (request: UpdateUserRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await updateCurrentUser(request);
        // 수정 후 사용자 정보 업데이트
        setUser(response.detail);
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
    [onError]
  );

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchUser();
    }
  }, [autoFetch, fetchUser]);

  return {
    user,
    isLoading,
    error,
    fetchUser,
    refresh,
    deleteUser,
    updateUser,
  };
}
