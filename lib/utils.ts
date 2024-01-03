export function average(numbers) {
  return numbers.reduce((sum, number) => sum + number, 0) / numbers.length;
}

export function standardDeviation(numbers) {
  const mean = average(numbers);
  const variance = average(numbers.map((number) => Math.pow(number - mean, 2)));
  return Math.sqrt(variance);
}

export function median(numbers) {
  const sortedNumbers = numbers.sort((a, b) => a - b);
  const middle = Math.floor(sortedNumbers.length / 2);
  return sortedNumbers[middle];
}
