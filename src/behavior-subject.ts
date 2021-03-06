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

  protected hasError(): boolean {
    return this.errValue !== undefined;
  }
}
