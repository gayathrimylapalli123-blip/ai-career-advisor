async function analyzeSkills(){

document.getElementById("loading").style.display="block"
document.getElementById("result").innerHTML=""

let answers={

q1:document.getElementById("q1").value,
q2:document.getElementById("q2").value,
q3:document.getElementById("q3").value,
q4:document.getElementById("q4").value,
q5:document.getElementById("q5").value,
q6:document.getElementById("q6").value,
q7:document.getElementById("q7").value,
q8:document.getElementById("q8").value,
q9:document.getElementById("q9").value,
q10:document.getElementById("q10").value,
q11:document.getElementById("q11").value,
q12:document.getElementById("q12").value,
q13:document.getElementById("q13").value,
q14:document.getElementById("q14").value,
q15:document.getElementById("q15").value

}

let response=await fetch("http://127.0.0.1:8000/analyze",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(answers)

})

let data=await response.json()

document.getElementById("loading").style.display="none"

document.getElementById("result").innerHTML=

"<h3>Recommended Role</h3>"+data.recommended_role+

"<h3>Skills to Learn</h3>"+data.missing_skills.join(", ")

}