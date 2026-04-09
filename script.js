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
  forceResult: answer === "__FORCE_RESULT__"   // ✅ ADD THIS LINE
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

    let career = data.career || data.message;
let resources = data.resources || [];
    // fallback parsing (if OpenAI returns string)
    if (!message && data.output) {
      try {
        const parsed = JSON.parse(data.output[0].content[0].text);
        message = parsed.message;
      } catch (e) {
        console.error("Parsing error:", e);
      }
    }

    container.innerHTML = `
      <h2>🎯 Career Suggestions</h2>
      <p>${message || "No suggestions available"}</p>
      <button onclick="startApp()" style="margin-top:15px;padding:10px;border:none;border-radius:8px;background:#4CAF50;color:white;cursor:pointer;">
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

  // 🔴 HARD STOP AT 10 (frontend guarantee)
  if (answers.length >= 10) {
    console.log("Reached max questions → forcing result");
    fetchNextQuestion("__FORCE_RESULT__");  // special signal
    return; // ❗ do NOT continue asking questions
  }

  fetchNextQuestion(selectedOption);
}