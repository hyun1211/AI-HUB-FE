// 채팅방 목록 조회 API 타입 정의

// 개별 채팅방 정보
export interface ChatRoom {
  roomId: string; // UUID
  title: string; // 채팅방 제목
  coinUsage: number; // 누적 코인 사용량
  lastMessageAt: string; // 마지막 메시지 시각 (ISO 8601)
  createdAt: string; // 생성 시각 (ISO 8601)
}

// 페이지네이션 응답
export interface ChatRoomsPageResponse {
  content: ChatRoom[]; // 채팅방 목록
  totalElements: number; // 전체 채팅방 수
  totalPages: number; // 전체 페이지 수
  size: number; // 페이지 크기
  number: number; // 현재 페이지 번호 (0부터 시작)
}

// 채팅방 목록 조회 쿼리 파라미터
export interface GetChatRoomsParams {
  page?: number; // 페이지 번호 (기본값: 0, 0 이상)
  size?: number; // 페이지 크기 (기본값: 20, 1~100)
  sort?: string; // 정렬 조건 (기본값: createdAt,desc)
}

// 정렬 방향
export type SortDirection = "asc" | "desc";

// 정렬 필드 (채팅방)
export type RoomSortField = "createdAt" | "lastMessageAt" | "coinUsage";

/**
 * 정렬 파라미터 생성 유틸리티
 * @example
 * createRoomSortParam('createdAt', 'desc') // "createdAt,desc"
 */
export function createRoomSortParam(
  field: RoomSortField,
  direction: SortDirection
): string {
  return `${field},${direction}`;
}

// 채팅방 생성 요청
export interface CreateChatRoomRequest {
  title: string; // 채팅방 제목 (필수, 최대 30자, 공백만 입력 불가)
  modelId: number; // AI 모델 ID (필수, 활성 상태의 모델만 허용)
}

// 채팅방 생성 응답
export interface CreateChatRoomResponse {
  roomId: string; // 생성된 채팅방 UUID (v7)
  title: string; // 채팅방 제목
  userId: number; // 채팅방 소유 사용자 ID
  coinUsage: number; // 누적 코인 사용량 (초기값: 0.0)
  createdAt: string; // 생성 시각 (ISO 8601)
  updatedAt: string; // 수정 시각 (ISO 8601)
}

// 채팅방 상세 조회 응답
export interface RoomDetail {
  roomId: string; // 채팅방 UUID
  title: string; // 채팅방 제목
  userId: number; // 채팅방 소유 사용자 ID
  coinUsage: number; // 누적 코인 사용량
  createdAt: string; // 생성 시각 (ISO 8601)
  updatedAt: string; // 수정 시각 (ISO 8601)
}

// 채팅방 제목 수정 요청
export interface UpdateChatRoomRequest {
  title: string; // 새로운 채팅방 제목 (필수, 최대 30자)
}
