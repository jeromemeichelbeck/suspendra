# AbortablePromise TODO List

- [x] Create `abortable-promise.ts` and `abortable-promise.test.ts` files
- [x] Implement basic `AbortablePromise` class structure
- [x] Test: `.then()` should be called when the promise resolves
- [x] Implement `.then()` method
- [x] Test: `.catch()` should be called when the promise rejects
- [x] Implement `.catch()` method
- [x] Test: `.finally()` should be called when the promise settles
- [x] Implement `.finally()` method
- [x] Test: `abort()` should reject the promise with an `AbortError`
- [x] Implement `abort()` method and `AbortError` class
- [x] Test: `abort()` should not have an effect if the promise is already settled
- [ ] Test: Aborting a promise should abort chained promises
- [ ] Test: A controlling promise should abort its controlled promises
- [ ] Implement promise control mechanism
