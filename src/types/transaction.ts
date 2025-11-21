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
