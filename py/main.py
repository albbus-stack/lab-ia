import os
import csv
import time
from lib.forward_checking import ForwardChecking
from lib.map_coloring_graph import MapColoringGraph

ITERATIONS = 100
MAX_N = 10

if not os.path.exists("output"):
    os.mkdir("output")

with open("output/results.csv", "w", newline="") as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerow(["n", "k", "average", "median", "standard deviation"])

    for n in range(2, MAX_N + 1):
        # Generate random instances of map-coloring problems as follows: scatter n points on the unit square; select a point X at random, connect X by a straight line to the nearest point Y such that X is not already connected to Y and the line crosses no other line; repeat the previous step until no more connections are possible. The points represent regions on the map and the lines connect neighbors.

        map_coloring = MapColoringGraph(n)
        map_coloring.plot_grid("output/map_coloring_3_" + str(n) + ".png")

        # Now try to find k-colorings of each map, for both k3 and k4, using backtracking with forward checking

        print("----------- N =", n, "------------")

        for k in [3, 4]:
            backtracking_with_forward_checking = ForwardChecking(map_coloring, k, ITERATIONS)
            backtracking_with_forward_checking.run()

            print("----- Forward Checking K" + str(k) + " -----")
            print(backtracking_with_forward_checking)
            print()

            csv_writer.writerow([
                n,
                k,
                backtracking_with_forward_checking.average_run_time,
                backtracking_with_forward_checking.median_run_time,
                backtracking_with_forward_checking.standard_deviation
            ])
        
        # And backtracking with MAC.

    # Construct a table of average run times for each algorithm for values of n up to the largest you can manage.