import { Observable } from './observable';
import { Observer } from './observer';
import { SubscriberFunction, Subscription } from './subscription';

export class Subject<T> extends Observable<T> {
  protected observers: Observer<T>[] = [];

  constructor() {
    super((observer: Observer<T>): () => void => {
      this.observers.push(observer);
      return () => {
        this.observers = this.observers.filter((o) => o !== observer);
      };
    });
  }

  public next(value: T): void {
    // Broadcast to all observers
    this.observers.forEach((observer) => observer.next(value));
  }

  public error(errValue: unknown): void {
    this.observers.forEach((observer) => observer.error(errValue));
  }

  public complete(): void {
    this.observers.forEach((observer) => observer.complete());
  }
}
