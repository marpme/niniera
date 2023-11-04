import { AnyFunction } from "./AnyFunction";
import { Panic } from "./panic";

export class Optional<E extends Error, X = unknown> {
  readonly #resolvedState: () => X | E;

  #cachedState: X | E | null = null;

  private constructor(data: any, ...args: any[]) {
    if (typeof data === "function") {
      args = args ?? [];
      this.#resolvedState = () => data(...args);
    } else {
      throw new Error("Function is expected!");
    }
  }

  static of<E extends Error, A, R>(
    data: AnyFunction<A, R>,
    ...args: A[]
  ): Optional<E, R> {
    return new Optional(data, ...args);
  }

  /**
   * Allows callee to map or produce data upon the maybe
   * available data in the call chain.
   */
  then<V>(mapper: (data: X) => V): Optional<E, V> {
    return new Optional<E, V>(() => {
      try {
        return mapper(this.unwrap());
      } catch (e) {
        throw e;
      }
    });
  }

  /**
   * Allows callee to map or handle the underlying error
   * to ensure a proper error message can be produced based on the error caused.
   */
  catch<V>(fn: (error: E) => V) {
    return new Optional<E, V>(() => {
      try {
        return this.unwrap();
      } catch (e: unknown) {
        return fn(e as E) as V;
      }
    });
  }

  /**
   * Makes sure to throw errors in any case,
   * especially if type <T> is not returned
   *
   * to ensure to disrupt and collapse the state of the application
   * by throwing the error, ensuring the underlying user to only receive a valid value
   */
  unwrap(): X | never {
    const callableState = this.#resolvedState;

    let actualResult =
      this.#cachedState !== null ? this.#cachedState : callableState();

    if (!this.#hasCacheState()) {
      this.#cachedState = actualResult;
    }

    if (actualResult instanceof Error) {
      throw actualResult;
    }

    return actualResult;
  }

  elseUnwrap(fn: () => X): X {
    try {
      return this.unwrap();
    } catch (e: unknown) {
      return fn();
    }
  }

  expect(expectationStatement: string = ""): Optional<Panic, X> {
    return Optional.of(() => {
      try {
        return this.unwrap();
      } catch (e: unknown) {
        if (e instanceof Panic) {
          throw e;
        } else {
          throw new Panic(expectationStatement, e);
        }
      }
    });
  }

  #hasCacheState() {
    return this.#cachedState !== null;
  }
}
