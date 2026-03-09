async function analyzeSkills() {

const data = {
q1: document.getElementById("q1").value,
q2: document.getElementById("q2").value,
q3: document.getElementById("q3").value,
q4: document.getElementById("q4").value,
q5: document.getElementById("q5").value,
q6: document.getElementById("q6").value,
q7: document.getElementById("q7").value,
q8: document.getElementById("q8").value,
q9: document.getElementById("q9").value,
q10: document.getElementById("q10").value,
q11: document.getElementById("q11").value,
q12: document.getElementById("q12").value,
q13: document.getElementById("q13").value,
q14: document.getElementById("q14").value,
q15: document.getElementById("q15").value
};

const response = await fetch(
"https://hook.eu1.make.com/iker9497gakwnfjfve05gjh1yttfrawq",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(data)
}
);

const result = await response.json();

document.getElementById("result").innerHTML = `
<h2>Recommended Role</h2>
<p>${result.recommended_role}</p>

<h3>Skills to Learn</h3>
<p>${result.missing_skills}</p>
`;

}