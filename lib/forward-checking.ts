import MapColoringGraph from "./map-coloring-graph";
import { average, median, standardDeviation } from "./utils";

export default class ForwardChecking {
  mapColoringGraph: MapColoringGraph;
  averageRunTime: number;
  standardDeviation: number;
  medianRunTime: number;
  iterations: number;

  constructor(mcg: MapColoringGraph, iterations: number) {
    this.mapColoringGraph = mcg;
    this.averageRunTime = 0;
    this.standardDeviation = 0;
    this.medianRunTime = 0;
    this.iterations = iterations;
  }

  run() {
    const times: number[] = [];

    for (let i = 0; i < this.iterations; i++) {
      const start = performance.now();
      this.backtrack();
      const end = performance.now();
      times.push(end - start);
    }

    this.averageRunTime = average(times);
    this.standardDeviation = standardDeviation(times);
    this.medianRunTime = median(times);
  }

  private backtrack() {
    const domains: number[][] = [];
    const assignments: number[] = [];

    for (let i = 0; i < this.mapColoringGraph.n; i++) {
      domains.push(Array.from(Array(this.mapColoringGraph.k).keys()));
      assignments.push(-1);
    }

    this.backtrackWithForwardChecking(assignments, domains);
  }

  private backtrackWithForwardChecking(
    assignments: number[],
    domains: number[][]
  ) {
    if (assignments.length === this.mapColoringGraph.n) {
      return true;
    }

    const unassigned = this.getUnassigned(assignments);

    for (const value of domains[unassigned]) {
      if (this.isAssignmentValid(assignments, unassigned, value)) {
        assignments[unassigned] = value;

        if (this.backtrackWithForwardChecking(assignments, domains)) {
          return true;
        }

        assignments[unassigned] = -1;
      }
    }

    return false;
  }

  private getUnassigned(assignments: number[]) {
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i] === -1) {
        return i;
      }
    }

    return -1;
  }

  private isAssignmentValid(
    assignments: number[],
    unassigned: number,
    value: number
  ) {
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i] === undefined) {
        continue;
      }

      if (
        this.mapColoringGraph.lines.some((line) => {
          const pointA = this.mapColoringGraph.points[i];
          const pointB = this.mapColoringGraph.points[unassigned];

          return (
            (pointA === line.pointA && pointB === line.pointB) ||
            (pointA === line.pointB && pointB === line.pointA)
          );
        })
      ) {
        if (assignments[i] === value) {
          return false;
        }
      }
    }

    return true;
  }

  toString() {
    return `Average run time: ${this.averageRunTime} ms\nStandard deviation: ${this.standardDeviation} ms\nMedian run time: ${this.medianRunTime} ms`;
  }
}
