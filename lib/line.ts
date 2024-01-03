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

  // Checks if two lines are crossing
  isCrossing(line: Line) {
    const denominator =
      (this.pointB.y - this.pointA.y) * (line.pointB.x - line.pointA.x) -
      (this.pointB.x - this.pointA.x) * (line.pointB.y - line.pointA.y);

    if (denominator === 0) {
      return false;
    }

    const ua =
      ((this.pointB.x - this.pointA.x) * (line.pointA.y - this.pointA.y) -
        (this.pointB.y - this.pointA.y) * (line.pointA.x - this.pointA.x)) /
      denominator;
    const ub =
      ((line.pointB.x - line.pointA.x) * (line.pointA.y - this.pointA.y) -
        (line.pointB.y - line.pointA.y) * (line.pointA.x - this.pointA.x)) /
      denominator;

    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  }

  toString() {
    return `${this.pointA.toString()} -> ${this.pointB.toString()}`;
  }
}
