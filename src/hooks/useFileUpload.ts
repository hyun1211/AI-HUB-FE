import { useState, useCallback } from "react";
import { uploadFile, validateFile } from "@/lib/api/upload";
import { UploadFileResponse, ApiResponse } from "@/types/upload";

interface UseFileUploadOptions {
  onSuccess?: (response: ApiResponse<UploadFileResponse>) => void;
  onError?: (error: Error) => void;
}

export function useFileUpload(options?: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] =
    useState<ApiResponse<UploadFileResponse> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(
    async (file: File) => {
      // 파일 유효성 검사
      const validation = validateFile(file);
      if (!validation.isValid) {
        const validationError = new Error(validation.error);
        setError(validationError);
        options?.onError?.(validationError);
        return null;
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);
      setUploadedFile(null);

      try {
        // 진행률 시뮬레이션 (실제 업로드 진행률은 XMLHttpRequest를 사용해야 함)
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const response = await uploadFile(file);

        clearInterval(progressInterval);
        setProgress(100);
        setUploadedFile(response);
        options?.onSuccess?.(response);

        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("업로드 실패");
        setError(error);
        options?.onError?.(error);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setUploadedFile(null);
    setError(null);
  }, []);

  return {
    upload,
    isUploading,
    progress,
    uploadedFile,
    error,
    reset,
  };
}

/**
 * 여러 파일 업로드를 위한 훅
 */
export function useMultiFileUpload(options?: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    ApiResponse<UploadFileResponse>[]
  >([]);
  const [failedFiles, setFailedFiles] = useState<
    { file: File; error: Error }[]
  >([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const uploadMultiple = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      setUploadedFiles([]);
      setFailedFiles([]);
      setCurrentFileIndex(0);
      setTotalFiles(files.length);

      const uploaded: ApiResponse<UploadFileResponse>[] = [];
      const failed: { file: File; error: Error }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileIndex(i + 1);

        try {
          const response = await uploadFile(file);
          uploaded.push(response);
          options?.onSuccess?.(response);
        } catch (err) {
          const error = err instanceof Error ? err : new Error("업로드 실패");
          failed.push({ file, error });
          options?.onError?.(error);
        }
      }

      setUploadedFiles(uploaded);
      setFailedFiles(failed);
      setIsUploading(false);

      return { uploaded, failed };
    },
    [options]
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadedFiles([]);
    setFailedFiles([]);
    setCurrentFileIndex(0);
    setTotalFiles(0);
  }, []);

  return {
    uploadMultiple,
    isUploading,
    uploadedFiles,
    failedFiles,
    currentFileIndex,
    totalFiles,
    progress: totalFiles > 0 ? (currentFileIndex / totalFiles) * 100 : 0,
    reset,
  };
}
