import { AIModel } from "@/types/chat";

export const AI_MODELS: AIModel[] = [
  {
    id: "claude",
    name: "Claude 3.7 Sonnet",
    description: "Claude의 코딩에 최적화된 최신 모델 입니다.",
  },
  {
    id: "gpt4o",
    name: "GPT 4o",
    description: "OpenAI의 범용적인 비 추론 모델 입니다.",
  },
  {
    id: "gpt4o-mini",
    name: "GPT o4 mini-high",
    description: "OpenAI의 범용적인 추론 모델 입니다.",
  },
  {
    id: "gemini",
    name: "Gemini 2.5 Flash",
    description: "Google의 빠르고 고효율의 추론 모델 입니다.",
  },
  {
    id: "grok",
    name: "Grok 3",
    description: "Xai의 보다 자유로운 응답이 가능한 모델입니다.",
  },
];

export const DEFAULT_MODEL = AI_MODELS[0];
