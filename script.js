const WEBHOOK_URL = "https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793";

let stage = "education";

let userData = {
  education: null,
  skills: [],
  interests: [],
  experience: null
};

let conversationHistory = [];

// Start button
function start() {
  loadQuestion("");
}

// 🔥 MAIN FUNCTION (FIXED)
async function loadQuestion(answer = "") {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: answer,
        stage: stage,
        userData: userData,
        history: conversationHistory
      })
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();
    console.log("✅ RESPONSE FROM n8n:", data);

    // ✅ DIRECTLY USE JSON (NO parsing needed)
   const response = Array.isArray(data) ? data[0] : data;

if (response.type === "question") {
  showQuestion(response);
} 
else if (response.type === "result") {
  showResult(response);
} 
else {
  console.error("Unexpected format:", response);
  alert("Invalid AI response");
}
      showQuestion(data);
    } 
    else if (data.type === "result") {
      showResult(data);
    } 
    else {
      console.error("Unexpected format:", data);
      alert("Invalid AI response");
    }

  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    alert("Error connecting to AI");
  }
}

// Show question
function showQuestion(data) {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  questionEl.innerText = data.question;
  optionsEl.innerHTML = "";

  data.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.className = "option-btn";

    btn.onclick = () => handleAnswer(option);

    optionsEl.appendChild(btn);
  });
}

// Handle answer + state update
function handleAnswer(option) {

  if (stage === "education") {
    userData.education = option;
    stage = "skills";
  } 
  else if (stage === "skills") {
    if (!userData.skills.includes(option)) {
      userData.skills.push(option);
    }
    stage = "interests";
  } 
  else if (stage === "interests") {
    if (!userData.interests.includes(option)) {
      userData.interests.push(option);
    }
    stage = "experience";
  } 
  else if (stage === "experience") {
    userData.experience = option;
    stage = "result";
  }

  // Save history
  conversationHistory.push({
    stage: stage,
    answer: option
  });

  loadQuestion(option);
}

// Show final result
function showResult(data) {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  questionEl.innerText = "🎯 Career Recommendation";

  optionsEl.innerHTML = `
    <p><strong>Role:</strong> ${data.role}</p>
    <p><strong>Skills Gap:</strong> ${data.skills_gap.join(", ")}</p>
    <p><strong>Roadmap:</strong> ${data.roadmap.join(", ")}</p>
    <p><strong>Resources:</strong> ${data.resources.join(", ")}</p>
  `;
}