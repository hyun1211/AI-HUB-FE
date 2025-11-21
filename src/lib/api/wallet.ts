import {
  WalletInfo,
  WalletBalance,
  ApiErrorDetail,
  ApiResponse,
} from "@/types/wallet";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 현재 사용자의 지갑 정보 조회
 * 쿠키 기반 인증 필수
 */
export async function getWallet(): Promise<ApiResponse<WalletInfo>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<WalletInfo> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<WalletInfo>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "WALLET_NOT_FOUND":
        throw new Error("지갑 정보가 존재하지 않습니다.");
      case "FORBIDDEN":
        throw new Error(errorDetail.details || "접근 권한이 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "지갑 정보 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("지갑 정보 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 현재 사용자의 지갑 잔액만 조회
 * 쿠키 기반 인증 필수
 */
export async function getWalletBalance(): Promise<ApiResponse<WalletBalance>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/wallet/balance`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<WalletBalance> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<WalletBalance>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "WALLET_NOT_FOUND":
        throw new Error("지갑 정보가 존재하지 않습니다.");
      case "FORBIDDEN":
        throw new Error(errorDetail.details || "접근 권한이 없습니다.");
      default:
        throw new Error(errorDetail.message || "잔액 조회에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("잔액 조회 중 오류가 발생했습니다.");
  }
}
