// 결제 내역 API 타입 정의

// 결제 상태
export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled";

// 결제 정보
export interface Payment {
  paymentId: number; // 결제 ID
  transactionId: string; // 게이트웨이 거래 ID
  paymentMethod: string; // 결제 수단
  amountKrw: number; // 결제 금액 (KRW)
  coinAmount: number; // 지급된 코인
  bonusCoin: number; // 지급된 보너스 코인
  status: PaymentStatus; // 결제 상태
  createdAt: string; // 결제 생성 시각 (ISO 8601)
  completedAt: string | null; // 결제 완료 시각 (ISO 8601, null 가능)
}

// 결제 내역 페이지 응답
export interface PaymentsPageResponse {
  content: Payment[]; // 결제 목록
  totalElements: number; // 전체 결제 건수
  totalPages: number; // 전체 페이지 수
  size: number; // 페이지 크기
  number: number; // 현재 페이지 번호 (0부터 시작)
}

// 결제 상세 정보
export interface PaymentDetail {
  paymentId: number; // 결제 고유 ID
  transactionId: string; // 거래 ID
  paymentMethod: string; // 결제 수단
  amountKrw: number; // 원화 금액
  amountUsd: number; // 달러 금액
  coinAmount: number; // 기본 코인 금액
  bonusCoin: number; // 보너스 코인 금액
  status: PaymentStatus; // 결제 상태
  paymentGateway: string; // 결제 게이트웨이
  metadata: Record<string, unknown>; // 메타데이터 (JSONB)
  createdAt: string; // 결제 생성 시각 (ISO 8601)
  completedAt: string | null; // 결제 완료 시각 (ISO 8601, null 가능)
}

// 코인 충전 요청
export interface CreatePaymentRequest {
  amountKrw: number; // 결제 금액 (KRW, 1000 이상)
  paymentMethod: string; // 결제 수단 (예: card, transfer)
  paymentGateway: string; // 결제 게이트웨이 코드 (예: toss)
}

// 코인 충전 응답
export interface CreatePaymentResponse {
  paymentId: number; // 생성된 결제 ID
  transactionId: string; // 게이트웨이 거래 ID
  amountKrw: number; // 결제 금액 (KRW)
  amountUsd: number; // 달러 금액
  coinAmount: number; // 지급 예정 코인
  bonusCoin: number; // 지급 예정 보너스 코인
  status: PaymentStatus; // 결제 상태 (pending)
  paymentUrl: string; // 결제 URL
  createdAt: string; // 결제 생성 시각 (ISO 8601)
}

// 결제 취소 요청
export interface CancelPaymentRequest {
  reason: string; // 취소 사유 (필수)
}

// 결제 취소 응답
export interface CancelPaymentResponse {
  paymentId: number; // 결제 고유 ID
  transactionId: string; // 거래 ID
  status: PaymentStatus; // 결제 상태 (cancelled)
  refundedAmount: number; // 환불된 금액 (KRW)
  refundedCoin: number; // 환불된 코인
  reason: string; // 취소 사유
  cancelledAt: string; // 취소 시각 (ISO 8601)
}
