import { Observable } from './observable';
import { Observer } from './observer';

export class Subject<T> extends Observable<T> {
  protected observers: Observer<T>[] = [];
  protected memory: T[] = [];
  protected errValue: any = undefined;

  // memorySize: number of event saved and replayed on subscription
  constructor(private memorySize: number = 0) {
    super((observer: Observer<T>): () => void => {
      this.observers.push(observer);
      this.memory.forEach((value) => observer.next(value));
      return () => {
        this.observers = this.observers.filter((o) => o !== observer);
      };
    });
  }

  public next(value: T) {
    // Save the value for later replay on subscription
    this.remember(value);
    // Broadcast to all observers
    this.observers.forEach((observer) => observer.next(value));
  }

  public error(errValue: any) {
    this.errValue = errValue;
    this.observers.forEach((observer) => observer.next(errValue));
  }

  public complete() {
    this.observers.forEach((observer) => observer.complete());
  }

  protected hasError() {
    return this.errValue !== undefined;
  }

  protected remember(value: T): void {
    if (this.memorySize > 0) {
      if (this.memory.length >= this.memorySize) {
        const [_head, ...tail] = this.memory;
        this.memory = tail;
      }
      this.memory.push(value);
    }
  }
}
