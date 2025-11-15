export interface AIModel {
  id: string;
  name: string;
  description: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
