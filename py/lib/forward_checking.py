import time
import copy
from typing import List
from lib.map_coloring_graph import MapColoringGraph 
from lib.utils import average, median, standard_deviation  

class ForwardChecking:
    def __init__(self, mcg: MapColoringGraph, k: int,  iterations: int):
        self.map_coloring_graph = mcg
        self.k = k
        self.average_run_time = 0
        self.standard_deviation = 0
        self.median_run_time = 0
        self.iterations = iterations
        self.assignments = []

    def run(self):
        times = []

        for _ in range(self.iterations):
            start = time.perf_counter()
            self.backtrack()
            end = time.perf_counter()
            times.append(end - start)

        self.average_run_time = average(times)
        self.standard_deviation = standard_deviation(times)
        self.median_run_time = median(times)

        self.plot_solution()

    def backtrack(self):
        domains = []
        assignments = []

        for _ in range(self.map_coloring_graph.n):
            domains.append(list(range(self.k)))
            assignments.append(-1)

        res = self.backtrack_with_forward_checking(assignments, domains)
        if res:
            self.assignments = assignments
            # print(assignments)
            # print("Solution found")
        # else:
            # print("No solution found")

    def backtrack_with_forward_checking(self, assignments: List[int], domains: List[List[int]]):
        if all(assignment != -1 for assignment in assignments):
            return True

        unassigned = self.get_unassigned(assignments)

        # print(assignments, domains)

        for value in domains[unassigned]:
            temp_domains = [list(domain) for domain in domains]
            assignments[unassigned] = value
            domains[unassigned] = [value]

            for i in range(len(assignments)):
                if assignments[i] != -1 or i == unassigned:
                    continue

                domains[i] = [domain_value for domain_value in domains[i] if
                              self.is_assignment_valid(assignments, i, domain_value)]

            if self.backtrack_with_forward_checking(assignments, domains):
                return True

            assignments[unassigned] = -1
            domains = temp_domains

        return False

    def get_unassigned(self, assignments: List[int]):
        for i, assignment in enumerate(assignments):
            if assignment == -1:
                return i
        return -1

    def is_assignment_valid(self, assignments: List[int], unassigned: int, value: int):
        for i in range(len(assignments)):
            if assignments[i] == -1 or i == unassigned:
                continue

            if any(line.pointA == self.map_coloring_graph.points[i] and line.pointB == self.map_coloring_graph.points[unassigned] or
                   line.pointA == self.map_coloring_graph.points[unassigned] and line.pointB == self.map_coloring_graph.points[i]
                   for line in self.map_coloring_graph.lines) and assignments[i] == value:
                return False

        return True

    def plot_solution(self):
        colors = ['red', 'blue', 'green', 'yellow']
        color_assignments = []

        for i in range(len(self.assignments)):
            color_assignments.append(colors[self.assignments[i]])

        print(color_assignments)

        self.map_coloring_graph.plot_grid("output/map_coloring_" + str(self.map_coloring_graph.n) + "_" + str(self.k) + "_forward_checking.png", color_assignments)


    def __str__(self):
        return f"Average run time: {self.average_run_time} s\nStandard deviation: {self.standard_deviation} s\nMedian run time: {self.median_run_time} s"
