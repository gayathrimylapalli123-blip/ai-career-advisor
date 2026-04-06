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

  let container = document.getElementById("app");

  if (!container) {
    container = document.querySelector(".card");
  }

  if (!container) {
    console.error("No container found");
    return;
  }

  // RESULT
  if (data.type === "result") {
    container.innerHTML = `
      <h2>🎯 Career Suggestions</h2>
      <p>${data.message}</p>
    `;
    return;
  }

  // BUILD OPTIONS
  let optionsHTML = "";

  if (Array.isArray(data.options) && data.options.length > 0) {
    data.options.forEach(option => {
      optionsHTML += `
        <button 
          style="
            width:100%;
            padding:12px;
            margin:8px 0;
            border:none;
            border-radius:8px;
            background:#e0e0e0;
            cursor:pointer;
            font-size:14px;
          "
          onclick="handleAnswer('${option}')"
        >
          ${option}
        </button>
      `;
    });
  } else {
    console.warn("No options received");
  }

  // RENDER UI
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