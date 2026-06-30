const teamGrid = document.getElementById("teamGrid");

const staticTeamMembers = [
    {
        name: "Alaa Sunono",
        role: "Frontend Developer",
        description: "Builds modern, responsive, and user-friendly web interfaces.",
        image: "../assets/images/user.jpg"
    },
    {
        name: "Team Member",
        role: "Backend Developer",
        description: "Develops APIs, database structure, authentication, and server-side logic.",
        image: "../assets/images/user.jpg"
    },
    {
        name: "Team Member",
        role: "UI/UX Designer",
        description: "Designs clean user experiences and professional visual interfaces.",
        image: "../assets/images/user.jpg"
    }
];

function loadTeamMembers() {
    if (!teamGrid) return;

    teamGrid.innerHTML = staticTeamMembers.map(member => `
        <article class="team-card">
            <div class="team-img">
                <img src="${member.image}" alt="${member.name}">
            </div>

            <h3>${member.name}</h3>
            <span>${member.role}</span>
            <p>${member.description}</p>
        </article>
    `).join("");
}

loadTeamMembers();