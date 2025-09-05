let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;

export const getCanvasContext = () => {
  if (!canvas && typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
  }
  return context;
};

export const calcWidthData = {
  font: '14px sans-serif',
  padding: 32,
  sortIconSpace: 20,
  defaultWidth: 40,
};
