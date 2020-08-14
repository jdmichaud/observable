import { Observer } from './observer';
import { SubscriberFunction, Subscription } from './subscription';

type Observed<T> = T extends Observable<infer U> ? U : T;

export class Observable<T> {
  constructor(private subscriber: SubscriberFunction<T>) {}

  /**
   * Consolidates all the provided observables into one. The returned observable
   * will start receiving next calls once all the observable have provided at
   * least one value and will receive next calls on each new events.
   * Values are provided into an array containing all values.
   * complete is called once all the provided observables are completed.
   * error is called on each provided observable error.
   * example:
   * ```typescript
   *   const observable1 = new Subject<number>();
   *   const observable2 = new Subject<string>();
   *   Observable.all([observable1, observable2]).subscribe({
   *     next: values => console.log(values),
   *     complete: () => console.log('completed'),
   *   });
   *   observable1.next(12); // nothing happens
   *   observable2.next('yolo'); // [12, 'yolo']
   *   observable2.complete(); // nothing happens
   *   observable1.next(42); // [42, 'yolo']
   *   observable1.complete; // 'completed'
   * ```
   */
  static all<T extends Observable<T>[]>(observables: readonly [...T]): Observable<{ [P in keyof T]: Observed<T[P]> }> {
    const values = Array.from(Array(observables.length));
    const completionState = Array.from(Array(observables.length)).map(_ => false);

    return new Observable(observer => {
      function next(): void {
        if (values.every(v => v !== undefined)) {
          observer.next(values as any);
        }
      }

      function complete(): void {
        if (completionState.every(c => c)) {
          observer.complete();
        }
      }

      observables.forEach((observable, index) => {
        observable.subscribe({
          next: value => {
            values[index] = value;
            next();
          },
          complete: () => {
            completionState[index] = true;
            complete();
          },
          error: observer.error,
        });
      });

      return () => {};
    });
  }

  static complete<T>(value?: T): Observable<T> {
    return new Observable(observer => {
      if (value !== undefined) {
        observer.next(value);
      }
      observer.complete();
      return () => {};
    });
  }

  /**
   * Chains observable in order to smoothly apply processing on next values.
   * Error and complete signals are being forwarded to returned observable.
   * Errors can be raised to the error parameter of the next function parameter.
   * example:
   * ```typescript
   * const observable = new Observable<number>(observer => {
   *   observer.next(42);
   *   return () => {};
   * });
   *
   * let observedValue: string;
   * Observable.chain(observable, value => value.toString()).subscribe({
   *   next: value => observedValue = value,
   * });
   * ```
   */
  static chain<T, U>(observable: Observable<T>,
    next: (value: T, error: (errValue) => void) => U): Observable<U> {
    return new Observable<U>(observer => {
      observable.subscribe({
        next: value => observer.next(next(value, observer.error)),
        error: observer.error,
        complete: observer.complete,
      });

      return () => {};
    });
  }

  // Returns itself
  observable() : Observable<T> {
    return this;
  }

  // Converts items to an Observable
  static of<T>(...items: Array<T>) : Observable<T> {
    return new Observable(observer => {
      items.forEach(i => observer.next(i));
      observer.complete();

      return () => {};
    });
  }

  // Converts an observable or iterable to an Observable
  static from<T>(convertee: Observable<T> | Iterable<T>): Observable<T> {
    if (convertee.hasOwnProperty('observable')) {
      const observable: Observable<T> = convertee as any;
      return observable.observable();
    }
    const iterable: Iterable<T> = convertee as any;
    return new Observable(observer => {
      for (const value of iterable) {
        observer.next(value);
      }
      observer.complete();
      return () => {};
    });
  }

  public subscribe(observer: Observer<T> | ((value: T) => void),
    error: (errValue: any) => void = () => {},
    complete: () => void = () => {}): Subscription<T> {
    if (typeof observer === 'function') {
      return new Subscription<T>({
        start: (_subscription: Subscription<T>) => {},
        next: observer,
        error,
        complete,
      }, this.subscriber);
    } else {
      return new Subscription<T>({
        start: observer.start !== undefined ? observer.start : () => {},
        next: observer.next !== undefined ? observer.next : () => {},
        error: observer.error !== undefined ? observer.error : () => {},
        complete:
          observer.complete !== undefined ? observer.complete : () => {},
      }, this.subscriber);
    }
  }
}
