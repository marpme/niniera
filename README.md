# Niniera 🚀
### Bringing Rust-Inspired Optional and Error Handling to JavaScript

**Niniera** is an npm package that introduces Rust's `Option` and error handling concepts to JavaScript, offering a powerful and elegant solution.

The name "Niniera" is inspired by the Japanese term "nini era" (任意エラー), which conveys the idea of an error that is not mandatory and can be managed or ignored based on the context. This library aims to simplify and enhance error handling and optional value management in your JavaScript code.

## Key Features 🌟

With **Niniera**, you can:

- Effortlessly handle errors 🛠️
- Streamline your error-handling workflow with clean and concise code 📝

You can chain error-handling operations, making your code more readable and maintainable, particularly in scenarios involving multiple error-prone operations.

## Installation 💡

You can install **Niniera** via npm:

```bash
npm add niniera
```

## Usage 💻

Here's a brief overview of how you can use **Niniera** in your JavaScript code:

```javascript
// Everything happens synchronously
// Similar to working with promises
const result = Optional.of(anyFunction)
// Continue using the return value
.then(value => transform(value))
// Customize the error message if 'then' fails
.expect("something to happen")
// Handle any occurring error, attempting to rescue or rethrow
.catch(error => transformError(error))
// Unwrap the final value
.unwrap()
```

In certain cases, you may wish to provide a default value in the event of an error. This default value is utilized only when an error occurs.

```javascript
// Result will either be the return type of 'transform(value)' or 'defaultTransformed'
const result = Optional.of(anyFunction)
// Continue using the return value
.then(value => transform(value))
// Unwrap the final value or provide an alternative value
.elseUnwrap(() => defaultTransformed)
```

## Documentation 📘

For more in-depth information on using **Niniera**, refer to the [documentation](https://github.com/your-nini-era-repo/documentation) and explore examples in the `examples` directory of this repository.

## Contributing 🤝

We welcome contributions from the community! If you want to enhance **Niniera**, please review our [contribution guidelines](CONTRIBUTING.md) to get started.

## License 📜

**Niniera** is licensed under the Apache-2.0 License. See [LICENSE](LICENSE) for more details.

## Credits 🙏

**Niniera** draws inspiration from the simplicity and elegance of Rust's `Option` and error handling. We extend our gratitude to the Rust community for inspiring this project.

[GitHub Repository](https://github.com/marpme/niniera)

---

_"Niniera - Where simplicity meets elegance."_
