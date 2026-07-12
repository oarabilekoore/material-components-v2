import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const carouselSva = sva({
  base: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    gap: "12px",
    padding: "16px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    scrollBehavior: "smooth",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  },
});

const itemSva = sva({
  base: {
    flex: "0 0 auto",
    scrollSnapAlign: "center", // M3 typical is center or start
    borderRadius: "16px",
    overflow: "hidden",
    boxSizing: "border-box",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1)",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
  },
});

let styleInjected = false;
function injectCarouselStyle() {
  if (styleInjected) return;
  styleInjected = true;
  if (typeof document !== "undefined") {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .m3-carousel::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleEl);
  }
}

export class Carousel extends BaseElement {
  constructor() {
    super("div");
    injectCarouselStyle();
    this.element.className = "m3-carousel " + carouselSva();
  }

  AddItem(item: BaseElement, width = 220, height = 160): this {
    const wrapper = document.createElement("div");
    wrapper.className = itemSva();
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    
    // Fill the wrapper
    if (item.element) {
      item.element.style.width = "100%";
      item.element.style.height = "100%";
      item.element.style.boxSizing = "border-box";
    }
    
    wrapper.appendChild(item.element);

    this.element.appendChild(wrapper);
    return this;
  }
  
  ScrollToNext(): this {
    this.element.scrollBy({ left: 220 + 12, behavior: "smooth" });
    return this;
  }
  
  ScrollToPrev(): this {
    this.element.scrollBy({ left: -(220 + 12), behavior: "smooth" });
    return this;
  }
}

function CreateCarousel(): Carousel {
  return new Carousel();
}

/**
 * AddCarousel function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {Carousel}
 *
 */
export function AddCarousel(parent: LayoutElement): Carousel {
  const carousel = CreateCarousel();
  parent.AddChild(carousel);
  return carousel;
}
