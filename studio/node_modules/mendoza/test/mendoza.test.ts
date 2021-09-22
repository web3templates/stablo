import {applyPatch} from '../src'

test('patches correctly', () => {
  const left = {name: 'Bob Bobson', age: 30, skills: ['Go', 'Patching', 'Playing']}
  const patch = [19, 1, 10, 1, 14, 'firstName', 11, 2, 20, 'Diffing', 21, 0, 2, 15]
  const right = applyPatch(left, patch)
  expect(right).toEqual({firstName: 'Bob Bobson', age: 30, skills: ['Diffing', 'Go', 'Patching']})
})
