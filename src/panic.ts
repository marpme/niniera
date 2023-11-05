/**
 * Represents an error that occurs when a program has panicked.
 */
export class Panic extends Error {
  
  /**
   * Creates a new PanicError instance with the given expectation message.
   * @param expectation The expectation message that caused the panic.
   */
  constructor(expectation: string) {
    super(`Panicked at ${expectation}`);
    this.stack = this.stack?.replace("Error: ", `Panic: ${expectation}`);
  }
}
