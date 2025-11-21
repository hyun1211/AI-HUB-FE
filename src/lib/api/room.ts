import {
  ChatRoomsPageResponse,
  GetChatRoomsParams,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  RoomDetail,
} from "@/types/room";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 채팅방 목록을 페이지네이션하여 조회
 * 쿠키 기반 인증 사용
 */
export async function getChatRooms(
  params: GetChatRoomsParams = {}
): Promise<ApiResponse<ChatRoomsPageResponse>> {
  const { page = 0, size = 20, sort = "createdAt,desc" } = params;

  // 유효성 검사
  if (page < 0) {
    throw new Error("페이지 번호는 0 이상이어야 합니다.");
  }

  if (size < 1 || size > 100) {
    throw new Error("페이지 크기는 1~100 사이여야 합니다.");
  }

  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat-rooms?${queryParams}`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data:
      | ApiResponse<ChatRoomsPageResponse>
      | ApiResponse<ApiErrorDetail> = await response.json();

    // 성공 응답
    if (response.ok && data.success) {
      return data as ApiResponse<ChatRoomsPageResponse>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      case "VALIDATION_ERROR":
        throw new Error(
          errorDetail.message || "지원하지 않는 정렬 필드입니다."
        );
      default:
        throw new Error(
          errorDetail.message || "채팅방 목록 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("채팅방 목록 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 다음 페이지 채팅방 목록 조회
 */
export async function getNextChatRoomsPage(
  currentResponse: ApiResponse<ChatRoomsPageResponse>,
  size?: number,
  sort?: string
): Promise<ApiResponse<ChatRoomsPageResponse> | null> {
  const currentPage = currentResponse.detail.number;
  const totalPages = currentResponse.detail.totalPages;

  // 다음 페이지가 없으면 null 반환
  if (currentPage + 1 >= totalPages) {
    return null;
  }

  return getChatRooms({
    page: currentPage + 1,
    size,
    sort,
  });
}

/**
 * 새로운 채팅방 생성
 * 쿠키 기반 인증 사용
 */
export async function createChatRoom(
  request: CreateChatRoomRequest
): Promise<ApiResponse<CreateChatRoomResponse>> {
  const { title, modelId } = request;

  // 유효성 검사
  if (!title || title.trim().length === 0) {
    throw new Error("채팅방 제목을 입력해주세요.");
  }

  if (title.length > 30) {
    throw new Error("채팅방 제목은 최대 30자까지 입력 가능합니다.");
  }

  if (!modelId || modelId <= 0) {
    throw new Error("유효한 AI 모델을 선택해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat-rooms`, {
      method: "POST",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, modelId }),
    });

    const data:
      | ApiResponse<CreateChatRoomResponse>
      | ApiResponse<ApiErrorDetail> = await response.json();

    // 성공 응답 (201 Created)
    if (response.ok && data.success) {
      return data as ApiResponse<CreateChatRoomResponse>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("채팅방 생성 권한이 없습니다.");
      case "VALIDATION_ERROR":
        throw new Error(
          errorDetail.message || "입력값을 확인해주세요."
        );
      case "MODEL_NOT_FOUND":
        throw new Error("선택한 AI 모델을 찾을 수 없습니다.");
      case "MODEL_NOT_ACTIVE":
        throw new Error("선택한 AI 모델은 현재 사용할 수 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "채팅방 생성에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("채팅방 생성 중 오류가 발생했습니다.");
  }
}

/**
 * 특정 채팅방의 상세 정보 조회
 * 쿠키 기반 인증 사용
 */
export async function getRoomDetail(
  roomId: string
): Promise<ApiResponse<RoomDetail>> {
  // 유효성 검사
  if (!roomId || roomId.trim().length === 0) {
    throw new Error("채팅방 ID가 필요합니다.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat-rooms/${roomId}`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: ApiResponse<RoomDetail> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<RoomDetail>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("이 채팅방에 접근할 권한이 없습니다.");
      case "ROOM_NOT_FOUND":
        throw new Error("채팅방을 찾을 수 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "채팅방 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("채팅방 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 채팅방 삭제 (연관 메시지도 함께 삭제)
 * 쿠키 기반 인증 사용
 */
export async function deleteChatRoom(roomId: string): Promise<void> {
  // 유효성 검사
  if (!roomId || roomId.trim().length === 0) {
    throw new Error("채팅방 ID가 필요합니다.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat-rooms/${roomId}`,
      {
        method: "DELETE",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 성공 응답 (204 No Content)
    if (response.status === 204) {
      return;
    }

    // 에러 응답 (JSON 본문이 있는 경우)
    const data: ApiResponse<ApiErrorDetail> = await response.json();
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("이 채팅방을 삭제할 권한이 없습니다.");
      case "ROOM_NOT_FOUND":
        throw new Error("채팅방을 찾을 수 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "채팅방 삭제에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("채팅방 삭제 중 오류가 발생했습니다.");
  }
}
