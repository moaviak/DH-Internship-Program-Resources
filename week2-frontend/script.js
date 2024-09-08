// DOM elements
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");
const resultsElement = document.getElementById("results");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");

let currentQuestion = 0;
let score = 0;
let questions = [];

// Fetch questions from Open Trivia DB
const fetchQuestions = async (amount = 5) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&type=multiple`
    );
    const data = await response.json();
    return data.results.map((q) => ({
      question: q.question,
      answers: [...q.incorrect_answers, q.correct_answer].sort(
        () => Math.random() - 0.5
      ),
      correctAnswer: q.correct_answer,
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// Start the quiz
const startQuiz = async () => {
  loadingElement.classList.remove("hidden");
  errorElement.classList.add("hidden");
  quizContainer.classList.add("hidden");
  resultsElement.classList.add("hidden");

  try {
    questions = await fetchQuestions();
    currentQuestion = 0;
    score = 0;
    loadingElement.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    showQuestion();
  } catch (error) {
    loadingElement.classList.add("hidden");
    errorElement.textContent = "Failed to load questions. Please try again.";
    errorElement.classList.remove("hidden");
  }
};

// Resume the quiz
const resumeQuiz = () => {
  if (questions.length === 0) {
    // If questions are not loaded (e.g., after a page refresh), start a new quiz
    startQuiz();
  } else {
    loadingElement.classList.add("hidden");
    errorElement.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    resultsElement.classList.add("hidden");
    showQuestion();
  }
};

// Show question
const showQuestion = () => {
  const { question, answers } = questions[currentQuestion];

  questionElement.innerHTML = decodeEntities(question);
  answersElement.innerHTML = answers
    .map(
      (answer, index) => `
    <div>
      <input type="radio" id="answer${index}" name="answer" value="${answer}">
      <label for="answer${index}">${decodeEntities(answer)}</label>
    </div>
  `
    )
    .join("");

  submitButton.classList.remove("hidden");
  nextButton.classList.add("hidden");
};

// Handle answer submission
const submitAnswer = () => {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) return;

  const userAnswer = selectedAnswer.value;
  const { correctAnswer } = questions[currentQuestion];

  if (userAnswer === correctAnswer) {
    score++;
  }

  saveProgress();
  showFeedback(userAnswer === correctAnswer);
  submitButton.classList.add("hidden");
  nextButton.classList.remove("hidden");
};

// Show feedback
const showFeedback = (isCorrect) => {
  const feedbackClass = isCorrect ? "correct" : "incorrect";
  const feedback = isCorrect
    ? "Correct!"
    : `Incorrect. The correct answer was: ${decodeEntities(
        questions[currentQuestion].correctAnswer
      )}`;
  answersElement.innerHTML += `<p class="feedback ${feedbackClass}">${feedback}</p>`;
};

// Move to next question or end quiz
const nextQuestion = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    saveProgress();
    showQuestion();
  } else {
    showResults();
  }
};

// Show quiz results
const showResults = () => {
  quizContainer.classList.add("hidden");
  resultsElement.classList.remove("hidden");
  scoreElement.textContent = `${score} out of ${questions.length}`;
  localStorage.removeItem("quizProgress");
};

// Save progress to localStorage
const saveProgress = () => {
  localStorage.setItem(
    "quizProgress",
    JSON.stringify({
      currentQuestion,
      score,
      totalQuestions: questions.length,
      questions: questions,
    })
  );
};

// Load progress from localStorage
const loadProgress = () => {
  const progress = JSON.parse(localStorage.getItem("quizProgress"));
  if (progress) {
    currentQuestion = progress.currentQuestion;
    score = progress.score;
    questions = progress.questions;
    return true;
  }
  return false;
};

// Decode HTML entities
const decodeEntities = (text) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

// Event listeners
submitButton.addEventListener("click", submitAnswer);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", startQuiz);

// Initialize quiz
document.addEventListener("DOMContentLoaded", () => {
  if (loadProgress()) {
    // If there's saved progress, ask the user if they want to continue
    if (confirm("Do you want to continue from where you left off?")) {
      resumeQuiz();
    } else {
      localStorage.removeItem("quizProgress");
      startQuiz();
    }
  } else {
    startQuiz();
  }
});
