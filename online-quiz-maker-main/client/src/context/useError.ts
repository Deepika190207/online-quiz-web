import { useContext } from "react";
import { ErrorContext } from "./ErrorContextValue";

export const useError = () => {
  const context = useContext(ErrorContext);

  const clearErrors = () => {
    context.setErrors([]);
  };

  return {
    errors: context.errors,
    setErrors: context.setErrors,
    clearErrors,
  };
};