def average(numbers):
    return sum(numbers) / len(numbers)

def standard_deviation(numbers):
    mean = average(numbers)
    variance = average([(number - mean) ** 2 for number in numbers])
    return variance ** 0.5

def median(numbers):
    sorted_numbers = sorted(numbers)
    middle = len(sorted_numbers) // 2
    return sorted_numbers[middle]