import { Observable } from './observable';
import { Observer } from './observer';
import { SubscriberFunction, Subscription } from './subscription';

/**
 * Will replay the previoujs calls to next, complete and error to a newly
 * subscribe subject.
 */
export class ReplaySubject<T> extends Observable<T> {
  protected observers: Observer<T>[] = [];
  protected memory: T[] = [];
  protected errValue: any = undefined;
  protected completed: boolean = false;

  // memorySize: number of event saved and replayed on subscription
  constructor(private memorySize: number) {
    super((observer: Observer<T>): () => void => {
      this.observers.push(observer);
      this.memory.forEach((value) => observer.next(value));
      if (this.hasError()) {
        observer.error(this.errValue);
      } else if (this.isComplete()) {
        observer.complete();
      }
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
    this.completed = true;
    this.observers.forEach((observer) => observer.complete());
  }

  protected hasError() {
    return this.errValue !== undefined;
  }

  protected isComplete(): boolean {
    return this.completed;
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