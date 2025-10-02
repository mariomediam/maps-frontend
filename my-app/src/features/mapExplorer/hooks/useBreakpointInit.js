import { useEffect } from "react";
import { initBreakpointListeners } from "@/shared/store/windowStore";

export const useBreakpointInit = () => {
  useEffect(() => {
    const cleanup = initBreakpointListeners();
    return cleanup;
  }, []);
};
