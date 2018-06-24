import { Observable } from './observable';
import { Observer } from './observer';

export function toPromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    observable.subscribe({
      next: resolve,
      error: reject,
      complete: resolve,
    });
  });
}

export function toObservable<T>(promise: Promise<T>): Observable<T> {
  return new Observable((observer: Observer<T>): () => void => {
    promise.then((v) => {
      observer.next(v);
      observer.complete();
    });
    promise.catch(observer.error);
    return () => {};
  });
}
