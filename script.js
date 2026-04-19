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
container.innerHTML =
'<div class="loader-box">' +
'<div class="spinner"></div>' +
'<p>Thinking... 🤖</p>' +
'</div>';
}

// ==========================
// FETCH QUESTION
// ==========================
async function fetchNextQuestion(answer) {
if (isLoading) return;
isLoading = true;

showLoader();

console.log("STAGE:", answers.length);

try {
const response = await fetch("https://pension-wildly-catsup.ngrok-free.dev/webhook/career-advisor", {
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
console.error("ERROR:", error);
alert("Backend connection failed");
isLoading = false;
}
}

// ==========================
// SHOW QUESTION / RESULT
// ==========================
function showQuestion(data) {
const container = document.querySelector(".card");

// RESULT
if (data.type === "result") {
let html = '<h2>🎯 Career Recommendation</h2>';
html += '<p>' + (data.message || "No result") + '</p>';

```
if (Array.isArray(data.resources)) {
  html += '<h3>📚 Resources</h3>';
  data.resources.forEach(r => {
    html +=
      '<div>' +
        '<strong>' + r.title + '</strong><br>' +
        '<small>' + r.platform + '</small><br>' +
        '<a href="' + r.link + '" target="_blank">Open</a>' +
      '</div><br>';
  });
}

html += '<button onclick="startApp()">Restart</button>';

container.innerHTML = html;
return;
```

}

// QUESTION
let options = [];

if (Array.isArray(data.options)) {
options = data.options;
}

let buttons = "";

options.forEach((opt, i) => {
const safe = opt.replace(/'/g, "\'");
buttons +=
'<button onclick="handleAnswer(\'' + safe + '\')">' +
opt +
'</button><br>';
});

container.innerHTML =
'<h2>🚀 AI Career Advisor</h2>' +
'<p>' + (data.question || "") + '</p>' +
buttons;
}

// ==========================
// HANDLE ANSWER
// ==========================
function handleAnswer(option) {
if (isLoading) return;

answers.push(option);

if (answers.length >= 10) {
fetchNextQuestion("**FORCE_RESULT**");
return;
}

fetchNextQuestion(option);
}
