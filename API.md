## :factory: Optional

Represents an optional value that may or may not be present.
If the value is present, it can be unwrapped and used.
If the value is not present, an error will be thrown.

### Methods

- [of](#gear-of)
- [then](#gear-then)
- [catch](#gear-catch)
- [unwrap](#gear-unwrap)
- [elseUnwrap](#gear-elseunwrap)
- [expect](#gear-expect)
- [#hasCacheState](#gear-#hascachestate)

#### :gear: of

Creates a new Optional instance with the given data and arguments.

| Method | Type                                                                               |
| ------ | ---------------------------------------------------------------------------------- |
| `of`   | `<E extends Error, A, R>(data: AnyFunction<A, R>, ...args: A[]) => Optional<E, R>` |

Parameters:

- `data`: - The function to be wrapped in an Optional instance.
- `args`: - The arguments to be passed to the function.

#### :gear: then

Allows callee to map or produce data upon the maybe
available data in the call chain.

| Method | Type                                            |
| ------ | ----------------------------------------------- |
| `then` | `<V>(mapper: (data: X) => V) => Optional<E, V>` |

#### :gear: catch

Returns a new Optional instance with the result of calling the provided function `fn` if this Optional instance
contains an error. If this Optional instance does not contain an error, the result of calling `unwrap()` is returned.

| Method  | Type                                         |
| ------- | -------------------------------------------- |
| `catch` | `<V>(fn: (error: E) => V) => Optional<E, V>` |

Parameters:

- `fn`: - The function to call if this Optional instance contains an error.

#### :gear: unwrap

Unwraps the value of the Optional instance.
If the value is not present, throws an error.
If the value is present, returns it.

| Method   | Type      |
| -------- | --------- |
| `unwrap` | `() => X` |

#### :gear: elseUnwrap

Returns the value of the Optional if present, otherwise returns the result of the provided function.

| Method       | Type                 |
| ------------ | -------------------- |
| `elseUnwrap` | `(fn: () => X) => X` |

Parameters:

- `fn`: - The function to be executed if the Optional is empty.

#### :gear: expect

Returns an Optional that will either contain the unwrapped value of this Optional, or will throw a Panic with the given expectation statement.

| Method   | Type                                                    |
| -------- | ------------------------------------------------------- |
| `expect` | `(expectationStatement?: string) => Optional<Panic, X>` |

Parameters:

- `expectationStatement`: A string describing the expectation of the unwrapped value.

#### :gear: #hasCacheState

| Method           | Type            |
| ---------------- | --------------- |
| `#hasCacheState` | `() => boolean` |
