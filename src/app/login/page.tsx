"use client";

import { useRouter } from "next/navigation";
import loginSvgPaths from "@/assets/svgs/login";

function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute left-5 top-8 flex h-[35px] w-[48px] items-center justify-center rounded-[5px] border border-[#444648] transition-colors hover:bg-white/5"
      aria-label="뒤로 가기"
    >
      <svg className="size-6" fill="none" viewBox="0 0 24 24">
        <path
          d={loginSvgPaths.arrowLeft}
          stroke="#F5F5F5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 로직 구현
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="flex h-[45px] w-[183px] items-center justify-center gap-2 rounded-[6px] bg-[#FEE500] transition-opacity hover:opacity-90"
      aria-label="카카오 로그인"
    >
      <svg className="size-[18px]" viewBox="0 0 18 18" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 0.5C4.02944 0.5 0 3.69137 0 7.60714C0 10.0305 1.55893 12.1645 3.93152 13.4136L2.93303 17.0408C2.84481 17.3619 3.21105 17.6157 3.49337 17.4268L7.87366 14.5038C8.24037 14.5474 8.61503 14.5714 9 14.5714C13.9706 14.5714 18 11.38 18 7.46429C18 3.54857 13.9706 0.5 9 0.5Z"
          fill="#000000"
        />
      </svg>
      <span
        className="text-[14px] text-[#000000D9]"
        style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 500 }}
      >
        카카오 로그인
      </span>
    </button>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-zinc-950">
      {/* 뒤로가기 버튼 */}
      <BackButton />

      {/* 로그인 폼 영역 - 전체 화면 중앙 정렬 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* 타이틀 */}
        <h1
          className="mb-4 text-[36px] text-neutral-100"
          style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 600 }}
        >
          AI HUB
        </h1>

        {/* 서브타이틀 */}
        <p
          className="mb-4 text-center text-[24px] text-[#e0e0e0]"
          style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
        >
          3초 카카오톡 로그인
        </p>

        {/* 설명 */}
        <p
          className="mb-20 text-center text-[16px] text-[#929292]"
          style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400 }}
        >
          지금 바로 다양한 AI모델을 한번에 사용해보세요.
        </p>

        {/* 카카오 로그인 버튼 */}
        <KakaoLoginButton />
      </div>
    </div>
  );
}
