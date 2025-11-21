import { useState, useCallback } from "react";
import { refreshToken as refreshTokenApi } from "@/lib/api/auth";
import { TokenRefreshResponse } from "@/types/auth";

interface UseTokenRefreshOptions {
  onSuccess?: (response: TokenRefreshResponse) => void;
  onError?: (error: Error) => void;
}

export function useTokenRefresh(options: UseTokenRefreshOptions = {}) {
  const { onSuccess, onError } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 토큰 갱신 실행
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await refreshTokenApi();
      onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("토큰 갱신 실패");
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [onSuccess, onError]);

  return {
    refresh,
    isRefreshing,
    error,
  };
}
