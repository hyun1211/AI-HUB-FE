import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요 없는 경로들
const publicPaths = [
  "/login",
  "/oauth/callback", // OAuth 콜백
];

// 정적 파일 및 API 경로 패턴
const excludedPatterns = [
  /^\/api\//,
  /^\/_next\//,
  /^\/favicon\.ico$/,
  /\.(png|jpg|jpeg|gif|svg|ico|webp)$/,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일 및 API 경로는 미들웨어 건너뛰기
  if (excludedPatterns.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // 공개 경로는 인증 체크 건너뛰기
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 쿠키에서 accessToken 확인
  const accessToken = request.cookies.get("accessToken")?.value;

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    // 원래 가려던 페이지를 쿼리 파라미터로 저장 (로그인 후 리다이렉트용)
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
