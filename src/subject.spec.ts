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

  it('shall forward errors to observers', () => {
    const subject = new Subject<number>();
    const errorSpy1 = jest.fn();
    const errorSpy2 = jest.fn();
    subject.subscribe({ next: () => {}, complete: () => {}, error: ev => errorSpy1(ev) });
    subject.subscribe({ next: () => {}, complete: () => {}, error: ev => errorSpy2(ev) });
    subject.error({ error: 'error' });
    expect(errorSpy1).toHaveBeenCalledWith({ error: 'error' });
    expect(errorSpy2).toHaveBeenCalledWith({ error: 'error' });
  });
});
