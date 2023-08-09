import { Cells } from '../engine';

export interface Printer {
  parseCells(cells: Cells): string
}
