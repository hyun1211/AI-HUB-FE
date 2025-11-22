import { useState, useCallback, useEffect } from "react";
import { getWalletBalance } from "@/lib/api/wallet";

interface UseWalletBalanceOptions {
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useWalletBalance(options: UseWalletBalanceOptions = {}) {
  const { autoFetch = true, onError } = options;

  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 잔액 조회
  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getWalletBalance();
      setBalance(response.detail.balance);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setBalance(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchBalance();
    }
  }, [autoFetch, fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    fetchBalance,
    refresh,
  };
}
