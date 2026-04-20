// ==========================
// GLOBAL STATE
// ==========================
let answers = [];
let isLoading = false;
let quizCompleted = false; // 🔒 prevents extra calls

// ==========================
// START APP
// ==========================
function startApp() {
  answers = [];
  isLoading = false;
  quizCompleted = false;
  fetchNextQuestion(null);
}

// ==========================
// LOADER UI
// ==========================
function showLoader() {
  const container = document.querySelector(".card");
  container.innerHTML = `
    <div class="loader-box">
      <div class="spinner"></div>
      <p>Thinking... 🤖</p>
    </div>
  `;
}

// ==========================
// FETCH QUESTION
// ==========================
async function fetchNextQuestion(answer) {
  // 🚨 STOP if already completed
  if (quizCompleted && answer !== "__FORCE_RESULT__") {
    console.log("Blocked extra request");
    return;
  }

  if (isLoading) return;
  isLoading = true;

  showLoader();

  console.log("STAGE:", answers.length);

  try {
    const response = await fetch("/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  answer: answer,
  stage: answers.length,
  history: answers.map((ans, i) => ({
    stage: i,
    answer: ans
  })),
  forceResult: answers.length === 10
})
    });

    const data = await response.json();

    console.log("RAW RESPONSE:", data);

    setTimeout(() => {
      showQuestion(data);
      isLoading = false;
    }, 300);

  } catch (error) {
    console.error("ERROR:", error);
    alert("Backend connection failed");
    isLoading = false;
  }
}

// ==========================
// SHOW QUESTION / RESULT
// ==========================
function showQuestion(data) {
  const container = document.querySelector(".card");

  // ==========================
  // RESULT SCREEN
  // ==========================
  if (data.type === "result") {
    quizCompleted = true; // 🔒 LOCK SYSTEM

    let html = `<h2>🎯 Career Recommendation</h2>`;
    html += `<p>${data.message || "No result available"}</p>`;

    if (Array.isArray(data.resources)) {
      html += `<h3>📚 Resources</h3>`;
      data.resources.forEach(r => {
        html += `
          <div>
            <strong>${r.title}</strong><br>
            <small>${r.platform}</small><br>
            <a href="${r.link}" target="_blank">Open</a>
          </div><br>
        `;
      });
    }

    html += `<button id="restartBtn">Restart</button>`;
    container.innerHTML = html;

    document.getElementById("restartBtn").addEventListener("click", startApp);
    return;
  }

  // ==========================
  // QUESTION SCREEN
  // ==========================
  let buttons = "";

  if (Array.isArray(data.options)) {
    data.options.forEach(opt => {
      buttons += `
        <button class="option-btn" data-value="${opt}">
          ${opt}
        </button><br>
      `;
    });
  }

  container.innerHTML = `
    <h2>🚀 AI Career Advisor</h2>
    <p>${data.question || "Loading..."}</p>
    ${buttons}
  `;

  // ✅ SAFE EVENT LISTENERS
  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      handleAnswer(btn.dataset.value);
    });
  });
}

// ==========================
// HANDLE ANSWER
// ==========================
function handleAnswer(option) {
  if (isLoading || quizCompleted) return;

  // 🚨 HARD STOP
  if (answers.length >= 10) {
    console.log("STOP: Max reached");
    return;
  }

  answers.push(option);

  // ✅ EXACTLY 10 → GET RESULT
  if (answers.length === 10) {
    quizCompleted = true;
    fetchNextQuestion("__FORCE_RESULT__");
    return;
  }

  fetchNextQuestion(option);
}

// ==========================
// INIT
// ==========================
startApp();