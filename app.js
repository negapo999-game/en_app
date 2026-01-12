/* 高校生レベル英単語（日→英） */
let words =[];
let quizWords = [];
const WORD_FILES = [
  "words_001_300.json",
  "words_301_600.json",
  "words_601_900.json",
  "words_901_1200.json",
  "words_1201_1500.json",
  "words_1501_1800.json",
  "words_1801_2027.json"
];
const WORD_RANGES = [
  { label: "1〜100", start: 1, end: 100 },
  { label: "101〜200", start: 101, end: 200 },
  { label: "201〜300", start: 201, end: 300 },
  { label: "301〜400", start: 301, end: 400 },
  { label: "401〜500", start: 401, end: 500 },
  { label: "501〜600", start: 501, end: 600 },
  { label: "601〜700", start: 601, end: 700 },
  { label: "701〜800", start: 701, end: 800 },
  { label: "801〜900", start: 801, end: 900 },
  { label: "901〜1000", start: 901, end: 1000 },
  { label: "1001〜1100", start: 1001, end: 1100 },
  { label: "1101〜1200", start: 1101, end: 1200 },
  { label: "1201〜1300", start: 1201, end: 1300 },
  { label: "1301〜1400", start: 1301, end: 1400 },
  { label: "1401〜1500", start: 1401, end: 1500 },
  { label: "1501〜1600", start: 1501, end: 1600 },
  { label: "1601〜1700", start: 1601, end: 1700 },
  { label: "1701〜1800", start: 1701, end: 1800 },
  { label: "1801〜1900", start: 1801, end: 1900 },
  { label: "1901〜2027", start: 1901, end: 2027 }
];

/* 単語一覧ページ用 */
const WORDS_PER_PAGE = 100; // 1ページ50語
let currentWordListPage = 1;

let wrongWords = [];
let currentId = 0;


let MAX=20;
let jp="", en="", score=0, total=0;

async function loadWords() {
  words = [];

  for (const file of WORD_FILES) {
    const res = await fetch(file);
    const data = await res.json();
    words.push(...data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadWords();
});


// async function startGame(){
//   score = total = 0;
//   wrongWords = [];
//   // words=[];
//   title.classList.add("hidden");
//   finish.classList.add("hidden");
//   game.classList.remove("hidden");
//   console.log(words.length);
//   // if (words.length === 0) {
//   //   await loadWords();
//   // }

//   nextWord();
// }

function startGame() {
  score = 0;
  total = 0;
  wrongWords = [];

  // ← 条件に基づいて新しくランダム生成
  quizWords = createQuizWords(); 

  title.classList.add("hidden");
  finish.classList.add("hidden");
  game.classList.remove("hidden");

  nextWord();
}

function showRangeSelect() {
  hideAll();
  rangeSelect.classList.remove("hidden");

  rangeButtons.innerHTML = "";

  WORD_RANGES.forEach(r => {
    const btn = document.createElement("button");
    btn.textContent = r.label;
    btn.onclick = () => showModeSelect(r.start, r.end);
    rangeButtons.appendChild(btn);
  });
}

let selectedStart = 0;
let selectedEnd = 0;

function showModeSelect(start, end) {
  selectedStart = start;
  selectedEnd = end;

  hideAll();
  modeSelect.classList.remove("hidden");
}

function startQuiz(count) {
  MAX = count;
  score = total = 0;
  wrongWords = [];

  quizWords = words.filter(w =>
    w.id >= selectedStart && w.id <= selectedEnd
  );

  shuffleArray(quizWords);

  hideAll();
  game.classList.remove("hidden");

  nextWord();
}

function wrongWordQuiz() {
  MAX = wrongWords.length;
  score = total = 0;
  quizWords = wrongWords;
  wrongWords = [];
  shuffleArray(quizWords);

  hideAll();
  game.classList.remove("hidden");

  nextWord();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function nextWord() {
  if (total === MAX) return finishGame();

  const w = quizWords[total];

  jp = w.jp;
  en = w.en;
  currentId = w.id;

  jpDiv.textContent = jp;
  questionNo.textContent = `No.${currentId}`;

  input.value = "";
  result.textContent = "";

  checkBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");

  updateDisplay();
  input.focus();
}

// function nextWord(){
//   if(total === MAX) return finishGame();

//   const w = words[Math.floor(Math.random() * words.length)];

//   jp = w.jp;
//   en = w.en;
//   currentId = w.id; // ← 問題番号

//   jpDiv.textContent = jp;
//   input.value = "";
//   result.textContent = "";
//   questionNo.textContent = `No.${currentId}`;
//   checkBtn.classList.remove("hidden");
//   nextBtn.classList.add("hidden");
//   updateDisplay();
//   input.focus();
// }

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
    result.textContent = `❌ 不正解 (正解：${en})`;
    wrongWords.push({ id: currentId,jp, en });
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

// function backToTitle(){
//   finish.classList.add("hidden");
//   title.classList.remove("hidden");
// }

function confirmBack(){
  const ok = confirm(
    "現在の学習記録は保存されません。\nタイトル画面に戻りますか？"
  );

  if (ok) {
    // 学習状態をリセット
    score = 0;
    total = 0;
    wrongWords = [];

    hideAll();
    title.classList.remove("hidden");
  }
}

// function showWordList(){
//   hideAll();
//   wordList.classList.remove("hidden");

//   wordListContent.innerHTML = "";
//   for (let i = 0; i < words.length; i++) {
//     const li = document.createElement("li"); console.log(11)
//     li.textContent = `No.${words[i].id} ${words[i].jp} - ${words[i].en}`;
//     wordListContent.appendChild(li);
//   }
// }

function showWordList(){
  hideAll();
  wordList.classList.remove("hidden");

  currentWordListPage = 1;   // ← 追加
  renderWordList();          // ← 新関数
}

function renderWordList() {
  wordListContent.innerHTML = "";

  const pageWords = getWordListByPage(currentWordListPage);

  pageWords.forEach(w => {
    const li = document.createElement("li");
    li.textContent = `No.${w.id} ${w.jp} - ${w.en}`;
    wordListContent.appendChild(li);
  });

  updateWordListPageInfo();
}

function updateWordListPageInfo() {
  const totalPages = Math.ceil(words.length / WORDS_PER_PAGE);

  wordListPageInfo.textContent =
    `${currentWordListPage} / ${totalPages}`;

  wordListPrev.disabled = currentWordListPage === 1;
  wordListNext.disabled = currentWordListPage === totalPages;
}

function getWordListByPage(page) {
  const start = (page - 1) * WORDS_PER_PAGE;
  const end = start + WORDS_PER_PAGE;
  return words.slice(start, end);
}

function showWrongList(){
  hideAll();
  wrongList.classList.remove("hidden");

  wrongListContent.innerHTML = "";

  if (wrongWords.length === 0) {
    wrongListContent.innerHTML = "<li>まだありません</li>";
    return;
  }

  wrongWords.forEach(w => {
    const li = document.createElement("li");
    li.textContent = `${w.jp} ー ${w.en}`;
    wrongListContent.appendChild(li);
  });
}

function hideAll(){
  title.classList.add("hidden");
  rangeSelect.classList.add("hidden");
  modeSelect.classList.add("hidden");
  game.classList.add("hidden");
  finish.classList.add("hidden");
  wordList.classList.add("hidden");
  wrongList.classList.add("hidden");
}


function backToTitle(){
  hideAll();
  title.classList.remove("hidden");
}

function backToRange() {
  hideAll();
  rangeSelect.classList.remove("hidden");
}

/* DOM取得 */
const title = document.getElementById("title");
const game = document.getElementById("game");
const finish = document.getElementById("finish");
const jpDiv = document.getElementById("word");
const display = document.getElementById("display");
const input = document.getElementById("input");
const result = document.getElementById("result");
const scoreDiv = document.getElementById("score");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const finalScore = document.getElementById("finalScore");
const wordList = document.getElementById("wordList");
const wrongList = document.getElementById("wrongList");
const wordListContent = document.getElementById("wordListContent");
const wrongListContent = document.getElementById("wrongListContent");
const questionNo = document.getElementById("questionNo");
const rangeSelect = document.getElementById("rangeSelect");
const rangeButtons = document.getElementById("rangeButtons");
const modeSelect = document.getElementById("modeSelect");
const wordListPrev = document.getElementById("wordListPrev");
const wordListNext = document.getElementById("wordListNext");
const wordListPageInfo = document.getElementById("wordListPageInfo");

wordListPrev.addEventListener("click", () => {
  if (currentWordListPage > 1) {
    currentWordListPage--;
    renderWordList();
  }
});

wordListNext.addEventListener("click", () => {
  const maxPage = Math.ceil(words.length / WORDS_PER_PAGE);
  if (currentWordListPage < maxPage) {
    currentWordListPage++;
    renderWordList();
  }
});

/* タップで入力復帰（Android対応） */
document.body.addEventListener("click", ()=>input.focus());
input.addEventListener("input", updateDisplay);
