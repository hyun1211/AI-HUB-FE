import { UserInfo, UpdateUserRequest } from "@/types/user";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 현재 로그인한 사용자 정보 조회
 * 쿠키 기반 인증 필수
 */
export async function getCurrentUser(): Promise<ApiResponse<UserInfo>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<UserInfo> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<UserInfo>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증 정보가 유효하지 않습니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error(
          errorDetail.details || "접근 권한이 없습니다."
        );
      default:
        throw new Error(
          errorDetail.message || "사용자 정보 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("사용자 정보 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 회원 탈퇴 (소프트 삭제)
 * 쿠키 기반 인증 필수
 */
export async function deleteCurrentUser(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "DELETE",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
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
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "회원 탈퇴에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("회원 탈퇴 중 오류가 발생했습니다.");
  }
}

/**
 * 현재 로그인한 사용자 정보 수정
 * 쿠키 기반 인증 필수
 */
export async function updateCurrentUser(
  request: UpdateUserRequest
): Promise<ApiResponse<UserInfo>> {
  const { username, email } = request;

  // 유효성 검사
  if (!username || username.trim().length === 0) {
    throw new Error("사용자 이름을 입력해주세요.");
  }

  if (username.length < 2 || username.length > 30) {
    throw new Error("사용자 이름은 2~30자로 입력해주세요.");
  }

  if (username.includes(" ")) {
    throw new Error("사용자 이름에 공백을 포함할 수 없습니다.");
  }

  if (!email || email.trim().length === 0) {
    throw new Error("이메일을 입력해주세요.");
  }

  // 간단한 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("올바른 이메일 형식을 입력해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "PUT",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
      }),
    });

    const data: ApiResponse<UserInfo> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<UserInfo>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      case "VALIDATION_ERROR":
        throw new Error(errorDetail.message || "입력값을 확인해주세요.");
      default:
        throw new Error(
          errorDetail.message || "정보 수정에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("정보 수정 중 오류가 발생했습니다.");
  }
}
