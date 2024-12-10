import { useState } from "react";

function Square({ value, onSquareClick, styleWinner }) {
  return (
    <button className="square" onClick={onSquareClick} style={styleWinner}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, onHandlePosition }) {
  function handleClick(i) {
    if (calculateWinner(squares).result || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
    onHandlePosition(i)
  }

  const winner = calculateWinner(squares);
  let status;
  if ((winner.result && winner.result === "X") || winner.result === "O") {
    status = "Ganador: " + winner.result;
  } else {
    winner.result === "empate"
      ? (status = "Empate")
      : (status = "Siguiente jugador " + (xIsNext ? "X" : "O"));
  }

  let row = [];
  let board = squares.map((square, i) => {
    let styleWinner;
    if (winner.winnerSquares && winner.winnerSquares.includes(i)) {
      styleWinner = {
        backgroundColor: "#63ff63",
      };
    }
    (row.length === 3) && (row = []);
    row.push(
      <Square
        key={i}
        value={square}
        onSquareClick={() => handleClick(i)}
        styleWinner={styleWinner}
      />
    );
    if (row.length === 3) {
      return (
        <div key={i} className="board-row">
          {row}
        </div>
      )
    }
  });


  //Mi solución del segel segundo punto: Vuelve a escribir Board para usar dos bucles para crear los cuadrados en lugar de codificarlos.
  /*
   let [square1, square2, square3] = [{}, {}, {}];
  let rows = [];

  squares.forEach((value, i) => {
    let styleWinner;
    if (winner.winnerSquares && winner.winnerSquares.includes(i)) {
      styleWinner = {
        backgroundColor: "#63ff63",
      };
    }

    square1.key &&
      square2.key &&
      square3.key &&
      ([square1, square2, square3] = [{}, {}, {}]);

    !square1.key
      ? (square1 = (
          <Square
            key={i}
            value={value}
            onSquareClick={() => handleClick(i)}
            styleWinner={styleWinner}
          />
        ))
      : square1.key && !square2.key
      ? (square2 = (
          <Square
            key={i}
            value={value}
            onSquareClick={() => handleClick(i)}
            styleWinner={styleWinner}
          />
        ))
      : (square3 = (
          <Square
            key={i}
            value={value}
            onSquareClick={() => handleClick(i)}
            styleWinner={styleWinner}
          />
        ));
    square1.key &&
      square2.key &&
      square3.key &&
      rows.push(
        <div key={i} className="board-row">
          {square1}
          {square2}
          {square3}
        </div>
      );

  });
  let board = rows.map((row) => {
    return row;
  }); */

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [positionHistory, setPositionHistory] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0);
  const [reverseMovesList, setReverseMovesList] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePosition(position) {
    let positionSquare = positionHistory.map(value => currentMove < value ? null : value)
    positionSquare[position] = currentMove + 1;    
    setPositionHistory(positionSquare)
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Ir al movimiento #" + move;
    } else {
      description = "Ir al inicio del juego";
    }
    let item;
    if (move === currentMove) {
      item = <span className="code">Estás en el movimiento #{move}</span>;
    } else {
      item = <button onClick={() => jumpTo(move)}>{description}</button>;
    }
    return <li key={move}>{item}</li>;
  });

  if (reverseMovesList) {
    moves.reverse();
  }
  function sortList() {
    reverseMovesList ? setReverseMovesList(false) : setReverseMovesList(true);
  }

  let positionRow = [];
  const positionMoves = positionHistory.map((value, i) => {
    (positionRow.length === 3) && (positionRow = []);
    positionRow.push(
      <button key={i} className="square">{value}</button>
    );
    if (positionRow.length === 3) {
      return (
        <div key={i} className="board-row">
          {positionRow}
        </div>
      )
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onHandlePosition={handlePosition} />
      </div>
      <div className="game-board">{positionMoves}</div>
      <div className="game-info">
        <button onClick={() => sortList()}>Cambiar orden</button>
        <ol>{moves}</ol>
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
  let endGame = true;
  for (let i = 0; i < lines.length; i++) {
    !squares[i] && (endGame = false);
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        result: squares[a],
        winnerSquares: [a, b, c],
      };
    }
  }
  if (endGame) {
    return {
      result: "empate",
    };
  }
  return {};
}
