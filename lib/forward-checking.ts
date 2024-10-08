import MapColoringGraph from "./map-coloring-graph";
import {
  average,
  getNeighbours,
  getUnassigned,
  isAssignmentValid,
  median,
  standardDeviation,
} from "./utils";

export default class ForwardChecking {
  mapColoringGraph: MapColoringGraph;
  mapColoringGraphs: MapColoringGraph[];
  assignments: number[];
  exampleAssignments: number[];
  averageRunTime: number;
  standardDeviation: number;
  medianRunTime: number;
  k: number;
  backtracks: number;

  constructor(mcgs: MapColoringGraph[], k: number) {
    this.mapColoringGraphs = mcgs;
    this.mapColoringGraph = mcgs[0];
    this.k = k;
    this.averageRunTime = 0;
    this.standardDeviation = 0;
    this.medianRunTime = 0;
    this.assignments = [];
    this.exampleAssignments = [];
    this.backtracks = 0;
  }

  run() {
    const times: number[] = [];
    const backtracksList: number[] = [];

    for (let i = 0; i < this.mapColoringGraphs.length; i++) {
      this.mapColoringGraph = this.mapColoringGraphs[i];

      this.assignments = [];
      this.backtracks = 0;

      const start = performance.now();
      this.backtrack();
      const end = performance.now();

      times.push(end - start);
      backtracksList.push(this.backtracks);

      if (i === 0) {
        this.exampleAssignments = this.assignments;
      }
    }

    this.averageRunTime = average(times);
    this.standardDeviation = standardDeviation(times);
    this.medianRunTime = median(times);
    this.backtracks = average(backtracksList);
  }

  private backtrack() {
    const domains: number[][] = [];
    const assignments: number[] = [];

    for (let i = 0; i < this.mapColoringGraph.n; i++) {
      domains.push(Array.from(Array(this.k).keys()));
      assignments.push(-1);
    }

    const res = this.backtrackWithForwardChecking(assignments, domains);
    if (res) {
      // Backtracking with Forward Checking has found a valid coloring
      this.assignments = assignments;
    }
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
    const unassigned = getUnassigned(assignments, domains);

    for (const value of domains[unassigned]) {
      const tempDomains = [...domains.map((domain) => [...domain])];
      assignments[unassigned] = value;
      domains[unassigned] = [value];

      // Get the neighbors of the current unassigned point
      const neighbours = getNeighbours(
        this.mapColoringGraph.points,
        this.mapColoringGraph.lines,
        this.mapColoringGraph.points[unassigned]
      );

      for (let neighbour of neighbours) {
        // Skip already assigned neighbors
        if (assignments[neighbour] !== -1) {
          continue;
        }

        // Filter the domains array for each neighbor to remove colors that violate the constraint
        domains[neighbour] = domains[neighbour].filter((domainValue) => {
          return isAssignmentValid(
            this.mapColoringGraph.points,
            this.mapColoringGraph.lines,
            assignments,
            neighbour,
            domainValue
          );
        });
      }

      if (domains.some((domain) => domain.length === 0)) {
        assignments[unassigned] = -1;
        domains = tempDomains;
        continue;
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
    this.backtracks++;
    return false;
  }

  toString() {
    return `Average run time: ${this.averageRunTime} ms\nStandard deviation: ${this.standardDeviation} ms\nMedian run time: ${this.medianRunTime} ms`;
  }
}
