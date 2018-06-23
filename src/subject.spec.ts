import { IdleSubject, Subject } from './subject';

describe('Subject', () => {
  it('shall subscribe multiple observer', () => {
    const subject = new Subject<number>();
    const nextSpy1 = jest.fn();
    const nextSpy2 = jest.fn();
    subject.subscribe(nextSpy1);
    subject.subscribe(nextSpy2);
    subject.next(42);
    expect(nextSpy1).toHaveBeenCalledWith(42);
    expect(nextSpy2).toHaveBeenCalledWith(42);
  });

  it('shall unsubscribe multiple observer', () => {
    const subject = new Subject<number>();
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
    const subject = new Subject<number>(2);
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
});

describe('IdleSubject', () => {
  it('shall call the observer on idle period', () => {
    let callback;
    const window = {
      requestIdleCallback: (f) => callback = f,
    };
    const subject = new IdleSubject<number>(window as any);
    const nextSpy = jest.fn();
    subject.subscribe(nextSpy);
    subject.next(42);
    expect(nextSpy).not.toHaveBeenCalled();
    callback();
    expect(nextSpy).toHaveBeenCalledWith(42);
  });
});
