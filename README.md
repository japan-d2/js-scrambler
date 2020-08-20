# @japan-d2/scrambler

Converts an integer to another integer that is unpredictable and reversible.

# install

```bash
npm install @japan-d2/scrambler
```

or

```bash
yarn add @japan-d2/scrambler
```

# how to use

## find two numbers

1. Decide the number of digits (ex. 4)
2. Decide one **first odd number (n1)** that fits in the number of digits (ex. 1101)
3. Formulate

`1101x - (10^4)y = 1`

4. Enter the formula into [Wolfram|Alpha](https://www.wolframalpha.com/) and get an integer solution

`x = 10000 n + 8901, y = 1101 n + 980, n element Z`

5. Get the **second odd number (n2)**

`8901`

## example

```ts
import { createScrambler } from '@japan-d2/scrambler'

const scrambler = createScrambler({
  digits: 4,
  n1: BigInt(1101),
  n2: BigInt(8901),
  seed: 123456789,
  stages: 10
})

const from = BigInt(1)
const to = scrambler.scramble(from)
const restored = scrambler.restore(to)

console.log({
  from,
  to,
  restored
})
```

### Output

```
{
  from: 1n,
  to: 4055n,
  restored: 1n
}
```

## methods

### createScrambler(options): Scrambler

Return the scrambler.

#### Options

##### digits: number

number of digits in space.

##### n1: number, n2: number

Odd number pair that satisfies `(n1 * n2) % (10 ** digits) === 1`.

##### seed: number

Seed value for swap table creation.

##### stages: number

Number of swap/slide stages.

# license

MIT
