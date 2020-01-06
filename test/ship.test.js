import Ship from '../src/ship.js';

let positions;
let ship;

beforeEach(() => {
  positions = [88, 89, 90];
  ship = Ship(positions);
});

it('returns its positions', () => {
  expect(ship.positions).toBe(positions);
});

it('returns its length', () => {
  expect(ship.length).toBe(positions.length);
});

it('returns its hits', () => {
  expect(ship.hits).toEqual([]);
});

it('add hits ', () => {
  ship.hit(88);
  expect(ship.hits).toEqual([88]);
});

it('doesnt add hits if already hit in this position', () => {
  ship.hit(88);
  expect(ship.hit(88)).toBeFalsy();
  expect(ship.hits).toEqual([88]);
});

it('doesnt add hits if out of its positions', () => {
  expect(ship.hit(91)).toBeFalsy();
  expect(ship.hits).toEqual([]);
});

it('checks if sunk', () => {
  ship.hit(88);
  expect(ship.isSunk()).toBeFalsy();
  ship.hit(89);
  ship.hit(90);
  expect(ship.isSunk()).toBeTruthy();
});