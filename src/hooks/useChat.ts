import { useState, useCallback } from "react";

export function useChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = useCallback(
    (msg: string) => {
      setMessages((prev) => [...prev, msg]);
      console.log("Message sent:", msg);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        handleSendMessage(message);
        setMessage("");
      }
    },
    [message, handleSendMessage]
  );

  return {
    messages,
    message,
    setMessage,
    handleSendMessage,
    handleSubmit,
  };
}
