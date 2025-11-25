import {
  GetMessagesParams,
  MessagesPageResponse,
  ApiMessage,
  SendMessageRequest,
  SSECompletedData,
  MessageDetailResponse,
} from "@/types/message";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * SSE 스트리밍 콜백 타입
 */
export interface SSECallbacks {
  onStart?: () => void;
  onDelta?: (text: string) => void;
  onCompleted?: (data: SSECompletedData) => void;
  onError?: (error: Error) => void;
}

/**
 * 메시지 전송 및 AI 응답 스트리밍 (SSE)
 * 쿠키 기반 인증 사용
 */
export async function sendMessageWithStreaming(
  roomId: string,
  request: SendMessageRequest,
  callbacks: SSECallbacks,
  signal?: AbortSignal
): Promise<void> {
  // 메시지 길이 검증
  if (request.message.length > 4000) {
    throw new Error("메시지는 최대 4,000자까지 입력 가능합니다.");
  }

  if (!request.message.trim()) {
    throw new Error("메시지를 입력해주세요.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/messages/send/${roomId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(request),
        credentials: "include", // 쿠키 포함
        signal,
      }
    );

    // 에러 응답 처리
    if (!response.ok) {
      const contentType = response.headers.get("content-type");

      // JSON 에러 응답인 경우
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        const errorDetail = errorData.detail as ApiErrorDetail;

        switch (errorDetail.code) {
          case "VALIDATION_ERROR":
            throw new Error(errorDetail.message || "입력값이 유효하지 않습니다.");
          case "INSUFFICIENT_BALANCE":
            throw new Error("코인 잔액이 부족합니다.");
          case "ROOM_NOT_FOUND":
            throw new Error("채팅방이 존재하지 않습니다.");
          case "MODEL_NOT_FOUND":
            throw new Error("AI 모델을 찾을 수 없습니다.");
          case "INVALID_TOKEN":
            throw new Error("인증이 필요합니다.");
          case "FORBIDDEN":
            throw new Error("접근 권한이 없습니다.");
          default:
            throw new Error(
              errorDetail.message || "메시지 전송에 실패했습니다."
            );
        }
      }

      throw new Error(`HTTP ${response.status}: 메시지 전송에 실패했습니다.`);
    }

    // SSE 스트림 읽기
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("스트림을 읽을 수 없습니다.");
    }

    let buffer = "";
    let currentEvent: string | null = null;
    let eventDataLines: string[] = []; // 같은 이벤트의 여러 data: 라인을 누적

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // 청크 디코딩
      buffer += decoder.decode(value, { stream: true });

      // 라인별로 처리
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // 마지막 불완전한 라인은 버퍼에 보관

      for (const line of lines) {
        // 빈 라인 = 이벤트 완료 (SSE 표준)
        if (!line.trim()) {
          // 누적된 data 라인들을 처리
          if (currentEvent && eventDataLines.length > 0) {
            // SSE 표준: 여러 data: 라인은 \n으로 연결
            const data = eventDataLines.join("\n");

            switch (currentEvent) {
              case "started":
                callbacks.onStart?.();
                break;

              case "delta":
                callbacks.onDelta?.(data);
                break;

              case "completed":
                try {
                  const completedData: SSECompletedData = JSON.parse(data);
                  callbacks.onCompleted?.(completedData);
                } catch (e) {
                }
                break;
            }
          }

          // 이벤트 초기화
          currentEvent = null;
          eventDataLines = [];
          continue;
        }

        // SSE 이벤트 타입 파싱 (event: 라인)
        if (line.trim().startsWith("event:")) {
          currentEvent = line.trim().slice(6).trim();
          continue;
        }

        // data: 라인은 원본 사용 (공백 보존을 위해)
        if (line.startsWith("data:")) {
          // SSE 표준: data: 뒤의 첫 번째 공백만 선택적 구분자로 제거
          let data = line.slice(5);
          if (data.startsWith(" ")) {
            data = data.slice(1);
          }
          // 같은 이벤트의 data 라인들을 누적 (빈 문자열도 유효한 데이터)
          eventDataLines.push(data);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return;
      }
      callbacks.onError?.(error);
      throw error;
    }
    const unknownError = new Error("메시지 전송 중 오류가 발생했습니다.");
    callbacks.onError?.(unknownError);
    throw unknownError;
  }
}

/**
 * 특정 채팅방의 메시지 목록을 페이지네이션하여 조회
 * 쿠키 기반 인증 사용
 */
export async function getMessages(
  params: GetMessagesParams
): Promise<MessagesPageResponse> {
  const { roomId, page = 0, size = 50, sort = "createdAt,asc" } = params;

  // 유효성 검사
  if (page < 0) {
    throw new Error("페이지 번호는 0 이상이어야 합니다.");
  }

  if (size < 1 || size > 200) {
    throw new Error("페이지 크기는 1~200 사이여야 합니다.");
  }

  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/messages/page/${roomId}?${queryParams}`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: MessagesPageResponse | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답
    if (response.ok && data.success) {
      return data as MessagesPageResponse;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "ROOM_NOT_FOUND":
        throw new Error("채팅방이 존재하지 않습니다.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다.");
      default:
        throw new Error(
          errorDetail.message || "메시지 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("메시지 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 다음 페이지 메시지 조회
 */
export async function getNextPage(
  currentResponse: MessagesPageResponse,
  roomId: string,
  size?: number,
  sort?: string
): Promise<MessagesPageResponse | null> {
  const currentPage = currentResponse.detail.number;
  const totalPages = currentResponse.detail.totalPages;

  // 다음 페이지가 없으면 null 반환
  if (currentPage + 1 >= totalPages) {
    return null;
  }

  return getMessages({
    roomId,
    page: currentPage + 1,
    size,
    sort,
  });
}

/**
 * 이전 페이지 메시지 조회
 */
export async function getPreviousPage(
  currentResponse: MessagesPageResponse,
  roomId: string,
  size?: number,
  sort?: string
): Promise<MessagesPageResponse | null> {
  const currentPage = currentResponse.detail.number;

  // 이전 페이지가 없으면 null 반환
  if (currentPage <= 0) {
    return null;
  }

  return getMessages({
    roomId,
    page: currentPage - 1,
    size,
    sort,
  });
}

/**
 * 메시지 목록을 UI용 Message 타입으로 변환
 */
export function convertToUIMessages(apiMessages: ApiMessage[]) {
  return apiMessages.map((msg) => ({
    id: msg.messageId,
    content: msg.content,
    role: msg.role,
    timestamp: new Date(msg.createdAt),
    metadata: {
      // role에 따라 inputTokens 또는 outputTokens로 매핑
      ...(msg.role === "user"
        ? { inputTokens: msg.tokenCount, userMessageId: msg.messageId }
        : { outputTokens: msg.tokenCount, aiResponseId: msg.messageId }),
      tokenCount: msg.tokenCount,
      coinCount: msg.coinCount,
      modelId: msg.modelId,
    },
  }));
}

/**
 * 특정 메시지의 상세 정보 조회
 * 쿠키 기반 인증 사용
 */
export async function getMessageDetail(
  messageId: string
): Promise<MessageDetailResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/messages/${messageId}`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: MessageDetailResponse | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답
    if (response.ok && data.success) {
      return data as MessageDetailResponse;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "MESSAGE_NOT_FOUND":
        throw new Error("메시지를 찾을 수 없습니다.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다.");
      default:
        throw new Error(
          errorDetail.message || "메시지 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("메시지 조회 중 오류가 발생했습니다.");
  }
}
