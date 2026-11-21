import Lenis from 'lenis';

export type ClockTickListener = (time: number, deltaTime: number, scrollProgress: number) => void;

export class SharedClock {
  private static instance: SharedClock;
  private lenis: Lenis | null = null;
  private listeners: Set<ClockTickListener> = new Set();
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private currentScrollProgress: number = 0;

  private constructor() {}

  public static getInstance(): SharedClock {
    if (!SharedClock.instance) {
      SharedClock.instance = new SharedClock();
    }
    return SharedClock.instance;
  }

  public initLenis(wrapper?: HTMLElement): Lenis {
    if (!this.lenis) {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        ...(wrapper ? { wrapper } : {}),
      });

      this.lenis.on('scroll', (e: { progress: number }) => {
        this.currentScrollProgress = e.progress;
      });

      this.startLoop();
    }
    return this.lenis;
  }

  public getScrollProgress(): number {
    return this.currentScrollProgress;
  }

  public subscribe(callback: ClockTickListener): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private startLoop(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();

    const loop = (currentTime: number) => {
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      if (this.lenis) {
        this.lenis.raf(currentTime);
      }

      for (const listener of this.listeners) {
        listener(currentTime, deltaTime, this.currentScrollProgress);
      }

      if (this.isRunning) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
  }

  public destroy(): void {
    this.isRunning = false;
    this.listeners.clear();
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}
