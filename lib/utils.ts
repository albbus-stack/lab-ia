import Line from "./line";
import Point from "./point";

export function average(numbers: number[]) {
  return numbers.reduce((sum, number) => sum + number, 0) / numbers.length;
}

export function standardDeviation(numbers: number[]) {
  const mean = average(numbers);
  const variance = average(numbers.map((number) => Math.pow(number - mean, 2)));
  return Math.sqrt(variance);
}

export function median(numbers: number[]) {
  const sortedNumbers = numbers.sort((a, b) => a - b);
  const middle = Math.floor(sortedNumbers.length / 2);
  return sortedNumbers[middle];
}

export function getNeighbours(points: Point[], lines: Line[], point: Point) {
  // Filter the lines array to get the neighbors of a given point
  return lines
    .filter((line) => line.pointA === point || line.pointB === point)
    .map((line) => (line.pointA === point ? line.pointB : line.pointA))
    .map((point) => points.indexOf(point));
}

export function isAssignmentValid(
  points: Point[],
  lines: Line[],
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
      lines.some((line) => {
        const pointA = points[i];
        const pointB = points[unassigned];

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

export function getUnassigned(assignments: number[], domains: number[][]) {
  // Find the index of the unassigned point with the smallest domain (Minimum Remaining Values), breaking ties randomly
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

    if (domains[i].length === min && Math.random() < 0.5) {
      min = domains[i].length;
      minIndex = i;
    }
  }

  return minIndex;
}
