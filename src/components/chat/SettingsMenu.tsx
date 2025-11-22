"use client";

import React from "react";

interface MenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 text-left transition-colors hover:bg-[#3c3e40] rounded-lg px-3 py-2"
    >
      <img src={icon} alt="" className="size-[24px]" />
      <p
        className="text-[14px] text-neutral-100"
        style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
      >
        {label}
      </p>
    </button>
  );
}

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBalanceClick?: () => void;
}

export function SettingsMenu({ isOpen, onClose, onBalanceClick }: SettingsMenuProps) {
  const handleLogout = () => {
    console.log("로그아웃 클릭");
    onClose();
  };

  const handleBalance = () => {
    console.log("잔액 조회 클릭");
    onBalanceClick?.();
    onClose();
  };

  const handleHistory = () => {
    console.log("코인 거래 내역 조회 클릭");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50" onClick={onClose} />

      {/* Menu */}
      <div className="absolute bottom-[70px] left-4 z-50 w-[220px] rounded-[15px] bg-[#2c2e30] p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="space-y-1">
          <MenuItem icon="/logout.svg" label="로그아웃" onClick={handleLogout} />
          <MenuItem icon="/wallet.svg" label="잔액 조회" onClick={handleBalance} />
          <MenuItem icon="/coin.svg" label="코인 거래 내역 조회" onClick={handleHistory} />
        </div>
      </div>
    </>
  );
}

interface SettingsButtonProps {
  onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#2c2e30]"
    >
      <img src="/setting.svg" alt="" className="size-[24px]" />
      <p
        className="text-[14px] text-neutral-100"
        style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
      >
        환경설정
      </p>
    </button>
  );
}
