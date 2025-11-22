import { useState, useCallback, useEffect } from "react";
import { getTransactions } from "@/lib/api/transaction";
import {
  TransactionType,
  TransactionsPageResponse,
  GetTransactionsParams,
} from "@/types/transaction";

interface UseTransactionsOptions {
  page?: number; // 페이지 번호 (기본값: 0)
  size?: number; // 페이지 크기 (기본값: 20)
  transactionType?: TransactionType; // 거래 유형 필터
  startDate?: string; // 시작 날짜 (YYYY-MM-DD)
  endDate?: string; // 종료 날짜 (YYYY-MM-DD)
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const {
    page = 0,
    size = 20,
    transactionType,
    startDate,
    endDate,
    autoFetch = true,
    onError,
  } = options;

  const [transactions, setTransactions] =
    useState<TransactionsPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 거래 내역 조회
  const fetchTransactions = useCallback(
    async (params?: GetTransactionsParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTransactions({
          page: params?.page ?? page,
          size: params?.size ?? size,
          transactionType: params?.transactionType ?? transactionType,
          startDate: params?.startDate ?? startDate,
          endDate: params?.endDate ?? endDate,
        });
        setTransactions(response.detail);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("조회 실패");
        setError(error);
        setTransactions(null);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page, size, transactionType, startDate, endDate, onError]
  );

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchTransactions();
    }
  }, [autoFetch, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    refresh,
  };
}
