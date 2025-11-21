import { useState, useCallback, useEffect } from "react";
import { getWallet } from "@/lib/api/wallet";
import { WalletInfo } from "@/types/wallet";

interface UseWalletOptions {
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useWallet(options: UseWalletOptions = {}) {
  const { autoFetch = true, onError } = options;

  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 지갑 정보 조회
  const fetchWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getWallet();
      setWallet(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setWallet(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchWallet();
  }, [fetchWallet]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchWallet();
    }
  }, [autoFetch, fetchWallet]);

  return {
    wallet,
    isLoading,
    error,
    fetchWallet,
    refresh,
  };
}
