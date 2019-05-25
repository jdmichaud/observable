import { Subject } from './subject';

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
});
