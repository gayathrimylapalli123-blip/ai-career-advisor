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

    // ✅ FINAL SAFETY UNWRAP
    if (Array.isArray(data)) {
      data = data[0];
    }

    console.log("FINAL FINAL DATA:", data);

    // ✅ VALIDATION
    if (!data || typeof data !== "object") {
      alert("Invalid AI response");
      return;
    }

    // ✅ HANDLE TYPE (fixes spacing issues)
   // 🔥 FORCE EXTRACT REAL DATA (FINAL FIX)

if (!data.type && data.output) {
  try {
    const text = data.output[0].content[0].text;
    data = JSON.parse(text);
  } catch (e) {
    console.error("Deep parse failed:", e);
  }
}

console.log("FINAL FIXED DATA:", data);

// ✅ NOW SAFE
// 🔥 FINAL UNIVERSAL FIX (handles ALL n8n + OpenAI formats)

try {
  // If already correct, skip
  if (!data.type) {

    // Case 1: OpenAI/n8n nested structure
    if (data.output?.[0]?.content?.[0]?.text) {
      data = JSON.parse(data.output[0].content[0].text);
    }

    // Case 2: string response
    else if (typeof data === "string") {
      data = JSON.parse(data);
    }

    // Case 3: wrapped json
    else if (data.json) {
      data = data.json;
    }
  }

} catch (e) {
  console.error("FINAL PARSE ERROR:", e);
}

console.log("🚀 FINAL USABLE DATA:", data);

// ✅ FINAL CHECK
// 🔥 FINAL GUARANTEED PARSER

try {

  // STEP 1: extract nested OpenAI response
  if (data.output?.[0]?.content?.[0]?.text) {
    data = JSON.parse(data.output[0].content[0].text);
  }

  // STEP 2: if still string
  else if (typeof data === "string") {
    data = JSON.parse(data);
  }

  // STEP 3: if wrapped
  else if (data.json) {
    data = data.json;
  }

} catch (e) {
  console.error("PARSE ERROR:", e);
}

// 🔥 ABSOLUTE FINAL FIX

try {

  if (data.output?.[0]?.content?.[0]?.text) {
    data = JSON.parse(data.output[0].content[0].text);
  }

  else if (typeof data === "string") {
    data = JSON.parse(data);
  }

  if (!data.type && data.text) {
    data = JSON.parse(data.text);
  }

  if (!data.type && data.json) {
    data = data.json;
  }

} catch (e) {
  console.error("❌ PARSE FAILED:", e);
}

console.log("✅ FINAL DATA AFTER FIX:", data);

// 🔥 FORCE TYPE IF MISSING
if (!data.type) {
  if (data.question && data.options) {
    data.type = "question";
  } else if (data.role) {
    data.type = "result";
  }
}

// ✅ FINAL ROUTING
if (data.type === "question") {
  showQuestion(data);
} 
else if (data.type === "result") {
  showResult(data);
} 
else {
  console.error("🚨 STILL BROKEN:", data);
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