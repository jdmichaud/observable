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

  public next(value: T) {
    // Broadcast to all observers
    this.observers.forEach((observer) => observer.next(value));
  }

  public error(errValue: any) {
    this.observers.forEach((observer) => observer.next(errValue));
  }

  public complete() {
    this.observers.forEach((observer) => observer.complete());
  }
}
