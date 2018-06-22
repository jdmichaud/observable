import { Observer } from "./observer";
import { SubscriberFunction, Subscription } from "./subscription";

export class Observable<T> {
  constructor(private subscriber: SubscriberFunction<T>) {}
  public subscribe(observer: Observer<T> | ((value: T) => void),
                   error: (errValue: any) => void = () => {},
                   complete: () => void = () => {}): Subscription<T> {
    if (typeof observer === "function") {
      return new Subscription<T>({
        start: (subscription: Subscription<T>) => {},
        next: observer,
        error,
        complete,
      }, this.subscriber);
    } else {
      return new Subscription<T>(observer, this.subscriber);
    }
  }
}
