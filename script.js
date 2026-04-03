const WEBHOOK_URL = "https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793";

// Start button click
function start() {
  loadQuestion("");
}

// Load question from n8n
async function loadQuestion(answer = "") {
  try {
  const url = WEBHOOK_URL + "?answer=" + encodeURIComponent(answer);

const res = await fetch(WEBHOOK_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ answer })
});

    const data = await res.json();
    console.log("RAW RESPONSE:", data);

    // 🔥 Extract text from n8n response
   let text = data?.output?.[0]?.content?.[0]?.text;

if (!text) {
  console.error("Invalid response:", data);
  alert("Invalid response from AI");
  return;
}

    // 🔥 Clean markdown (```json ... ```)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 🔥 Convert to JSON
    const parsed = JSON.parse(text);
    console.log("PARSED DATA:", parsed);

    // 🔥 Decide what to show
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