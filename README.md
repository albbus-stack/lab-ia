# lab-ia

## File Structure

- `main.ts` is the test program.
- `plot-examples.py` is the map plotting script for the example problems.
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
1. Run `npm run test` to execute the test program.

###### Plotting

1. Install `matplotlib` (used to display the map graphs) with `python3 -m pip install -r requirements.txt`.
1. Run `npm run plot-examples` to plot the colored example map graphs computed by Node.js using Python.
1. Run `npm run plot-times` to plot the average/median execution times & the average number of backtracks of the two algorithms using Python.
1. Run `npm run plot` to execute sequentially the two previous commands.

## Results

All the results of the tests are stored in the `output/` directory as follows:

- `times.csv` contains the output data with average/median execution times & the average number of backtracks for the two algorithms and k values.
- `maps.txt` contains a serialized version of the maps for the example problems with their coloring, if solvable.

If you plot the data, the results will be stored in the following subdirectories:

- `graphs/` contains the colored graphs for the example problems, if solvable.
- `times/` contains the plots of the average/median execution times & the average number of backtracks for the two algorithms and k values.
