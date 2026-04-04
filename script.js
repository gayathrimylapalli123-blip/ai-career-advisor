const WEBHOOK_URL = "https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793";
let stage = "education";

let userData = {
  education: null,
  skills: [],
  interests: [],
  experience: null
};

let conversationHistory = [];
// Start button click
function start() {
  loadQuestion("");
}

// Load question from n8n
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

    const data = await res.json();
    console.log("RAW RESPONSE:", data);

   let text = data?.text || JSON.stringify(data);

    if (!text) {
      console.error("Invalid response:", data);
      alert("Invalid response from AI");
      return;
    }

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);
    console.log("PARSED DATA:", parsed);

    if (parsed.type === "question") {
      showQuestion(parsed);
    } else if (parsed.type === "result") {
      showResult(parsed);
    }

  } catch (err) {
    console.error(err);
    alert("Error connecting to AI");
  }
}

// Show question + options
function showQuestion(data) {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  questionEl.innerText = data.question;
  optionsEl.innerHTML = "";

  data.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.className = "option-btn";

   btn.onclick = () => {

  // Update state BEFORE sending
  if (stage === "education") {
    userData.education = option;
    stage = "skills";
  } 
  else if (stage === "skills") {
    userData.skills.push(option);
    stage = "interests";
  } 
  else if (stage === "interests") {
    userData.interests.push(option);
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

  // Send to AI
  loadQuestion(option);
};

    optionsEl.appendChild(btn);
  });
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