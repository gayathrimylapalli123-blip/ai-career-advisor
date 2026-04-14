// ==========================
// GLOBAL STATE
// ==========================
let currentStage = "education";
let answers = [];

// ==========================
// START APP
// ==========================
function startApp() {
  console.log("App started");

  currentStage = "education";
  answers = [];

  fetchNextQuestion(null);
}

// ==========================
// FETCH QUESTION FROM n8n
// ==========================
async function fetchNextQuestion(answer) {
  try {
    console.log("Sending request...");

    const response = await fetch("https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: answer,
        stage: currentStage,
        history: [...new Set(answers)],
        count: answers.length,
        forceResult: answer === "__FORCE_RESULT__"
      })
    });

    const data = await response.json();

    console.log("RESPONSE DATA:", data);
    console.log("History:", answers);
    console.log("Count:", answers.length);

    showQuestion(data);

  } catch (error) {
    console.error("FETCH ERROR:", error);
    alert("Error connecting to AI");
  }
}

// ==========================
// DISPLAY QUESTION / RESULT
// ==========================
function showQuestion(data) {

  console.log("FINAL DATA:", data);

  let container = document.querySelector(".card");

  if (!container) {
    console.error("Container not found");
    return;
  }

 // ==========================
// RESULT SCREEN
// ==========================
if (data.type === "result") {

  let career = data.career || data.message || "No career recommendation available";
  let resources = data.resources || [];

  if (typeof resources === "string") {
    try { resources = JSON.parse(resources); } catch { resources = []; }
  }

  if (!Array.isArray(resources)) {
    resources = [resources];
  }

  let resourcesHTML = "";

  if (resources.length > 0) {
    resourcesHTML = `
      <h3 class="section-title">📚 Learning Resources</h3>
      ${resources.map(r => `
        <div class="resource-card">
          <strong>${r.title}</strong>
          <small>${r.platform}</small>
          <p>${r.description || ""}</p>
          <a href="${r.link}" target="_blank">Start Learning →</a>
        </div>
      `).join("")}
    `;
  }

  container.innerHTML = `
    <h2>🎯 Career Suggestions</h2>

    <div class="result-box">
      <p>${career}</p>
    </div>

    ${resourcesHTML}

    <button onclick="startApp()">Restart</button>
  `;

  return;
}
  // ==========================
  // QUESTION SCREEN
  // ==========================
  let options = [];

  try {
    if (Array.isArray(data.options)) {
      options = data.options;
    } else if (typeof data.options === "string") {
      options = JSON.parse(data.options);
    }
  } catch (e) {
    console.error("Options parsing failed:", e);
  }

  console.log("OPTIONS:", options);

  // ❌ PREVENT EMPTY OPTIONS BUG
  if (!options || options.length === 0) {
    console.warn("No options → forcing result");
    fetchNextQuestion("__FORCE_RESULT__");
    return;
  }

  let optionsHTML = "";

options.forEach(option => {
  const safeOption = option.replace(/'/g, "\\'");

  optionsHTML += `
   <button class="option-btn" onclick="handleAnswer('${safeOption}')">
      ${option}
    </button>
  `;
});
  container.innerHTML = `
    <h2>🚀 AI Career Advisor</h2>
    <p>${data.question || "Loading..."}</p>
    <div>${optionsHTML}</div>
  `;
}

// ==========================
// HANDLE USER ANSWER
// ==========================
function handleAnswer(selectedOption) {
  console.log("User selected:", selectedOption);

  if (answers[answers.length - 1] !== selectedOption) {
    answers.push(selectedOption);
  }

  // ✅ HARD STOP AT 10
  if (answers.length >= 10) {
    console.log("Reached max questions → forcing result");
    fetchNextQuestion("__FORCE_RESULT__");
    return;
  }

  fetchNextQuestion(selectedOption);
}