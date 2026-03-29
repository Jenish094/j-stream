import { useCallback, useEffect, useRef, useState } from "react";

interface FocusableElement {
  element: HTMLElement;
  x: number;
  y: number;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const FOCUSABLE_SELECTOR =
  '[data-focusable="true"], button:not([disabled]), a[href], [role="button"], [tabindex]:not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])';

export function useSpatialNavigation() {
  const focusableElementsRef = useRef<FocusableElement[]>([]);
  const currentFocusRef = useRef<HTMLElement | null>(null);
  const [currentRect, setCurrentRect] = useState<Rect | null>(null);

  const getRect = useCallback((element: HTMLElement): Rect => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const setFocusedElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        currentFocusRef.current = null;
        setCurrentRect(null);
        return;
      }

      currentFocusRef.current = element;
      element.focus({ preventScroll: true });
      setCurrentRect(getRect(element));
    },
    [getRect],
  );

  const updateFocusableElements = useCallback(() => {
    const elements = document.querySelectorAll(FOCUSABLE_SELECTOR);
    const focusables: FocusableElement[] = [];

    elements.forEach((el) => {
      const element = el as HTMLElement;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      if (
        rect.width <= 0 ||
        rect.height <= 0 ||
        style.visibility === "hidden" ||
        style.display === "none" ||
        element.getAttribute("aria-hidden") === "true"
      ) {
        return;
      }

      focusables.push({
        element,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    });

    focusableElementsRef.current = focusables;
  }, []);

  const findClosestElement = useCallback<
    (
      direction: "up" | "down" | "left" | "right",
      currentX: number,
      currentY: number,
    ) => FocusableElement | null
  >(
    (
      direction: "up" | "down" | "left" | "right",
      currentX: number,
      currentY: number,
    ) => {
      const elements = focusableElementsRef.current;
      let closest: FocusableElement | null = null;
      let minDistance = Infinity;

      elements.forEach((item) => {
        if (item.element === currentFocusRef.current) return;

        let valid = false;
        let distance = 0;

        switch (direction) {
          case "up":
            if (item.y < currentY) {
              valid = true;
              distance = Math.abs(item.x - currentX) + (currentY - item.y);
            }
            break;
          case "down":
            if (item.y > currentY) {
              valid = true;
              distance = Math.abs(item.x - currentX) + (item.y - currentY);
            }
            break;
          case "left":
            if (item.x < currentX) {
              valid = true;
              distance = Math.abs(item.y - currentY) + (currentX - item.x);
            }
            break;
          case "right":
            if (item.x > currentX) {
              valid = true;
              distance = Math.abs(item.y - currentY) + (item.x - currentX);
            }
            break;
          default:
            valid = false;
            break;
        }

        if (valid && distance < minDistance) {
          minDistance = distance;
          closest = item;
        }
      });

      return closest;
    },
    [],
  );

  const resetNavigation = useCallback(() => {
    currentFocusRef.current = null;
    setCurrentRect(null);
  }, []);

  const navigate = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      updateFocusableElements();

      const elements = focusableElementsRef.current;
      if (elements.length === 0) {
        resetNavigation();
        return;
      }

      const currentActive =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      const current =
        currentFocusRef.current &&
        elements.some((entry) => entry.element === currentFocusRef.current)
          ? currentFocusRef.current
          : currentActive &&
              elements.some((entry) => entry.element === currentActive)
            ? currentActive
            : null;

      if (!current) {
        setFocusedElement(elements[0].element);
        return;
      }

      const rect = current.getBoundingClientRect();
      const currentX = rect.left + rect.width / 2;
      const currentY = rect.top + rect.height / 2;

      const next: FocusableElement | null = findClosestElement(
        direction,
        currentX,
        currentY,
      );
      if (next) {
        setFocusedElement(next.element);
      } else {
        setFocusedElement(current);
      }
    },
    [
      findClosestElement,
      resetNavigation,
      setFocusedElement,
      updateFocusableElements,
    ],
  );

  const handleAction = useCallback(
    (action: string) => {
      switch (action) {
        case "navigate-up":
          navigate("up");
          break;
        case "navigate-down":
          navigate("down");
          break;
        case "navigate-left":
          navigate("left");
          break;
        case "navigate-right":
          navigate("right");
          break;
        case "confirm":
          if (document.activeElement) {
            (document.activeElement as HTMLElement).click();
          }
          break;
        case "back":
          // Handle back navigation
          window.history.back();
          break;
        default:
          break;
      }
    },
    [navigate],
  );

  useEffect(() => {
    updateFocusableElements();

    const handleResize = () => {
      updateFocusableElements();
      if (
        currentFocusRef.current &&
        currentFocusRef.current.isConnected &&
        document.contains(currentFocusRef.current)
      ) {
        setCurrentRect(getRect(currentFocusRef.current));
      } else {
        resetNavigation();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (target.matches(FOCUSABLE_SELECTOR)) {
        currentFocusRef.current = target;
        setCurrentRect(getRect(target));
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [getRect, resetNavigation, updateFocusableElements]);

  return {
    handleAction,
    updateFocusableElements,
    currentRect,
    resetNavigation,
  };
}
