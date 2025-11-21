// 거래 API 타입 정의

import type { ApiResponse, ApiErrorDetail } from "./upload";

export type { ApiResponse, ApiErrorDetail };

// 거래 유형
export type TransactionType = "purchase" | "usage" | "refund" | "bonus";

// 거래 상세 정보
export interface TransactionDetail {
  transactionId: number;
  userId: number;
  roomId: string | null;
  messageId: string | null;
  transactionType: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  modelId: number | null;
  createdAt: string;
}

// 거래 내역 목록 아이템
export interface Transaction {
  transactionId: number;
  transactionType: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  modelId: number | null;
  modelName: string | null;
  roomId: string | null;
  messageId: string | null;
  createdAt: string;
}

// 거래 내역 페이지 응답
export interface TransactionsPageResponse {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 거래 내역 조회 파라미터
export interface GetTransactionsParams {
  page?: number;
  size?: number;
  transactionType?: TransactionType;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}
