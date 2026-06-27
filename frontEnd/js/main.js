const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");
    });
});

const chatBtn = document.querySelector(".chat-btn");

chatBtn.addEventListener("click", () => {
    alert("Hello! I am VYRONIX smart assistant.");
});