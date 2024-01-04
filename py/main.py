import os
import csv
import time
from lib.forward_checking import ForwardChecking
from lib.map_coloring_graph import MapColoringGraph

ITERATIONS = 100
MAX_N = 100

if not os.path.exists("output"):
    os.mkdir("output")

with open("output/results.csv", "w", newline="") as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerow(["n", "k", "average", "median", "standard deviation"])

    for n in range(MAX_N):
        # Generate random instances of map-coloring problems
        map_coloring_3 = MapColoringGraph(n, 3)
        map_coloring_4 = MapColoringGraph(n, 4)

        print("----------- N =", n, "------------")

        for map_coloring in [map_coloring_3, map_coloring_4]:
            backtracking_with_forward_checking = ForwardChecking(map_coloring, ITERATIONS)
            backtracking_with_forward_checking.run()

            print("----- Forward Checking K" + str(map_coloring.k) + " -----")
            print(backtracking_with_forward_checking)
            print()

            csv_writer.writerow([
                n,
                map_coloring.k,
                backtracking_with_forward_checking.average_run_time,
                backtracking_with_forward_checking.median_run_time,
                backtracking_with_forward_checking.standard_deviation
            ])