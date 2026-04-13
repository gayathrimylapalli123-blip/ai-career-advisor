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
    console.error("AI Error:", error);
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

  let career = data.career || data.message || "Career recommendation not available";
  let resources = data.resources || [];

  // fallback parsing (important)
  if ((!career || career === "Career recommendation not available") && data.output) {
    try {
      const parsed = JSON.parse(data.output[0].content[0].text);
      career = parsed.career || parsed.message || career;
      resources = parsed.resources || resources;
    } catch (e) {
      console.error("Parsing error:", e);
    }
  }

  container.innerHTML = `
    <h2>🎯 Career Suggestions</h2>
    <p style="line-height:1.6;">${career}</p>

    ${resources.length > 0 ? `
      <h3>📚 Learning Resources</h3>
      ${resources.map(r => `
        <div style="margin:10px 0;padding:10px;background:#f3f4f6;border-radius:8px;">
          <strong>${r.title}</strong><br>
          <small>${r.platform}</small><br>
          <a href="${r.link}" target="_blank">Start Learning →</a>
        </div>
      `).join("")}
    ` : ""}

    <button onclick="startApp()" style="margin-top:15px;padding:10px;border:none;border-radius:8px;background:#4CAF50;color:white;">
      Restart
    </button>
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

  let optionsHTML = "";

  options.forEach(option => {
    const safeOption = option.replace(/'/g, "\\'");

    optionsHTML += `
      <button onclick="handleAnswer('${safeOption}')"
        style="width:100%;padding:12px;margin:8px 0;border:none;border-radius:8px;background:#e0e0e0;cursor:pointer;">
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

  // HARD STOP AT 10 QUESTIONS
  if (answers.length >= 10) {
    console.log("Reached max questions → forcing result");
    fetchNextQuestion("__FORCE_RESULT__");
    return;
  }

  fetchNextQuestion(selectedOption);
}