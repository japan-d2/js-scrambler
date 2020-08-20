/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable node/no-unpublished-import */

import { createScrambler, splitDigits, joinDigits, swapDigits, restoreSwapDigits } from '../src/index'

describe('createScrambler', () => {
  describe('5 digit or less', () => {
    describe('scramble', () => {
      it('should returns bigint', () => {
        const scrambler = createScrambler({
          digits: 4,
          n1: BigInt(1101),
          n2: BigInt(8901),
          seed: 123456789,
          stages: 10
        })
        expect(scrambler.scramble(BigInt(1))).toBe(BigInt(4055))
      })

      it('should bijection', () => {
        for (let x = 2; x < 6; x++) {
          const scrambler = createScrambler({
            digits: x,
            n1: BigInt('9'),
            n2: BigInt('8'.repeat(x - 1) + '9'),
            seed: 713947652327,
            stages: 1
          })
          const modulo = 10 ** x

          const table = new Set(new Array(modulo).fill(0).map((_, i) => scrambler.scramble(BigInt(i))))

          expect(table.size).toBe(modulo)
        }
      })
    })

    describe('restore', () => {
      it('should restorable', () => {
        for (let x = 2; x < 10; x++) {
          const scrambler = createScrambler({
            digits: x,
            n1: BigInt('9'),
            n2: BigInt('8'.repeat(x - 1) + '9'),
            seed: 713947652327,
            stages: 1
          })

          const source = new Array(x).fill(0).map((_, i) => BigInt(10) ** BigInt(i))
          const scrambled = source.map((n) => scrambler.scramble(n))
          const restored = scrambled.map((n) => scrambler.restore(n))

          expect(restored).toEqual(source)
        }
      })
    })
  })

  describe('6 digit or more', () => {
    describe('restore', () => {
      it('should restorable', () => {
        for (let x = 6; x < 100; x++) {
          const scrambler = createScrambler({
            digits: x,
            n1: BigInt('9'),
            n2: BigInt('8'.repeat(x - 1) + '9'),
            seed: 713947652327,
            stages: 1
          })

          const source = new Array(x).fill(0).map((_, i) => BigInt(10) ** BigInt(i))
          const scrambled = source.map((n) => scrambler.scramble(n))
          const restored = scrambled.map((n) => scrambler.restore(n))

          expect(restored).toEqual(source)
        }
      })
    })
  })
})

describe('splitDigits', () => {
  it('should split digits from bigint', () => {
    expect(splitDigits(BigInt(12345678), 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('should be zero-filled if not enough digits', () => {
    expect(splitDigits(BigInt(123456), 8)).toEqual([0, 0, 1, 2, 3, 4, 5, 6])
  })
})

describe('joinDigits', () => {
  it('should join digits to bigint', () => {
    expect(joinDigits([1, 2, 3, 4, 5, 6, 7, 8])).toBe(BigInt(12345678))
  })
  it('should skip leading 0', () => {
    expect(joinDigits([0, 0, 1, 2, 3, 4, 5, 6])).toBe(BigInt(123456))
  })
})

describe('swapDigits and restoreSwapDigits', () => {
  const table = [5, 4, 0, 7, 2, 6, 3, 1]

  describe('swapDigits', () => {
    it('should swap position of digit', () => {
      expect(swapDigits([1, 2, 3, 4, 5, 6, 7, 8], table)).toEqual([3, 8, 5, 7, 2, 1, 6, 4])
    })
  })

  describe('restoreSwapDigits', () => {
    it('should restore position of swapped digit', () => {
      expect(restoreSwapDigits([3, 8, 5, 7, 2, 1, 6, 4], table)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    })
  })
})
