import {useState} from 'react';

function Square({value, onSquareClick, isWinning }) {
  return (
    <button 
      className="square" 
      onClick={onSquareClick}
      style={{
        backgroundColor: isWinning ? "lightgreen" : "white"
      }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return; //if the square is already filled, or someone has won, return early and do nothing
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  //status section
  const winner = calculateWinner(squares);
  const draw = calculateDraw(squares);
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else if (draw) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinning={winner?.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinning={winner?.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinning={winner?.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinning={winner?.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinning={winner?.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinning={winner?.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinning={winner?.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinning={winner?.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinning={winner?.includes(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); //notice how this array with only one item, which itself if an array of 9 nulls
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; //if the current move is even, then it's X's turn, otherwise it's O's turn
  const currentSquares = history[currentMove]; //currentSquares is the current state of the board
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; //if we go back in time and then make a new move from that point, we want to discard all the "future" history that would now become incorrect
    setHistory(nextHistory); 
    setCurrentMove(nextHistory.length - 1); //the current move is now the last item in the history array, which is the new state of the board
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
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
      <div className="game-baord">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c]; //if there is a winner, return the indices of the winning squares
    }
  }
  return null;
}

function calculateDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false; //if there is at least one null square, then it's not a draw
    }
  }
  return true; //if there are no null squares, then it's a draw
}