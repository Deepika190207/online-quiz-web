import { createContext } from "react";

export interface SuccessContextType {
  messages: string[];
  addMessage: (msg: string) => void;
  clearMessages: () => void;
}

export const SuccessContext =
  createContext<SuccessContextType | undefined>(undefined);