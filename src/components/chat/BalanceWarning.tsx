"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface BalanceWarningProps {
  message: string;
  onDismiss: () => void;
}

export function BalanceWarning({ message, onDismiss }: BalanceWarningProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="flex items-center justify-between px-3 mb-3 mx-auto bg-zinc-950"
      style={{
        borderRadius: "8px",
        border: "1px solid #FE2828",
        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
        width: "35rem",
        height: "3.2rem",
        color: "#FE2828",
        fontFamily: "Pretendard",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
      }}
    >
      <Image src="/warning.svg" alt="Warning" width={20} height={18} />
      <span className="whitespace-nowrap">{message}</span>
    </div>
  );
}
