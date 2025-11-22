import { useState, useCallback, useEffect } from "react";
import { getModelsPricing } from "@/lib/api/dashboard";
import { ModelPricing } from "@/types/dashboard";

interface UseModelsPricingOptions {
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useModelsPricing(options: UseModelsPricingOptions = {}) {
  const { autoFetch = true, onError } = options;

  const [models, setModels] = useState<ModelPricing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 모델 가격 목록 조회
  const fetchPricing = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getModelsPricing();
      setModels(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setModels([]);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchPricing();
  }, [fetchPricing]);

  // modelId로 특정 모델 찾기
  const getModelById = useCallback(
    (modelId: number): ModelPricing | undefined => {
      return models.find((model) => model.modelId === modelId);
    },
    [models]
  );

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchPricing();
    }
  }, [autoFetch, fetchPricing]);

  return {
    models,
    isLoading,
    error,
    fetchPricing,
    refresh,
    getModelById,
  };
}
