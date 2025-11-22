import { useState, useCallback, useEffect } from "react";
import { getDashboardStats } from "@/lib/api/dashboard";
import { DashboardStats } from "@/types/dashboard";

interface UseDashboardStatsOptions {
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useDashboardStats(options: UseDashboardStatsOptions = {}) {
  const { autoFetch = true, onError } = options;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 통계 조회
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDashboardStats();
      setStats(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setStats(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
    refresh,
  };
}
