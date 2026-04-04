const WEBHOOK_URL = "https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793";

let stage = "education";

let userData = {
  education: null,
  skills: [],
  interests: [],
  experience: null
};

let conversationHistory = [];

// ✅ Start button
function start() {
  loadQuestion("");
}

// ✅ Main function
async function loadQuestion(answer = "") {
  try {
    console.log("Sending request...");

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer,
        stage,
        userData,
        history: conversationHistory
      })
    });

    if (!res.ok) throw new Error("Server error");

    let data = await res.json();

    console.log("RAW RESPONSE:", data);

    // ✅ UNIVERSAL CLEANING (handles ALL n8n formats)
    while (Array.isArray(data)) {
      data = data[0];
    }

    if (data && data.json) {
      data = data.json;
    }

    while (Array.isArray(data)) {
      data = data[0];
    }

    console.log("FINAL CLEAN OBJECT:", data);

    // ✅ Validate
    if (!data || typeof data !== "object") {
      alert("Invalid AI response");
      return;
    }

    // ✅ Route response
    if (data.type === "question") {
      showQuestion(data);
    } 
    else if (data.type === "result") {
      showResult(data);
    } 
    else {
      console.error("UNKNOWN STRUCTURE:", data);
      alert("Invalid AI response type");
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);
    alert("Error connecting to AI");
  }
}

// ✅ Show question
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

// ✅ Handle answer
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

  conversationHistory.push({
    stage,
    answer: option
  });

  loadQuestion(option);
}

// ✅ Show result
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