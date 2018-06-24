import { Subscription } from './subscription';

export interface Observer<T> {
  start?(subscription: Subscription<T>): void;
  next?(value: T): void;
  error?(errValue: any): void;
  complete?(): void;
}

export interface FullObserver<T> {
  start(subscription: Subscription<T>): void;
  next(value: T): void;
  error(errValue: any): void;
  complete(): void;
}
