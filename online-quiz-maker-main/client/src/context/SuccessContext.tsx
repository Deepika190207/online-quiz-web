import { useState, type ReactNode } from "react";
import { SuccessContext } from "./SuccessContextValue";

export const SuccessProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (msg: string) => {
    setMessages((prev) => [...prev, msg]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <SuccessContext.Provider
      value={{ messages, addMessage, clearMessages }}
    >
      {children}
    </SuccessContext.Provider>
  );
};
