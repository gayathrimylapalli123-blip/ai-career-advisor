const WEBHOOK_URL = "https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793";

console.log("✅ NEW VERSION LOADED");

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

// Main function
async function loadQuestion(answer = "") {
  try {
    console.log("📤 Sending request...");

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

    console.log("📡 Status:", res.status);

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();
    console.log("📥 RAW RESPONSE:", data);

    // ✅ Expecting this from n8n: { text: "..." }
    let text = data.text;

    if (!text) {
      console.error("❌ FULL RESPONSE:", data);
      alert("No response from AI");
      return;
    }

    // Clean markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", text);
      alert("Invalid AI response format");
      return;
    }

    console.log("✅ PARSED DATA:", parsed);

    // ✅ Update stage from AI (IMPORTANT)
    if (parsed.next_stage) {
      stage = parsed.next_stage;
    }

    if (parsed.type === "question") {
      showQuestion(parsed);
    } else if (parsed.type === "result") {
      showResult(parsed);
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

// Handle answer
function handleAnswer(option) {

  // Update local state (backup safety)
  if (stage === "education") {
    userData.education = option;
  } 
  else if (stage === "skills") {
    if (!userData.skills.includes(option)) {
      userData.skills.push(option);
    }
  } 
  else if (stage === "interests") {
    if (!userData.interests.includes(option)) {
      userData.interests.push(option);
    }
  } 
  else if (stage === "experience") {
    userData.experience = option;
  }

  // Save history
  conversationHistory.push({
    stage: stage,
    answer: option
  });

  // Show loading
  document.getElementById("options").innerHTML = "<p>Loading...</p>";

  // Call next question
  loadQuestion(option);
}

// Show result
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