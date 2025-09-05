import { progressStore } from '~/store/progressStore';
import { CountriesData } from '~/types';
import { WorkerResponse } from './@types';
import FetchAndParseWorker from './fetch-and-parse.worker.ts?worker';

interface WorkerTask {
  id: string;
  resolve: (value: CountriesData) => void;
  reject: (error: Error) => void;
}

class WorkerClient {
  private worker: Worker;
  private tasks = new Map<string, WorkerTask>();

  constructor() {
    this.worker = new FetchAndParseWorker();
    this.worker.onmessage = this.handleMessage.bind(this);
  }

  async fetchAndParseJson(url: string): Promise<CountriesData> {
    const id = Math.random().toString(36).substring(2, 10);

    return new Promise((resolve, reject) => {
      this.tasks.set(id, { id, resolve, reject });
      this.worker.postMessage({ id, url });
    });
  }

  terminate() {
    this.worker.terminate();
    this.tasks.clear();
  }

  private handleMessage(event: MessageEvent<WorkerResponse>): void {
    const { id, type, message, result, error } = event.data;

    if (type === 'result') {
      const task = this.tasks.get(id);
      if (task) {
        if (result) {
          task.resolve(result);
          progressStore.setState({ message });
        } else {
          task.reject(new Error(error || 'Unknown error'));
        }
        this.tasks.delete(id);
      } else {
        console.error('Received result for unknown task', id);
      }
    }
    progressStore.setState({ message });
  }
}

export const fetchAndParseWorker = new WorkerClient();
