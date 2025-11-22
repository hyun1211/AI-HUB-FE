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

// AI 서버 파일 업로드 응답 (POST /api/v1/messages/files/upload)
export interface MessageFileUploadResponse {
  fileId: string;
}

// AI 서버 파일 업로드 요청 파라미터
export interface MessageFileUploadParams {
  file: File;
  modelId: number;
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

// 허용되는 파일 타입
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
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

export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
] as const;

// 파일 크기 제한 (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// 허용되는 확장자
export const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".pdf",
  ".txt",
  ".docx",
  ".xlsx",
  ".pptx",
  ".csv",
] as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];
