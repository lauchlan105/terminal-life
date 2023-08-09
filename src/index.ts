import { Command } from 'commander';
import figlet from 'figlet';
import { Cells, Engine } from './engine';
import { BlockPrinter } from './printers/blocks';

//add the following line
const program = new Command();

program
  .option("-t, --time  [value]", "Time per generation (ms)")
  .option("-g, --generations  [value]", "Total number of generations (default: infinite)")
  .parse(process.argv);

function clamp(value: number, max: number) {
  return (value + max) % max;
}

function getNeighbours(origin: number, radius: number, cells: Cells, thresholdMin: number, thresholdMax: number): Cells {  
  const neighbours = cells.filter((value, index) => {
    const distance = Math.abs(index - origin)
    if (distance === 0) return false
    if (distance <= radius) {
      if (value >= thresholdMin && value <= thresholdMax) {
        return true
      }
    }

    return false
  })

  return neighbours
}

const options = program.opts();
const printer = new BlockPrinter()
const engine = new Engine({
  maxGenerations: options.generations ?? Infinity,
  size: process.stdout.columns / 2,
  lifespan: 30,
  generate: (cells) => {
    return cells.map((cell, index) => {
      const nbrs = getNeighbours(index, 2, cells, 0.5, 1).length
      if (cell > 5) cell = 0.5
      if (nbrs === 0) return 0.5
      if (nbrs === 1) return cell * 0.8
      if (nbrs === 2) return cell * 1.1
      if (nbrs === 3) return cell * 1.5
      if (nbrs === 4) return cell * 1.8
      return cell
    })
  },
})

const ticker$ = engine.start();
ticker$.subscribe({
  next: ({ cells }) => {
    console.log(`${printer.parseCells(cells)}`)
  },
  complete: () => {
    process.exit(0)
  }
})
