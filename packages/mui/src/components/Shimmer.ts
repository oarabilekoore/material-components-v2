import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

export type ShimmerShape = "rect" | "circle" | "text";
export type ShimmerAnimation = "wave" | "pulse" | "static";

const shimmerSva = sva({
  base: {
    position: "relative",
    overflow: "hidden",
    display: "block",
    backgroundColor: "var(--md-surface-variant, #e0e0e0)",
  },
  variants: {
    shape: {
      rect: { borderRadius: "8px" },
      circle: { borderRadius: "50%" },
      text: { borderRadius: "4px" },
    },
  },
  defaultVariants: {
    shape: "rect",
  },
});

const sweepSva = sva({
  base: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, var(--md-surface, rgba(255,255,255,0.6)), transparent)",
    transform: "translateX(-100%)",
  },
});

/**
 * A loading placeholder standing in for content that hasn't loaded yet.
 * Supports three animation styles:
 *  - "wave"   a diagonal light sweep (most premium-feeling, costs a moving gradient)
 *  - "pulse"  the whole block fades opacity in/out (cheap, GPU-compositable)
 *  - "static" no animation at all (cheapest, best for prefers-reduced-motion or low-power devices)
 */
export class Shimmer extends BaseElement {
  private _sweep?: HTMLDivElement;
  private _shape: ShimmerShape;
  private _animation: ShimmerAnimation;

  constructor(
    shape: ShimmerShape = "rect",
    animation: ShimmerAnimation = "wave",
  ) {
    super("div");
    this._shape = shape;
    this._animation = "wave"; // placeholder until SetAnimation runs below
    this.element.className = "m3-shimmer " + shimmerSva({ shape });

    this.ensureAnimations();
    this.applyDefaultSize();
    this.SetAnimation(animation);
  }

  /**
   * Sizing uses mixed units by default (e.g. 100% wide, 120px tall), which
   * the inherited BaseElement.SetSize can't express in one call since a
   * single `px` option applies to both width and height. Set the CSS
   * directly here instead; callers who want the framework's normal
   * fraction/px convention should just call the inherited SetSize(...).
   */
  private applyDefaultSize(): void {
    if (this._shape === "circle") {
      this.SetSize(40, 40, { px: true });
      return;
    }
    this.element.style.width = "100%";
    this.element.style.height = this._shape === "text" ? "16px" : "120px";
  }

  /** Switches the shape after construction (rect / circle / text). */
  SetShape(shape: ShimmerShape): this {
    this._shape = shape;
    this.element.className = "m3-shimmer " + shimmerSva({ shape });
    if (this._sweep) this.element.appendChild(this._sweep);
    return this;
  }

  /** Switches the animation style after construction (wave / pulse / static). */
  SetAnimation(animation: ShimmerAnimation): this {
    this._animation = animation;

    // tear down whatever the previous mode set up
    this._sweep?.remove();
    this._sweep = undefined;
    this.element.style.animation = "none";

    if (animation === "wave") {
      this._sweep = document.createElement("div");
      this._sweep.className = sweepSva();
      this._sweep.style.animation =
        "m3-shimmer-sweep 1.6s ease-in-out infinite";
      this.element.appendChild(this._sweep);
    } else if (animation === "pulse") {
      this.element.style.animation =
        "m3-shimmer-pulse 1.5s ease-in-out infinite";
    }
    // "static" leaves both animation and sweep off

    return this;
  }

  /** Pauses whichever animation is active, e.g. once real content is ready to swap in. */
  Stop(): this {
    if (this._sweep) {
      this._sweep.style.animationPlayState = "paused";
      this._sweep.style.opacity = "0";
    }
    if (this._animation === "pulse") {
      this.element.style.animationPlayState = "paused";
    }
    return this;
  }

  /** Resumes whichever animation is active. */
  Start(): this {
    if (this._sweep) {
      this._sweep.style.opacity = "1";
      this._sweep.style.animationPlayState = "running";
    }
    if (this._animation === "pulse") {
      this.element.style.animationPlayState = "running";
    }
    return this;
  }

  private ensureAnimations(): void {
    if (
      typeof document !== "undefined" &&
      !document.getElementById("m3-shimmer-anim")
    ) {
      const style = document.createElement("style");
      style.id = "m3-shimmer-anim";
      style.textContent = `
        @keyframes m3-shimmer-sweep {
          100% { transform: translateX(100%); }
        }
        @keyframes m3-shimmer-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  override GetType(): string {
    return "Shimmer";
  }
}

function CreateShimmer(
  shape: ShimmerShape = "rect",
  animation: ShimmerAnimation = "wave",
): Shimmer {
  return new Shimmer(shape, animation);
}

/**
 * AddShimmer function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {ShimmerShape} shape - rect | circle | text (default: "rect")
 * @param {ShimmerAnimation} animation - wave | pulse | static (default: "wave")
 * @returns {Shimmer}
 *
 */
export function AddShimmer(
  parent: LayoutElement,
  shape: ShimmerShape = "rect",
  animation: ShimmerAnimation = "wave",
): Shimmer {
  const shimmer = CreateShimmer(shape, animation);
  parent.AddChild(shimmer);
  return shimmer;
}
