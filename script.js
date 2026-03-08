async function analyzeSkills(){

let q1 = document.getElementById("q1")?.value || "";
let q2 = document.getElementById("q2")?.value || "";
let q3 = document.getElementById("q3")?.value || "";
let q4 = document.getElementById("q4")?.value || "";
let q5 = document.getElementById("q5")?.value || "";
let q6 = document.getElementById("q6")?.value || "";
let q7 = document.getElementById("q7")?.value || "";
let q8 = document.getElementById("q8")?.value || "";
let q9 = document.getElementById("q9")?.value || "";
let q10 = document.getElementById("q10")?.value || "";
let q11 = document.getElementById("q11")?.value || "";
let q12 = document.getElementById("q12")?.value || "";
let q13 = document.getElementById("q13")?.value || "";
let q14 = document.getElementById("q14")?.value || "";
let q15 = document.getElementById("q15")?.value || "";

let answers = {
q1:q1,
q2:q2,
q3:q3,
q4:q4,
q5:q5,
q6:q6,
q7:q7,
q8:q8,
q9:q9,
q10:q10,
q11:q11,
q12:q12,
q13:q13,
q14:q14,
q15:q15
};

try{

let response = await fetch("https://ai-career-advisor-0hrj.onrender.com/analyze",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(answers)

});

let data = await response.json();

document.getElementById("result").innerHTML =
"<b>Recommended Role:</b> " + data.recommended_role +
"<br><b>Missing Skills:</b> " + data.missing_skills.join(", ");

}

catch(error){

document.getElementById("result").innerHTML =
"Error connecting to AI system.";

}


}
