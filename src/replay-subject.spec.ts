import { ReplaySubject } from './replay-subject';

describe('ReplaySubject', () => {
  it('shall subscribe multiple observer', () => {
    const subject = new ReplaySubject<number>(2);
    const nextSpy1 = jest.fn();
    const nextSpy2 = jest.fn();
    subject.subscribe(nextSpy1);
    subject.subscribe(nextSpy2);
    subject.next(42);
    expect(nextSpy1).toHaveBeenCalledWith(42);
    expect(nextSpy2).toHaveBeenCalledWith(42);
  });

  it('shall unsubscribe multiple observer', () => {
    const subject = new ReplaySubject<number>(2);
    const nextSpy1 = jest.fn();
    const nextSpy2 = jest.fn();
    subject.subscribe(nextSpy1);
    const subscription = subject.subscribe(nextSpy2);
    subscription.unsubscribe();
    subject.next(42);
    expect(nextSpy1).toHaveBeenCalledWith(42);
    expect(nextSpy2).not.toHaveBeenCalled();
  });

  it('shall keep a memory of past events', () => {
    const subject = new ReplaySubject<number>(2);
    subject.next(0);
    subject.next(0);
    subject.next(0);
    subject.next(42);
    subject.next(666);
    const nextSpy = jest.fn();
    subject.subscribe(nextSpy);
    expect(nextSpy).toHaveBeenNthCalledWith(1, 42);
    expect(nextSpy).toHaveBeenNthCalledWith(2, 666);
  });

  it('shall replay events before any error and the error if there was any', () => {
    const subject = new ReplaySubject<number>(2);
    subject.next(42);
    subject.next(666);
    subject.error('boum!');
    const spy = jest.fn();
    subject.subscribe({
      next: spy,
      error: spy,
    });
    expect(spy).toHaveBeenNthCalledWith(1, 42);
    expect(spy).toHaveBeenNthCalledWith(2, 666);
    expect(spy).toHaveBeenNthCalledWith(3, 'boum!');
  });

  it('shall replay events and the complete event if the subject is completed', () => {
    const subject = new ReplaySubject<number>(2);
    subject.next(42);
    subject.next(666);
    subject.complete();
    const spy = jest.fn();
    subject.subscribe({
      next: spy,
      complete: spy,
    });
    expect(spy).toHaveBeenNthCalledWith(1, 42);
    expect(spy).toHaveBeenNthCalledWith(2, 666);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
