const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const clearChat = document.getElementById("clearChat");

function addMessage(text, type = "bot") {
    const message = document.createElement("div");
    message.className = `message ${type}-message`;

    if (type === "bot") {
        message.innerHTML = `
            <div class="message-icon">
                <i class="bi bi-robot"></i>
            </div>
            <p>${text}</p>
        `;
    } else {
        message.innerHTML = `<p>${text}</p>`;
    }

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatInput.value = "";

    try {
        const response = await apiRequest("/chatbot/message", "POST", {
            message: message
        });

addMessage(
    response.reply || 
    response.response || 
    response.data?.reply || 
    response.data?.response || 
    response.data?.message ||
    response.message || 
    "I received your message.",
    "bot"
);
    } catch (error) {
        console.error(error);
        addMessage("Sorry, I could not connect to the assistant right now.", "bot");
    }
});

document.querySelectorAll(".suggestion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        chatInput.value = btn.textContent;
        chatForm.requestSubmit();
    });
});

if (clearChat) {
    clearChat.addEventListener("click", () => {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-icon">
                    <i class="bi bi-robot"></i>
                </div>
                <p>Hello! I’m VYRONIX smart assistant. How can I help your business today?</p>
            </div>
        `;
    });
}