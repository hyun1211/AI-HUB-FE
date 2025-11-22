import { useState, useCallback, useEffect } from "react";
import { getModelDetail, updateModel } from "@/lib/api/model";
import { AIModelDetail, UpdateModelRequest } from "@/types/model";

interface UseModelDetailOptions {
  modelId: number;
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useModelDetail(options: UseModelDetailOptions) {
  const { modelId, autoFetch = true, onError } = options;

  const [modelDetail, setModelDetail] = useState<AIModelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // AI 모델 상세 조회
  const fetchModelDetail = useCallback(async () => {
    if (!modelId || modelId <= 0) {
      setError(new Error("유효한 모델 ID가 필요합니다."));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getModelDetail(modelId);
      setModelDetail(response.detail);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
      setModelDetail(null);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [modelId, onError]);

  // 새로고침
  const refresh = useCallback(async () => {
    await fetchModelDetail();
  }, [fetchModelDetail]);

  // [관리자] AI 모델 수정
  const updateModelInfo = useCallback(
    async (request: UpdateModelRequest) => {
      if (!modelId || modelId <= 0) {
        const error = new Error("유효한 모델 ID가 필요합니다.");
        setError(error);
        throw error;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await updateModel(modelId, request);
        setModelDetail(response.detail);
        return response.detail;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("수정 실패");
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [modelId, onError]
  );

  // 초기 로드
  useEffect(() => {
    if (autoFetch && modelId > 0) {
      fetchModelDetail();
    }
  }, [autoFetch, modelId, fetchModelDetail]);

  return {
    modelDetail,
    isLoading,
    error,
    fetchModelDetail,
    refresh,
    updateModelInfo,
  };
}
