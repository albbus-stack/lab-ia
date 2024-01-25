import * as fs from "fs";
import ForwardChecking from "./lib/forward-checking";
import MapColoringGraph from "./lib/map-coloring-graph";
import ArcConsistency from "./lib/arc-consistency";

const N_INSTANCES = 20;
const DIMENSIONS = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40 /*50, 60, 80, 100,*/,
];

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

const timesCsv = fs.createWriteStream("output/times.csv", {
  flags: "w",
});
timesCsv.write(
  "algorithm,n,k,average,median,standard deviation,average backtracks\n"
);

const mapsData = fs.createWriteStream("output/maps.txt", {
  flags: "w",
});

for (let n of DIMENSIONS) {
  // Generate random instances of map-coloring problems as follows: scatter n points on the unit square; select a point X at random, connect X by a straight line to the nearest point Y such that X is not already connected to Y and the line crosses no other line; repeat the previous step until no more connections are possible. The points represent regions on the map and the lines connect neighbors.
  const mapColoringGraphs = Array.from(Array(N_INSTANCES).keys()).map(
    (_) => new MapColoringGraph(n)
  );
  const exampleMapColoring = mapColoringGraphs[0];

  console.log("----------- N = " + n + " ------------");

  // Write an example map to the maps file
  mapsData.write(exampleMapColoring.toString());

  // Now try to find k-colorings of each map, for both k3 and k4
  for (let k of [3, 4]) {
    // Using backtracking with forward checking
    const backtrackingWithForwardChecking = new ForwardChecking(
      mapColoringGraphs,
      k
    );
    backtrackingWithForwardChecking.run();

    console.log("----- Forward Checking K" + k + " -----");
    console.log(backtrackingWithForwardChecking.toString() + "\n");

    // Write the assignments for the example map to the maps file
    mapsData.write(
      "FC Assignments K" +
        k +
        ":" +
        backtrackingWithForwardChecking.exampleAssignments.toString() +
        "\n"
    );

    timesCsv.write(
      `fc,${n},${k},${backtrackingWithForwardChecking.averageRunTime},${backtrackingWithForwardChecking.medianRunTime},${backtrackingWithForwardChecking.standardDeviation},${backtrackingWithForwardChecking.backtracks}\n`
    );

    // And backtracking with MAC.
    const backtrackingWithArcConsistency = new ArcConsistency(
      mapColoringGraphs,
      k
    );
    backtrackingWithArcConsistency.run();

    console.log("----- Arc Consistency K" + k + " -----");
    console.log(backtrackingWithArcConsistency.toString() + "\n");
    mapsData.write(
      "MAC Assignments K" +
        k +
        ":" +
        backtrackingWithArcConsistency.exampleAssignments.toString() +
        "\n"
    );

    timesCsv.write(
      `mac,${n},${k},${backtrackingWithArcConsistency.averageRunTime},${backtrackingWithArcConsistency.medianRunTime},${backtrackingWithArcConsistency.standardDeviation},${backtrackingWithArcConsistency.backtracks}\n`
    );
  }
}

// Construct a table of average run times for each algorithm for values of n up to the largest you can manage.
timesCsv.end();
mapsData.end();
