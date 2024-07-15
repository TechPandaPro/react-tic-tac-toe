import { useState } from "react";

function Square({ value, winner, onSquareClick }) {
  const className = `square ${winner ? `winner` : ``}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if (xIsNext) nextSquares[i] = "X";
    else nextSquares[i] = "O";
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) status = `Winner: ${winner.winner}`;
  else if (squares.every((square) => square)) status = `It's a draw!`;
  else status = `Next player: ${xIsNext ? "X" : "O"}`;

  const boardRows = Array(3)
    .fill()
    .map((_, i) => (
      <div key={i} className="board-name">
        {Array(3)
          .fill()
          .map((_, j) => {
            const squareNum = 3 * i + j;
            return (
              <Square
                key={squareNum}
                value={squares[squareNum]}
                winner={(winner?.line ?? []).includes(squareNum)}
                onSquareClick={() => handleClick(squareNum)}
              />
            );
          })}
      </div>
    ));

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: i },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleToggleClick() {
    setAscending(!ascending);
  }

  const moves = history.map(({ location: rawLocation }, move) => {
    const row = Math.floor(rawLocation / 3) + 1;
    const col = rawLocation % 3;
    const location = rawLocation === null ? "" : `(${row}, ${col})`;

    const description =
      move > 0 ? `Go to move #${move} ${location}` : "Go to game start";

    if (move === currentMove)
      return (
        <li key={move}>
          You are at move #{move} {location}
        </li>
      );
    else
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
  });

  if (!ascending) moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={handleToggleClick}>Toggle Sorting Order</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
