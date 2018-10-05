import { BehaviorSubject } from './behavior-subject';

describe('BehaviorSubject', () => {
  it('shall get the last value', () => {
    const subject = new BehaviorSubject<number>(12);
    expect(subject.get()).toEqual(12);
    subject.next(42);
    expect(subject.get()).toEqual(42);
  });
});
