import { Observable } from './observable';
import { Observer } from './observer';
import { SubscriberFunction, Subscription } from './subscription';

export class Subject<T> extends Observable<T> {
  protected observers: Array<Observer<T>> = [];

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
    this.observers.forEach((observer) => (observer as any).next(value));
  }

  public error(errValue: unknown): void {
    this.observers.forEach((observer) => (observer as any).error(errValue));
  }

  public complete(): void {
    this.observers.forEach((observer) => (observer as any).complete());
  }
}
