from matplotlib import pyplot as plt
import os

class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    # Returns the distance between two points
    def get_distance(self, point):
        return ((self.x - point.x) * 2 + (self.y - point.y) * 2) ** 0.5

    def __str__(self):
        return f"({self.x}, {self.y})"

class Line:
    def __init__(self, pointA: Point, pointB: Point):
        self.pointA = pointA
        self.pointB = pointB

    # Checks if two lines are equal
    def is_equal(self, line):
        return (
            (self.pointA.x == line.pointA.x and
             self.pointA.y == line.pointA.y and
             self.pointB.x == line.pointB.x and
             self.pointB.y == line.pointB.y) or
            (self.pointA.x == line.pointB.x and
             self.pointA.y == line.pointB.y and
             self.pointB.x == line.pointA.x and
             self.pointB.y == line.pointA.y)
        )

    def _orientation(self, p, q, r):
        val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
        if val == 0:
            # Collinear
            return 0
        
        # Clockwise or counterclockwise
        return 1 if val > 0 else 2

    def _on_segment(self, p, q, r):
        return (q.x < max(p.x, r.x) and q.x > min(p.x, r.x) and
                q.y < max(p.y, r.y) and q.y > min(p.y, r.y))

    def is_crossing(self, line):
        p1, q1 = self.pointA, self.pointB
        p2, q2 = line.pointA, line.pointB

        o1 = self._orientation(p1, q1, p2)
        o2 = self._orientation(p1, q1, q2)
        o3 = self._orientation(p2, q2, p1)
        o4 = self._orientation(p2, q2, q1)

        if o1 != o2 and o3 != o4:
            if (o1 == 0 and not self._on_segment(p2, p1, q1)) or (o2 == 0 and not self._on_segment(q2, p1, q1)):
                return False
            return True

        if o1 == 0 and self._on_segment(p1, p2, q1):
            return True

        if o2 == 0 and self._on_segment(p1, q2, q1):
            return True

        if o3 == 0 and self._on_segment(p2, p1, q2):
            return True

        if o4 == 0 and self._on_segment(p2, q1, q2):
            return True

        return False

    def __str__(self):
        return f"{str(self.pointA)} -> {str(self.pointB)}"

def plot_grid(points, lines, filename, colors = None):
    plt.figure(figsize=(10, 10))
    plt.axis('off')

    for line in lines:
        plt.plot([line.pointA.x, line.pointB.x], [line.pointA.y, line.pointB.y], color='black')
        plt.text((line.pointA.x + line.pointB.x) / 2, (line.pointA.y + line.pointB.y) / 2, str(lines.index(line)), fontsize=12)

    for index, point in enumerate(points):
        plt.plot(point.x, point.y, 'o', color='black' if not colors else colors[index])
        plt.text(point.x, point.y, str(points.index(point)), fontsize=12)

    plt.savefig(filename, bbox_inches='tight')
    plt.close()

for file in os.listdir("output"):
    if file.startswith("map") and file.endswith(".png"):
        os.remove("output/" + file)

with open("output/maps.txt", "r") as maps_file:
    colors = ['red', 'blue', 'green', 'yellow']
    lines = maps_file.readlines()
    i = 0

    while i != len(lines):
        points = []
        lines_list = []
        assignments_k3 = []
        assignments_k4 = []

        if lines == "\n":
            continue
        
        if lines[i].strip() == "Points:":
            i += 1
            while lines[i].strip() != "Lines:":
                points.append(Point(float(lines[i].split(",")[0].strip()[1:]), float(lines[i].split(",")[1].strip()[:-1])))
                i += 1
            
            i += 1
            while "FC Assignments K3:" not in lines[i].strip():
                lines_list.append(Line(Point(
                    float(lines[i].split("->")[0].strip()[1:].split(",")[0]), float(lines[i].split("->")[0].strip()[1:].split(",")[1].strip()[:-1])),
                    Point(float(lines[i].split("->")[1].strip()[1:].split(",")[0]), float(lines[i].split("->")[1].strip()[1:].split(",")[1].strip()[:-1]))))
                i += 1
            
            v = lines[i].strip().split(":")[1].split(",")
            assignments_k3_fc = list(map(int, v if v != [''] else []))
            i += 1
            v = lines[i].strip().split(":")[1].split(",")
            assignments_k3_mac = list(map(int, v if v != [''] else []))
            i += 1
            v = lines[i].strip().split(":")[1].split(",")
            assignments_k4_fc = list(map(int, v if v != [''] else []))
            i += 1
            v = lines[i].strip().split(":")[1].split(",")
            assignments_k4_mac = list(map(int, v if v != [''] else []))

        if points:
            if len(assignments_k3_fc) != 0:
                plot_grid(points, lines_list, "output/map_coloring_" + str(len(points)) + "_3" + "_forward_checking.png", [colors[assignment] for assignment in assignments_k3_fc])

            if len(assignments_k4_fc) != 0:
                plot_grid(points, lines_list, "output/map_coloring_" + str(len(points)) + "_4" + "_forward_checking.png", [colors[assignment] for assignment in assignments_k4_fc])

            if len(assignments_k3_mac) != 0:
                plot_grid(points, lines_list, "output/map_coloring_" + str(len(points)) + "_3" + "_arc_consistency.png", [colors[assignment] for assignment in assignments_k3_mac])

            if len(assignments_k4_mac) != 0:
                plot_grid(points, lines_list, "output/map_coloring_" + str(len(points)) + "_4" + "_arc_consistency.png", [colors[assignment] for assignment in assignments_k4_mac])

        i += 1
