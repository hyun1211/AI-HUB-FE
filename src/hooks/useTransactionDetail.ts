import { useState, useCallback, useEffect } from "react";
import { getTransactionDetail } from "@/lib/api/transaction";
import { TransactionDetail } from "@/types/transaction";

interface UseTransactionDetailOptions {
  transactionId: number;
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useTransactionDetail(options: UseTransactionDetailOptions) {
  const { transactionId, autoFetch = true, onError } = options;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 거래 상세 조회
  const fetchTransaction = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTransactionDetail(transactionId);
      setTransaction(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setTransaction(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [transactionId, onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchTransaction();
  }, [fetchTransaction]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchTransaction();
    }
  }, [autoFetch, fetchTransaction]);

  return {
    transaction,
    isLoading,
    error,
    fetchTransaction,
    refresh,
  };
}
