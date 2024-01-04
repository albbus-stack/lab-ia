import random
from lib.point import Point
from lib.line import Line
import matplotlib.pyplot as plt

class MapColoringGraph:
    def __init__(self, n: int):
        self.n = n
        self.points = []
        self.lines = []
        self.generate_map()

    def generate_map(self):
        self.points = []
        self.lines = []

        # Scatter n points on the unit square
        for i in range(self.n):
            self.points.append(Point(random.random(), random.random()))

        while self.are_valid_lines_available():
            # Select a point X at random
            random_point = random.choice(self.points)

            nearest_point = None
            nearest_point_distance = complex('inf')
            visited_points = []
            
            while self.are_valid_lines_available_from(random_point):
                # Connect X by a straight line to the nearest point Y
                for point in self.points:
                    if point == random_point or point in visited_points:
                        continue

                    distance = random_point.get_distance(point)

                    if abs(distance) < abs(nearest_point_distance):
                        nearest_point = point
                        nearest_point_distance = distance

                if not nearest_point:
                    break

                # Such that X is not already connected to Y and the line crosses no other line (is valid)
                new_line = Line(random_point, nearest_point)
                if self.is_line_valid(new_line):
                    self.lines.append(new_line)
                    break

                visited_points.append(nearest_point)
                nearest_point = None
                nearest_point_distance = complex('inf')

    # Checks if a line is valid (not crossing any other line and not equal to any other line)
    def is_line_valid(self, line):
        return not any(existing_line.is_equal(line) or existing_line.is_crossing(line) for existing_line in self.lines)

    # From a given point, checks if there are any valid lines available
    def are_valid_lines_available_from(self, point):
        available_points = [available_point for available_point in self.points
                            if available_point != point and self.is_line_valid(Line(point, available_point))]

        return len(available_points) > 0

    # Checks if there are any valid lines available from any point
    def are_valid_lines_available(self):
        return any(self.are_valid_lines_available_from(point) for point in self.points)

    def plot_grid(self, filename):
        plt.figure(figsize=(10, 10))
        plt.axis('off')

        for line in self.lines:
            plt.plot([line.pointA.x, line.pointB.x], [line.pointA.y, line.pointB.y], color='black')
            plt.text((line.pointA.x + line.pointB.x) / 2, (line.pointA.y + line.pointB.y) / 2, str(self.lines.index(line)), fontsize=12)

        for point in self.points:
            plt.plot(point.x, point.y, 'o', color='black')
            plt.text(point.x, point.y, str(self.points.index(point)), fontsize=12)

        plt.savefig(filename, bbox_inches='tight')

    # Displays the map coloring graph as a string
    def __str__(self):
        points_str = "\n  ".join(map(str, self.points))
        lines_str = "\n  ".join(map(str, self.lines))
        return f"\nPoints:\n  {points_str}\nLines:\n  {lines_str}"