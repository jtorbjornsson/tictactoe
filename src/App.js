import React, { Component } from "react";
import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  const className = isWinningSquare ? "square-winning" : "square";

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(y, x) {
    if (calculateWinner(squares) || squares[y][x]) {
      return;
    }
    const nextSquares = squares
      .map((squareRow, i) => squareRow.slice())
      .slice();
    nextSquares[y][x] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner is: " + winner;
  } else {
    status = "Next turn: " + (xIsNext ? "X" : "O");
  }

  function renderRow(rowIndex) {
    const row = [];
    for (let colIndex = 0; colIndex < squares[rowIndex].length; colIndex++) {
      const winningSquare = isWinningSquare(squares, rowIndex, colIndex);
      row.push(
        <Square
          value={squares[rowIndex][colIndex]}
          onSquareClick={() => handleClick(rowIndex, colIndex)}
          isWinningSquare={winningSquare}
        />
      );
    }
    return row;
  }

  function renderAllRows() {
    const rows = [];
    for (let i = 0; i < squares.length; i++) {
      rows.push(<div className="board-row">{renderRow(i)}</div>);
    }
    return rows;
  }

  return (
    <div>
      <div className="status">{status}</div>
      {renderAllRows()}
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([
    [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)],
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      if (move === 0) {
        description = "You're at game start";
      } else {
        description = "You're at move #" + move;
      }
      return <li key={move}>{description}</li>;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const winnerPos = calculateWinnerPos(squares);

  if (winnerPos === null) {
    return false;
  }

  return squares[winnerPos[0][0]][winnerPos[0][1]];
}

function isWinningSquare(squares, rowIndex, colIndex) {
  const winnerPos = calculateWinnerPos(squares);

  if (winnerPos === null) {
    return false;
  }

  const [a, b, c] = winnerPos;

  return (
    (a[0] === rowIndex && a[1] === colIndex) ||
    (b[0] === rowIndex && b[1] === colIndex) ||
    (c[0] === rowIndex && c[1] === colIndex)
  );
}

function calculateWinnerPos(squares) {
  const lines = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a[0]][a[1]] &&
      squares[a[0]][a[1]] === squares[b[0]][b[1]] &&
      squares[a[0]][a[1]] === squares[c[0]][c[1]]
    ) {
      return lines[i];
    }
  }
  return null;
}
