import { Observer } from './observer';
import { Subscription } from './subscription';
import { Subject } from './subject';

/**
 * Always hold one value, which can be recalled at any time with get.
 * Basically a variable with subscription.
 */
export class BehaviorSubject<T> extends Subject<T> {
  protected last: T;
  protected errValue: any = undefined;

  /**
   * Construct a Subject by providing an intial value which will be immediatly
   * forwarded to the subscribed Observers.
   */
  constructor(private value: T) {
    super();
    this.last = value;
    this.next(value);
  }

  /**
   * Create a BehaviorSubject from a Subject.
   * The call is asynchronous and resolves once the first value is received.
   * Subsequent values are then forwarded.
   */
  static fromSubject<T>(subject: Subject<T>): Promise<BehaviorSubject<T>> {
    return new Promise(resolve => {
      let initialized = false;
      const subscription = subject.subscribe(value => {
        if (!initialized) {
          initialized = true;
          const behaviorSubject = new BehaviorSubject<T>(value);
          subject.subscribe({
            next: value => behaviorSubject.next(value),
            error: error => behaviorSubject.error(error),
            complete: () => behaviorSubject.complete(),
          });
          // We can only unsubscribe asynchonously when we are subscribing.
          setTimeout(() => {
            subscription.unsubscribe();
            resolve(behaviorSubject);
          }, 0);
        }
      });
    });
  }

  public error(errValue: unknown): void {
    this.errValue = errValue;
    super.error(errValue);
  }

  public next(value: T): void {
    this.last = value;
    super.next(value);
  }

  /**
   * Retrieve the last set value
   */
  public get(): T {
    if (this.hasError()) {
      throw this.errValue;
    }
    return this.last;
  }

  /**
   * Notifies subscribing observer immediatly.
   */
  public subscribe(observer: Observer<T> | ((value: T) => void),
    error: (errValue: any) => void = () => {},
    complete: () => void = () => {}): Subscription<T> {
    const subscription = super.subscribe(observer, error, complete);
    (subscription as any).observer.next(this.last);
    return subscription;
  }

  protected hasError(): boolean {
    return this.errValue !== undefined;
  }
}
