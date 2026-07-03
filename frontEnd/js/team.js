const teamGrid = document.getElementById("teamGrid");

const staticTeamMembers = [
    {
        name: "Akef Ali",
        role: "Founder",
        description: "Leads the company's vision, strategy, and overall growth.",
        icon: "bi bi-person-circle"
    },
    {
        name: "Fares Abu Samra",
        role: "Founder",
        description: "Co-founder responsible for business development and innovation.",
        icon: "bi bi-person-circle"
    },
    {
        name: "Alaa Sunono",
        role: "Frontend Developer",
        description: "Builds modern, responsive, and user-friendly web interfaces.",
        icon: "bi bi-person-circle"
    },
     {
        name: "Ruba Abu Samra",
        role: "Backend Developer",
        description: "Develops APIs, database structure, authentication, and server-side logic.",
        icon: "bi bi-person-circle"
    },
    {
        name: "Eman Subhi",
        role: "Frontend Developer",
        description: "Develops responsive and interactive user interfaces.",
        icon: "bi bi-person-circle"
    },
    {
        name: "Aish Ryad",
        role: "Frontend Developer",
        description: "Creates engaging and user-friendly web experiences.",
        icon: "bi bi-person-circle"
    },
   
    {
        name: "Nada Saleh",
        role: "Media",
        description: "Manages media content, communication, and brand presence.",
        icon: "bi bi-person-circle"
    },
    {
        name: "Lamees Omran",
        role: "Media Representative",
        description: "Represents the organization in media and public communications.",
        icon: "bi bi-person-circle"
    },
    {
        name: "Dania Sider",
        role: "Designer",
        description: "Designs creative visuals and enhances the user experience.",
        icon: "bi bi-person-circle"
    }
];

function loadTeamMembers() {
    if (!teamGrid) return;

    teamGrid.innerHTML = staticTeamMembers.map(member => `
        <article class="team-card">

            <div class="team-avatar">
                <i class="${member.icon}"></i>
            </div>

            <div class="team-info">
                <h3>${member.name}</h3>
                <span>${member.role}</span>
                <p>${member.description}</p>
            </div>

        </article>
    `).join("");
}

loadTeamMembers();