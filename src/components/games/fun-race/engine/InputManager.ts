export class InputManager {
  private targetElement: HTMLElement | null = null;
  private isPointerDown: boolean = false;
  private isSpaceDown: boolean = false;
  private keyLeft: boolean = false;
  private keyRight: boolean = false;
  private programmaticSteer: number = 0; // -1 (left), 0 (none), 1 (right)
  private enabled: boolean = true;
  private pointerTargetX: number | null = null; // Normalized lateral target (-1 to 1)
  private onHoldChangeCallback?: (holding: boolean) => void;

  constructor() {
    this.handleWindowPointerUp = this.handleWindowPointerUp.bind(this);
    this.handleWindowPointerMove = this.handleWindowPointerMove.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public attach(element: HTMLElement, onHoldChange?: (holding: boolean) => void) {
    this.targetElement = element;
    this.onHoldChangeCallback = onHoldChange;

    element.addEventListener('pointerdown', this.handleElementPointerDown, { passive: false });
    element.addEventListener('touchstart', this.handleTouchStart, { passive: false });

    window.addEventListener('pointermove', this.handleWindowPointerMove, true);
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
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

  /**
   * Set programmatic steering for touch HUD buttons (-1 = Left, 1 = Right, 0 = Neutral)
   */
  public setSteering(dir: number) {
    this.programmaticSteer = Math.max(-1, Math.min(1, dir));
  }

  /**
   * Calculates new lateral offset (-maxLateral to +maxLateral) based on keyboard, HUD buttons, and pointer drag
   */
  public updateLateralOffset(currentOffset: number, dt: number, maxLateral: number = 1.05): number {
    if (!this.enabled) return currentOffset;

    let target = currentOffset;

    // 1. Keyboard & On-Screen Button Steering
    let steerDir = this.programmaticSteer;
    if (this.keyLeft) steerDir -= 1;
    if (this.keyRight) steerDir += 1;

    if (steerDir !== 0) {
      const steerSpeed = 4.2; // m/s snappy steering
      target += steerDir * steerSpeed * dt;
      return Math.max(-maxLateral, Math.min(maxLateral, target));
    }

    // 2. Mouse / Touch Drag Steering
    if (this.isPointerDown && this.pointerTargetX !== null) {
      // Map pointerTargetX (-1 to 1) to track lateral corridor
      const dragTarget = this.pointerTargetX * maxLateral;
      // Smooth interpolation toward drag target
      target += (dragTarget - currentOffset) * Math.min(1.0, dt * 10.0);
      return Math.max(-maxLateral, Math.min(maxLateral, target));
    }

    return currentOffset;
  }

  private updatePointerCoords(clientX: number) {
    if (!this.targetElement) return;
    const rect = this.targetElement.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    // Center is 0, left is -1.0, right is +1.0
    const normX = ((clientX - rect.left) / width - 0.5) * 2.2;
    this.pointerTargetX = Math.max(-1.0, Math.min(1.0, normX));
  }

  private handleElementPointerDown = (e: PointerEvent) => {
    if (!this.enabled) return;

    // Ignore clicks on HUD control buttons or modals
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-hud-control="true"]')) {
      return;
    }

    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    this.isPointerDown = true;
    this.updatePointerCoords(e.clientX);
    this.notify();
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (!this.enabled) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-hud-control="true"]')) return;

    e.preventDefault();
    this.isPointerDown = true;
    if (e.touches.length > 0) {
      this.updatePointerCoords(e.touches[0].clientX);
    }
    this.notify();
  };

  private handleWindowPointerMove = (e: PointerEvent) => {
    if (this.isPointerDown) {
      this.updatePointerCoords(e.clientX);
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (this.isPointerDown && e.touches.length > 0) {
      this.updatePointerCoords(e.touches[0].clientX);
    }
  };

  private handleWindowPointerUp = () => {
    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.pointerTargetX = null;
      this.notify();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;

    // Spacebar = Run
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      this.isSpaceDown = true;
      this.notify();
    }

    // A / ArrowLeft = Steer Left
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      e.preventDefault();
      this.keyLeft = true;
    }

    // D / ArrowRight = Steer Right
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      e.preventDefault();
      this.keyRight = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      this.isSpaceDown = false;
      this.notify();
    }
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      this.keyLeft = false;
    }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      this.keyRight = false;
    }
  };

  private handleWindowBlur = () => {
    this.reset();
  };

  public reset() {
    this.isPointerDown = false;
    this.isSpaceDown = false;
    this.keyLeft = false;
    this.keyRight = false;
    this.programmaticSteer = 0;
    this.pointerTargetX = null;
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
    window.removeEventListener('pointermove', this.handleWindowPointerMove, true);
    window.removeEventListener('touchmove', this.handleTouchMove);
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
