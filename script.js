let webhookURL = "https://hook.eu1.make.com/iker9497gakwnfjfve05gjh1yttfrawq";

let conversation = [];

function addMessage(text, sender) {
    let chatBox = document.getElementById("chatBox");
    let div = document.createElement("div");
    div.className = sender;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    let input = document.getElementById("userInput");
    let message = input.value;

    if (!message) return;

    addMessage(message, "user");

    conversation.push({
        role: "user",
        content: message
    });

    input.value = "";

    try {
        let response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: conversation
            })
        });

        let data = await response.json();

        let reply = data.reply || "No response";

        addMessage(reply, "bot");

        conversation.push({
            role: "assistant",
            content: reply
        });

    } catch (error) {
        addMessage("Error connecting to AI", "bot");
        console.error(error);
    }
}