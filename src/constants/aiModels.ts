import { AIModel } from "@/types/chat";

export const AI_MODELS: AIModel[] = [
  // 현재 서버에 등록된 모델 (테스트용)
  {
    id: "gpt-5-mini",
    name: "GPT 5 Mini",
    description: "chatgpt의 gpt 5 mini 모델입니다.",
  },
  // TODO: 서버에 모델 추가 후 주석 해제
  // {
  //   id: "claude",
  //   name: "Claude 3.7 Sonnet",
  //   description: "Claude의 코딩에 최적화된 최신 모델 입니다.",
  // },
  // {
  //   id: "gpt4o",
  //   name: "GPT 4o",
  //   description: "OpenAI의 범용적인 비 추론 모델 입니다.",
  // },
  // {
  //   id: "gpt4o-mini",
  //   name: "GPT o4 mini-high",
  //   description: "OpenAI의 범용적인 추론 모델 입니다.",
  // },
  // {
  //   id: "gemini",
  //   name: "Gemini 2.5 Flash",
  //   description: "Google의 빠르고 고효율의 추론 모델 입니다.",
  // },
  // {
  //   id: "grok",
  //   name: "Grok 3",
  //   description: "Xai의 보다 자유로운 응답이 가능한 모델입니다.",
  // },
];

export const DEFAULT_MODEL = AI_MODELS[0];
