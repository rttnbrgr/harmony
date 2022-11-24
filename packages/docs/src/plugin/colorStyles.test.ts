import { getSpecStringFromColorStop } from "./colorStyles";
import { deriveRgbValue, isInt } from "./utils";

describe("deriveRgbValue", () => {
  test("it should return rounded values", () => {
    expect(deriveRgbValue(0.1)).toEqual(26);
    expect(deriveRgbValue(0.3)).toEqual(77);
    expect(deriveRgbValue(0.5)).toEqual(128);
    expect(deriveRgbValue(0.7)).toEqual(179);
    expect(deriveRgbValue(0.9)).toEqual(230);
    expect(deriveRgbValue(0.99)).toEqual(252);
  });
});

describe("isInt", () => {
  test("should return true for integer", () => {
    expect(isInt(0)).toBe(true);
    expect(isInt(1)).toBe(true);
    expect(isInt(1000)).toBe(true);
  });
  test("should return false for decimal", () => {
    expect(isInt(1.1)).toBe(false);
    expect(isInt(1000.1)).toBe(false);
  });
});

describe("getSpecStringFromColorStop", () => {
  test("should return rbga string", () => {
    expect(getSpecStringFromColorStop({ position: 2, color: { r: 0.012, g: 0.56, b: 0.798, a: 1 } })).toEqual(
      "[3, 143, 203, 1] @ 2"
    );
  });
  test("should throw error", () => {
    expect(() => {
      getSpecStringFromColorStop(undefined);
    }).toThrowError("Missing colorStop value");
  });
});
