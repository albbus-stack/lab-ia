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

    def is_crossing(self, line, i=0, j=0, k=0, l=0):
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