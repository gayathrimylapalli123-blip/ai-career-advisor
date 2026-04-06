const WEBHOOK_URL = "https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793";

// 👉 Start button click
function startApp() {
  loadQuestion();
}

// 👉 Call backend
async function loadQuestion() {
  try {
    console.log("Sending request...");

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
    });

    const data = await response.json();

    console.log("RESPONSE DATA:", data);

    // Show question
    showQuestion(data);

  } catch (error) {
    console.error("FETCH ERROR:", error);
    alert("Error connecting to AI");
  }
}

// 👉 Render question + options
function showQuestion(data) {
  const container = document.querySelector(".card");

  // Replace UI
  container.innerHTML = `
    <h2>🚀 AI Career Advisor</h2>
    <p>${data.question}</p>
    <div id="options"></div>
  `;

  const optionsContainer = document.getElementById("options");

  // Ensure options is always an array
  let options = data.options;

  if (!Array.isArray(options)) {
    try {
      options = JSON.parse(options);
    } catch (e) {
      console.error("Options parsing failed:", e);
      options = [];
    }
  }

  // Render buttons
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.className = "option-btn";

    btn.onclick = () => handleAnswer(option);

    optionsContainer.appendChild(btn);
  });
}

// 👉 Handle click
async function handleAnswer(selectedOption) {
  console.log("User selected:", selectedOption);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: selectedOption
      })
    });

    const data = await response.json();

    console.log("NEXT QUESTION:", data);

    // 👉 show next question
    showQuestion(data);

  } catch (error) {
    console.error("ERROR:", error);
    alert("Error getting next question");
  }
}