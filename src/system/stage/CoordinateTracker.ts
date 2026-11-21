import { CameraPose, SectionWaypoint } from '../types';

export class CoordinateTracker {
  private waypoints: SectionWaypoint[];

  constructor(waypoints: SectionWaypoint[]) {
    this.waypoints = waypoints;
  }

  /**
   * Smoothly interpolates between camera coordinates with cubic easeInOut
   * Zero-jump matching: the exit coordinates of section N match section N+1
   */
  public getInterpolatedPose(scrollProgress: number): CameraPose {
    const clamped = Math.max(0, Math.min(1, scrollProgress));

    // Find the active segment
    for (let i = 0; i < this.waypoints.length; i++) {
      const wp = this.waypoints[i];
      if (clamped >= wp.startProgress && clamped <= wp.endProgress) {
        const localRange = wp.endProgress - wp.startProgress;
        const localT = localRange > 0 ? (clamped - wp.startProgress) / localRange : 0;
        const easedT = this.easeInOutCubic(localT);

        return this.lerpPose(wp.startPose, wp.endPose, easedT);
      }
    }

    // Default to last pose if at end
    if (this.waypoints.length > 0) {
      return this.waypoints[this.waypoints.length - 1].endPose;
    }

    return { x: 0, y: 0, z: 5, rx: 0, ry: 0, rz: 0 };
  }

  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  private lerpPose(start: CameraPose, end: CameraPose, t: number): CameraPose {
    return {
      x: this.lerp(start.x, end.x, t),
      y: this.lerp(start.y, end.y, t),
      z: this.lerp(start.z, end.z, t),
      rx: this.lerp(start.rx, end.rx, t),
      ry: this.lerp(start.ry, end.ry, t),
      rz: this.lerp(start.rz, end.rz, t),
    };
  }

  private easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}
