import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { Optional } from "../src/main";

const throwAnyError = () => {
  if (1 === 1) {
    throw new Error("any error");
  }
  return "my name";
};

const getAnyError = (): string | Error =>
  1 === 1 ? new Error("any error") : "my name";

const getAnyData = (): string => "my name";

describe("optional cases", () => {
  it("instantiation of illegal values", () => {
    expect(() => {
      // @ts-ignore
      Optional.of("what?");
    }).toThrowErrorMatchingInlineSnapshot('"Function is expected!"');

    expect(() => {
      // @ts-ignore
      Optional.of({});
    }).toThrowErrorMatchingInlineSnapshot('"Function is expected!"');

    expect(() => {
      // @ts-ignore
      Optional.of([]);
    }).toThrowErrorMatchingInlineSnapshot('"Function is expected!"');
  });

  describe("immediate unwrapping", () => {
    it("function to normal data", () => {
      const a = Optional.of(getAnyData);
      expect(a.unwrap()).toStrictEqual("my name");
    });

    it("normal error thrown", () => {
      const a = Optional.of(throwAnyError);

      expect(() => a.unwrap()).toThrowErrorMatchingInlineSnapshot(
        '"any error"',
      );
    });

    it("returned error is being auto-thrown!", () => {
      const a = Optional.of(getAnyError);
      expect(() => a.unwrap()).toThrowErrorMatchingInlineSnapshot(
        '"any error"',
      );
    });
  });

  describe("immediate else unwrapping", () => {
    it("function to normal data", () => {
      const a = Optional.of(getAnyData);
      expect(a.elseUnwrap(() => "other name")).toStrictEqual("my name");
    });

    it("normal error thrown", () => {
      const a = Optional.of(throwAnyError);

      expect(a.elseUnwrap(() => "other name")).toStrictEqual("other name");
    });

    it("returned error is being auto-thrown!", () => {
      const a = Optional.of(getAnyError);
      expect(a.elseUnwrap(() => "other name")).toStrictEqual("other name");
    });
  });

  describe("combining mappings", () => {
    it("catch and rescue error", () => {
      const test = vi.fn(throwAnyError);
      const generateName = Optional.of(test);

      const maybeName = generateName
        .then((name) => name.toUpperCase())
        .catch(() => "bad name");

      expect(maybeName.unwrap()).toStrictEqual("bad name");
      expect(test).toBeCalledTimes(1);
    });

    it("build mapping & expectations", () => {
      const test = vi.fn(getAnyData);
      const generateName = Optional.of(test);

      const maybeName = generateName
        .then((name) => name.toUpperCase())
        .expect("create upper-cased string")
        .then((name) => name.split(" "))
        .expect("split string apart")
        .unwrap();

      expectTypeOf(maybeName).toEqualTypeOf<string[]>();
      expect(maybeName).toStrictEqual(["MY", "NAME"]);
      expect(test).toBeCalledTimes(1);
    });

    it("handle mapping & expectations with error thrown", () => {
      const test = vi.fn(throwAnyError);
      const generateName = Optional.of(test);

      expect(() =>
        generateName
          .then((name) => name.toUpperCase())
          .expect("uppercase failed")
          .then((name) => name.split(" "))
          .expect("splitting failed")
          .then((data) => data.join(":"))
          .expect("expected split name")
          .unwrap(),
      ).toThrowErrorMatchingInlineSnapshot('"Panicked at uppercase failed"');

      expect(test).toBeCalledTimes(1);
    });

    it("handle mapping expectations with error thrown but caught on elseUnwrap", () => {
      const test = vi.fn(throwAnyError);
      const generateName = Optional.of(test);

      expect(
        generateName
          .then((name) => name.toUpperCase())
          .expect("uppercase failed")
          .then((name) => name.split(" "))
          .expect("splitting failed")
          .then((data) => data.join(":"))
          .expect("expected split name")
          .elseUnwrap(() => "any name?"),
      ).toStrictEqual("any name?");

      expect(test).toBeCalledTimes(1);
    });
  });
});
