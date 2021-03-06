import { ReplaySubject } from './replay-subject';

/**
 * This Subject does not broadcast the value immediatly but only when the
 * browser is idle using the requestIdleCallback facility.
 * Observers should not expect to receive all updates but only the last one
 * received before the browser became idle.
 */
export class IdleSubject<T> extends ReplaySubject<T> {
  protected idleHandle = 0;

  /**
   * window: the brower's window object or equivalent
   * timeout: optional parameter provided to requestIdCallback
   */
  constructor(private window: Window, private timeout?: number) {
    super(0);
  }

  public next(value: T): void {
    if (this.idleHandle !== 0) {
      (this.window as any).cancelIdleCallback(this.idleHandle);
    }
    this.idleHandle = (this.window as any).requestIdleCallback(() => {
      // Broadcast to all observers
      this.observers.forEach((observer) => observer.next(value), {
        timeout: this.timeout,
      });
    });
    // Save the value for later replay on subscription
    this.remember(value);
  }
}
