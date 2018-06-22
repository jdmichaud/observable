import { Observable } from './observable';

describe('Observable', () => {
  it('shall subscribe the observer', () => {
    const startMock = jest.fn();
    const nextMock = jest.fn();
    const observable = new Observable<number>((observer) => {
      observer.next(42);
      return () => {};
    });
    const subscription = observable.subscribe({
      start: startMock,
      next: nextMock,
    });
    expect(startMock).toBeCalledWith(subscription);
    expect(nextMock).toBeCalledWith(42);
  });

  it('shall unsubscribe the observer', () => {
    const unsubscribeMock = jest.fn();
    const observable = new Observable<number>((observer) => {
      return unsubscribeMock;
    });
    const subscription = observable.subscribe(() => {});
    subscription.unsubscribe();
    expect(unsubscribeMock).toBeCalled();
  });

  it('shall call error on the observable', () => {
    const errorMock = jest.fn();
    const observable = new Observable<number>((observer) => {
      observer.error('error!');
      return () => {};
    });
    const subscription = observable.subscribe({
      error: errorMock,
    });
    expect(errorMock).toBeCalledWith('error!');
  });

  it('shall call complete on the observable', () => {
    const completeMock = jest.fn();
    const observable = new Observable<number>((observer) => {
      observer.complete();
      return () => {};
    });
    const subscription = observable.subscribe({
      complete: completeMock,
    });
    expect(completeMock).toBeCalledWith();
  });
});
