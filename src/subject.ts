import { Observable } from './observable';
import { Observer } from './observer';

export class Subject<T> extends Observable<T> {
  protected observers: Observer<T>[] = [];
  protected memory: T[] = [];

  // memorySize: number of event saved and replayed on subscription
  constructor(private memorySize: number = 0) {
    super((observer: Observer<T>): () => void => {
      this.observers.push(observer);
      this.memory.forEach(value => observer.next(value));
      return () => {
        this.observers = this.observers.filter(o => o !== observer);
      };
    });;
  }

  public next(value: T) {
    // Broadcast to all observers
    this.observers.forEach(observer => observer.next(value));
    // Save the value for later replay on subscription
    this.remember(value);
  }

  public error(errValue: any) {
    this.observers.forEach(observer => observer.next(errValue));
  }

  public complete(errValue: any) {
    this.observers.forEach(observer => observer.complete());
  }

  protected remember(value: T): void {
    if (this.memorySize > 0) {
      if (this.memory.length >= this.memorySize) {
        const [head, ...tail] = this.memory;
        this.memory = tail;
      }
      this.memory.push(value);
    }
  }
}

/**
 * This Subject does not broadcast the value immediatly but only when the
 * browser is idle using the requestIdleCallback facility.
 * Observers should not expect to receive all updates but only the last one
 * received before the browser became idle.
 */
export class IdleSubject<T> extends Subject<T> {
  protected idleHandle: number = 0;

  /**
   * window: the brower's window object or equvalient
   * timeout: optional parameter provided to requestIdCallback
   */
  constructor(private window: Window, private timeout?: number) {
    super(0);
  }

  public next(value: T) {
    if (this.idleHandle !== 0) {
      (this.window as any).cancelIdleCallback(this.idleHandle);
    }
    (this.window as any).requestIdleCallback(() => {
      // Broadcast to all observers
      this.observers.forEach(observer => observer.next(value), {
        timeout: this.timeout
      });
    })
    // Save the value for later replay on subscription
    this.remember(value);
  }
}
