export class InputManager {
  private targetElement: HTMLElement | null = null;
  private isPointerDown: boolean = false;
  private isSpaceDown: boolean = false;
  private enabled: boolean = true;
  private onHoldChangeCallback?: (holding: boolean) => void;

  constructor() {
    this.handleWindowPointerUp = this.handleWindowPointerUp.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public attach(element: HTMLElement, onHoldChange?: (holding: boolean) => void) {
    this.targetElement = element;
    this.onHoldChangeCallback = onHoldChange;

    // Attach local pointer/touch listeners to the canvas container
    element.addEventListener('pointerdown', this.handleElementPointerDown, { passive: false });
    element.addEventListener('touchstart', this.handleTouchStart, { passive: false });

    // Global listeners on window to ensure release is NEVER missed
    window.addEventListener('pointerup', this.handleWindowPointerUp, true);
    window.addEventListener('pointercancel', this.handleWindowPointerUp, true);
    window.addEventListener('touchend', this.handleWindowPointerUp, true);
    window.addEventListener('touchcancel', this.handleWindowPointerUp, true);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleWindowBlur);
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.reset();
    }
  }

  public get isHolding(): boolean {
    return this.enabled && (this.isPointerDown || this.isSpaceDown);
  }

  private handleElementPointerDown = (e: PointerEvent) => {
    if (!this.enabled) return;

    // Ignore clicks on HUD buttons or modals
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-hud-control="true"]')) {
      return;
    }

    // Only respond to main button (left click = 0) or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    this.isPointerDown = true;
    this.notify();
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (!this.enabled) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    e.preventDefault(); // Prevent screen scroll/pinch while playing
    this.isPointerDown = true;
    this.notify();
  };

  private handleWindowPointerUp = () => {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.notify();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      this.isSpaceDown = true;
      this.notify();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      this.isSpaceDown = false;
      this.notify();
    }
  };

  private handleWindowBlur = () => {
    // Safety: tab switch or window minimize must immediately halt character
    this.reset();
  };

  public reset() {
    this.isPointerDown = false;
    this.isSpaceDown = false;
    this.notify();
  }

  private notify() {
    if (this.onHoldChangeCallback) {
      this.onHoldChangeCallback(this.isHolding);
    }
  }

  public destroy() {
    if (this.targetElement) {
      this.targetElement.removeEventListener('pointerdown', this.handleElementPointerDown);
      this.targetElement.removeEventListener('touchstart', this.handleTouchStart);
    }
    window.removeEventListener('pointerup', this.handleWindowPointerUp, true);
    window.removeEventListener('pointercancel', this.handleWindowPointerUp, true);
    window.removeEventListener('touchend', this.handleWindowPointerUp, true);
    window.removeEventListener('touchcancel', this.handleWindowPointerUp, true);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleWindowBlur);
    this.reset();
  }
}
