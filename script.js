document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    // Safely connect to elements that exist in index.html
    const opening = $("opening-screen");
    const main = $("main-content");

    // Open the secret universe
    window.enterUniverse = function () {
        if (opening) opening.style.display = "none";
        if (main) main.style.display = "block";

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Question and answer collection
    const questions = [
        {
            question: "Which BTS song feels like magic to you? 💜",
            placeholder: "Type your favourite BTS song..."
        },
        {
            question: "If you could visit one magical world, where would you go? 🌌",
            placeholder: "Describe your dream world..."
        },
        {
            question: "What is one little thing that makes you smile? ✨",
            placeholder: "Tell me something that makes you happy..."
        },
        {
            question: "What makes a conversation memorable for you? 🌙",
            placeholder: "Share your thoughts..."
        }
    ];

    let currentQuestion = 0;
    const answers = [];

    const questionText = $("question-text");
    const answerInput = $("answer-input");
    const nextButton = $("next-question");
    const questionNumber = $("question-number");
    const answerArea = $("answer-area");

    function displayQuestion() {
        if (!questionText || !answerInput) return;

        const item = questions[currentQuestion];

        questionText.textContent = item.question;
        answerInput.value = answers[currentQuestion] || "";
        answerInput.placeholder = item.placeholder;

        if (questionNumber) {
            questionNumber.textContent =
                `Question ${currentQuestion + 1} of ${questions.length}`;
        }

        if (nextButton) {
            nextButton.textContent =
                currentQuestion === questions.length - 1
                    ? "Reveal the next chapter ✨"
                    : "Next question →";
        }
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            if (!answerInput || !questionText) return;

            const answer = answerInput.value.trim();

            if (!answer) {
                answerInput.focus();
                answerInput.placeholder = "Write a little answer first 💜";
                return;
            }

            answers[currentQuestion] = answer;

            // Save answers on this device only
            try {
                localStorage.setItem(
                    "secretLoveUniverseAnswers",
                    JSON.stringify(answers)
                );
            } catch (error) {
                console.warn("Browser storage is unavailable.");
            }

            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                displayQuestion();
            } else {
                showFinalChapter();
            }
        });
    }

    function showFinalChapter() {
        if (!answerArea) return;

        answerArea.innerHTML = `
            <div class="final-chapter">
                <h2>✨ A Little Piece of Your Universe ✨</h2>
                <p>Every answer tells a tiny part of your story. 💜</p>

                <div id="answer-card"></div>

                <button id="download-card" type="button">
                    Save Your Answer Card 🌌
                </button>

                <p class="screenshot-note">
                    You can save or screenshot this card if you want to share it.
                </p>

                <h2>The Door to a New Chapter 💜</h2>
                <p>
                    I would like to get to know you better, if you're comfortable.
                    No pressure — your choice matters.
                </p>

                <button id="yes-choice" type="button">
                    YES, LET'S TALK! 💜
                </button>

                <button id="slow-choice" type="button">
                    LET'S TAKE OUR TIME 🌙
                </button>

                <p id="choice-message" aria-live="polite"></p>
            </div>
        `;

        const card = $("answer-card");

        if (card) {
            card.innerHTML = questions.map((item, index) => `
                <div class="answer-item">
                    <h3>${escapeHTML(item.question)}</h3>
                    <p>${escapeHTML(answers[index] || "")}</p>
                </div>
            `).join("");
        }

        const downloadButton = $("download-card");

        if (downloadButton) {
            downloadButton.addEventListener("click", downloadAnswerCard);
        }

        const yesButton = $("yes-choice");
        const slowButton = $("slow-choice");
        const message = $("choice-message");

        if (yesButton && message) {
            yesButton.addEventListener("click", () => {
                message.textContent =
                    "A new chapter begins! 💜 Let's start with a friendly conversation.";
            });
        }

        if (slowButton && message) {
            slowButton.addEventListener("click", () => {
                message.textContent =
                    "Of course! 🌙 There's no rush. We can take things one step at a time.";
            });
        }
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function downloadAnswerCard() {
        const card = $("answer-card");
        if (!card) return;

        const page = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>My Secret Universe 💜</title>
                <style>
                    body {
                        background: #100824;
                        color: #fff;
                        font-family: Arial, sans-serif;
                        padding: 24px;
                        line-height: 1.6;
                    }
                    main {
                        max-width: 650px;
                        margin: auto;
                        padding: 24px;
                        border: 1px solid #b58cff;
                        border-radius: 20px;
                        background: #20103d;
                    }
                    h1, h2 { color: #e0c3ff; }
                    .answer-item {
                        padding: 12px;
                        margin: 14px 0;
                        border-radius: 12px;
                        background: #321b50;
                        overflow-wrap: anywhere;
                    }
                    p { white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <main>
                    <h1>My Secret Universe 🌌💜</h1>
                    ${card.innerHTML}
                    <p>A little story, written one answer at a time. ✨</p>
                </main>
            </body>
            </html>
        `;

        const blob = new Blob([page], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "my-secret-universe.html";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // Restore saved answers if available
    try {
        const saved = JSON.parse(
            localStorage.getItem("secretLoveUniverseAnswers") || "[]"
        );

        if (Array.isArray(saved)) {
            saved.forEach((answer, index) => {
                if (typeof answer === "string" && index < questions.length) {
                    answers[index] = answer;
                }
            });
        }
    } catch (error) {
        console.warn("Could not restore saved answers.");
    }

    displayQuestion();
});
