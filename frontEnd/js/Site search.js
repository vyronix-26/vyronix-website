/* ==========================================================
   VYRONIX — Client-side header search (no backend calls)
   Save as: ../js/site-search.js
   Include AFTER the header markup, e.g.:
   <script src="../js/site-search.js"></script>
   ========================================================== */

(function () {
    "use strict";

    // ---------------------------------------------------------
    // 1. Search index — edit/extend this list as you add pages
    // ---------------------------------------------------------
    const SEARCH_INDEX = [
        {
            title: "Dashboards & Systems",
            category: "Service",
            description: "Custom management systems tailored to your business operations and workflow.",
            keywords: ["dashboard", "system", "admin panel", "management"],
            url: "dashboards-systems.html"
        },
        {
            title: "Mobile Development",
            category: "Service",
            description: "High-performance iOS and Android apps with modern user experience.",
            keywords: ["mobile", "app", "ios", "android"],
            url: "mobile-development.html"
        },
        {
            title: "UI/UX & Brand Design",
            category: "Service",
            description: "Modern interfaces, brand identity, and user experiences designed for clarity and conversion.",
            keywords: ["design", "ui", "ux", "branding", "identity"],
            url: "uiux-design.html"
        },
        {
            title: "Web Development",
            category: "Service",
            description: "Fast, responsive, secure, and professional websites for companies and brands.",
            keywords: ["web", "website", "development"],
            url: "webDevelopment.html"
        },
        {
            title: "Digital Platforms",
            category: "Project",
            description: "Business systems, online stores, delivery apps, dashboards, and management platforms.",
            keywords: ["platform", "store", "delivery", "ecommerce"],
            url: "digital-platforms.html"
        },
        {
            title: "Designs",
            category: "Project",
            description: "UI/UX designs, corporate identity, landing pages, websites, and visual solutions.",
            keywords: ["designs", "portfolio", "landing page"],
            url: "designs.html"
        },
        {
            title: "Our Team",
            category: "Page",
            description: "Meet the people behind VYRONIX.",
            keywords: ["team", "about", "people", "staff"],
            url: "ourteam.html"
        },
        {
            title: "Contact",
            category: "Page",
            description: "Get in touch to start your project or book a consultation.",
            keywords: ["contact", "consultation", "email", "reach"],
            url: "contact.html"
        },
        {
            title: "AI Assistant",
            category: "Service",
            description: "Chat with the VYRONIX AI assistant for quick answers.",
            keywords: ["chatbot", "ai", "assistant", "chat"],
            url: "chatbot.html"
        },
        {
            title: "Ratings & Feedback",
            category: "Page",
            description: "See what clients say and leave your own feedback.",
            keywords: ["ratings", "reviews", "feedback", "testimonials"],
            url: "rating.html"
        }
    ];

    // ---------------------------------------------------------
    // 2. DOM references
    // ---------------------------------------------------------
    const input = document.getElementById("siteSearchInput");
    const resultsBox = document.getElementById("searchResults");
    const searchBox = document.getElementById("searchBox");

    if (!input || !resultsBox || !searchBox) return; // markup not present on this page

    let activeIndex = -1;
    let currentMatches = [];
    let debounceTimer = null;

    // ---------------------------------------------------------
    // 3. Helpers
    // ---------------------------------------------------------
    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
    }

    function highlight(text, query) {
        const safeText = escapeHtml(text);
        const safeQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (!safeQuery) return safeText;
        const re = new RegExp(`(${safeQuery})`, "ig");
        return safeText.replace(re, "<mark>$1</mark>");
    }

    function scoreEntry(entry, query) {
        const q = query.toLowerCase();
        const title = entry.title.toLowerCase();
        const desc = entry.description.toLowerCase();
        const kw = entry.keywords.join(" ").toLowerCase();

        if (title.startsWith(q)) return 100;
        if (title.includes(q)) return 80;
        if (kw.includes(q)) return 60;
        if (desc.includes(q)) return 40;
        return 0;
    }

    function search(query) {
        if (!query.trim()) return [];
        return SEARCH_INDEX
            .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
            .filter((r) => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map((r) => r.entry);
    }

    // ---------------------------------------------------------
    // 4. Rendering
    // ---------------------------------------------------------
    function render(matches, query) {
        currentMatches = matches;
        activeIndex = -1;

        if (!query.trim()) {
            resultsBox.innerHTML = "";
            resultsBox.classList.remove("open");
            return;
        }

        if (matches.length === 0) {
            resultsBox.innerHTML = `<div class="search-empty">No results for "${escapeHtml(query)}"</div>`;
            resultsBox.classList.add("open");
            return;
        }

        resultsBox.innerHTML = matches.map((entry, i) => `
            <a href="${entry.url}" class="search-result-item" data-index="${i}">
                <span class="search-result-tag">${escapeHtml(entry.category)}</span>
                <div class="search-result-text">
                    <strong>${highlight(entry.title, query)}</strong>
                    <p>${highlight(entry.description, query)}</p>
                </div>
            </a>
        `).join("");

        resultsBox.classList.add("open");
    }

    function updateActiveHighlight() {
        const items = resultsBox.querySelectorAll(".search-result-item");
        items.forEach((el, i) => el.classList.toggle("active", i === activeIndex));
        if (activeIndex >= 0 && items[activeIndex]) {
            items[activeIndex].scrollIntoView({ block: "nearest" });
        }
    }

    // ---------------------------------------------------------
    // 5. Events
    // ---------------------------------------------------------
    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        const query = input.value;
        debounceTimer = setTimeout(() => {
            render(search(query), query);
        }, 120); // debounce so we don't re-render on every keystroke
    });

    input.addEventListener("focus", () => {
        if (input.value.trim()) render(search(input.value), input.value);
    });

    input.addEventListener("keydown", (e) => {
        if (!resultsBox.classList.contains("open") || currentMatches.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, currentMatches.length - 1);
            updateActiveHighlight();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            updateActiveHighlight();
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && currentMatches[activeIndex]) {
                e.preventDefault();
                window.location.href = currentMatches[activeIndex].url;
            }
        } else if (e.key === "Escape") {
            resultsBox.classList.remove("open");
            input.blur();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchBox.contains(e.target)) {
            resultsBox.classList.remove("open");
        }
    });
})();