const spinButton = document.getElementById('spin-button');
const resultMessage = document.getElementById('result-message');
const positionDisplay = document.getElementById('position-display');
const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const choiceButtons = [
    document.getElementById('choice-1'),
    document.getElementById('choice-2'),
    document.getElementById('choice-3'),
    document.getElementById('choice-4')
];
const gameBoard = document.getElementById('game-board');
const wheel = document.getElementById('wheel');
const ctxWheel = wheel.getContext('2d');

// Sample game data
let currentPlayer = { position: 1 };
const questions = [
    {

    category: 'Math', 
    question: 'What is the square root of 16?', 
    correctAnswer: '4', 
    options: ['2', '4', '8', '6'] 
},
{ 
    category: 'Science', 
    question: 'What is H2O commonly known as?', 
    correctAnswer: 'Water', 
    options: ['Oxygen', 'Water', 'Hydrogen', 'Carbon Dioxide'] 
},
{ 
    category: 'History', 
    question: 'What year did World War II end?', 
    correctAnswer: '1945', 
    options: ['1945', '1944', '1950', '1939'] 
},
{ 
    category: 'Geography', 
    question: 'Which country is known as the Land of the Rising Sun?', 
    correctAnswer: 'Japan', 
    options: ['China', 'Japan', 'Thailand', 'South Korea'] 
},
{ 
    category: 'Literature', 
    question: 'Who wrote "1984"?', 
    correctAnswer: 'George Orwell', 
    options: ['George Orwell', 'Aldous Huxley', 'F. Scott Fitzgerald', 'Mark Twain'] 
},
{ 
    category: 'Math', 
    question: 'What is the value of Pi to two decimal places?', 
    correctAnswer: '3.14', 
    options: ['3.12', '3.14', '3.16', '3.18'] 
},
{ 
    category: 'Science', 
    question: 'What is the chemical symbol for gold?', 
    correctAnswer: 'Au', 
    options: ['Ag', 'Au', 'Pb', 'Fe'] 
},
{ 
    category: 'History', 
    question: 'Who was known as the Maid of Orléans?', 
    correctAnswer: 'Joan of Arc', 
    options: ['Marie Antoinette', 'Joan of Arc', 'Cleopatra', 'Boudica'] 
},
{ 
    category: 'Geography', 
    question: 'Which river is the longest in the world?', 
    correctAnswer: 'Nile', 
    options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'] 
},
{ 
    category: 'Literature', 
    question: 'What is the name of Sherlock Holmes’ assistant?', 
    correctAnswer: 'Dr. Watson', 
    options: ['Dr. Watson', 'Irene Adler', 'Professor Moriarty', 'Lestrade'] 
}
];
let currentQuestion = null;

// Snakes and Ladders (more snakes and ladders added)
const ladders = { 3: 22, 5: 8, 11: 26, 20: 29, 36: 44, 48: 67, 60: 82, 71: 91 };
// Spin Wheel functionality
let spinning = false;
spinButton.addEventListener('click', spinWheel);
function spinWheel() {
    if (spinning) return;
    spinning = true;

    const anglePerSlice = Math.PI * 2 / questions.length;
    let angle = Math.random() * Math.PI * 2;
    currentQuestion = questions[Math.floor(angle / anglePerSlice)];

    // Spin animation
    let spins = 20 + Math.floor(Math.random() * 10); // Random spin count
    let spinSpeed = 0.1;
    let interval = setInterval(() => {
        ctxWheel.clearRect(0, 0, wheel.width, wheel.height);
        ctxWheel.save();
        ctxWheel.translate(wheel.width / 2, wheel.height / 2);
        ctxWheel.rotate(angle);
        ctxWheel.fillStyle = 'lightblue';
        ctxWheel.fillRect(-wheel.width / 2, -wheel.height / 2, wheel.width, wheel.height);
        ctxWheel.restore();

        angle += spinSpeed;
        spins--;
        if (spins <= 0) {
            clearInterval(interval);
            spinning = false;
            showQuestion(currentQuestion);
        }
    }, 50);
}

// Show question and options
function showQuestion(question) {
    // Set the question text with the correct template literal syntax
    questionText.textContent = `Category: ${question.category}, Question: ${question.question}`;
    choicesContainer.style.display = 'block'; // Ensure the choices container is visible

    // Display answer choices
    question.options.forEach((option, index) => {
        choiceButtons[index].textContent = option; // Set button text
        choiceButtons[index].style.display = 'inline-block'; // Show the button
        choiceButtons[index].onclick = () => checkAnswer(option, question.correctAnswer); // Assign click handler
    });
}


// Check if the answer is correct
function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        resultMessage.textContent = "Correct! Move forward!";
        currentPlayer.position += 3; // Move forward 3 spaces
    } else {
        resultMessage.textContent = "Wrong! Move back!";
        currentPlayer.position -= 1; // Move back 1 space
    }
    updatePosition();
    hideChoices();
}

// Hide the multiple-choice options after answering
function hideChoices() {
    choicesContainer.style.display = 'none';
    choiceButtons.forEach(btn => btn.style.display = 'none');
}

// Update the player's position with snake and ladder movement
function updatePosition() {
    if (currentPlayer.position < 1) currentPlayer.position = 1;

    // Check for ladders
    if (ladders[currentPlayer.position]) {
        resultMessage.textContent += " You found a ladder! Climbing up!";
        currentPlayer.position = ladders[currentPlayer.position];
    }
    // Check for snakes
    else if (snakes[currentPlayer.position]) {
        resultMessage.textContent += " Oh no! You got bitten by a snake! Sliding down!";
        currentPlayer.position = snakes[currentPlayer.position];
    }

    positionDisplay.textContent = currentPlayer.position;
    drawBoard(); // Redraw the board after the move
}

// Draw Snakes and Ladders Board
function drawBoard() {
    const ctx = gameBoard.getContext('2d');
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height); // Clear previous board
    const boardSize = 500;
    const rows = 10, cols = 10;
    const cellSize = boardSize / rows;

    // Draw grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col * cellSize;
            let y = row * cellSize;
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }

    // Draw ladders (green)
    ctx.strokeStyle = "green";
    for (let start in ladders) {
        let end = ladders[start];
        drawLine(ctx, start, end, cellSize, "green");
    }

    // Draw snakes (red)
    ctx.strokeStyle = "red";
    for (let start in snakes) {
        let end = snakes[start];
        drawLine(ctx, start, end, cellSize, "red");
    }

    // Draw the player
    drawPlayer(ctx, currentPlayer.position, cellSize);
}

// Draw snakes and ladders
function drawLine(ctx, start, end, cellSize, color) {
    const { x: startX, y: startY } = getPosition(start, cellSize);
    const { x: endX, y: endY } = getPosition(end, cellSize);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Get coordinates for snakes and ladders
function getPosition(position, cellSize) {
    const row = Math.floor((position - 1) / 10);
    const col = (position - 1) % 10;
    return {
        x: col * cellSize + cellSize / 2,
        y: (9 - row) * cellSize + cellSize / 2
    };
}

// Draw the player
function drawPlayer(ctx, position, cellSize) {
    const { x, y } = getPosition(position, cellSize);
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

}// Initial call to draw the board
drawBoard();