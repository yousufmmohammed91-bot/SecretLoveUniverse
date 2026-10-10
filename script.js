// Create a gentle starry background.
const starContainer = document.getElementById("stars");

for (let i = 0; i < 90; i++) {
  const star = document.createElement("span");
  star.className = "star";
  star.textContent = Math.random() > 0.5 ? "✦" : "·";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.fontSize = (8 + Math.random() * 12) + "px";
  star.style.animationDelay = Math.random() * 3 + "s";
  star.style.animationDuration = (2 + Math.random() * 4) + "s";
  starContainer.appendChild(star);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  const nextScreen = document.getElementById(screenId);
  if (nextScreen) {
    nextScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openDoor() {
  document.querySelector(".door").classList.add("open");
  setTimeout(() => showScreen("universe"), 950);
}

const questionFields = [
  { id: "nickname", label: "Your name or nickname" },
  { id: "bts", label: "Favourite BTS member" },
  { id: "song", label: "Favourite BTS song" },
  { id: "happiness", label: "What makes you happy" },
  { id: "friendship", label: "Your thoughts on unexpected friendships" },
  { id: "message", label: "Something you'd like to share" }
];

function readAnswersFromForm() {
  const answers = {};
  questionFields.forEach(field => {
    answers[field.id] = document.getElementById(field.id).value.trim();
  });
  return answers;
}

function saveAnswers() {
  const answers = readAnswersFromForm();

  if (!answers.nickname) {
    alert("Please enter your name or nickname first 💜");
    document.getElementById("nickname").focus();
    return;
  }

  try {
    localStorage.setItem("secretLoveUniverseAnswers", JSON.stringify(answers));
  } catch (error) {
    console.warn("Browser storage unavailable.", error);
  }

  createAnswerCard(answers);
  showScreen("answerScreen");
}

function createAnswerCard(answers) {
  document.getElementById("personalTitle").textContent =
    answers.nickname + "'s Little Universe 💜";
  document.getElementById("letterGreeting").textContent =
    "Hey, " + answers.nickname + ". 💜";

  const list = document.getElementById("answerList");
  list.replaceChildren();

  questionFields.forEach(field => {
    const value = answers[field.id];
    if (!value) return;

    const row = document.createElement("div");
    row.className = "answer-row";

    const label = document.createElement("div");
    label.className = "answer-label";
    label.textContent = field.label;

    const answer = document.createElement("div");
    answer.className = "answer-value";
    answer.textContent = value;

    row.append(label, answer);
    list.appendChild(row);
  });
}

function restoreAnswers() {
  try {
    const saved = localStorage.getItem("secretLoveUniverseAnswers");
    if (!saved) return;
    const answers = JSON.parse(saved);

    questionFields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input && typeof answers[field.id] === "string") input.value = answers[field.id];
    });
  } catch (error) {
    console.warn("Could not restore saved answers.", error);
  }
}
restoreAnswers();

// Download a self-contained HTML answer card. Open it, then take a screenshot.
function downloadAnswers() {
  const answers = readAnswersFromForm();
  // Prefer the saved answers when available.
  try {
    const saved = localStorage.getItem("secretLoveUniverseAnswers");
    if (saved) Object.assign(answers, JSON.parse(saved));
  } catch (_) {}

  const title = (answers.nickname || "Your") + "'s Little Universe 💜";
  const rows = questionFields
    .filter(field => answers[field.id])
    .map(field => `<div class="row"><div class="label">${escapeHTML(field.label)}</div><div class="value">${escapeHTML(answers[field.id])}</div></div>`)
    .join("");

  const exportDocument = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>My Little Universe</title><style>
*{box-sizing:border-box}body{margin:0;padding:24px 12px;background:#100719;color:#fff8ff;font-family:Georgia,serif}
.card{max-width:560px;margin:0 auto;padding:28px 22px;border:1px solid #d7b0ff;border-radius:22px;background:linear-gradient(145deg,#392052,#13091f);overflow-wrap:anywhere}
.top,.bottom{text-align:center;line-height:2}h1{text-align:center;color:#d9baff;font-size:30px}.subtitle{text-align:center;color:#ead9ff}
.row{padding:14px 0;border-bottom:1px solid #9e7fc355}.label{color:#ffbfe4;font-size:13px;margin-bottom:7px}.value{font-family:Arial,sans-serif;line-height:1.8;white-space:pre-wrap}
.bottom{margin-top:25px;color:#f3d7ff}.signature{color:#ffbfe4;font-style:italic}.hint{text-align:center;color:#d6c2e7;font:12px Arial,sans-serif}
</style></head><body><p class="hint">Take a screenshot of this card to save or share it.</p>
<main class="card"><div class="top">💜 ✨ 🌙 ✨ 💜</div><h1>${escapeHTML(title)}</h1>
<p class="subtitle">A few little things that make you, YOU.</p>${rows}
<div class="bottom"><p>Every person has a story worth knowing. 🌷</p><p class="signature">A little memory from a little universe 💜</p></div></main></body></html>`;

  const blob = new Blob([exportDocument], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "My-Little-Universe.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  alert("Your answer card has been saved as an HTML file. Open it and take a screenshot to share it. 💜");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function chooseResponse(choice) {
  const response = document.getElementById("responseMessage");
  response.textContent = choice === "yes"
    ? "That would make this little beginning special. I hope we can have a lovely conversation. 💜"
    : "That's completely okay. Good things can take time. Thank you for visiting this little universe. 🌷";
}

function restartJourney() {
  document.querySelector(".door").classList.remove("open");
  showScreen("welcome");
}
