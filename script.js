document.addEventListener("DOMContentLoaded", function () {
const openingScreen = document.getElementById("opening-screen");
const mainContent = document.getElementById("main-content");
const discoverScreen = document.getElementById("discover-screen");
const confessionScreen = document.getElementById("confession-screen");

const nameInput = document.getElementById("visitor-name");
const enterButton = document.getElementById("enter-button");
const nameError = document.getElementById("name-error");
const welcomeTitle = document.getElementById("welcome-title");
const confessionTitle = document.getElementById("confession-title");

const discoverButton = document.getElementById("discover-button");
const confessionButton = document.getElementById("confession-button");
const responseMessage = document.getElementById("response-message");
const restartButton = document.getElementById("restart-button");
const heartsContainer = document.querySelector(".hearts");

let visitorName = "";

function showScreen(screenToShow) {
const screens = [
openingScreen,
mainContent,
discoverScreen,
confessionScreen
];

screens.forEach(function (screen) {
  screen.classList.add("hidden");
});

screenToShow.classList.remove("hidden");

// Replay the entrance animation.
screenToShow.style.animation = "none";
void screenToShow.offsetWidth;
screenToShow.style.animation = "";

window.scrollTo({ top: 0, behavior: "smooth" });

}

function createFloatingHeart() {
if (!heartsContainer) return;

const heart = document.createElement("span");
heart.className = "floating-heart";

const symbols = ["♡", "♥", "✦", "💜", "✨"];
heart.textContent = symbols[
  Math.floor(Math.random() * symbols.length)
];

heart.style.left = Math.random() * 100 + "%";
heart.style.fontSize = 12 + Math.random() * 18 + "px";
heart.style.animationDuration = 6 + Math.random() * 6 + "s";

heartsContainer.appendChild(heart);

setTimeout(function () {
  heart.remove();
}, 12500);

}

// Start the floating-heart animation.
setInterval(createFloatingHeart, 650);

function enterUniverse() {
visitorName = nameInput.value.trim();

if (!visitorName) {
  nameError.textContent = "Please enter your name first 💗";
  nameInput.focus();
  nameInput.classList.add("name-error-animation");

  setTimeout(function () {
    nameInput.classList.remove("name-error-animation");
  }, 500);

  return;
}

nameError.textContent = "";

// Use textContent so the entered name is treated as plain text.
welcomeTitle.textContent = "Welcome, " + visitorName + " 💗";
confessionTitle.textContent = "A Little Message for " + visitorName;

showScreen(mainContent);
createSparkles();

}

function createSparkles() {
for (let i = 0; i < 18; i++) {
setTimeout(createFloatingHeart, i * 100);
}
}

enterButton.addEventListener("click", enterUniverse);

nameInput.addEventListener("keydown", function (event) {
if (event.key === "Enter") {
enterUniverse();
}
});

discoverButton.addEventListener("click", function () {
showScreen(discoverScreen);
createSparkles();
});

confessionButton.addEventListener("click", function () {
showScreen(confessionScreen);
createSparkles();
});

document.querySelectorAll(".choice").forEach(function (button) {
button.addEventListener("click", function () {
const answer = button.dataset.answer;

  if (answer === "yes") {
    responseMessage.textContent =
      "That makes me smile, " + visitorName +
      " 💗 Let's take our time, keep talking, and see where this story goes. ✨";
  } else if (answer === "slow") {
    responseMessage.textContent =
      "Of course, " + visitorName +
      " 🌷 There's no rush. I'd be happy to get to know you slowly, one conversation at a time.";
  } else if (answer === "friends") {
    responseMessage.textContent =
      "Thank you for being honest, " + visitorName +
      " 💜 I respect your feelings, and there's no pressure. I hope we can still be kind to each other.";
  }

  responseMessage.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  createSparkles();
});

});

restartButton.addEventListener("click", function () {
nameInput.value = "";
nameError.textContent = "";
responseMessage.textContent = "";
visitorName = "";
showScreen(openingScreen);
});
});
