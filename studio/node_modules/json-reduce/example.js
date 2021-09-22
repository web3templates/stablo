import reduce from './src/reduce'

const document = {
  first: 1,
  second: 2,
  deep: {
    array: [3, 4, 5, 6],
    seven: 7
  }
}

const result = reduce(
  document,
  (acc, value, path) => (typeof value === 'number' ? acc + value : acc),
  0
)

console.log(result) // Prints out 28
