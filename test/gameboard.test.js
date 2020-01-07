import GameBoard from '../src/gameboard.js';

let board;


describe(('#placeShip()'), () => {
  beforeEach(() => {
    board = GameBoard();
  });

  it('places a ship on the board horizontally', () => {
    board.placeShip([87, 88, 89]);
    expect(board.ships[0].positions).toContain(...[87, 88, 89]);
  });

  it('places a ship on the board vertically', () => {
    board.placeShip([9, 19, 29]);
    expect(board.ships[0].positions).toContain(...[9, 19, 29]);
  });

  it('does not place a ship if position is occupied', () => {
    board.placeShip([87, 88, 89]);
    const res = board.placeShip([87, 88]);

    expect(res).toBeFalsy();
    expect(board.ships.length).toBe(1);
  });

  it('does not place a ship if position too close to another ship', () => {
    board.placeShip([87, 88, 89]);
    const res = board.placeShip([98, 99]);

    expect(res).toBeFalsy();
    expect(board.ships.length).toBe(1);
  });

  it('considers the edge of the board', () => {
    board.placeShip([87, 88, 89]);
    const res = board.placeShip([90, 91]);

    expect(res).toBeTruthy();
    expect(board.ships.length).toBe(2);
  });

  it('doesnt add ship with non-sequential positions', () => {
    expect(board.placeShip([2, 3, 5, 6])).toBeFalsy();
    expect(board.placeShip([20, 30, 50, 60])).toBeFalsy();
    expect(board.placeShip([2, 3, 4, 5])).toBeTruthy();
    expect(board.placeShip([8, 18, 28, 38])).toBeTruthy();
  });

  it('doesnt add ship if positions contain out of bound position', () => {
    expect(board.placeShip([99, 100])).toBeFalsy();
    expect(board.placeShip([-1, 0])).toBeFalsy();
  });

  it('doesnt add ship across two rows', () => {
    expect(board.placeShip([9, 10, 11])).toBeFalsy();
    expect(board.placeShip([99, 100])).toBeFalsy();
  });
});

describe(('#receiveAttack()'), () => {
  beforeEach(() => {
    board = GameBoard();
    board.placeShip([0, 1, 2, 3]);
  });

  it('adds the missed shots to the missed shots positions', () => {
    board.receiveAttack(4);
    expect(board.missedShotsPositions).toContain(4);
  });

  it('calls ship.hit() if position is where a ship is at!', () => {
    board.receiveAttack(3);
    expect(board.ships[0].hits).toContain(3);
  });

  it('returns invalid if the position was shot before!', () => {
    board.receiveAttack(3);

    expect(board.receiveAttack(3)).toBe('invalid');
  });

  it('returns the ship object if the position was a successful hit!', () => {
    const feedback = board.receiveAttack(3);

    expect(feedback.length).toEqual(4);
    expect(feedback.positions).toEqual([0, 1, 2, 3]);
  });

  it('returns miss if the position is not occupied by a ship', () => {
    expect(board.receiveAttack(4)).toBe('miss');
  });
});


describe('#allShipsSunk()', () => {
  beforeEach(() => {
    board = GameBoard();
    board.placeShip([0, 1, 2]);
    board.placeShip([79, 89, 99]);

    [0, 1, 2].forEach((p) => { board.receiveAttack(p); });
  });

  it('returns true if all ships were sunk', () => {
    [79, 89, 99].forEach((p) => { board.receiveAttack(p); });
    expect(board.allShipsSunk()).toBeTruthy();
  });

  it('returns false if any ship is still not sunk', () => {
    expect(board.allShipsSunk()).toBeFalsy();
  });
});