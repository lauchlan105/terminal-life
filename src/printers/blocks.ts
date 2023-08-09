import { Cells } from '../engine';

type FontMap = Record<number, string>
interface Nums {
  float: number;
  integer: number;
}

function applyMap(map: FontMap, value: number): string {
  const keysAsNumbers = Object.keys(map).map(key => ({
    float: Number.parseFloat(key),
    integer: Number.parseInt(key)
  }));

  // ascending array is kept moreso just to maintian the a copy
  const ascending = keysAsNumbers.sort((a, b) => b.float - a.float);
  const descending = [...ascending].reverse()

  if (descending.length === 0) {
    throw new Error("Failed to assign value using an empty map")
  }

  const getValue = (nums: Nums) => {
    if (nums.float in map) {
      return map[nums.float]
    }
    if (nums.float in map) {
      return map[nums.float]
    }
    throw new Error(`Invalid map: Couldn't find "${nums.float}" or "${nums.integer}" in map`)
  }

  let nextKey: Record<'integer' | 'float', keyof typeof map>;
  while (descending.length) {
    nextKey = descending.pop()!;
    if (value >= nextKey.float) {
      return getValue(nextKey)
    }
  }

  const lowestKey = ascending[0]
  return getValue(lowestKey)
}

const defaultmap: FontMap = {
  // 0: "  ",
  // 0.25: "░░",
  // 0.5: "▒▒",
  // 0.75: "▓▓",
  0: "  ",
  0.1: "││",
  0.2: "║║",
  0.3: "░░",
  0.5: "▒▒",
  0.75: "▓▓",
  0.9: "██",
  // 0.0: '╚',
  // 0.1: '╩',
  // 0.2: '╬',
  // 0.3: '═',
  // 0.4: '╠',
  // 0.5: '╦',
  // 0.6: '╣',
  // 0.7: '║',
  // 0.8: '╗',
  // 0.9: '╝',
  // 0.0: '╚',
  // 0.1: '╩',
  // 0.2: '╬',
  // 0.3: '═',
  // 0.4: '╠',
  // 0.5: '╦',
  // 0.6: '╣',
  // 0.7: '║',
  // 0.8: '╗',
  // 0.9: '╝',
}

export class BlockPrinter {
  parseCells(cells: Cells): string {
    const chars = cells.map(value => {
      return applyMap(defaultmap, value)
    })

    return chars.join("");
  }
}
