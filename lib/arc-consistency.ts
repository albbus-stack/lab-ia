import MapColoringGraph from "./map-coloring-graph";
import {
  average,
  getNeighbours,
  getUnassigned,
  isAssignmentValid,
  median,
  standardDeviation,
} from "./utils";

export default class ArcConsistency {
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

    const res = this.backtrackWithMaintainingArcConsistency(
      assignments,
      domains
    );
    if (res) {
      // Backtracking with MAC has found a valid coloring
      this.assignments = assignments;
    }
  }

  private backtrackWithMaintainingArcConsistency(
    assignments: number[],
    domains: number[][]
  ) {
    // Check if any map points have an unitary domain, if so assign the only possible color to them
    domains.forEach((domain, index) => {
      if (domain.length === 1) {
        assignments[index] = domain[0];
      }
    });

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
    this.backtracks++;
    return false;
  }

  private applyArcConsistency(
    assignments: number[],
    domains: number[][],
    unassigned: number
  ) {
    const queue: [number, number][] = [];

    // Add all arcs between the current unassigned point and its neighbors to the queue
    const neighbours = getNeighbours(
      this.mapColoringGraph.points,
      this.mapColoringGraph.lines,
      this.mapColoringGraph.points[unassigned]
    );
    for (const neighbour of neighbours) {
      queue.push([neighbour, unassigned]);
    }

    while (queue.length > 0) {
      const [from, to] = queue.shift()!;

      if (this.revise(assignments, domains, from, to)) {
        // If the domain of the 'from' point becomes empty, inconsistency is detected
        if (domains[from].length === 0) {
          return false;
        }

        // Add all arcs between the 'from' point and its neighbors (excluding 'to') to the queue
        const fromNeighbours = getNeighbours(
          this.mapColoringGraph.points,
          this.mapColoringGraph.lines,
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

  private revise(
    assignments: number[],
    domains: number[][],
    from: number,
    to: number
  ) {
    let revised = false;

    for (const value of domains[from]) {
      assignments[from] = value;
      if (!this.hasSupport(assignments, domains, to)) {
        // Remove the value from the domain of the 'from' point
        domains[from] = domains[from].filter(
          (domainValue) => domainValue !== value
        );
        revised = true;
      }
    }
    assignments[from] = -1;

    return revised;
  }

  private hasSupport(assignments: number[], domains: number[][], to: number) {
    for (const value of domains[to]) {
      if (
        isAssignmentValid(
          this.mapColoringGraph.points,
          this.mapColoringGraph.lines,
          assignments,
          to,
          value
        )
      ) {
        return true;
      }
    }

    return false;
  }

  toString() {
    return `Average run time: ${this.averageRunTime} ms\nStandard deviation: ${this.standardDeviation} ms\nMedian run time: ${this.medianRunTime} ms`;
  }
}
