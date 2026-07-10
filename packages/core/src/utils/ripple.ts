/**
 * attachRipple function.
 * @param {HTMLElement} element - The element parameter
 *
 */
export function attachRipple(element: HTMLElement) {
  element.style.position = "relative";
  element.style.overflow = "hidden";

  element.addEventListener("mousedown", (e: MouseEvent) => {
    createRipple(e, element);
  });

  // For touch devices
  element.addEventListener("touchstart", (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      // Create a mock mouse event for the ripple logic
      const mockEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      createRipple(mockEvent, element);
    }
  }, { passive: true });
}

function createRipple(event: MouseEvent, element: HTMLElement) {
  const ripple = document.createElement("span");
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  // Calculate click coordinates relative to the element
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.position = "absolute";
  ripple.style.borderRadius = "50%";
  ripple.style.transform = "scale(0)";
  ripple.style.backgroundColor = "currentColor";
  ripple.style.opacity = "0.15"; // Initial opacity for the ink drop
  ripple.style.pointerEvents = "none";

  // SVA animations won't easily support dynamic coordinate injection, so we use WAAPI
  element.appendChild(ripple);

  const animation = ripple.animate(
    [
      { transform: "scale(0)", opacity: 0.15 },
      { transform: "scale(2.5)", opacity: 0 }
    ],
    {
      duration: 600,
      easing: "cubic-bezier(0.2, 0, 0, 1)", // Standard M3 easing
    }
  );

  animation.onfinish = () => {
    ripple.remove();
  };
}
