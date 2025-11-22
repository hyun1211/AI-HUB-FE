import {
  PaymentStatus,
  PaymentsPageResponse,
  PaymentDetail,
  CreatePaymentRequest,
  CreatePaymentResponse,
  CancelPaymentRequest,
  CancelPaymentResponse,
} from "@/types/payment";
import { ApiErrorDetail, ApiResponse } from "@/types/upload";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface GetPaymentsParams {
  page?: number; // 페이지 번호 (기본값: 0)
  size?: number; // 페이지 크기 (기본값: 20, 1~100)
  status?: PaymentStatus; // 결제 상태 필터
}

/**
 * 결제 내역 조회 (페이지네이션)
 * 쿠키 기반 인증 필수
 */
export async function getPayments(
  params: GetPaymentsParams = {}
): Promise<ApiResponse<PaymentsPageResponse>> {
  const { page = 0, size = 20, status } = params;

  // 유효성 검사
  if (page < 0) {
    throw new Error("페이지 번호는 0 이상이어야 합니다.");
  }

  if (size < 1 || size > 100) {
    throw new Error("페이지 크기는 1~100 사이여야 합니다.");
  }

  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());
  if (status) {
    queryParams.append("status", status);
  }

  const url = `${API_BASE_URL}/api/v1/payments?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data:
      | ApiResponse<PaymentsPageResponse>
      | ApiResponse<ApiErrorDetail> = await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<PaymentsPageResponse>;
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
        throw new Error(errorDetail.message || "잘못된 요청입니다.");
      default:
        throw new Error(
          errorDetail.message || "결제 내역 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("결제 내역 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 결제 상세 정보 조회
 * 쿠키 기반 인증 필수
 */
export async function getPaymentDetail(
  paymentId: number
): Promise<ApiResponse<PaymentDetail>> {
  // 유효성 검사
  if (!paymentId || paymentId <= 0) {
    throw new Error("유효한 결제 ID가 필요합니다.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<PaymentDetail> | ApiResponse<ApiErrorDetail> =
      await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<PaymentDetail>;
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
      case "PAYMENT_NOT_FOUND":
        throw new Error("결제 내역을 찾을 수 없습니다.");
      default:
        throw new Error(
          errorDetail.message || "결제 상세 조회에 실패했습니다."
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("결제 상세 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 코인 충전 요청
 * 쿠키 기반 인증 필수
 */
export async function createPayment(
  request: CreatePaymentRequest
): Promise<ApiResponse<CreatePaymentResponse>> {
  // 유효성 검사
  if (!request.amountKrw || request.amountKrw < 1000) {
    throw new Error("결제 금액은 1,000원 이상이어야 합니다.");
  }

  if (!request.paymentMethod || request.paymentMethod.trim() === "") {
    throw new Error("결제 수단을 선택해주세요.");
  }

  if (!request.paymentGateway || request.paymentGateway.trim() === "") {
    throw new Error("결제 게이트웨이를 선택해주세요.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments`, {
      method: "POST",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data:
      | ApiResponse<CreatePaymentResponse>
      | ApiResponse<ApiErrorDetail> = await response.json();

    // 성공 응답 (201 Created)
    if (response.ok && data.success) {
      return data as ApiResponse<CreatePaymentResponse>;
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
      case "CONFLICT":
        throw new Error(
          errorDetail.message || "이미 처리 중인 결제 요청이 있습니다."
        );
      default:
        throw new Error(errorDetail.message || "결제 요청에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("결제 요청 중 오류가 발생했습니다.");
  }
}

/**
 * 결제 취소 요청
 * 쿠키 기반 인증 필수
 */
export async function cancelPayment(
  paymentId: number,
  request: CancelPaymentRequest
): Promise<ApiResponse<CancelPaymentResponse>> {
  // 유효성 검사
  if (!paymentId || paymentId <= 0) {
    throw new Error("유효한 결제 ID가 필요합니다.");
  }

  if (!request.reason || request.reason.trim() === "") {
    throw new Error("취소 사유를 입력해주세요.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/${paymentId}/cancel`,
      {
        method: "POST",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    const data:
      | ApiResponse<CancelPaymentResponse>
      | ApiResponse<ApiErrorDetail> = await response.json();

    // 성공 응답 (200 OK)
    if (response.ok && data.success) {
      return data as ApiResponse<CancelPaymentResponse>;
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
      case "PAYMENT_NOT_FOUND":
        throw new Error("결제 내역을 찾을 수 없습니다.");
      case "VALIDATION_ERROR":
        throw new Error(errorDetail.message || "잘못된 요청입니다.");
      default:
        throw new Error(errorDetail.message || "결제 취소에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("결제 취소 중 오류가 발생했습니다.");
  }
}
