# AbortablePromise Requirements

1.  **Core Promise Behavior:**
    - It should behave like a standard `Promise`, with `.then()`, `.catch()`, and `.finally()` methods.
    - It should be able to wrap an existing `Promise` or a function that returns a `Promise`.

2.  **Abortability:**
    - The class must have a public `abort(reason?: any)` method.
    - Calling `abort()` on a pending promise must cause it to reject.
    - The rejection reason must be an instance of a custom `AbortError`.
    - The `AbortError` instance should contain the `reason` passed to the `abort()` method.
    - A custom `AbortError` class must be created, extending from `Error`.
    - If the promise has already settled (resolved or rejected), calling `abort()` must have no effect. It should not throw an error or change the promise's state.

3.  **Chaining and Propagation:**
    - Methods like `.then()`, `.catch()`, and `.finally()` on an `AbortablePromise` should return a new `AbortablePromise`, not a standard `Promise`.
    - When a parent `AbortablePromise` is aborted, any child promises chained from it must also be aborted, and the `AbortError` should propagate down the chain.

4.  **Controlling Other Promises:**
    - The class should have a method, let's say `control(promises: AbortablePromise<any>[])`, to link other `AbortablePromise` instances to it.
    - When the controlling promise is aborted, all of the controlled promises must also be aborted.
    - If a controlled promise is already settled, it should not be affected when the controller is aborted.
