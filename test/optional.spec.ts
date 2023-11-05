import { describe, expect, it } from "vitest";
import { Optional } from "../src/optional";
import { Panic } from "../src/panic";

describe("optional cases", () => {
  describe("Optional elseUnwrap", () => {
    it("returns unwrapped value if successful", () => {
      const optional = Optional.of(() => "hello");
      const result = optional.elseUnwrap(() => "world");
      expect(result).toBe("hello");
    });

    it("returns fallback value if unwrapping throws an error", () => {
      const optional = Optional.of(() => {
        if (1 === 1) throw new Error("oops");
        return "hello";
      });
      const result = optional.elseUnwrap(() => "fallback");
      expect(result).toBe("fallback");
    });
  });

  describe("Optional unwrap", () => {
    it("returns unwrapped value if successful", () => {
      const optional = Optional.of(() => "hello");
      const result = optional.unwrap();
      expect(result).toBe("hello");
    });

    it("throws an error if unwrapping throws an error", () => {
      const optional = Optional.of(() => {
        if (1 === 1) throw new Error("oops");
        return "hello";
      });
      expect(() => optional.unwrap()).toThrowError("oops");
    });

    it("caches the result if not already cached", () => {
      let count = 0;
      const optional = Optional.of(() => {
        count++;
        return "hello";
      });

      const firstResult = optional.unwrap();
      const secondResult = optional.unwrap();

      expect(count).toBe(1);
      expect(firstResult).toStrictEqual(secondResult);
      expect(secondResult).toStrictEqual("hello");
    });
  });

  describe("Optional expect", () => {
    it("returns an Optional with the unwrapped value if successful", () => {
      const optional = Optional.of(() => "hello");
      const result = optional.expect();
      expect(result.unwrap()).toBe("hello");
    });

    it("throws a Panic with the given expectation statement if unwrapping throws an error", () => {
      const optional = Optional.of(() => {
        if (1 === 1) throw new Error("oops");
        return "hello";
      });

      const unwrap = () => optional.expect("unwrapping a value").unwrap();

      expect(unwrap).toThrowError(Panic);
      expect(unwrap).toThrowErrorMatchingInlineSnapshot(
        '"Panicked at unwrapping a value"',
      );
    });

    it("throws the original Panic if unwrapping throws a Panic", () => {
      const optional = Optional.of(() => {
        throw new Panic("oops");
      });

      expect(() => optional.expect().unwrap()).toThrowError(Panic);
    });
  });

  describe("Optional catch", () => {
    it("returns a new Optional with the unwrapped value if successful", () => {
      const optional = Optional.of(() => "hello");
      const result = optional.catch(() => "world");
      expect(result.unwrap()).toBe("hello");
    });

    it("returns a new Optional with the fallback value if unwrapping throws an error", () => {
      const optional = Optional.of(() => {
        if (1 === 1) throw new Error("oops");
        return "hello";
      });
      const result = optional.catch(() => "fallback");
      expect(result.unwrap()).toBe("fallback");
    });

    it("returns a new Optional with the result of the catch function if unwrapping throws an error", () => {
      const optional = Optional.of(() => {
        if (1 === 1) throw new Error("oops");
        return "hello";
      });
      const result = optional.catch(() => "fallback");
      expect(result.unwrap()).toBe("fallback");
    });

    it("passes the error to the catch function if unwrapping throws an error", () => {
      const optional = Optional.of(() => {
        if (1 === 1) throw new Error("oops");
        return "hello";
      });
      const result = optional.catch((e) => `caught ${e.message}`);
      expect(result.unwrap()).toBe("caught oops");
    });

    it("throws the original Panic if unwrapping throws a Panic and no catch function is provided", () => {
      const optional = Optional.of(() => {
        throw new Panic("oops");
      });

      expect(optional.catch(() => "fallback").unwrap()).toEqual("fallback");
    });

    it("throws the result of the catch function if unwrapping throws a Panic and a catch function is provided", () => {
      const optional = Optional.of(() => {
        throw new Panic("oops");
      });

      const result = optional.catch((e) => `caught ${e.message}`);
      expect(result.unwrap()).toEqual("caught Panicked at oops");
    });
  });
});
