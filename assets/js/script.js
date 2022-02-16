// Declaration of variables
let startContainer = document.querySelector("#start-container");
let questionsContainer = document.querySelector("#questions-container");
let finishedContainer = document.querySelector("#finished-container");
let highscoresContainer = document.querySelector("#highscores-container");

let header = document.querySelector("header");
let countdown = document.querySelector("#countdown-timer");

let questionCard = document.querySelector("#questions-card");
let questionEl = document.querySelector("#question");
let choicesEl = document.querySelector("#choices");
let responseEl = document.querySelector("#response");
let initials = document.querySelector("#initials");
let emptyHighscores = document.querySelector("#empty-highscores-list");
let highscoresList = document.querySelector("#highscores-list");
let finalHighscore = document.querySelector("#score");

// Button variable declarations
let startButton = document.querySelector("#start-button");
let submitButton = document.querySelector("#submit-button");
let tryAgainButton = document.querySelector("#try-again-button");
let clearButton = document.querySelector("#clear-button");

// Other variables
let qListCurrent = []; // array used for questions and buttons
let qIndex = 0; // index of question
let qCard = {}; // all the info for the question
let timer = 60; // timer duration of quiz
let score = 0; //score of user

// List of quiz questions
let qList = [
    {
        question: "Who invented JavaScript?",
        answers: [
            "Douglas Crockford",
            "Sheryl Sandberg",
            "Brendan Eich",
            "Nevan D'Souza"
        ],
        rightAnswer: "Brendan Eich"
    },
    {
        question: "Which of the following type of variable is visible everywhere in your JavaScript code?",
        answers: [
            "global variable",
            "local variable",
            "Both of the above",
            "None of the above"
        ],
        rightAnswer: "global variable"
    },
    {
        question: "Which built-in method calls a function for each element in the array?",
        answers: [
            "while()",
            "loop()",
            "forEach()",
            "None of the above"
        ],
        rightAnswer: "forEach()"
    },
    {
        question: "Which of the following function of Array object returns a string representing the array and its elements?",
        answers: [
            "toSource()",
            "sort()",
            "splice()",
            "toString()"
        ],
        rightAnswer: "toString()"
    },
    {
        question: "Which of the following function of String object causes a string to be italic, as if it were in an <i> tag?",
        answers: [
            "fixed()",
            "fontcolor()",
            "fontsize()",
            "italics()"
        ],
        rightAnswer: "italics()"
    }
    
];

// Function to make element visible
function showEl(element) {
    element.removeAttribute("class", "hidden");
}

// Function to make element hidden by adding class - 'hidden'
function hideEl(element) {
    element.setAttribute("class", "hidden");
}

// Function to clear elements of an array
function clearList(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Function to check whether the answer clicked is correct or not
function checkAnswer(event) {
    let chosenEle = event.target;
    let chosenText = chosenEle.textContent;

    if (responseEl.firstChild !== null) {
        responseEl.removeChild(responseEl.firstChild);
    }

    if (chosenText === qCard.rightAnswer) {
        let responseMsg = document.createElement('p');
        responseEl.appendChild(responseMsg);
        responseMsg.innerText = "Your last answer was correct! Try this one.";
    } else {
        let responseMsg = document.createElement('p');
        responseEl.appendChild(responseMsg);
        responseMsg.innerText = "Your last answer was incorrect! 10 second penalty! Try this one."
        timer -= 10;
    }
}

// Function to convert timer to score
function finalScore() {
    if (timer < 0) {
        timer = 0;
    }
    return score = timer;
}

// Function to show container with the final score and score storing info
function showScoreContainer(scoreValue) {
    hideEl(questionCard);
    hideEl(header);
    showEl(finishedContainer);

    finalHighscore.innerText = scoreValue;
}

// Function to show the highscores and the locally stored highscores list
function showHighscores() {
    let savedScoreLocal = localStorage.getItem("high scores");
    let highscoresArray = JSON.parse(savedScoreLocal);
    console.log(highscoresArray[highscoresArray.length-1]);

    hideEl(header);
    hideEl(startContainer);
    hideEl(questionCard);
    hideEl(finishedContainer);
    showEl(highscoresContainer);

    // This checks if any high scores are stored in local storage
    if (savedScoreLocal === null) {
        return;
    }

    let lastHighscore = document.createElement("li");
    lastHighscore.innerText = highscoresArray[highscoresArray.length-1].userScore + " - " + highscoresArray[highscoresArray.length-1].userInitials;
    highscoresList.appendChild(lastHighscore);
}

// This function stores highscore in local storage after entering initials
function storeHighscores(event) {
    event.preventDefault();

    // This forces user to enter something in the initials input
    if (initials.value === "") {
        alert("Please do not leave this empty.");
        return;
    }

    hideEl(finishedContainer);
    showEl(highscoresContainer);
    
    // This part stores it into local storage
    let savedScoreLocal = localStorage.getItem("high scores");
    let highscoresArray;
    let user = {
        userInitials: initials.value,
        userScore: finalHighscore.textContent
    };

    if (savedScoreLocal === null) {
        highscoresArray = [];
    } else {
        highscoresArray = JSON.parse(savedScoreLocal);
    }

    highscoresArray.push(user);

    // This turns array into string so it can be locally stored
    let highscoresArrayString = JSON.stringify(highscoresArray);
    window.localStorage.setItem("high scores", highscoresArrayString);

    showHighscores();
}

// Function deletes local storage of high scores
function clearHighscores() {
    clearList(highscoresList);
    showEl(emptyHighscores);
    window.localStorage.removeItem("high scores");

}

// Function begins timer
function startTimer() {
    timeInterval = setInterval(function() {
        countdown.textContent = timer;
        timer--;
 
        if (timer < 0) {
            score = 0;
            showScoreContainer(score);
            questionEl.textContent = '';
            clearInterval(timeInterval);

        }
    }, 1000);
}


// Function clears the question and adds the next one
function nextQuestion() {
    qCard = qListCurrent[qIndex];
    questionEl.innerText = qCard.question;

    for (i = 0; i < qCard.answers.length; i++) {
        let buttonEle = document.createElement('button');
        buttonEle.setAttribute("class","button");
        buttonEle.innerText = qCard.answers[i];
        buttonEle.addEventListener("click", function() {
            checkAnswer(event);
            nextChoices();
        });
        choicesEl.appendChild(buttonEle);
    }
}

// Function clears buttons and put in new ones with the next question
function nextChoices() {
    qIndex++;
    if (qIndex < qListCurrent.length) {
        clearList(choicesEl);
        nextQuestion();
    } else {
        finalScore();
        clearList(choicesEl);
        showScoreContainer(score);
        clearInterval(timeInterval);
    }
}

// Function starts the quiz
function start() {
    qListCurrent = qList
    hideEl(startContainer);
    showEl(questionCard);
    startTimer();
    nextQuestion();
}

// Resets quiz 
function reset() {
    timer = 60;
    qIndex = 0;
    countdown.textContent = timer;
    qListCurrent = [];
    qCard = {};
    initials.value = "";
    
    clearList(choicesEl);
    questionEl.textContent = '';
    if (responseEl.firstElementChild.innerText != null) {
        responseEl.firstElementChild.innerText = ""
    };
    hideEl(highscoresContainer);
    hideEl(finishedContainer);
    hideEl(emptyHighscores);
    showEl(header);
    showEl(startContainer);
}

// Event listeners
startButton.addEventListener("click", start);
tryAgainButton.addEventListener("click", reset);
clearButton.addEventListener("click", clearHighscores);
submitButton.addEventListener("click", function() {
    storeHighscores(event);
})
