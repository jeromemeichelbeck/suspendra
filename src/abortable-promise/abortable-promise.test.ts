import { describe, it, expect, vi } from 'vitest';
import { AbortablePromise } from './abortable-promise.js';
import { AbortError } from './abort-error.js';

const ASYNC_TEST_TIMEOUT = 100;

describe('AbortablePromise', () => {
  it(
    'should call .then() when the promise resolves',
    async () => {
      const promise = new AbortablePromise<string>((resolve) => {
        setTimeout(() => resolve('test'), 10);
      });

      const result = await promise;
      expect(result).toBe('test');
    },
    ASYNC_TEST_TIMEOUT,
  );

  it(
    'should call .catch() when the promise rejects',
    async () => {
      const promise = new AbortablePromise<string>((_resolve, reject) => {
        setTimeout(() => reject('test-error'), 10);
      });

      await expect(promise).rejects.toBe('test-error');
    },
    ASYNC_TEST_TIMEOUT,
  );

  it(
    'should call .finally() when the promise settles',
    async () => {
      let finallyCalled = false;
      const promise = new AbortablePromise<string>((resolve) => {
        setTimeout(() => resolve('test'), 10);
      }).finally(() => {
        finallyCalled = true;
      });

      await promise;
      expect(finallyCalled).toBe(true);
    },
    ASYNC_TEST_TIMEOUT,
  );

  it(
    'should call .finally() when the promise is rejected',
    async () => {
      let finallyCalled = false;
      const promise = new AbortablePromise<string>((_resolve, reject) => {
        setTimeout(() => reject('test-error'), 10);
      }).finally(() => {
        finallyCalled = true;
      });

      await promise.catch(() => {}); // Catch the rejection to prevent unhandled rejection errors
      expect(finallyCalled).toBe(true);
    },
    ASYNC_TEST_TIMEOUT,
  );

  describe('abort', () => {
    it(
      'should reject with an AbortError when aborted',
      async () => {
        const promise = new AbortablePromise<string>(() => {});
        const catchCallback = vi.fn();

        const p = promise.catch(catchCallback);
        promise.abort();
        await p;

        expect(catchCallback).toHaveBeenCalledTimes(1);
        expect(catchCallback).toHaveBeenCalledWith(expect.any(AbortError));
      },
      ASYNC_TEST_TIMEOUT,
    );

    it(
      'should reject with a reason',
      async () => {
        const promise = new AbortablePromise<string>(() => {});
        const reason = 'test reason';
        promise.abort(reason);
        await expect(promise).rejects.toHaveProperty('message', reason);
      },
      ASYNC_TEST_TIMEOUT,
    );

    it(
      'should not do anything if aborted after resolving',
      async () => {
        const promise = new AbortablePromise<string>((resolve) =>
          resolve('done'),
        );
        await promise; // ensure it's settled
        promise.abort();
        await expect(promise).resolves.toBe('done');
      },
      ASYNC_TEST_TIMEOUT,
    );

    it(
      'should not do anything if aborted after rejecting',
      async () => {
        const promise = new AbortablePromise<string>((_resolve, reject) =>
          reject('error'),
        );
        await promise.catch(() => {}); // ensure it's settled and catch the rejection
        promise.abort();
        await expect(promise).rejects.toBe('error');
      },
      ASYNC_TEST_TIMEOUT,
    );
  });
});
