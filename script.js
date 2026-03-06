const words = [
  "さくら",
  "ひこうき",
  "あさごはん",
  "にほんご",
  "でんしゃ",
  "うみ",
  "ともだち",
  "ほんだな",
  "きょうしつ",
  "まど"
];

const sentences = [
  "きょうはいいてんきです",
  "わたしはにほんごをべんきょうしています",
  "おいしいごはんをたべました",
  "でんしゃでがっこうへいきます",
  "しゅうまつはともだちとあそびます"
];

const kanaKeys = [
  "あ", "い", "う", "え", "お",
  "か", "き", "く", "け", "こ",
  "さ", "し", "す", "せ", "そ",
  "た", "ち", "つ", "て", "と",
  "な", "に", "ぬ", "ね", "の",
  "は", "ひ", "ふ", "へ", "ほ",
  "ま", "み", "む", "め", "も",
  "や", "ゆ", "よ",
  "ら", "り", "る", "れ", "ろ",
  "わ", "を", "ん",
  "ゃ", "ゅ", "ょ", "っ",
  "ー"
];

const modeEl = document.getElementById("mode");
const targetEl = document.getElementById("target");
const typedEl = document.getElementById("typed");
const scoreEl = document.getElementById("score");
const missEl = document.getElementById("miss");
const nextBtn = document.getElementById("next-btn");
const backspaceBtn = document.getElementById("backspace");
const keyboardEl = document.getElementById("on-screen-keyboard");

let targetText = "";
let typedText = "";
let score = 0;
let miss = 0;

function pickPrompt() {
  const pool = modeEl.value === "sentence" ? sentences : words;
  targetText = pool[Math.floor(Math.random() * pool.length)];
  typedText = "";
  render();
}

function updateScoreboard() {
  scoreEl.textContent = String(score);
  missEl.textContent = String(miss);
}

function render() {
  targetEl.textContent = targetText;

  const correctPart = typedText.slice(0, targetText.length);
  const isPrefix = targetText.startsWith(correctPart);

  if (typedText.length === 0) {
    typedEl.className = "typed";
    typedEl.textContent = "（ここに入力されます）";
  } else if (isPrefix) {
    typedEl.className = "typed ok";
    typedEl.textContent = typedText;
  } else {
    typedEl.className = "typed miss";
    typedEl.textContent = typedText;
  }
}

function checkProgress() {
  if (!targetText.startsWith(typedText)) {
    miss += 1;
    updateScoreboard();
    return;
  }

  if (typedText === targetText) {
    score += 1;
    updateScoreboard();
    pickPrompt();
  }
}

function inputChar(char) {
  typedText += char;
  render();
  checkProgress();
}

function removeLastChar() {
  if (!typedText) return;
  typedText = typedText.slice(0, -1);
  render();
}

function createKeyboard() {
  keyboardEl.innerHTML = "";
  kanaKeys.forEach((char) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key";
    button.textContent = char;
    button.addEventListener("click", () => inputChar(char));
    keyboardEl.appendChild(button);
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Backspace") {
    event.preventDefault();
    removeLastChar();
    return;
  }

  if (event.key.length !== 1) return;
  inputChar(event.key);
});

nextBtn.addEventListener("click", pickPrompt);
modeEl.addEventListener("change", pickPrompt);
backspaceBtn.addEventListener("click", removeLastChar);

createKeyboard();
pickPrompt();
updateScoreboard();
