import { Subject } from './subject';

/**
 * Always hold one value, which can be recalled at any time with get.
 * Basically a variable with subscription.
 */
export class BehaviorSubject<T> extends Subject<T> {
  /**
   */
  constructor(private value: T) {
    super(1);
    this.next(value);
  }

  /**
   * Retrieve the last set value
   */
  public get(): T {
    if (this.hasError()) {
      throw this.errValue;
    }
    return this.memory[this.memory.length - 1];
  }

}
