let Questions = [];
const ques = document.getElementById("ques");
let tries = 0; // Keep track of the number of tries

async function fetchQuestions() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    if (!response.ok) {
      throw new Error("Something went wrong!! Unable to fetch the data");
    }
    const data = await response.json();
    Questions = data.results;
    loadQues(); // Now we call loadQues after data is fetched
  } catch (error) {
    console.log(error);
    ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
  }
}

let currQuestion = 0;
let score = 0;

function loadQues() {
  if (Questions.length === 0) {
    ques.innerHTML = `<h5 style='color: red'>Unable to fetch data, Please try again!!</h5>`;
    return;
  }

  const opt = document.getElementById("opt");
  let currentQuestion = Questions[currQuestion].question;

  // Handle special characters in the question
  currentQuestion = currentQuestion
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  ques.innerText = currentQuestion;

  opt.innerHTML = "";
  const correctAnswer = Questions[currQuestion].correct_answer;
  const incorrectAnswers = Questions[currQuestion].incorrect_answers;
  const options = [correctAnswer, ...incorrectAnswers];
  options.sort(() => Math.random() - 0.5);

  options.forEach((option) => {
    // Handle special characters in options
    option = option.replace(/&quot;/g, '"').replace(/&#039;/g, "'");

    const choicesdiv = document.createElement("div");
    const choice = document.createElement("input");
    const choiceLabel = document.createElement("label");

    choice.type = "radio";
    choice.name = "answer";
    choice.value = option;
    choiceLabel.textContent = option;

    choicesdiv.appendChild(choice);
    choicesdiv.appendChild(choiceLabel);
    opt.appendChild(choicesdiv);
  });
}

function loadScore() {
  const totalScore = document.getElementById("score");
  totalScore.textContent = `You scored ${score} out of ${tries}`;
  totalScore.innerHTML += "<h3>All Answers</h3>";
  Questions.slice(0, tries).forEach((el, index) => {
    totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
  });
}

function nextQuestion() {
  const selectedAns = document.querySelector('input[name="answer"]:checked');
  if (!selectedAns) return; // Prevent error if no answer is selected

  const selectedAnswerValue = selectedAns.value;
  if (selectedAnswerValue === Questions[currQuestion].correct_answer) {
    score++;
  }

  tries++; // Increment the number of tries
  if (tries < 5 && currQuestion < Questions.length - 1) {
    currQuestion++;
    loadQues();
  } else {
    // End the quiz after 5 tries or when there are no more questions
    document.getElementById("opt").remove();
    document.getElementById("ques").remove();
    document.getElementById("btn").remove();
    loadScore();
  }
}

fetchQuestions();
