import {
  LogoutRequest,
  TokenRefreshResponse,
  ApiErrorDetail,
  ApiResponse,
} from "@/types/auth";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 로그아웃 (액세스 토큰과 리프레시 토큰 폐기)
 * 쿠키 기반 인증 필수
 */
export async function logout(request: LogoutRequest): Promise<void> {
  const { refreshToken } = request;

  // 유효성 검사
  if (!refreshToken || refreshToken.trim().length === 0) {
    throw new Error("리프레시 토큰이 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    // 성공 응답 (204 No Content)
    if (response.status === 204) {
      return;
    }

    // 에러 응답 처리
    const data: ApiResponse<ApiErrorDetail> = await response.json();
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "VALIDATION_ERROR":
        throw new Error(
          errorDetail.message || "리프레시 토큰 필드는 필수입니다."
        );
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다.");
      default:
        throw new Error(errorDetail.message || "로그아웃에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("로그아웃 중 오류가 발생했습니다.");
  }
}

/**
 * 토큰 갱신 (액세스 토큰과 리프레시 토큰 회전 발급)
 * 쿠키 기반 인증 필수 (refreshToken 쿠키)
 * 응답 토큰은 HttpOnly 쿠키로 자동 설정됨
 */
export async function refreshToken(): Promise<TokenRefreshResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh`, {
      method: "POST",
      credentials: "include", // 쿠키 포함 (refreshToken 쿠키)
      headers: {
        "Content-Type": "application/json",
      },
      // 요청 본문 없음 (쿠키 기반)
    });

    const data: TokenRefreshResponse | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as TokenRefreshResponse;
    }

    // 에러 응답 처리
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "AUTHENTICATION_FAILED":
        throw new Error(
          "리프레시 토큰이 만료되었거나 폐기되었습니다. 다시 로그인해주세요."
        );
      case "TOKEN_REUSED":
        throw new Error(
          "이미 회전된 리프레시 토큰입니다. 다시 로그인해주세요."
        );
      default:
        throw new Error(errorDetail.message || "토큰 갱신에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("토큰 갱신 중 오류가 발생했습니다.");
  }
}
