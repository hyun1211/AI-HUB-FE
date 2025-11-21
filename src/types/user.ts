// 사용자 정보 API 타입 정의

// 내 정보 조회
export interface UserInfo {
  userId: number; // 사용자 식별자
  username: string; // 사용자 이름
  email: string; // 사용자 이메일
  isActivated: boolean; // 계정 활성화 여부
  createdAt: string; // 계정 생성 시각 (ISO 8601)
}

// 내 정보 수정 요청
export interface UpdateUserRequest {
  username: string; // 사용자 이름 (필수, 2~30자, 공백 불가)
  email: string; // 사용자 이메일 (필수, RFC 5322 형식)
}
