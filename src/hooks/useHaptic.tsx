import { useCallback } from 'react';

export const useHaptic = () => {
  const vibrate = useCallback((duration: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(20), [vibrate]);
  const successTap = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const errorTap = useCallback(() => vibrate([20, 100, 20]), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    successTap,
    errorTap,
  };
};
