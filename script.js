/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let timeLeft = 60;
let timerInterval;
let timerStarted = false;
let currentWordIndex = 0;
let totalCorrectLetters = 0;
let totalExpectedLetters = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const timerDisplay = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");


const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    totalCorrectLetters = 0;   
    totalExpectedLetters = 0;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red";
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    inputField.disabled = false;
    results.textContent = "";
    timerDisplay.textContent = timeLeft = 60;
    timerStarted = false;
    clearInterval(timerInterval);
};

// Start the timer when user begins typing
inputField.addEventListener("input", () => {
    if (startTime === null) {
        startTime = Date.now();
        previousEndTime = startTime;
    }
    if (!timerStarted) {
        startCountdown();   
    }
});

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    const totalChars = wordsToType
        .slice(0, currentWordIndex + 1)
        .reduce((acc, word) => acc + word.length, 0);

    const wpm = (totalChars / 5) / (elapsedTime / 60);
    const accuracy = totalExpectedLetters === 0//la moyenne de tout les mots
        ? 100
        : (totalCorrectLetters / totalExpectedLetters) * 100;

    return {
        wpm: wpm.toFixed(2),
        accuracy: accuracy.toFixed(2)
    };
};


// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") {
        event.preventDefault();
        const typedWord = inputField.value.trim();
        const currentWord = wordsToType[currentWordIndex];

        // Comparaison lettre par lettre
        for (let i = 0; i < Math.min(typedWord.length, currentWord.length); i++) {
            if (typedWord[i] === currentWord[i]) {
                totalCorrectLetters++;
            }
        }

        totalExpectedLetters += currentWord.length;

        if (typedWord === currentWord) {
            const { wpm, accuracy } = getCurrentStats();
            results.textContent = ` WPM: ${wpm}, Accuracy: ${accuracy}%`;

            currentWordIndex++;
            highlightNextWord();
        } else {
            const { wpm, accuracy } = getCurrentStats();
            results.textContent = ` Mot incorrect | WPM: ${wpm}, Accuracy: ${accuracy}%`;
        }

        inputField.value = "";
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

// Event listeners
inputField.addEventListener("keydown", (event) => {
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();

document.getElementById("start-btn").addEventListener("click", () => {
    const splash = document.getElementById('splash-screen');
    splash.style.opacity = 0;
    setTimeout(() => splash.style.display = 'none', 1000);

    const audio = new Audio('642309__lightmister__light-mister-intro.mp3');
    audio.play();
});

// Timer de 60 secondes
function startCountdown() {
    if (timerStarted) return; 
    timerStarted = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            inputField.disabled = true;
            results.textContent += " | Temps écoulé !";
            restartBtn.style.display = "inline-block";
        }
    }, 1000);
}

//button to restart
restartBtn.addEventListener("click", () => {
    restartBtn.style.display = "none"; 
    startTest(); 
});


