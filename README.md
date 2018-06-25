# Observable

An implementation of the Observable interfaces as presented in the
[tc-39 proposal](https://github.com/tc39/proposal-observable).

# How to use

```javascript
const observable = new Observable(observer => {
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
const subject = new Subject();
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
const subject = new Subject();
subject.subscribe(value => console.log(`1: ${value}`));
subject.subscribe(value => console.log(`2: ${value}`));
subject.next(42);
```
outputs:
```
1: 42
2: 42
```
