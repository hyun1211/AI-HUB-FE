import { useState, useCallback, useEffect } from "react";
import { getPaymentDetail, cancelPayment } from "@/lib/api/payment";
import {
  PaymentDetail,
  CancelPaymentRequest,
  CancelPaymentResponse,
} from "@/types/payment";

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
  const [isCancelling, setIsCancelling] = useState(false);

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

  // 결제 취소
  const cancelPaymentRequest = useCallback(
    async (
      request: CancelPaymentRequest
    ): Promise<CancelPaymentResponse | null> => {
      if (!paymentId || paymentId <= 0) {
        const error = new Error("유효한 결제 ID가 필요합니다.");
        setError(error);
        onError?.(error);
        return null;
      }

      setIsCancelling(true);
      setError(null);

      try {
        const response = await cancelPayment(paymentId, request);
        // 취소 후 자동으로 결제 상세 정보 새로고침
        await fetchPaymentDetail();
        return response.detail;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("취소 요청 실패");
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setIsCancelling(false);
      }
    },
    [paymentId, fetchPaymentDetail, onError]
  );

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
    isCancelling,
    fetchPaymentDetail,
    refresh,
    cancelPaymentRequest,
  };
}
