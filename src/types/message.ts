import { ApiResponse } from "./upload";

// API 응답 메시지 타입
export interface ApiMessage {
  messageId: string; // UUID v7
  role: "user" | "assistant";
  content: string;
  tokenCount: number;
  coinCount: number;
  modelId: number;
  createdAt: string; // ISO 8601
}

// 메시지 전송 요청 타입
export interface SendMessageRequest {
  message: string; // 최대 4,000자, 사진만 전송 시 빈 문자열 가능
  modelId: number; // 채팅방에 허용된 모델
  fileId?: string; // 업로드 파일 ID (선택, 업로드 API에서 반환받은 ID)
  previousResponseId?: string; // 이전 AI 응답 ID (선택)
}

// SSE 이벤트 타입
export type SSEEventType = "started" | "delta" | "completed";

// SSE started 이벤트
export interface SSEStartedEvent {
  event: "started";
  data: string; // "Message sending started"
}

// SSE delta 이벤트
export interface SSEDeltaEvent {
  event: "delta";
  data: string; // 증분 텍스트
}

// SSE completed 이벤트 데이터
export interface SSECompletedData {
  aiResponseId: string;
  inputTokens: number;
  userMessageId: string;
  outputTokens: number;
}

// SSE completed 이벤트
export interface SSECompletedEvent {
  event: "completed";
  data: SSECompletedData;
}

// SSE 이벤트 유니온 타입
export type SSEEvent = SSEStartedEvent | SSEDeltaEvent | SSECompletedEvent;

// 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 현재 페이지 번호
}

// 메시지 목록 조회 응답
export type MessagesPageResponse = ApiResponse<PageResponse<ApiMessage>>;

// 메시지 목록 조회 파라미터
export interface GetMessagesParams {
  roomId: string;
  page?: number; // 기본값 0
  size?: number; // 기본값 50, 1~200
  sort?: string; // 기본값 "createdAt,asc"
}

// 정렬 방향
export type SortDirection = "asc" | "desc";

// 정렬 필드
export type MessageSortField = "createdAt" | "messageId";

// 정렬 옵션 헬퍼
export function createSortParam(
  field: MessageSortField,
  direction: SortDirection
): string {
  return `${field},${direction}`;
}

// 메시지 상세 조회 응답 타입
export interface MessageDetail {
  messageId: string; // UUID v7
  roomId: string; // UUID v7
  role: "user" | "assistant";
  content: string;
  fileUrl: string | null; // 첨부 파일 URL (없으면 null)
  tokenCount: number;
  coinCount: number;
  modelId: number;
  createdAt: string; // ISO 8601
}

// 메시지 상세 조회 응답
export type MessageDetailResponse = ApiResponse<MessageDetail>;
