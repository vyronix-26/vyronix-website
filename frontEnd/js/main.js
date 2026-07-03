const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 90) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {
    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("show");
    });

    document.querySelectorAll(".navbar a").forEach((link) => {
        link.addEventListener("click", () => {
            navbar.classList.remove("show");
        });
    });
}

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

function startCounters() {
    if (countersStarted) return;

    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;

    const top = statsSection.getBoundingClientRect().top;

    if (top < window.innerHeight - 120) {
        countersStarted = true;

        counters.forEach((counter) => {
            const target = Number(counter.dataset.count);
            let current = 0;
            const speed = Math.max(1, Math.floor(target / 70));

            const update = () => {
                current += speed;

                if (current >= target) {
                    counter.textContent = target;
                    return;
                }

                counter.textContent = current;
                requestAnimationFrame(update);
            };

            update();
        });
    }
}

window.addEventListener("scroll", startCounters);
window.addEventListener("load", startCounters);

const glow = document.getElementById("cursor-glow");

if (glow) {
    document.addEventListener("mousemove", (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });
}

/* Active navbar */
const navLinks = document.querySelectorAll(".navbar a");

function updateActiveNav() {
    const currentPage = window.location.pathname.split("/").pop();
    const currentHash = window.location.hash;

    navLinks.forEach(link => {
        link.classList.remove("active");

        const linkHref = link.getAttribute("href");

        if (currentPage === "index.html" || currentPage === "") {
            if (currentHash) {
                if (linkHref === `index.html${currentHash}`) {
                    link.classList.add("active");
                }
            } else if (linkHref === "index.html#home") {
                link.classList.add("active");
            }
        }

        if (currentPage === "ourteam.html" && linkHref === "ourteam.html") {
            link.classList.add("active");
        }

        if (currentPage === "contact.html" && linkHref === "contact.html") {
            link.classList.add("active");
        }

        if (currentPage === "chatbot.html" && linkHref === "chatbot.html") {
            link.classList.add("active");
        }
    });
}

window.addEventListener("load", updateActiveNav);
window.addEventListener("hashchange", updateActiveNav);

/* Loader between pages */
const pageLoader = document.getElementById("pageLoader");

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
            return;
        }

        // Skip links meant to open in a new tab (e.g. Watch Intro Video)
        // so the browser's native new-tab behavior isn't hijacked by
        // the same-tab navigation below.
        if (this.target === "_blank") {
            return;
        }

        if (href.includes("#") && href.includes("index.html") && window.location.pathname.includes("index.html")) {
            return;
        }

        e.preventDefault();

        if (pageLoader) {
            pageLoader.classList.add("show");
        }

        setTimeout(() => {
            window.location.href = href;
        }, 450);
    });
});

/* Card 3D movement */
const motionCards = document.querySelectorAll(".project-category-card, .service-card");

motionCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - .5) * -10;
        const rotateY = ((x / rect.width) - .5) * 10;

        card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });
});

/* Profile Dropdown */
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle("show");

        // close notif dropdown if open
        const notifDropdownEl = document.getElementById("notifDropdown");
        if (notifDropdownEl) notifDropdownEl.classList.remove("show");
    });

    profileDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", () => {
        profileDropdown.classList.remove("show");
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            profileDropdown.classList.remove("show");
        }
    });
}

/* Chat button (fix: select by class since no #chatBtn id exists in markup) */
const chatBtn = document.querySelector(".chat-btn");

if (chatBtn) {
    chatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Hello! I am VYRONIX smart assistant.");
    });
}

/* Search functionality (fix: guard for pages without #searchInput) */
const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".digital-card");

if (searchInput && cards.length) {
    const filterCards = (value) => {
        cards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const match = title.includes(value);
            card.style.display = match ? "flex" : "none";
        });
    };

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const handleSearch = debounce(function (e) {
        const value = e.target.value.toLowerCase().trim();
        filterCards(value);
    }, 200);

    searchInput.addEventListener("input", handleSearch);
}

/* Notification dropdown */
const notifBtn = document.getElementById("notifBtn");
const notifDropdown = document.getElementById("notifDropdown");
const notifDot = document.getElementById("notifDot");
const notifClear = document.getElementById("notifClear");

if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("show");

        // close profile dropdown if open
        const profileDropdownEl = document.getElementById("profileDropdown");
        if (profileDropdownEl) profileDropdownEl.classList.remove("show");
    });

    document.addEventListener("click", (e) => {
        if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
            notifDropdown.classList.remove("show");
        }
    });
}

if (notifClear && notifDot) {
    notifClear.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".notif-item.unread").forEach(item => {
            item.classList.remove("unread");
        });
        notifDot.classList.add("hidden");
    });
}
/* ===========================
   Mobile Bottom Navigation
=========================== */
document.addEventListener("DOMContentLoaded", () => {
    const bottomNav = document.querySelector(".mobile-bottom-nav");

    if (!bottomNav) return;

    let lastScrollY = window.scrollY;
    let hideNavTimer;

    function showBottomNav() {
        if (window.innerWidth > 768) return;

        bottomNav.classList.add("show");
        document.body.classList.add("bottom-nav-visible");

        clearTimeout(hideNavTimer);

        hideNavTimer = setTimeout(() => {
            bottomNav.classList.remove("show");
            document.body.classList.remove("bottom-nav-visible");
        }, 2500);
    }

    showBottomNav();

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY < lastScrollY) {
            showBottomNav();
        } else {
            bottomNav.classList.remove("show");
            document.body.classList.remove("bottom-nav-visible");
        }

        lastScrollY = currentScrollY;
    });
});