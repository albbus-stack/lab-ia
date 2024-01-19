# lab-ia

## File Structure

- `main.ts` is the test program.
- `plot.py` is the map plotting script.
- `plot-times.py` is the execution time plotting script.
- `lib/` contains the source code for the map generation algorithm and the two coloring algorithms with Forward Checking and Maintaining Arc Consistency.
- `output/` will contain the output of the algorithms in various data files and plots.

## How to run

###### Requirements

- Node.js
- npm
- *Python 3 (only if you want to plot the example data & execution times)*

###### Testing

1. Clone the repository.
1. Install `typescript` and `tsx` (a typescript runner) with `npm install`.
1. Run `npm run start` to execute the test program.

###### Plotting

1. Install `matplotlib` (used to display the map graphs) with `python3 -m pip install -r requirements.txt`.
1. Run `npm run plot` to plot the example data computed by Node.js using Python.
1. Run `npm run plot-times` to plot the median execution times of the two algorithms usign Python.
