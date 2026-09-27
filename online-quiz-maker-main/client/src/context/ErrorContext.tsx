import { useState, type ReactNode } from "react";
import { ErrorContext } from "./ErrorContextValue";

export const ErrorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <ErrorContext.Provider value={{ errors, setErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};