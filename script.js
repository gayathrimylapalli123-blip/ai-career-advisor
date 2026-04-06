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
        history: answers
      })
    });

    const data = await response.json();
    console.log("RESPONSE DATA:", data);

    showQuestion(data);

  } catch (error) {
    console.error("FETCH ERROR:", error);
    alert("Error connecting to AI");
  }
}


// ==========================
// DISPLAY QUESTION (SAFE)
// ==========================
function showQuestion(data) {

  console.log("FINAL DATA:", data);

  let container = document.querySelector(".card");

  if (!container) {
    console.error("Container not found");
    return;
  }

  if (data.type === "result") {
    container.innerHTML = `
      <h2>🎯 Career Suggestions</h2>
      <p>${data.message}</p>
    `;
    return;
  }

  // ✅ SAFE OPTIONS PARSING
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

  if (options.length > 0) {
    options.forEach(option => {

      // ✅ SAFE STRING (FIXES YOUR ERROR)
      const safeOption = option.replace(/'/g, "\\'");

      optionsHTML += `
        <button onclick="handleAnswer('${safeOption}')"
          style="width:100%;padding:12px;margin:8px 0;border:none;border-radius:8px;background:#e0e0e0;cursor:pointer;">
          ${option}
        </button>
      `;
    });
  }

  container.innerHTML = `
    <h2>🚀 AI Career Advisor</h2>
    <p>${data.question}</p>
    <div>${optionsHTML}</div>
  `;
}

// ==========================
// HANDLE USER ANSWER
// ==========================
function handleAnswer(selectedOption) {
  console.log("User selected:", selectedOption);

  answers.push(selectedOption);

  // stage flow control
  if (currentStage === "education") {
    currentStage = "field";
  } 
  else if (currentStage === "field") {
    currentStage = "skills";
  } 
  else if (currentStage === "skills") {
    currentStage = "result";
  }

  fetchNextQuestion(selectedOption);
}