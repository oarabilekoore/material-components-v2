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

  const cssRed = "display: flex; z-index: 5; background-color: red;";
  const expectedHashRed = hashCode(cssRed);

  const classRed = mySva();
  assertEquals(classRed, expectedHashRed);

  const cssBlue = "display: flex; z-index: 5; background-color: blue;";
  const expectedHashBlue = hashCode(cssBlue);

  const classBlue = mySva({ color: "blue" });
  assertEquals(classBlue, expectedHashBlue);
});

Deno.test("styleObjectToCss formats camelCase and numbers", () => {
  const css = styleObjectToCss({
    zIndex: 10,
    backgroundColor: "green",
    borderRadius: 8,
  });
  assertEquals(css, "z-index: 10; background-color: green; border-radius: 8px;");
});
