import Line from "./line";
import Point from "./point";

export default class MapColoringGraph {
  points: Point[];
  lines: Line[];

  constructor(public n: number) {
    this.generateMap();
  }

  private generateMap() {
    this.points = [];
    this.lines = [];

    // Scatter n points on the unit square
    for (let i = 0; i < this.n; i++) {
      this.points.push(new Point(Math.random(), Math.random()));
    }

    while (this.areValidLinesAvailable()) {
      // Select a point X at random
      const randomPoint =
        this.points[Math.floor(Math.random() * this.points.length)];

      let nearestPoint: Point | undefined;
      let nearestPointDistance = Infinity;
      let visitedPoints: Point[] = [];

      while (this.areValidLinesAvailableFrom(randomPoint)) {
        // Connect X by a straight line to the nearest point Y
        for (const point of this.points) {
          if (point === randomPoint || visitedPoints.includes(point)) {
            continue;
          }

          const distance = randomPoint.getDistance(point);

          if (distance < nearestPointDistance) {
            nearestPoint = point;
            nearestPointDistance = distance;
          }
        }

        if (!nearestPoint) {
          break;
        }

        // Such that X is not already connected to Y and the line crosses no other line (is valid)
        if (this.isLineValid(new Line(randomPoint, nearestPoint))) {
          this.lines.push(new Line(randomPoint, nearestPoint));
          break;
        }

        visitedPoints.push(nearestPoint);
        nearestPoint = undefined;
        nearestPointDistance = Infinity;
      }
      // Repeat the previous step until no more connections are possible
    }
  }

  // Checks if a line is valid (not crossing any other line and not equal to any other line)
  private isLineValid(line: Line) {
    return (
      !this.lines.some((existingLine) => existingLine.isCrossing(line)) &&
      !this.lines.some((existingLine) => existingLine.isEqual(line))
    );
  }

  // From a given point, checks if there are any valid lines available
  private areValidLinesAvailableFrom(point: Point) {
    const availablePoints = this.points.filter(
      (availablePoint) =>
        availablePoint !== point &&
        this.isLineValid(new Line(point, availablePoint))
    );

    return availablePoints.length > 0;
  }

  // Checks if there are any valid lines available from any point
  private areValidLinesAvailable() {
    return this.points.some((point) => this.areValidLinesAvailableFrom(point));
  }

  // Displays the map coloring graph as a string
  public toString() {
    return `
Points:\n  ${this.points.map((point) => point.toString()).join("\n  ")}
Lines:\n  ${this.lines.map((line) => line.toString()).join("\n  ")}
    `;
  }
}
