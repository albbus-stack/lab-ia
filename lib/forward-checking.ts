import MapColoringGraph from "./map-coloring-graph";
import { average, median, standardDeviation } from "./utils";

export default class ForwardChecking {
  mapColoringGraph: MapColoringGraph;
  assignments: number[];
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
    this.assignments = [];
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

    const res = this.backtrackWithForwardChecking(assignments, domains);
    // if (res) {
    //   console.log(assignments);
    //   console.log("found");
    // }
  }

  private backtrackWithForwardChecking(
    assignments: number[],
    domains: number[][]
  ) {
    if (assignments.every((assignment) => assignment !== -1)) {
      return true;
    }
    // console.log(assignments, domains);

    const unassigned = this.getUnassigned(assignments);

    for (const value of domains[unassigned]) {
      const tempDomains = [...domains.map((domain) => [...domain])];
      assignments[unassigned] = value;
      domains[unassigned] = [value];

      for (let i = 0; i < assignments.length; i++) {
        if (assignments[i] !== -1 || i === unassigned) {
          continue;
        }

        domains[i] = domains[i].filter((domainValue) => {
          return this.isAssignmentValid(assignments, i, domainValue);
        });
      }

      if (this.backtrackWithForwardChecking(assignments, domains)) {
        return true;
      }

      assignments[unassigned] = -1;
      domains = tempDomains;
    }

    // console.log("backtrack");
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
      if (assignments[i] === -1 || i === unassigned) {
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
        }) &&
        assignments[i] === value
      ) {
        return false;
      }
    }

    return true;
  }

  toString() {
    return `Average run time: ${this.averageRunTime} ms\nStandard deviation: ${this.standardDeviation} ms\nMedian run time: ${this.medianRunTime} ms`;
  }
}
