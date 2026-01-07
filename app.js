/* 高校生レベル英単語（日→英） */
const words = {
  "重要な":"important","違い":"difference","環境":"environment",
  "経験":"experience","意見":"opinion","成功":"success",
  "失敗":"failure","可能な":"possible","説明する":"explain",
  "理解する":"understand","解決する":"solve","影響":"influence",
  "選択する":"choose","改善する":"improve","続ける":"continue",
  "準備する":"prepare","守る":"protect","成長する":"develop",
  "必要な":"necessary","決定する":"decide"
};

const MAX = 20;
let jp="", en="", score=0, total=0;

function startGame(){
  score = total = 0;
  title.classList.add("hidden");
  finish.classList.add("hidden");
  game.classList.remove("hidden");
  nextWord();
}

function nextWord(){
  if(total === MAX) return finishGame();

  [jp, en] = Object.entries(words)[
    Math.floor(Math.random()*Object.keys(words).length)
  ];

  jpDiv.textContent = jp;
  input.value = "";
  result.textContent = "";
  checkBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  updateDisplay();
  input.focus();
}

function updateDisplay(){
  let t = input.value;
  display.textContent = [...en].map(
    (c,i)=> t[i]?t[i].toUpperCase():"_"
  ).join(" ");
}

function checkAnswer(){
  total++;
  if(input.value.toLowerCase() === en){
    score++;
    result.textContent = "⭕ 正解！";
  } else {
    result.textContent = `❌ 正解：${en}`;
  }
  scoreDiv.textContent = `正解数 ${score}/${total}`;
  checkBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
}

function finishGame(){
  game.classList.add("hidden");
  finish.classList.remove("hidden");
  finalScore.textContent = `あなたのスコア：${score} / ${MAX}`;
}

function backToTitle(){
  finish.classList.add("hidden");
  title.classList.remove("hidden");
}

/* DOM取得 */
const title = document.getElementById("title");
const game = document.getElementById("game");
const finish = document.getElementById("finish");
const jpDiv = document.getElementById("jp");
const display = document.getElementById("display");
const input = document.getElementById("input");
const result = document.getElementById("result");
const scoreDiv = document.getElementById("score");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const finalScore = document.getElementById("finalScore");

/* タップで入力復帰（Android対応） */
document.body.addEventListener("click", ()=>input.focus());
input.addEventListener("input", updateDisplay);
