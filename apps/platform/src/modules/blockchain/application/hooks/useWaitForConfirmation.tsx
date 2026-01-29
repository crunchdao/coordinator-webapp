import { useCallback } from "react";

export const useWaitForConfirmation = () => {
  const waitForConfirmation = useCallback(
    async (
      signature: string,
      checkCondition: () => Promise<boolean>,
      maxAttempts: number = 10,
      delayMs: number = 3500
    ): Promise<void> => {
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        
        try {
          const conditionMet = await checkCondition();
          if (conditionMet) {
            return;
          }
        } catch (error) {
          console.warn(`Confirmation check attempt ${i + 1} failed:`, error);
        }
      }
      
      throw new Error("Transaction confirmation timeout");
    },
    []
  );

  return { waitForConfirmation };
};