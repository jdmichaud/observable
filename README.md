# Observable

An implementation of the Observable interfaces as presented in the
[tc-39 proposal](https://github.com/tc39/proposal-observable).

# How to use

```javascript
const observable = new Observable.Observable(observer => {
  observer.next(42);
  return () => {};
})

observable.subscribe(value => console.log(value));
```

outputs:
```
42
```

# Subject extension

In addition to the interfaces as described in the tc-39 proposal, more
convenient interfaces are proposed as the `Subject`:
```javascript
const subject = new Observable.Subject();
subject.subscribe({
  next: value => console.log(value),
  error: error => console.log(error),
});
subject.next(42);
subject.error('error!');
```
outputs:
```
42
error!
```

## There can be multiple observers to a subject

```javascript
const subject = new Observable.Subject();
subject.subscribe(value => console.log(`1: ${value}`));
subject.subscribe(value => console.log(`2: ${value}`));
subject.next(42);
```
outputs:
```
1: 42
2: 42
```

## BehaviorSubject to attach a variable to a Subject

A `BehaviorSubject` is a subject that always have a value and which can be
queried at any time:
```javascript
const answer = new Observable.BehaviorSubject(42);
console.log('the answer is:', answer.get());
answer.subscribe(value => console.log('oops, the answer changed:', value));
answer.next(666);
```

# Useful shortcuts

## `all`

`all` will wait for all the provided observable to have a value and will then
forward those values all at once:
```typescript
import { Observable } from '@jdmichaud/observable'

Observable.all([subject1, subject2], ([value1, value2] =>
  console.log(value1, value2)));
subject1.next(42);
// nothing happens, as subject2 has not yet been triggered.
subject2.next('the answer to everything');
// prints: "42 the answer to everything"
subject1.next(666);
// prints: "666 the answer to everything"
```

## `chain`

Chains observable in order to smoothly apply processing on next values.
Error and complete signals are being forwarded to returned observable.
Errors can be raised to the error parameter of the next function parameter:

```typescript
import { Observable } from '@jdmichaud/observable'

const observable = new Observable<number>(observer => {
  observer.next(42);
  return () => {};
});

let observedValue: string;
// First converts to string.
Observable.chain(observable, value => value.toString()).subscribe({
  next: value => observedValue = value,
});
```

## `to`

Converts the provided parameters to an observable:
```typescript
import { Observable } from '@jdmichaud/observable'

Observable.to(1, 2, 3).subscribe(console.log);
```

## `from`

Converts an array or an iterable to an Observable:
```typescript
import { Observable } from '@jdmichaud/observable'

const a = [1, 2, 3];
Observable.from(a).subscribe(console.log);
```
