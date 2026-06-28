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
// search functionality
const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".digital-card");

function filterCards(value) {
    cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();

        const match = title.includes(value);

        card.style.display = match ? "flex" : "none";
    });
}


function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const handleSearch = debounce(function (e) {
    const value = e.target.value.toLowerCase().trim();
    filterCards(value);
}, 200);

searchInput.addEventListener("input", handleSearch);