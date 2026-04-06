// ==========================
// GLOBAL STATE
// ==========================
let currentStage = "education";  // controls flow
let answers = [];                // store user answers


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
// DISPLAY QUESTION
// ==========================
function showQuestion(data) {
  const container = document.getElementById("app");

  // RESULT SCREEN
  if (data.type === "result") {
    container.innerHTML = `
      <h2>🎯 Career Suggestions</h2>
      <p>${data.message}</p>
    `;
    return;
  }

  // QUESTION SCREEN
  let optionsHTML = "";

  if (Array.isArray(data.options)) {
    data.options.forEach(option => {
      optionsHTML += `
        <button class="option-btn" onclick="handleAnswer('${option}')">
          ${option}
        </button>
      `;
    });
  }

  container.innerHTML = `
    <h2>🚀 AI Career Advisor</h2>
    <p>${data.question}</p>
    <div class="options">${optionsHTML}</div>
  `;
}


// ==========================
// HANDLE USER ANSWER
// ==========================
function handleAnswer(selectedOption) {
  console.log("User selected:", selectedOption);

  // store answer
  answers.push(selectedOption);

  // update stage
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