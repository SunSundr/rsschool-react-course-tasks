import { CountriesData } from '~/types';

export interface WorkerSelf {
  onmessage: ((event: MessageEvent) => void) | null;
  postMessage: (message: WorkerMessage, transfer?: Transferable[]) => void;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
  terminate?: () => void;
}

export interface WorkerMessage {
  url: string;
  id: string;
}

export interface WorkerResponse {
  id: string;
  type: 'progress' | 'result';
  message?: string;
  result?: CountriesData;
  error?: string;
}

export type ExtendedWorkerGlobalScope = WorkerSelf & typeof globalThis;
