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
    expect(errorMock).toHaveBeenCalledWith('error!');
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

  describe('all', () => {
    let o1next;
    let o1complete;
    let o1error;
    let o1;
    let o2next;
    let o2complete;
    let o2error;
    let o2;

    beforeEach(() => {
      o1 = new Observable<number>(observer => {
        o1next = observer.next;
        o1complete = observer.complete;
        o1error = observer.error;
        return () => {};
      });

      o2 = new Observable<string>(observer => {
        o2next = observer.next;
        o2complete = observer.complete;
        o2error = observer.error;
        return () => {};
      });
    });

    it('shall consolidate multiple observable into one', () => {
      const nextSpy = jest.fn();
      Observable.all([o1, o2]).subscribe({
        next: nextSpy,
      });

      expect(nextSpy).not.toBeCalled();
      o1next(12);
      expect(nextSpy).not.toBeCalled();
      o2next('12');
      expect(nextSpy).toBeCalledWith([12, '12']);
      o1next(42);
      expect(nextSpy).toBeCalledWith([42, '12']);
    });

    it('shall complete when all the observables complete', () => {
      const completeSpy = jest.fn();
      Observable.all([o1, o2]).subscribe({
        complete: completeSpy,
      });

      expect(completeSpy).not.toBeCalled();
      o1complete();
      expect(completeSpy).not.toBeCalled();
      o2complete();
      expect(completeSpy).toBeCalled();
    });

    it('shall the errors from all observables', () => {
      const errorSpy = jest.fn();
      Observable.all([o1, o2]).subscribe({
        error: errorSpy,
      });

      expect(errorSpy).not.toBeCalled();
      o1error({ toto: 'toto' });
      expect(errorSpy).toBeCalledWith({ toto: 'toto' });
      o2error(['a', 'b']);
      expect(errorSpy).toBeCalledWith(['a', 'b']);
    });
  });

  describe('complete', () => {
    it('shall return a completed observable', () => {
      const completed = Observable.complete();
      const spyObserver = {
        next: jest.fn(),
        complete: jest.fn(),
        error: jest.fn(),
      };
      completed.subscribe(spyObserver);
      expect(spyObserver.next).not.toBeCalled();
      expect(spyObserver.complete).toBeCalled();
      expect(spyObserver.error).not.toBeCalled();
    });

    it('shall return a completed observable which received a value', () => {
      const completed = Observable.complete<number>(42);
      const spyObserver = {
        next: jest.fn(),
        complete: jest.fn(),
        error: jest.fn(),
      };
      completed.subscribe(spyObserver);
      expect(spyObserver.next).toBeCalledWith(42);
      expect(spyObserver.complete).toBeCalled();
      expect(spyObserver.error).not.toBeCalled();
    });
  });

  describe('chain', () => {
    it('shall chain observable', () => {
      const observable = new Observable<number>(observer => {
        observer.next(42);
        return () => {};
      });

      let observedValue = '';
      Observable.chain(observable, value => value.toString()).subscribe({
        next: value => observedValue = value,
      });
      expect(observedValue).toBe('42');
    });

    it('shall chain complete signal', () => {
      const observable = new Observable<number>(observer => {
        observer.complete();
        return () => {};
      });

      const completeSpy = jest.fn();
      Observable.chain(observable, value => value.toString()).subscribe({
        complete: completeSpy,
      });
      expect(completeSpy).toHaveBeenCalled();
    });

    it('shall chain error signal', () => {
      const observable = new Observable<number>(observer => {
        observer.error({ toto: 'error' });
        return () => {};
      });

      const errorSpy = jest.fn();
      Observable.chain(observable, value => value.toString()).subscribe({
        error: errorSpy,
      });
      expect(errorSpy).toHaveBeenCalledWith({ toto: 'error' });
    });

    it('shall forward error', () => {
      const observable = new Observable<number>(observer => {
        observer.next(42);
        return () => {};
      });

      let observedValue;
      Observable.chain(observable, (_, error) => error({ toto: 'error' })).subscribe({
        error: errValue => observedValue = errValue,
      });
      expect(observedValue).toStrictEqual({ toto: 'error' });
    });
  });

  describe('to', () => {
    it('shall convert the provided parameters to an observable', () => {
      const spy = jest.fn();
      Observable.of(1, 2, 12).subscribe(spy);
      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 12);
    });
  });

  describe('from', () => {
    it('shall convert an array to an observable', () => {
      const spy = jest.fn();
      Observable.from([1, 2, 12]).subscribe(spy);
      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 12);
    });

    it('shall convert an iterable to an observable', () => {
      function* generator(): Iterable<number> {
        yield 1;
        yield 2;
        yield 12;
      }
      const spy = jest.fn();
      Observable.from(generator()).subscribe(spy);
      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      expect(spy).toHaveBeenNthCalledWith(3, 12);
    });
  });
});
