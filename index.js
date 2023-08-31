document.addEventListener("DOMContentLoaded", function () {
  const gridSize = 9;
  const sudokuGrid = document.getElementById("sudoku-grid");
  const solveButton = document.getElementById("solve-btn");
  const generatePuzzleButton = document.getElementById("generate-puzzle-btn");

  generatePuzzleButton.addEventListener("click", generateRandomPuzzle);
  solveButton.addEventListener("click", generateSudoku);

  for (let row = 0; row < gridSize; row++) {
    const newRow = document.createElement("tr");
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.className = "cell";
      input.id = `cell-${row}-${col}`;
      cell.appendChild(input);
      newRow.appendChild(cell);
    }
    sudokuGrid.appendChild(newRow);
  }
});

function isValidMove(board, row, col, num) {
  const gridSize = 9;

  for (let i = 0; i < gridSize; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

async function generateSudoku() {
  const gridSize = 9;
  const sudokuArray = [];

  for (let row = 0; row < gridSize; row++) {
    sudokuArray[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cellValue = document.getElementById(cellId).value;
      sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cell = document.getElementById(cellId);

      if (sudokuArray[row][col] !== 0) {
        cell.classList.add("user-input");
      }
    }
  }

  if (generateSudokuHelper(sudokuArray)) {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (!cell.classList.contains("user-input")) {
          cell.value = sudokuArray[row][col];
          cell.classList.add("solved");
          await sleep(20);
        }
      }
    }
  } else {
    alert("No solution exists for the given Sudoku puzzle.");
  }
}

// function generateRandomPuzzle() {
//   const gridSize = 9;

//   for (let row = 0; row < gridSize; row++) {
//     for (let col = 0; col < gridSize; col++) {
//       const cellId = `cell-${row}-${col}`;
//       const cell = document.getElementById(cellId);
//       const isUserInput = cell.classList.contains("user-input");

//       if (!isUserInput) {
//         // Generuj losowe liczby w określonym przedziale tylko dla nieoznaczonych komórek
//         const isFilled = Math.random() < 0.5; // Około połowa komórek będzie uzupełniona
//         if (isFilled) {
//           const randomNumber = Math.floor(Math.random() * 9) + 1; // Zakres: 15-30
//           cell.value = randomNumber;
//           cell.classList.add("user-input"); // Oznacz jako uzupełniony przez użytkownika
//         } else {
//           cell.value = ""; // Pozostaw puste
//         }
//         cell.classList.remove("solved");
//         cell.classList.remove("error");
//         cell.classList.remove("correct");
//       }
//     }
//   }
// }

function generateSudokuHelper(board) {
  const gridSize = 9;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            if (generateSudokuHelper(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }

  return true;
}

function generateRandomPuzzle() {
  const sudokuGrid = document.getElementById("sudoku-grid");
  sudokuGrid.innerHTML = ""; // Wyczyść planszę przed generowaniem nowej

  // Generuj planszę optymalną i pełną
  const fullSudoku = generateOptimalSudoku();

  // Usuń losowe liczby, aby stworzyć planszę z pustymi polami
  const cellsToClear = Math.floor(Math.random() * 60) + 40; // Usuń od 20 do 59 komórek
  let clearedCells = 0;

  for (let i = 0; i < cellsToClear; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (fullSudoku[row][col] !== 0) {
      fullSudoku[row][col] = 0;
      clearedCells++;
    }
  }

  // Generuj planszę w HTML
  for (let row = 0; row < 9; row++) {
    const newRow = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.className = "cell";
      input.id = `cell-${row}-${col}`;
      if (fullSudoku[row][col] !== 0) {
        input.value = fullSudoku[row][col];
        input.readOnly = true; // Uzupełnione liczby zostaną oznaczone jako tylko do odczytu
        input.classList.add("user-input");
      }
      cell.appendChild(input);
      newRow.appendChild(cell);
    }
    sudokuGrid.appendChild(newRow);
  }
}

// Funkcja generująca planszę Sudoku optymalną i pełną
function generateOptimalSudoku() {
  const sudokuArray = Array.from({ length: 9 }, () => Array(9).fill(0));
  generateSudokuHelper(sudokuArray); // Wypełnij planszę pełną
  return sudokuArray;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
