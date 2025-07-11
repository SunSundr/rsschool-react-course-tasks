const DELAY = 400;

export const callWithDelay = (callback: () => void, delay = DELAY): void => {
  setTimeout(() => callback(), delay);
};
