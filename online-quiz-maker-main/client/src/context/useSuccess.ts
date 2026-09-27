import { useContext } from "react";
import { SuccessContext } from "./SuccessContextValue";

export const useSuccess = () => {
  const context = useContext(SuccessContext);

  if (!context) {
    throw new Error(
      "useSuccess must be used within SuccessProvider"
    );
  }

  return context;
};