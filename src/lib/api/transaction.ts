import {
  TransactionDetail,
  ApiErrorDetail,
  ApiResponse,
} from "@/types/transaction";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 특정 거래 상세 정보 조회
 * 쿠키 기반 인증 필수
 */
export async function getTransactionDetail(
  transactionId: number
): Promise<ApiResponse<TransactionDetail>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/transactions/${transactionId}`,
      {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: ApiResponse<TransactionDetail> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<TransactionDetail>;
    }

    // 에러 응답
    const errorDetail = data.detail as ApiErrorDetail;

    // 특정 에러 코드별 처리
    switch (errorDetail.code) {
      case "AUTHENTICATION_FAILED":
        throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
      case "INVALID_TOKEN":
        throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
      case "TRANSACTION_NOT_FOUND":
        throw new Error("거래 내역을 찾을 수 없습니다.");
      case "FORBIDDEN":
        throw new Error(errorDetail.details || "접근 권한이 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "거래 상세 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("거래 상세 조회 중 오류가 발생했습니다.");
  }
}
