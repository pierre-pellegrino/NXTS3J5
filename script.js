const firstDiv = document.querySelector('.start-div');
const questionsNb = document.querySelector('.q-nb');
const questionsNbBtn = document.querySelector('.q-nb-btn');
const mainDiv = document.querySelector('.main-div');
const scoreDiv = document.querySelector('.score-div');
const replayBtn = document.querySelector('.replay');

let clickableAnswers;
let questionsDiv;
let questionsArr = [];
let answersArr = [];
let currentQuestionNb = 0;
let score = 0;

window.onload = function() {
  firstDiv.classList.add('begin');
}

questionsNbBtn.addEventListener('click', e => {
  getQuestions(parseInt(questionsNb.value, 10));
  firstDiv.classList.remove('begin');
})

const getQuestions = (nb) => {
  fetch(`https://opentdb.com/api.php?amount=${nb}&type=multiple`)
  .then((response) => {
    return response.json()
  })
  .then((questions) => {
    questions.results.forEach(result => {
      let answers = [...result.incorrect_answers];
      answers.push(result.correct_answer);
      questionsArr.push( {"category": result.category, "difficulty": result.difficulty, "question": result.question, "correct": result.correct_answer, "incorrect": result.incorrect_answers, "answers": answers} )
    })
    questionsArr.forEach(question => {
      createQuestionDiv(question);
      currentQuestionNb++;
    })
    currentQuestionNb = 0;
    gameLoop(currentQuestionNb);
  })
}

const chooseAnswer = () => {
  clickableAnswers = mainDiv.querySelectorAll('.current .answer');
  clickableAnswers.forEach(answer => {
    answer.addEventListener('click', function() {
      answer.style.pointerEvents = "none";
      answersArr.push(answer.innerText.slice(3));
      questionsArr[currentQuestionNb].correct == answer.innerText.slice(3) ? answer.style.color = "green" : answer.style.color = "red";
      currentQuestionNb++;
      gameLoop(currentQuestionNb);
    })
  })
}

const gameLoop = (nb) => {
  if (nb < questionsArr.length) {
    questionsDiv = document.querySelectorAll('.question-div');
    nb > 0 ? questionsDiv[nb-1].classList.add('get-out') : null;
    questionsDiv[nb].classList.add('current');
    chooseAnswer();
  }
  else {
    getScore(answersArr, questionsArr);
  }

}

const getScore = (ans, q) => {
  let nbCorrect = q.filter((question, index) => question.correct == ans[index]);
  score = nbCorrect.length;
  displayScoreDiv(score);
}

const displayScoreDiv = (score) => {
  scoreDiv.querySelector('.final-score').innerText = `Score: ${score}/${parseInt(questionsNb.value, 10)}`;
  scoreDiv.classList.add('visible');
}

const createQuestionDiv = (q) => {
  let shuffled = [...q.answers];
  shuffled.sort((a,b) => 0.5 - Math.random());
  mainDiv.innerHTML += 
  `
  <div class="question-div q${currentQuestionNb}">
      <h3>Question ${currentQuestionNb+1}</h3>
      <p>${q.category}</p><br />
      <p>Difficulté : ${q.difficulty}</p><br />
      <p>${q.question}</p><br />
      <p class="answer"><span class="bolder">A.</span> ${shuffled[0]}</p>
      <p class="answer"><span class="bolder">B.</span> ${shuffled[1]}</p>
      <p class="answer"><span class="bolder">C.</span> ${shuffled[2]}</p>
      <p class="answer"><span class="bolder">D.</span> ${shuffled[3]}</p>
    </div>
  `
}

replayBtn.addEventListener('click', e => {
  location.reload();
})