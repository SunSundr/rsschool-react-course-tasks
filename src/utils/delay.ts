const DELAY = 400;

export const callWithDelay = (callback: () => void) => {
  setTimeout(() => callback(), DELAY);
};
