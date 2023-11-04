export class Panic extends Error {
  constructor(expectation: string) {
    super(`Panicked at ${expectation}`);
    this.stack = this.stack?.replace("Error: ", `Panic: ${expectation}`);
  }
}
