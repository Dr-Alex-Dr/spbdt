class DelayedQueue {
  private static instance: DelayedQueue;
  private queue: { callback: (...args: any[]) => void; args: any[] }[] = [];

  private constructor() {}

  public static getInstance(): DelayedQueue {
    if (!DelayedQueue.instance) {
      DelayedQueue.instance = new DelayedQueue();
    }
    return DelayedQueue.instance;
  }

  public add(callback: (...args: any[]) => void, ...args: any[]): void {
    this.queue.push({ callback, args });
    setTimeout(() => {
      const queuedItem = this.queue.shift();
      if (queuedItem) {
        queuedItem.callback(...queuedItem.args);
      }
    }, 300000);
  }
}

export default DelayedQueue;
