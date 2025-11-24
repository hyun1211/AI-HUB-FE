// 파일 업로드 API 타입 정의

// R2 파일 업로드 응답 (POST /api/v1/files/upload)
export interface UploadFileResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  expiresAt: string;
}

// 파일 업로드 응답 (POST /api/v1/messages/files/upload)
// R2에 저장 후 반환되는 정보
export interface MessageFileUploadResponse {
  fileId: string;       // 업로드된 파일 ID (메시지 전송 시 사용)
  fileUrl: string;      // R2에 저장된 파일의 공개 접근 URL (1년 유효)
  fileName: string;     // 원본 파일명
  fileSize: number;     // 파일 크기 (바이트)
  contentType: string;  // MIME 타입
  uploadedAt: string;   // 업로드 완료 시각 (ISO 8601)
  expiresAt: string;    // URL 만료 시각 (ISO 8601)
}

export interface ApiResponse<T> {
  success: boolean;
  detail: T;
  timestamp: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details: string | null;
}

// 허용되는 이미지 타입 (jpg, jpeg, png, webp만 허용)
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "text/csv",
] as const;

// 현재는 이미지만 허용 (서버 요구사항)
export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
] as const;

// 파일 크기 제한 (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// 허용되는 확장자 (현재는 이미지만 허용)
export const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];
