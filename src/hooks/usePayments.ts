import { useState, useCallback, useEffect } from "react";
import { getPayments, createPayment } from "@/lib/api/payment";
import {
  PaymentStatus,
  PaymentsPageResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "@/types/payment";

interface UsePaymentsOptions {
  page?: number; // 페이지 번호 (기본값: 0)
  size?: number; // 페이지 크기 (기본값: 20)
  status?: PaymentStatus; // 결제 상태 필터
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function usePayments(options: UsePaymentsOptions = {}) {
  const { page = 0, size = 20, status, autoFetch = true, onError } = options;

  const [payments, setPayments] = useState<PaymentsPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 결제 내역 조회
  const fetchPayments = useCallback(
    async (customPage?: number, customStatus?: PaymentStatus) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getPayments({
          page: customPage ?? page,
          size,
          status: customStatus ?? status,
        });
        setPayments(response.detail);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("조회 실패");
        setError(error);
        setPayments(null);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page, size, status, onError]
  );

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchPayments();
  }, [fetchPayments]);

  // 코인 충전 요청
  const createNewPayment = useCallback(
    async (
      request: CreatePaymentRequest
    ): Promise<CreatePaymentResponse | null> => {
      setIsCreating(true);
      setError(null);

      try {
        const response = await createPayment(request);
        // 충전 후 자동으로 결제 내역 새로고침
        await fetchPayments();
        return response.detail;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("충전 요청 실패");
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchPayments, onError]
  );

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchPayments();
    }
  }, [autoFetch, fetchPayments]);

  return {
    payments,
    isLoading,
    error,
    isCreating,
    fetchPayments,
    refresh,
    createNewPayment,
  };
}
