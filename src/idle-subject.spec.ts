import { IdleSubject } from './idle-subject';

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
