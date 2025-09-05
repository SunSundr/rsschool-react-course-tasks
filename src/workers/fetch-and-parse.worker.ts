import { ExtendedWorkerGlobalScope, WorkerMessage } from './@types';

const ctx = self as ExtendedWorkerGlobalScope;

ctx.onmessage = async function (event: MessageEvent<WorkerMessage>) {
  const { url, id } = event.data;

  try {
    ctx.postMessage({
      id,
      type: 'progress',
      message: 'Loading data...',
    });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    ctx.postMessage({
      id,
      type: 'progress',
      message: 'Parsing received data...',
    });

    const data = await response.json();

    ctx.postMessage({
      id,
      result: data,
      message: 'Processing received data',
      type: 'result',
    });
  } catch (error) {
    ctx.postMessage({
      id,
      type: 'result',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export type FetchAndParseWorker = typeof ctx;
