import {
  ApiResponse,
  ApiErrorDetail,
  UploadFileResponse,
  MessageFileUploadResponse,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/types/upload";

// API 베이스 URL (환경 변수로 설정 가능)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 파일 유효성 검사
 */
export function validateFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // 파일 크기 검사
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 업로드 가능합니다.`,
    };
  }

  // 파일 타입 검사
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `지원하지 않는 파일 형식입니다. (${file.type})`,
    };
  }

  return { isValid: true };
}

/**
 * 파일 업로드 API (R2 저장)
 * 쿠키 기반 인증 사용
 * @param file - 업로드할 파일
 * @param modelId - AI 모델 ID
 * @returns fileUrl 등 업로드된 파일 정보
 */
export async function uploadFile(
  file: File,
  modelId: number
): Promise<ApiResponse<MessageFileUploadResponse>> {
  // 파일 유효성 검사
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // FormData 생성
  const formData = new FormData();
  formData.append("file", file);
  formData.append("modelId", modelId.toString());

  try {
    console.log("[Upload] 파일 업로드 시작:", { fileName: file.name, modelId });

    const response = await fetch(`${API_BASE_URL}/api/v1/messages/files/upload`, {
      method: "POST",
      body: formData,
      credentials: "include", // 쿠키 포함
      // Content-Type은 자동으로 multipart/form-data로 설정됨 (boundary 포함)
    });

    console.log("[Upload] 응답 상태:", response.status, response.statusText);

    const data: ApiResponse<MessageFileUploadResponse | ApiErrorDetail> =
      await response.json();

    console.log("[Upload] 응답 데이터:", data);

    // 성공 응답
    if (response.ok && data.success) {
      console.log("[Upload] 업로드 성공:", data.detail);
      return data as ApiResponse<MessageFileUploadResponse>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;
    console.error("[Upload] 업로드 실패:", errorDetail);

    switch (errorDetail.code) {
      case "VALIDATION_ERROR":
        throw new Error(errorDetail.message || "파일 형식이 올바르지 않습니다.");
      case "MODEL_NOT_FOUND":
        throw new Error("선택한 AI 모델을 찾을 수 없습니다.");
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      default:
        throw new Error(errorDetail.message || "파일 업로드에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("파일 업로드 중 오류가 발생했습니다.");
  }
}

/**
 * 여러 파일 업로드 (순차적으로 업로드)
 */
export async function uploadFiles(
  files: File[],
  modelId: number
): Promise<ApiResponse<MessageFileUploadResponse>[]> {
  const results: ApiResponse<MessageFileUploadResponse>[] = [];

  for (const file of files) {
    try {
      const result = await uploadFile(file, modelId);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * 여러 파일 업로드 (병렬 업로드)
 */
export async function uploadFilesParallel(
  files: File[],
  modelId: number
): Promise<PromiseSettledResult<ApiResponse<MessageFileUploadResponse>>[]> {
  const uploadPromises = files.map((file) => uploadFile(file, modelId));
  return Promise.allSettled(uploadPromises);
}
