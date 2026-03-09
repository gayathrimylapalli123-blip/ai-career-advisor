async function analyzeSkills() {

    const loading = document.getElementById("loading");
    const resultDiv = document.getElementById("result");

    loading.style.display = "block";
    resultDiv.innerHTML = "";

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

    try {

        const response = await fetch(
            "https://ai-career-advisor-api.onrender.com/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        loading.style.display = "none";

        resultDiv.innerHTML = `
            <div class="result-card">
                <h2>Recommended Role</h2>
                <p>${result.recommended_role}</p>

                <h3>Skills to Learn</h3>
                <p>${result.missing_skills.join(", ")}</p>
            </div>
        `;

    } catch (error) {

        loading.style.display = "none";
        resultDiv.innerHTML = "Error connecting to AI server.";

        console.error(error);
    }
}