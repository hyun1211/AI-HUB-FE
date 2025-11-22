import { useState, useCallback } from "react";
import { logout as logoutApi } from "@/lib/api/auth";
import { LogoutRequest } from "@/types/auth";

interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const { onSuccess, onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 로그아웃 실행
  const performLogout = useCallback(
    async (request: LogoutRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        await logoutApi(request);
        onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("로그아웃 실패");
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError]
  );

  return {
    performLogout,
    isLoading,
    error,
  };
}
