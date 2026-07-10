import { BaseElement } from "./BaseElement.ts";

/** A tappable button for interacting with the app. */
export class ButtonElement extends BaseElement {
  constructor(text: string, width = -1, height = -1, options = "") {
    // Initialize the base HTML wrapper with a button element
    super("button");

    // Default button reset styles for a native-like appearance
    this.element.style.cursor = "pointer";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    this.element.style.border = "none";
    this.element.style.outline = "none";

    if (text) {
      this.SetText(text);
    }

    const optList = options.split(",").map((o) => o.trim());

    // Parse visual style options
    if (optList.includes("Aluminium") || optList.includes("Alum")) {
      this.element.style.background =
        "linear-gradient(to bottom, #eeeeee, #cccccc)";
      this.element.style.border = "1px solid #aaaaaa";
      this.element.style.color = "black";
    } else if (optList.includes("Gray")) {
      this.element.style.background =
        "linear-gradient(to bottom, #777777, #444444)";
      this.element.style.border = "1px solid #222222";
      this.SetTextColor("white");
    } else if (optList.includes("Lego")) {
      this.element.style.background = "red";
      this.element.style.border = "2px solid darkred";
      this.element.style.borderRadius = "4px";
      this.SetTextColor("white");
    }

    // Parse layout options
    if (optList.includes("NoPad")) {
      this.element.style.padding = "0";
    }
    if (optList.includes("FillX")) {
      this.SetSize(-1, height);
      this.element.style.width = "100%";
    } else if (optList.includes("FillY")) {
      this.SetSize(width, -1);
      this.element.style.height = "100%";
    } else if (optList.includes("AutoSize")) {
      this.element.style.width = "auto";
      this.element.style.height = "auto";
    } else {
      this.SetSize(width, height);
    }

    // Parse font options
    if (optList.includes("Monospace")) {
      this.element.style.fontFamily = "monospace";
    }
    if (optList.includes("SingleLine")) {
      this.element.style.whiteSpace = "nowrap";
    }
  }

  /** Returns the current displayed text of the control. */
  GetText(): string {
    return this.element.textContent || "";
  }

  /** Returns the current size of the contained text. */
  GetTextSize(mode?: string): number {
    const size = parseFloat(window.getComputedStyle(this.element).fontSize);
    return isNaN(size) ? 0 : size;
  }

  /** Will cause the inner text to be broken with ... at the start or the end if it cannot fit. */
  SetEllipsize(mode: string) {
    this.element.style.overflow = "hidden";
    this.element.style.whiteSpace = "nowrap";
    this.element.style.textOverflow = mode === "start" ? "clip" : "ellipsis";

    if (mode === "start") {
      this.element.style.direction = "rtl";
      this.element.style.textAlign = "right";
    } else {
      this.element.style.direction = "ltr";
      this.element.style.textAlign = "center"; // or left, depending on standard
    }
    return this;
  }

  /** Change the font style by defining a font file. */
  SetFontFile(file: string) {
    // Dynamically inject the font face into the document head
    const fontName = file.split("/").pop()?.split(".")[0] || "CustomFont";
    const newStyle = document.createElement("style");
    newStyle.appendChild(
      document.createTextNode(`
      @font-face {
        font-family: '${fontName}';
        src: url('${file}');
      }
    `),
    );
    document.head.appendChild(newStyle);
    this.element.style.fontFamily = fontName;
    return this;
  }

  /** Change the current text of the control to html-formatted text. */
  SetHtml(str: string) {
    this.element.innerHTML = str;
    return this;
  }

  /** Change the currently displayed text in the control. */
  SetText(text: string) {
    this.element.textContent = text;
    return this;
  }

  /** Change the text color of the contained text. */
  SetTextColor(color: string) {
    this.element.style.color = color;
    return this;
  }

  /** Define a shadow displayed around the control text. */
  SetTextShadow(radius: number, dx = 0, dy = 0, color = "black") {
    this.element.style.textShadow = `${dx}px ${dy}px ${radius}px ${color}`;
    return this;
  }

  /** Change the size of the contained text. */
  SetTextSize(size: number, mode = "px") {
    // Translate standard Android/DroidScript units to web units
    let unit = "px";
    if (mode === "sp" || mode === "dip" || mode === "dp") unit = "rem";
    if (mode === "pt") unit = "pt";

    // Simplification for screen relative / standard scaling
    this.element.style.fontSize =
      mode === "px" ? `${size}px` : `${size}${unit}`;
    return this;
  }

  /** Gets the control class name. */
  override GetType(): string {
    return "Button";
  }
}
