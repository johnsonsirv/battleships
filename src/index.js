import './scss/battleship.scss';
import UI from './gameui';
import GameBoard from './gameboard';
import AI from './ai';

let gameOver = false;
UI.generateBoard();

// Place ships on waters
const humanWaters = GameBoard();
const computerWaters = GameBoard();

const humanShips = [
  [15, 16, 17, 18, 19],
  [48, 58, 68, 78, 88],
  [22, 23, 24, 25],
  [60, 61, 62, 63],
  [31, 32, 33, 34],
  [97, 98, 99],
  [1, 2, 3, 4],
  [80, 90],
  [75],
  [55],
];

const computerShips = [
  [17, 27, 37, 47, 57],
  [31, 32, 33, 34, 35],
  [22, 23, 24, 25],
  [5, 6, 7, 8],
  [76, 77, 78, 79],
  [82, 83, 84],
  [45, 46, 47],
  [9, 19],
  [11],
  [39],
];

computerShips.forEach((ship) => {
  computerWaters.placeShip(ship);
});

humanShips.forEach((ship) => {
  humanWaters.placeShip(ship);
});

UI.renderShips({ id: 'human', ships: humanWaters.ships.map((ship) => ship.positions) });

const processPlayFeedback = ({ player, position, feedback }) => {
  const id = player === 'human' ? 'computer' : 'human';
  const root = document.querySelector(`#${id}`);

  if (typeof feedback === 'object') {
    if (feedback.isSunk()) {
      feedback.positions.forEach((pos) => {
        root.querySelector(`[data-id="${pos}"]`).classList.add('sunk');
      });
    }
    root.querySelector(`[data-id="${position}"]`).classList.add('hit');
  } else if (feedback === 'miss') {
    root.querySelector(`[data-id="${position}"]`).classList.add(feedback);
  }

  // Check game won?
  if (humanWaters.allShipsSunk()) {
    gameOver = true;
    UI.gameOver({ winner: 'computer' });
  }
  if (computerWaters.allShipsSunk()) {
    gameOver = true;
    UI.gameOver({ winner: 'human' });
  }
};

// Add event listeners
const eventListener = () => {
  const root = document.querySelector('#computer');
  const boxes = root.querySelectorAll('div');

  const handleClick = (e) => {
    if (gameOver) return;
    const position = e.target.getAttribute('data-id');
    const feedback = computerWaters.receiveAttack(Number(position));

    if (feedback !== 'invalid' && feedback !== 'hit') {
      processPlayFeedback({ player: 'human', position, feedback });

      // Pass turn to computer if game not over
      if (!humanWaters.allShipsSunk() && feedback === 'miss') {
        let isTurnOver = false;

        while (!isTurnOver) {
          const position = AI.pickPosition(humanWaters.alreadyShotPositions());
          const feedback = humanWaters.receiveAttack(position);
          processPlayFeedback({ player: 'computer', position, feedback });

          if (feedback === 'miss') isTurnOver = true;
        }
      }
    }
  };

  boxes.forEach((box) => {
    box.addEventListener('click', (e) => handleClick(e));
  });
};

eventListener();
