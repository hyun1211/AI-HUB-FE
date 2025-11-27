"use client";

import React, { useEffect, useState } from "react";
import svgPathsBalance from "@/assets/svgs/balance";
import { useWallet } from "@/hooks/useWallet";

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
  // -0 또는 매우 작은 음수를 0으로 처리
  const normalizedNum = num < 0 && num > -0.01 ? 0 : num;
  return normalizedNum.toLocaleString("ko-KR", {
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
  const { wallet, isLoading, error, fetchWallet, refresh } = useWallet({
    autoFetch: false,
    onError: (err) => {
      console.error("지갑 정보 조회 실패:", err);
    },
  });

  const [spinKey, setSpinKey] = useState(0);

  // 새로고침 핸들러 (회전 애니메이션 포함)
  const handleRefresh = async () => {
    if (isLoading) return;

    // key를 변경하여 애니메이션 재시작
    setSpinKey((prev) => prev + 1);
    await refresh();
  };

  // 페이지 진입 시 한 번만 데이터 로드
  useEffect(() => {
    fetchWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-[35px] rounded-[5px] px-4 hover:bg-[#2c2e30] transition-colors border border-[#444648] flex items-center justify-center disabled:opacity-50"
          >
            <svg
              key={spinKey}
              className={`size-[20px] ${spinKey > 0 ? 'animate-spin-once' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                stroke="#F5F5F5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <style jsx>{`
              @keyframes spin-once {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
              .animate-spin-once {
                animation: spin-once 0.6s ease-in-out;
              }
            `}</style>
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

          {/* Loading State */}
          {isLoading && !wallet && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7600]" />
            </div>
          )}

          {/* Error State */}
          {error && !wallet && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4 mb-6">
              <p
                className="text-[14px] text-red-400"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 400,
                }}
              >
                {error.message}
              </p>
              <button
                onClick={refresh}
                className="mt-2 text-[14px] text-[#ff7600] hover:underline"
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 500,
                }}
              >
                다시 시도
              </button>
            </div>
          )}

          {/* Data Display */}
          {wallet && (
            <>
              {/* User ID */}
              <div className="mb-6 pb-4 border-b border-[#444648]">
                <p
                  className="text-[14px] text-[#929292] mb-1"
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  사용자 ID
                </p>
                <p
                  className="text-[18px] text-white"
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  #{wallet.userId}
                </p>
              </div>

              {/* Balance Cards */}
              <div className="space-y-4">
                {/* Current Balance - Highlighted */}
                <div className="rounded-[8px] border-2 border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-4 bg-gradient-to-br from-[#ff7600]/10 to-transparent">
                  <p
                    className="text-[14px] text-[#929292] mb-2"
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    현재 잔액
                  </p>
                  <p
                    className="text-[32px] sm:text-[36px] text-[#ff7600]"
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {formatNumber(wallet.balance)}
                    <span className="text-[18px] ml-1">코인</span>
                  </p>
                </div>

                {/* Other Balance Info */}
                <div className="grid grid-cols-2 gap-4">
                  <BalanceCard
                    label="총 구매량"
                    value={`${formatNumber(wallet.totalPurchased)} 코인`}
                  />
                  <BalanceCard
                    label="총 사용량"
                    value={`${formatNumber(wallet.totalUsed)} 코인`}
                  />
                </div>

                {/* Last Transaction */}
                <div className="rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-4">
                  <p
                    className="text-[14px] text-[#929292] mb-2"
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    마지막 거래 일시
                  </p>
                  <p
                    className="text-[16px] text-white"
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(wallet.lastTransactionAt)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Usage Statistics Summary */}
        {wallet && (
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
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  사용률
                </span>
                <span
                  className="text-white"
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {((wallet.totalUsed / wallet.totalPurchased) * 100).toFixed(
                    1
                  )}
                  %
                </span>
              </div>
              <div className="h-[12px] bg-[#2c2e30] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff7600] to-[#ff983f] rounded-full transition-all"
                  style={{
                    width: `${
                      (wallet.totalUsed / wallet.totalPurchased) * 100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[12px] text-[#929292]">
                <span>사용: {formatNumber(wallet.totalUsed)}</span>
                <span>잔여: {formatNumber(wallet.balance)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info */}
        <div className="text-center pb-4">
          <p
            className="text-[12px] text-[#929292]"
            style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
          >
            우측 상단의 새로고침 버튼을 클릭하면 최신 잔액 정보를 확인할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
