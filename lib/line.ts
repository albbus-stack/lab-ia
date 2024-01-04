import Point from "./point";

export default class Line {
  pointA: Point;
  pointB: Point;

  constructor(pointA: Point, pointB: Point) {
    this.pointA = pointA;
    this.pointB = pointB;
  }

  // Checks if two lines are equal
  isEqual(line: Line) {
    return (
      (this.pointA.x === line.pointA.x &&
        this.pointA.y === line.pointA.y &&
        this.pointB.x === line.pointB.x &&
        this.pointB.y === line.pointB.y) ||
      (this.pointA.x === line.pointB.x &&
        this.pointA.y === line.pointB.y &&
        this.pointB.x === line.pointA.x &&
        this.pointB.y === line.pointA.y)
    );
  }

  private orientation(p: Point, q: Point, r: Point): number {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) {
      // Collinear
      return 0;
    }
    // Clockwise or counterclockwise
    return val > 0 ? 1 : 2;
  }

  private onSegment(p: Point, q: Point, r: Point): boolean {
    return (
      q.x < Math.max(p.x, r.x) &&
      q.x > Math.min(p.x, r.x) &&
      q.y < Math.max(p.y, r.y) &&
      q.y > Math.min(p.y, r.y)
    );
  }

  // Checks if two lines are crossing
  isCrossing(line: Line): boolean {
    const p1 = this.pointA;
    const q1 = this.pointB;
    const p2 = line.pointA;
    const q2 = line.pointB;

    const o1 = this.orientation(p1, q1, p2);
    const o2 = this.orientation(p1, q1, q2);
    const o3 = this.orientation(p2, q2, p1);
    const o4 = this.orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) {
      if (
        (o1 === 0 && !this.onSegment(p2, p1, q1)) ||
        (o2 === 0 && !this.onSegment(q2, p1, q1))
      ) {
        return false;
      }
      return true;
    }

    if (o1 === 0 && this.onSegment(p1, p2, q1)) {
      return true;
    }

    if (o2 === 0 && this.onSegment(p1, q2, q1)) {
      return true;
    }

    if (o3 === 0 && this.onSegment(p2, p1, q2)) {
      return true;
    }

    if (o4 === 0 && this.onSegment(p2, q1, q2)) {
      return true;
    }

    return false;
  }

  toString() {
    return `${this.pointA.toString()} -> ${this.pointB.toString()}`;
  }
}
