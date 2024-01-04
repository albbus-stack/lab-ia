import * as fs from "fs";
import ForwardChecking from "./lib/forward-checking";
import MapColoringGraph from "./lib/map-coloring-graph";

const ITERATIONS = 100;
const MAX_N = 10;

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

const csv = fs.createWriteStream("output/results.csv", {
  flags: "w",
});
csv.write("n,k,average,median,standard deviation\n");

for (let n = 2; n < MAX_N; n++) {
  // Generate random instances of map-coloring problems as follows: scatter n points on the unit square; select a point X at random, connect X by a straight line to the nearest point Y such that X is not already connected to Y and the line crosses no other line; repeat the previous step until no more connections are possible. The points represent regions on the map and the lines connect neighbors.

  const mapColoring = new MapColoringGraph(n);
  // console.log(mapColoring.toString());

  // Now try to find k-colorings of each map, for both k3 and k4, using backtracking with forward checking

  console.log("----------- N = " + n + " ------------");

  for (let k of [3, 4]) {
    const backtrackingWithForwardChecking = new ForwardChecking(
      mapColoring,
      k,
      ITERATIONS
    );

    backtrackingWithForwardChecking.run();

    console.log("----- Forward Checking K" + k + " -----");
    console.log(backtrackingWithForwardChecking.toString());
    console.log();

    csv.write(
      `${n},${k},${backtrackingWithForwardChecking.averageRunTime},${backtrackingWithForwardChecking.medianRunTime},${backtrackingWithForwardChecking.standardDeviation}\n`
    );
  }

  // And backtracking with MAC.
}

// Construct a table of average run times for each algorithm for values of n up to the largest you can manage.

csv.end();
