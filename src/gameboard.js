import _ from 'lodash';
import Ship from './ship.js';

const GameBoard = () => {
  const ships = [];
  const goodHits = [];
  const shipsPositions = {};
  const invalidPositions = [];
  const missedShotsPositions = [];

  const getNeighbours = (position) => {
    const neighbours = [];
    if (position > 9) neighbours.push(position - 10);
    if (position < 90) neighbours.push(position + 10);
    if (position % 10 > 0) neighbours.push(position - 1);
    if (position % 10 < 9) neighbours.push(position + 1);

    return neighbours;
  };

  const storeInvalid = (positions) => {
    if (positions.length === 1) invalidPositions.push(...positions);
    const neighbours = positions.map((position) => getNeighbours(position));
    invalidPositions.push(..._.flatten(neighbours));
  };

  const isInvalid = (pos) => pos.some((position) => invalidPositions.includes(position));

  const notSequential = (positions) => {
    const sorted = positions.sort();
    const spread = Math.max(...sorted) - Math.min(...sorted);
    return !(
      spread === positions.length - 1 || spread === (positions.length - 1) * 10
    );
  };

  const outOfBound = (positions) => positions.some((pos) => pos < 0 || pos > 99);

  const crossRows = (positions) => {
    const leftColumnElements = positions.filter(
      (position) => position % 10 === 9,
    );
    if (leftColumnElements.length !== 1) return false;
    if (leftColumnElements[0] < Math.max(...positions)) return true;
    return false;
  };

  const notPlaceable = (positions) => {
    if (notSequential(positions)) return true;
    if (outOfBound(positions)) return true;
    if (crossRows(positions)) return true;

    return false;
  };

  const placeShip = (positions) => {
    if (isInvalid(positions)) return false;
    if (notPlaceable(positions)) return false;

    const ship = Ship(positions);
    ships.push(ship);
    positions.forEach((position) => {
      shipsPositions[position] = ship;
    });
    storeInvalid(positions);

    return ships;
  };

  const receiveAttack = (position) => {
    const shipAtPosition = shipsPositions[position];

    if (shipAtPosition) {
      if (shipAtPosition.hit(position)) {
        goodHits.push(position);
        return shipAtPosition;
      }

      return 'invalid';
    }

    if (missedShotsPositions.includes(position)) return 'invalid';
    missedShotsPositions.push(position);

    return 'miss';
  };

  const allShipsSunk = () => ships.every((ship) => ship.isSunk());

  const alreadyShotPositions = () => [...goodHits, ...missedShotsPositions];

  return {
    ships,
    placeShip,
    allShipsSunk,
    receiveAttack,
    alreadyShotPositions,
    missedShotsPositions,
  };
};

export default GameBoard;
