import { AnyFunction } from "./AnyFunction";
import { Panic } from "./panic";

/**
 * Represents an optional value that may or may not be present.
 * If the value is present, it can be unwrapped and used.
 * If the value is not present, an error will be thrown.
 * 
 * @template E - The type of error that may be thrown if the value is not present.
 * @template X - The type of the value that may be present.
 */
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

  /**
   * Creates a new Optional instance with the given data and arguments.
   * @param data - The function to be wrapped in an Optional instance.
   * @param args - The arguments to be passed to the function.
   * @returns A new Optional instance.
   */
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
   * Returns a new Optional instance with the result of calling the provided function `fn` if this Optional instance
   * contains an error. If this Optional instance does not contain an error, the result of calling `unwrap()` is returned.
   * 
   * @param fn - The function to call if this Optional instance contains an error.
   * @returns A new Optional instance with the result of calling the provided function `fn` if this Optional instance
   * contains an error. If this Optional instance does not contain an error, the result of calling `unwrap()` is returned.
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
   * Unwraps the value of the Optional instance.
   * If the value is not present, throws an error.
   * If the value is present, returns it.
   * 
   * @returns The value of the Optional instance.
   * @throws An error if the value is not present.
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

  /**
   * Returns the value of the Optional if present, otherwise returns the result of the provided function.
   * 
   * @param fn - The function to be executed if the Optional is empty.
   * @returns The value of the Optional if present, otherwise the result of the provided function.
   */
  elseUnwrap(fn: () => X): X {
    try {
      return this.unwrap();
    } catch (e: unknown) {
      return fn();
    }
  }

  /**
   * Returns an Optional that will either contain the unwrapped value of this Optional, or will throw a Panic with the given expectation statement.
   * 
   * @param expectationStatement A string describing the expectation of the unwrapped value.
   * @returns An Optional that will either contain the unwrapped value of this Optional, or will throw a Panic with the given expectation statement.
   */
  expect(expectationStatement: string = ""): Optional<Panic, X> {
    return Optional.of(() => {
      try {
        return this.unwrap();
      } catch (e: unknown) {
        if (e instanceof Panic) {
          throw e;
        } else {
          throw new Panic(expectationStatement);
        }
      }
    });
  }

  #hasCacheState() {
    return this.#cachedState !== null;
  }
}
