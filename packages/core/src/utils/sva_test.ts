import { assertEquals } from "@std/assert";
import { sva, styleObjectToCss, hashCode } from "./sva.ts";

Deno.test("sva merges base and variants", () => {
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
  assertEquals(typeof classRed, "string");
  assertEquals(classRed.startsWith("m3-sva-"), true);

  const classBlue = mySva({ color: "blue" });
  assertEquals(typeof classBlue, "string");
  assertEquals(classBlue.startsWith("m3-sva-"), true);
  
  if (classRed === classBlue) {
    throw new Error("Hashes should differ for different style objects");
  }
});

Deno.test("styleObjectToCss formats camelCase and numbers", () => {
  const css = styleObjectToCss({
    zIndex: 10,
    backgroundColor: "green",
    borderRadius: 8,
  });
  assertEquals(css, "z-index: 10; background-color: green; border-radius: 8px;");
});

Deno.test("sva handles nested selectors and inserts rules", () => {
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

    assertEquals(!!baseRule, true, "Base rule should be inserted");
    assertEquals(!!hoverRule, true, "Hover rule should be inserted");
    assertEquals(baseRule?.includes("color: black;"), true);
    assertEquals(hoverRule?.includes("color: red;"), true);
  } finally {
    delete (globalThis as any).document;
  }
});
