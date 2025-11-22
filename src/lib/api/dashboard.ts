import {
  DashboardStats,
  ModelPricing,
  MonthlyUsage,
} from "@/types/dashboard";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 사용자 통계 요약 조회
 * 쿠키 기반 인증 필수
 */
export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/stats`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<DashboardStats> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<DashboardStats>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "AUTHENTICATION_FAILED":
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "통계 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("통계 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 모델별 가격 대시보드 조회
 * Public API (인증 불필요)
 */
export async function getModelsPricing(): Promise<
  ApiResponse<ModelPricing[]>
> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/dashboard/models/pricing`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함 (선택적)
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: ApiResponse<ModelPricing[]> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<ModelPricing[]>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "SYSTEM_ILLEGAL_STATE":
        throw new Error(
          errorDetail.message || "모델 가격 정보를 가져올 수 없습니다."
        );
      default:
        throw new Error(
          errorDetail.message || "모델 가격 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("모델 가격 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 월별 모델별 코인 사용량 조회
 * 쿠키 기반 인증 필수
 */
export async function getMonthlyUsage(
  year?: number,
  month?: number
): Promise<ApiResponse<MonthlyUsage>> {
  // 쿼리 파라미터 생성
  const params = new URLSearchParams();
  if (year !== undefined) {
    params.append("year", year.toString());
  }
  if (month !== undefined) {
    // 유효성 검사
    if (month < 1 || month > 12) {
      throw new Error("월은 1부터 12 사이의 값이어야 합니다.");
    }
    params.append("month", month.toString());
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/v1/dashboard/usage/monthly${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<MonthlyUsage> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<MonthlyUsage>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "AUTHENTICATION_FAILED":
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "FORBIDDEN":
        throw new Error("접근 권한이 없습니다.");
      case "VALIDATION_ERROR":
        throw new Error(errorDetail.message || "잘못된 요청입니다.");
      default:
        throw new Error(
          errorDetail.message || "사용량 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("사용량 조회 중 오류가 발생했습니다.");
  }
}
