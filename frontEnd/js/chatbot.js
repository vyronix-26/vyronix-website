const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const suggestionButtons = document.querySelectorAll(".suggestion-btn");
const clearChat = document.getElementById("clearChat");

const botReplies = [
    {
        keywords: ["services", "provide", "offer", "خدمات"],
        reply: "VYRONIX provides web development, mobile apps, dashboards, business systems, UI/UX design, digital platforms, and AI assistant solutions."
    },
    {
        keywords: ["website", "company website", "web", "موقع"],
        reply: "Yes, we can build a professional company website with responsive design, modern UI/UX, contact forms, SEO structure, and business-focused sections."
    },
    {
        keywords: ["dashboard", "system", "admin", "لوحة", "داشبورد"],
        reply: "Absolutely. We build custom dashboard systems for managing clients, orders, employees, reports, analytics, and business operations."
    },
    {
        keywords: ["mobile", "app", "android", "ios", "تطبيق"],
        reply: "We can build modern mobile applications for Android and iOS with clean interfaces, smooth user experience, and scalable structure."
    },
    {
        keywords: ["price", "cost", "pricing", "budget", "سعر", "تكلفة"],
        reply: "Project pricing depends on features, design complexity, number of pages, dashboard requirements, and timeline. You can contact us to get a custom quotation."
    },
    {
        keywords: ["contact", "phone", "email", "team", "تواصل"],
        reply: "You can contact VYRONIX through the contact form, by phone at +970 599 000 000, or by email at info@vyronix.com."
    },
    {
        keywords: ["ui", "ux", "design", "تصميم"],
        reply: "Our UI/UX service includes wireframes, modern interface design, user flow planning, responsive layouts, and visual identity improvements."
    },
    {
        keywords: ["ai", "chatbot", "assistant", "ذكاء"],
        reply: "We can create AI assistants and smart chatbot experiences for customer support, business automation, and digital platforms."
    }
];

function addMessage(text, type) {
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

function showTyping() {
    const typing = document.createElement("div");
    typing.className = "message bot-message typing";
    typing.id = "typingIndicator";

    typing.innerHTML = `
        <div class="message-icon">
            <i class="bi bi-robot"></i>
        </div>
        <p>
            <span></span>
            <span></span>
            <span></span>
        </p>
    `;

    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("typingIndicator");
    if (typing) typing.remove();
}

function getBotReply(userMessage) {
    const message = userMessage.toLowerCase();

    for (let item of botReplies) {
        if (item.keywords.some(keyword => message.includes(keyword.toLowerCase()))) {
            return item.reply;
        }
    }

    return "Thanks for your message. VYRONIX can help you turn your idea into a professional digital product. Tell me more about your project type, features, and target users.";
}

function handleUserMessage(text) {
    if (!text.trim()) return;

    addMessage(text, "user");
    chatInput.value = "";

    showTyping();

    setTimeout(() => {
        removeTyping();
        const reply = getBotReply(text);
        addMessage(reply, "bot");
    }, 800);
}

if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleUserMessage(chatInput.value);
    });
}

suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        handleUserMessage(button.textContent);
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