const DELAY = 400;

export const callWithDelay = (callback: () => void, delay = DELAY) => {
  setTimeout(() => callback(), delay);
};
