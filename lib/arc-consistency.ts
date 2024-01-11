import MapColoringGraph from "./map-coloring-graph";
import Point from "./point";
import { average, median, standardDeviation } from "./utils";

export default class ArcConsistency {
  mapColoringGraph: MapColoringGraph;
  assignments: number[];
  exampleAssignments: number[];
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
    this.exampleAssignments = [];
  }

  run() {
    const times: number[] = [];

    for (let i = 0; i < this.iterations; i++) {
      if (i !== 0)
        this.mapColoringGraph = new MapColoringGraph(this.mapColoringGraph.n);

      this.assignments = [];

      const start = performance.now();
      this.backtrack();
      const end = performance.now();
      times.push(end - start);

      if (i === 0) {
        this.exampleAssignments = this.assignments;
      }
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

    const res = this.backtrackWithMaintainingArcConsistency(
      assignments,
      domains
    );
    if (res) {
      this.assignments = assignments;
    }
    //   console.log(assignments);
    //   console.log("Solution found");
    // } else {
    //   console.log("No solution found");
    // }
  }

  private getNeighbours(point: Point) {
    // Filter the lines array to get the neighbors of a given point
    return this.mapColoringGraph.lines
      .filter((line) => line.pointA === point || line.pointB === point)
      .map((line) => (line.pointA === point ? line.pointB : line.pointA))
      .map((point) => this.mapColoringGraph.points.indexOf(point));
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

  private backtrackWithMaintainingArcConsistency(
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

      // Apply arc consistency to reduce the domains of neighboring unassigned points
      if (this.applyArcConsistency(assignments, domains, unassigned)) {
        // Recursively call the method with updated assignments and domains
        if (this.backtrackWithMaintainingArcConsistency(assignments, domains)) {
          return true;
        }
      }

      // Reset the assignment of the current unassigned point and restore the previous domains
      assignments[unassigned] = -1;
      domains = tempDomains;
    }

    // No valid coloring found, backtrack
    return false;
  }

  private applyArcConsistency(
    assignments: number[],
    domains: number[][],
    unassigned: number
  ) {
    if (domains.every((domain) => domain.length === 1)) {
      return true;
    }

    const queue: [number, number][] = [];

    // Add all arcs between the current unassigned point and its neighbors to the queue
    const neighbours = this.getNeighbours(
      this.mapColoringGraph.points[unassigned]
    );
    for (const neighbour of neighbours) {
      queue.push([neighbour, unassigned]);
    }

    while (queue.length > 0) {
      const [from, to] = queue.shift()!;

      if (this.revise(assignments, domains, from)) {
        // If the domain of the 'from' point becomes empty, inconsistency is detected
        if (domains[from].length === 0) {
          return false;
        }

        // Add all arcs between the 'from' point and its neighbors (excluding 'to') to the queue
        const fromNeighbours = this.getNeighbours(
          this.mapColoringGraph.points[from]
        );
        for (const neighbour of fromNeighbours) {
          if (neighbour !== to) {
            queue.push([neighbour, from]);
          }
        }
      }
    }

    return true;
  }

  private revise(assignments: number[], domains: number[][], from: number) {
    let revised = false;

    for (const value of domains[from]) {
      if (!this.isAssignmentValid(assignments, from, value)) {
        // Remove the value from the domain of the 'from' point
        domains[from] = domains[from].filter(
          (domainValue) => domainValue !== value
        );
        revised = true;
      }
    }

    return revised;
  }

  toString() {
    return `Average run time: ${this.averageRunTime} ms\nStandard deviation: ${this.standardDeviation} ms\nMedian run time: ${this.medianRunTime} ms`;
  }
}
