// 지갑 API 타입 정의

import type { ApiResponse, ApiErrorDetail } from "./upload";

export type { ApiResponse, ApiErrorDetail };

// 지갑 정보 타입
export interface WalletInfo {
  walletId: number;
  userId: number;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  lastTransactionAt: string;
  createdAt: string;
  updatedAt: string;
}
