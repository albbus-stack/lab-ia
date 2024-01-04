class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    # Returns the distance between two points
    def get_distance(self, point):
        return ((self.x - point.x) * 2 + (self.y - point.y) * 2) ** 0.5

    def __str__(self):
        return f"({self.x}, {self.y})"