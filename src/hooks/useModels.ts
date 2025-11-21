import { useState, useCallback, useEffect } from "react";
import { getModels, createModel } from "@/lib/api/model";
import { AIModel, CreateModelRequest } from "@/types/model";

interface UseModelsOptions {
  autoFetch?: boolean; // 자동으로 로드 (기본값: true)
  onError?: (error: Error) => void;
}

export function useModels(options: UseModelsOptions = {}) {
  const { autoFetch = true, onError } = options;

  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // AI 모델 목록 조회
  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getModels();
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
    await fetchModels();
  }, [fetchModels]);

  // modelId로 특정 모델 찾기
  const getModelById = useCallback(
    (modelId: number): AIModel | undefined => {
      return models.find((model) => model.modelId === modelId);
    },
    [models]
  );

  // [관리자] AI 모델 등록
  const createNewModel = useCallback(
    async (request: CreateModelRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await createModel(request);
        // 등록 후 목록 새로고침
        await fetchModels();
        return response.detail;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("등록 실패");
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchModels, onError]
  );

  // 활성화된 모델만 필터링
  const activeModels = models.filter((model) => model.isActive);

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchModels();
    }
  }, [autoFetch, fetchModels]);

  return {
    models,
    activeModels,
    isLoading,
    error,
    fetchModels,
    refresh,
    getModelById,
    createNewModel,
  };
}
