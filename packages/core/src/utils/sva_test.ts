import { test, expect } from "bun:test";
import { sva, styleObjectToCss, hashCode } from "./sva.ts";

test("sva merges base and variants", () => {
  const mySva = sva({
    base: {
      display: "flex",
      zIndex: 5,
    },
    variants: {
      color: {
        red: { backgroundColor: "red" },
        blue: { backgroundColor: "blue" },
      }
    },
    defaultVariants: {
      color: "red",
    }
  });

  const classRed = mySva();
  expect(typeof classRed).toBe("string");
  expect(classRed.startsWith("m3-sva-")).toBe(true);

  const classBlue = mySva({ color: "blue" });
  expect(typeof classBlue).toBe("string");
  expect(classBlue.startsWith("m3-sva-")).toBe(true);
  
  if (classRed === classBlue) {
    throw new Error("Hashes should differ for different style objects");
  }
});

test("styleObjectToCss formats camelCase and numbers", () => {
  const css = styleObjectToCss({
    zIndex: 10,
    backgroundColor: "green",
    borderRadius: 8,
  });
  expect(css).toBe("z-index: 10; background-color: green; border-radius: 8px;");
});

test("sva handles nested selectors and inserts rules", () => {
  // Mock document and style sheet
  const cssRules: string[] = [];
  const mockSheet = {
    cssRules,
    insertRule(rule: string, index: number) {
      cssRules.push(rule);
    }
  };
  globalThis.document = {
    getElementById: () => null,
    createElement: () => ({
      id: "",
      sheet: mockSheet
    }),
    head: {
      appendChild: () => {}
    }
  } as any;

  try {
    const mySva = sva({
      base: {
        color: "black",
        "&:hover": {
          color: "red"
        }
      }
    });

    const className = mySva();
    
    const baseRule = cssRules.find(r => r.startsWith(`.${className} {`));
    const hoverRule = cssRules.find(r => r.startsWith(`.${className}:hover {`));

    expect(!!baseRule).toBe(true);
    expect(!!hoverRule).toBe(true);
    expect(baseRule?.includes("color: black;")).toBe(true);
    expect(hoverRule?.includes("color: red;")).toBe(true);
  } finally {
    delete (globalThis as any).document;
  }
});
