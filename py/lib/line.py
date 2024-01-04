from lib.point import Point

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

    # Checks if two lines are crossing
    def is_crossing(self, line):
        denominator = (self.pointB.y - self.pointA.y) * (line.pointB.x - line.pointA.x) - \
                      (self.pointB.x - self.pointA.x) * (line.pointB.y - line.pointA.y)

        if denominator == 0:
            return False

        ua = ((self.pointB.x - self.pointA.x) * (line.pointA.y - self.pointA.y) -
              (self.pointB.y - self.pointA.y) * (line.pointA.x - self.pointA.x)) / denominator
        ub = ((line.pointB.x - line.pointA.x) * (line.pointA.y - self.pointA.y) -
              (line.pointB.y - self.pointA.y) * (line.pointA.x - self.pointA.x)) / denominator

        return 0 <= ua <= 1 and 0 <= ub <= 1

    def __str__(self):
        return f"{str(self.pointA)} -> {str(self.pointB)}"