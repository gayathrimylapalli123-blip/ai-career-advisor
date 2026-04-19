// ==========================
// GLOBAL STATE
// ==========================
let answers = [];
let isLoading = false;

// ==========================
// START APP
// ==========================
function startApp() {
answers = [];
showLoader();
fetchNextQuestion(null);
}

// ==========================
// LOADER UI
// ==========================
function showLoader() {
const container = document.querySelector(".card");
container.innerHTML = `     <div class="loader-box">       <div class="spinner"></div>       <p>Thinking... 🤖</p>     </div>
  `;
}

// ==========================
// FETCH QUESTION FROM n8n
// ==========================
async function fetchNextQuestion(answer) {
if (isLoading) return;
isLoading = true;

showLoader();

console.log("STAGE:", answers.length);

try {
const response = await fetch("http://localhost:5678/webhook/career-advisor", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
answer: answer,
stage: answers.length,
history: answers,
forceResult: answers.length >= 10
})
});

```
const data = await response.json();

setTimeout(() => {
  showQuestion(data);
  isLoading = false;
}, 300);
```

} catch (error) {
console.error("FETCH ERROR:", error);
alert("Error connecting to backend");
isLoading = false;
}
}

// ==========================
// DISPLAY QUESTION / RESULT
// ==========================
function showQuestion(data) {
const container = document.querySelector(".card");

// ==========================
// RESULT SCREEN
// ==========================
if (data.type === "result") {

```
let career = data.message || "No career recommendation available";
let resources = data.resources || [];

if (typeof resources === "string") {
  try { resources = JSON.parse(resources); } catch { resources = []; }
}

if (!Array.isArray(resources)) {
  resources = [resources];
}

let resourcesHTML = "";

if (resources.length > 0) {
  resourcesHTML = `
    <h3 class="section-title fade-in">📚 Learning Resources</h3>
    ${resources.map((r, i) => `
      <div class="resource-card fade-in" style="animation-delay:${i * 0.1}s">
        <strong>${r.title}</strong>
        <small>${r.platform}</small>
        <p>${r.description || ""}</p>
        <a href="${r.link}" target="_blank">Start Learning →</a>
      </div>
    `).join("")}
  `;
}

container.innerHTML = `
  <h2 class="fade-in">🎯 Career Recommendation</h2>
  <div class="result-box fade-in">
    <p>${career}</p>
  </div>
  ${resourcesHTML}
  <button class="fade-in" onclick="startApp()">Restart</button>
`;
return;
```

}

// ==========================
// QUESTION SCREEN
// ==========================
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

if (!options || options.length === 0) {
fetchNextQuestion("**FORCE_RESULT**");
return;
}

let optionsHTML = "";

options.forEach((option, i) => {
const safeOption = option.replace(/'/g, "\'");
optionsHTML += `       <button class="option-btn fade-in"
              style="animation-delay:${i * 0.1}s"
              onclick="handleAnswer('${safeOption}')">
        ${option}       </button>
    `;
});

container.innerHTML = `     <h2 class="fade-in">🚀 AI Career Advisor</h2>     <p class="fade-in">${data.question || "Loading..."}</p>     <div>${optionsHTML}</div>
  `;
}

// ==========================
// HANDLE USER ANSWER
// ==========================
function handleAnswer(selectedOption) {
if (isLoading) return;

answers.push(selectedOption);

if (answers.length >= 10) {
fetchNextQuestion("**FORCE_RESULT**");
return;
}

fetchNextQuestion(selectedOption);
}
