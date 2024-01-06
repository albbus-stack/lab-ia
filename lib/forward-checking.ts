import MapColoringGraph from "./map-coloring-graph";
import Point from "./point";
import { average, median, standardDeviation } from "./utils";

export default class ForwardChecking {
  mapColoringGraph: MapColoringGraph;
  assignments: number[];
  averageRunTime: number;
  standardDeviation: number;
  medianRunTime: number;
  iterations: number;
  k: number;

  constructor(mcg: MapColoringGraph, k: number, iterations: number) {
    this.mapColoringGraph = mcg;
    this.k = k;
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
      domains.push(Array.from(Array(this.k).keys()));
      assignments.push(-1);
    }

    const res = this.backtrackWithForwardChecking(assignments, domains);
    if (res) this.assignments = assignments;
    //   console.log(assignments);
    //   console.log("Solution found");
    // } else {
    //   console.log("No solution found");
    // }
  }

  private backtrackWithForwardChecking(
    assignments: number[],
    domains: number[][]
  ) {
    // Check if all map points have been assigned a color, if so a valid coloring has been found
    if (assignments.every((assignment) => assignment !== -1)) {
      return true;
    }

    // Get the index of the unassigned map point with the smallest domain (Minimum Remaining Values)
    const unassigned = this.getUnassigned(assignments, domains);

    for (const value of domains[unassigned]) {
      const tempDomains = [...domains.map((domain) => [...domain])];
      assignments[unassigned] = value;
      domains[unassigned] = [value];

      // Get the neighbors of the current unassigned point
      const neighbours = this.getNeighbours(
        this.mapColoringGraph.points[unassigned]
      );

      for (let neighbour of neighbours) {
        // Skip already assigned neighbors
        if (assignments[neighbour] !== -1) {
          continue;
        }

        // Filter the domains array for each neighbor to remove colors that violate the constraint
        domains[neighbour] = domains[neighbour].filter((domainValue) => {
          return this.isAssignmentValid(assignments, neighbour, domainValue);
        });
      }

      // Recursively call the method with updated assignments and domains
      if (this.backtrackWithForwardChecking(assignments, domains)) {
        return true;
      }

      // Reset the assignment of the current unassigned point and restore the previous domains
      assignments[unassigned] = -1;
      domains = tempDomains;
    }

    // No valid coloring found, backtrack
    return false;
  }

  private getNeighbours(point: Point) {
    // Filter the lines array to get the neighbors of a given point
    return this.mapColoringGraph.lines
      .filter((line) => line.pointA === point || line.pointB === point)
      .map((line) => (line.pointA === point ? line.pointB : line.pointA))
      .map((point) => this.mapColoringGraph.points.indexOf(point));
  }

  private getUnassigned(assignments: number[], domains: number[][]) {
    // Find the index of the unassigned point with the smallest domain (Minimum Remaining Values)
    let min = Infinity;
    let minIndex = -1;

    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i] !== -1) {
        continue;
      }

      if (domains[i].length < min) {
        min = domains[i].length;
        minIndex = i;
      }
    }

    return minIndex;
  }

  private isAssignmentValid(
    assignments: number[],
    unassigned: number,
    value: number
  ) {
    for (let i = 0; i < assignments.length; i++) {
      // Skip all the unassigned points
      if (assignments[i] === -1) {
        continue;
      }

      // Check if there is a line connecting the current neighbor and the unassigned point and if the neighbor has already been assigned the same color
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
