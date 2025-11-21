import { useState, useCallback, useEffect } from "react";
import { getPaymentDetail } from "@/lib/api/payment";
import { PaymentDetail } from "@/types/payment";

interface UsePaymentDetailOptions {
  paymentId: number; // 결제 ID
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function usePaymentDetail(options: UsePaymentDetailOptions) {
  const { paymentId, autoFetch = true, onError } = options;

  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 결제 상세 조회
  const fetchPaymentDetail = useCallback(async () => {
    if (!paymentId || paymentId <= 0) {
      setError(new Error("유효한 결제 ID가 필요합니다."));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getPaymentDetail(paymentId);
      setPayment(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setPayment(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [paymentId, onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchPaymentDetail();
  }, [fetchPaymentDetail]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch && paymentId > 0) {
      fetchPaymentDetail();
    }
  }, [autoFetch, paymentId, fetchPaymentDetail]);

  return {
    payment,
    isLoading,
    error,
    fetchPaymentDetail,
    refresh,
  };
}
