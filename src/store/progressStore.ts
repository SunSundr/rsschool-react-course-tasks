type ProgressStage = 'processing' | 'complete';

interface ProgressState {
  stage: ProgressStage;
  message: string;
}

type Subscriber = (state: ProgressState) => void;

class ProgressStore {
  private state: ProgressState = { stage: 'processing', message: 'Loading data...' };
  private subscribers: Subscriber[] = [];

  setState(newState: Partial<ProgressState>) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }

  getState() {
    return this.state;
  }
}

export const progressStore = new ProgressStore();
