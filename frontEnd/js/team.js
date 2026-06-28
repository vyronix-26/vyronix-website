const teamGrid = document.getElementById("teamGrid");

function loadTeamMembers() {
    const members = JSON.parse(localStorage.getItem("teamMembers")) || [];

    if (members.length === 0) {
        teamGrid.innerHTML = `
            <p class="empty-message">
                Team members will appear here soon.
            </p>
        `;
        return;
    }

    teamGrid.innerHTML = "";

    members.forEach(member => {
        teamGrid.innerHTML += `
            <article class="team-card">
                <div class="team-img">
                    <img src="${member.image}" alt="${member.name}">
                </div>

                <h3>${member.name}</h3>
                <span>${member.role}</span>
                <p>${member.description}</p>
            </article>
        `;
    });
}

loadTeamMembers();