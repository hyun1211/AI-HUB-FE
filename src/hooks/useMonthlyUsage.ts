import { useState, useCallback, useEffect } from "react";
import { getMonthlyUsage } from "@/lib/api/dashboard";
import { MonthlyUsage } from "@/types/dashboard";

interface UseMonthlyUsageOptions {
  year?: number; // 연도 (기본값: 현재 연도)
  month?: number; // 월 (기본값: 현재 월, 1-12)
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useMonthlyUsage(options: UseMonthlyUsageOptions = {}) {
  const { year, month, autoFetch = true, onError } = options;

  const [usage, setUsage] = useState<MonthlyUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 월별 사용량 조회
  const fetchUsage = useCallback(
    async (customYear?: number, customMonth?: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getMonthlyUsage(
          customYear ?? year,
          customMonth ?? month
        );
        setUsage(response.detail);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("조회 실패");
        setError(error);
        setUsage(null);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [year, month, onError]
  );

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchUsage();
  }, [fetchUsage]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchUsage();
    }
  }, [autoFetch, fetchUsage]);

  return {
    usage,
    isLoading,
    error,
    fetchUsage,
    refresh,
  };
}
