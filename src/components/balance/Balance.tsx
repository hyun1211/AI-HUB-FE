"use client";

import React from "react";
import svgPathsBalance from "@/assets/svgs/balance";

interface BalanceDetail {
  userId: number;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  lastTransactionAt: string;
}

// mock 데이터
const mockBalanceData: BalanceDetail = {
  userId: 12345,
  balance: 15420.5,
  totalPurchased: 50000,
  totalUsed: 34579.5,
  lastTransactionAt: "2025-11-22T14:30:45Z",
};

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface BalanceProps {
  onBack?: () => void;
}

function BalanceCard({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div className="rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-4">
      <p
        className="text-[14px] text-[#929292] mb-2"
        style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
      >
        {label}
      </p>
      <p
        className={`text-[24px] ${isHighlight ? "text-[#ff7600]" : "text-white"}`}
        style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
      >
        {value}
      </p>
    </div>
  );
}

export function Balance({ onBack }: BalanceProps) {
  const data = mockBalanceData;

  return (
    <div
      className="min-h-screen w-full bg-[#09090B] overflow-y-auto"
      data-name="잔액 조회 UI"
    >
      <div className="max-w-[508px] mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="h-[35px] rounded-[5px] w-[48px] hover:bg-[#2c2e30] transition-colors border border-[#444648] flex items-center justify-center"
          >
            <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
              <path
                d={svgPathsBalance.p20b2fe00}
                stroke="#F5F5F5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="bg-[rgba(29,31,33,0.95)] rounded-[15px] p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <img src="/wallet.svg" alt="" className="size-[32px]" />
            <h1
              className="text-[24px] sm:text-[28px] text-neutral-100"
              style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
            >
              잔액 조회
            </h1>
          </div>

          {/* User ID */}
          <div className="mb-6 pb-4 border-b border-[#444648]">
            <p
              className="text-[14px] text-[#929292] mb-1"
              style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
            >
              사용자 ID
            </p>
            <p
              className="text-[18px] text-white"
              style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
            >
              #{data.userId}
            </p>
          </div>

          {/* Balance Cards */}
          <div className="space-y-4">
            {/* Current Balance - Highlighted */}
            <div className="rounded-[8px] border-2 border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-4 bg-gradient-to-br from-[#ff7600]/10 to-transparent">
              <p
                className="text-[14px] text-[#929292] mb-2"
                style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
              >
                현재 잔액
              </p>
              <p
                className="text-[32px] sm:text-[36px] text-[#ff7600]"
                style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
              >
                {formatNumber(data.balance)}
                <span className="text-[18px] ml-1">코인</span>
              </p>
            </div>

            {/* Other Balance Info */}
            <div className="grid grid-cols-2 gap-4">
              <BalanceCard
                label="총 구매량"
                value={`${formatNumber(data.totalPurchased)} 코인`}
              />
              <BalanceCard
                label="총 사용량"
                value={`${formatNumber(data.totalUsed)} 코인`}
              />
            </div>

            {/* Last Transaction */}
            <div className="rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-4">
              <p
                className="text-[14px] text-[#929292] mb-2"
                style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
              >
                마지막 거래 일시
              </p>
              <p
                className="text-[16px] text-white"
                style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
              >
                {formatDate(data.lastTransactionAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Statistics Summary */}
        <div className="bg-[rgba(29,31,33,0.95)] rounded-[15px] p-4 sm:p-6">
          <h2
            className="text-[20px] text-neutral-100 mb-4"
            style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
          >
            사용 현황
          </h2>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[14px]">
              <span
                className="text-[#929292]"
                style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
              >
                사용률
              </span>
              <span
                className="text-white"
                style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
              >
                {((data.totalUsed / data.totalPurchased) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-[12px] bg-[#2c2e30] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff7600] to-[#ff983f] rounded-full transition-all"
                style={{
                  width: `${(data.totalUsed / data.totalPurchased) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[12px] text-[#929292]">
              <span>사용: {formatNumber(data.totalUsed)}</span>
              <span>잔여: {formatNumber(data.balance)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center pb-4">
          <p
            className="text-[12px] text-[#929292]"
            style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
          >
            잔액 정보는 실시간으로 업데이트됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
