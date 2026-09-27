import { createContext } from "react";

export interface ErrorContextType {
  errors: string[];
  setErrors: (errors: string[]) => void;
}

export const ErrorContext = createContext<ErrorContextType>({
  errors: [],
  setErrors: () => {},
});