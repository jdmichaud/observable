import { BehaviorSubject } from './behavior-subject';
import { Subject } from './subject';

describe('BehaviorSubject', () => {
  it('shall get the last value', () => {
    const subject = new BehaviorSubject<number>(12);
    expect(subject.get()).toEqual(12);
    let value;
    subject.subscribe(v => value = v);
    expect(value).toEqual(12);
    subject.next(42);
    expect(subject.get()).toEqual(42);
  });

  describe('fromSubject', () => {
    it('shall asynchronously create a BehaviorSubject from an Observable', async () => {
      const subject = new Subject<number>();
      setTimeout(() => subject.next(42), 100);
      const behaviorSubject = await BehaviorSubject.fromSubject(subject);
      expect(behaviorSubject.get()).toEqual(42);
      subject.next(12);
      expect(behaviorSubject.get()).toEqual(12);
      const spy = jest.fn();
      behaviorSubject.subscribe({ next: () => {}, error: spy });
      subject.error('error');
      expect(spy).toHaveBeenCalledWith('error');
    });
  });
});
