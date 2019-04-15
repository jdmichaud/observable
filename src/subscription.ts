import { FullObserver, Observer } from './observer';

export class Subscription<T> {
  public closed = false;
  private cleanup: () => void;

  constructor(private observer: FullObserver<T>,
    private subscriber: SubscriberFunction<T>) {
    this.observer.start(this);
    if (!this.closed) {
      this.cleanup = this.subscriber(observer);
    }
  }

  public unsubscribe(): void {
    if (!this.closed && this.cleanup !== undefined) {
      this.cleanup();
    }
    this.closed = true;
  }
}

export type SubscriberFunction<T> = (observer: Observer<T>) => () => void;
