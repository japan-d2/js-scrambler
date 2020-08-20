export type Scrambler = {
  scramble: (n: bigint) => bigint;
  restore: (n: bigint) => bigint;
}

export type ScramblerInput = {
  digits: number;
  n1: bigint;
  n2: bigint;
  stages: number;
  seed: number;
}

function array (length: number): undefined[] {
  return new Array(length).fill(undefined)
}

export function generateTables (length: number, stages: number, seed: number): number[][] {
  let y = seed

  const generatePseudoRandom = (): number => {
    y = y ^ (y << 13)
    y = y ^ (y >> 17)
    y = y ^ (y << 15)

    return y
  }

  return array(stages).map(() => {
    const numbers = array(length).map(() => generatePseudoRandom())

    return numbers.map((n, i) => [n, i]).sort(([a], [b]) => a - b).map(([, n]) => n)
  })
}

export function splitDigits (n: bigint, digits: number): number[] {
  const d: number[] = []

  while (n >= 1) {
    d.unshift(Math.floor(Number(n % BigInt(10))))
    n = n / BigInt(10)
  }

  while (d.length < digits) {
    d.unshift(0)
  }

  return d
}

export function joinDigits (digits: number[]): bigint {
  return digits
    .map((n, i) => n * 10 ** (digits.length - i - 1))
    .reduce((a, b) => a + BigInt(b), BigInt(0))
}

export function swapDigits (digits: number[], table: number[]): number[] {
  return digits
    .map((c, i) => [table[i], c])
    .sort(([a], [b]) => a - b)
    .map(([, n]) => n)
}

export function slideDigits (digits: number[], table: number[], multiplier: number): number[] {
  return digits
    .map((c, i) => (c + (table[i] * multiplier) + 10) % 10)
}

export function restoreSwapDigits (data: number[], table: number[]): number[] {
  return data
    .map((c, i) => [i, c])
    .sort(([a], [b]) => table.indexOf(a) - table.indexOf(b))
    .map(([, n]) => n)
}

export function createScrambler ({ digits, n1, n2, seed, stages }: ScramblerInput): Scrambler {
  const modulo = BigInt(10) ** BigInt(digits)

  if (n1 * n2 % modulo !== BigInt(1)) {
    throw new Error('invalid number pair')
  }

  const tables = generateTables(digits, stages, seed)

  return {
    scramble (n): bigint {
      for (const table of tables) {
        const multiplied = splitDigits(n * n1 % modulo, digits)
        const swapped = swapDigits(multiplied, table)
        const slided = slideDigits(swapped, table, 1)
        n = joinDigits(slided)
      }

      return n
    },
    restore (n): bigint {
      for (const table of [...tables].reverse()) {
        const slideRestored = slideDigits(splitDigits(n, digits), table, -1)
        const swapRestored = restoreSwapDigits(slideRestored, table)
        n = joinDigits(swapRestored) * n2 % modulo
      }

      return n
    }
  }
}
