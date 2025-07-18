import { AbortError } from './abort-error.js';
import type { Abortable } from './abortable.js';

export class AbortablePromise<TValue> implements Promise<TValue>, Abortable {
  private readonly promise: Promise<TValue>;
  private isSettled = false;
  private reject!: (reason?: any) => void;

  constructor(
    executor: (
      resolve: (value: TValue | PromiseLike<TValue>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;

      const wrappedResolve = (value: TValue | PromiseLike<TValue>) => {
        if (!this.isSettled) {
          this.isSettled = true;
          resolve(value);
        }
      };

      const wrappedReject = (reason?: any) => {
        if (!this.isSettled) {
          this.isSettled = true;
          reject(reason);
        }
      };

      executor(wrappedResolve, wrappedReject);
    });
  }

  public then<TFulfilledResult = TValue, TRejectedResult = never>(
    onfulfilled?:
      | ((value: TValue) => TFulfilledResult | PromiseLike<TFulfilledResult>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TRejectedResult | PromiseLike<TRejectedResult>)
      | null
      | undefined,
  ): Promise<TFulfilledResult | TRejectedResult> {
    return this.promise.then(onfulfilled, onrejected);
  }

  public catch<TRejectedResult = never>(
    onrejected?:
      | ((reason: any) => TRejectedResult | PromiseLike<TRejectedResult>)
      | null
      | undefined,
  ): Promise<TValue | TRejectedResult> {
    return this.promise.catch(onrejected);
  }

  public finally(onfinally?: (() => void) | undefined | null): Promise<TValue> {
    return this.promise.finally(onfinally);
  }

  public [Symbol.toStringTag] = 'AbortablePromise';

  public abort(reason?: any): void {
    if (!this.isSettled) {
      this.reject(new AbortError(reason ?? 'Promise was aborted'));
    }
  }
}
