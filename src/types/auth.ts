// 인증 API 타입 정의

import type { ApiResponse, ApiErrorDetail } from "./upload";

export type { ApiResponse, ApiErrorDetail };

// 로그아웃 요청 타입
export interface LogoutRequest {
  refreshToken: string;
}

// 토큰 갱신 응답 타입
// 실제 토큰은 HttpOnly 쿠키로 전송되므로 응답 본문은 비어있음
export type TokenRefreshResponse = ApiResponse<null>;
