// ==========================
// GLOBAL STATE
// ==========================
let answers = [];
let isLoading = false;
let quizCompleted = false;

// ==========================
// START APP
// ==========================
function startApp() {
  answers = [];
  isLoading = false;
  quizCompleted = false;
  fetchNextQuestion("start");
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
  if (quizCompleted && answer !== "__FORCE_RESULT__") return;
  if (isLoading) return;

  isLoading = true;
  showLoader();

  console.log("STAGE:", answers.length);

  try {
    const response = await fetch("https://pension-wildly-catsup.ngrok-free.dev/webhook/career-advisor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: answer,
        stage: answers.length,
        history: answers,
        forceResult: answers.length >= 7
      })
    });

    const text = await response.text();

    if (!text) {
      console.error("Empty response from backend");
      isLoading = false;
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON:", text);
      isLoading = false;
      return;
    }

    console.log("RAW RESPONSE:", data);

    // ❌ invalid AI response
    if (!data || !data.type) {
      console.error("Invalid AI response:", data);
      isLoading = false;
      return;
    }

    // ==========================
    // RESULT
    // ==========================
    if (data.type === "result") {
      quizCompleted = true;
      showResult(data);
      isLoading = false;
      return;
    }

    // ==========================
    // QUESTION
    // ==========================
    showQuestion(data);
    isLoading = false;

  } catch (error) {
    console.error("ERROR:", error);
    alert("Backend connection failed");
    isLoading = false;
  }
}

// ==========================
// SHOW QUESTION
// ==========================
function showQuestion(data) {
  const container = document.querySelector(".card");

  if (!Array.isArray(data.options)) {
    console.error("Options missing:", data);
    return;
  }

  let buttons = data.options.map(opt => `
    <button class="option-btn" data-value="${opt}">
      ${opt}
    </button>
  `).join("");

  container.innerHTML = `
    <h2>🚀 AI Career Advisor</h2>
    <p>${data.question || "Loading..."}</p>
    <div class="options">${buttons}</div>
  `;

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

  answers.push(option);

  console.log("ANSWERS:", answers);

  // 🔥 stop at 7 → force result
  if (answers.length >= 7) {
    quizCompleted = true;
    fetchNextQuestion("__FORCE_RESULT__");
    return;
  }

  fetchNextQuestion(option);
}

// ==========================
// SHOW RESULT
// ==========================
function showResult(data) {
  const container = document.querySelector(".card");

  container.innerHTML = `
    <h2>🎯 Your Career Recommendation</h2>
    <h3>${data.career || "No career found"}</h3>
    <p><strong>Why:</strong> ${data.reason || "No explanation available"}</p>

    <h4>Skills to Learn:</h4>
    <ul>
      ${(data.skills_to_learn || []).map(skill => `<li>${skill}</li>`).join("")}
    </ul>

    <h4>Next Steps:</h4>
    <ul>
      ${(data.next_steps || []).map(step => `<li>${step}</li>`).join("")}
    </ul>

    <button onclick="startApp()">Restart</button>
  `;
}

// ==========================
// INIT
// ==========================
startApp();