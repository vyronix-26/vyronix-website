const teamForm = document.getElementById("teamForm");
const adminTeamGrid = document.getElementById("adminTeamGrid");

let teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

function saveTeamMembers() {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
}

function displayTeamMembers() {
    adminTeamGrid.innerHTML = "";

    if (teamMembers.length === 0) {
        adminTeamGrid.innerHTML = `
            <p class="empty-message">No team members added yet.</p>
        `;
        return;
    }

    teamMembers.forEach((member, index) => {
        adminTeamGrid.innerHTML += `
            <article class="team-card">
                <div class="team-img">
                    <img src="${member.image}" alt="${member.name}">
                </div>

                <h3>${member.name}</h3>
                <span>${member.role}</span>
                <p>${member.description}</p>

                <button class="delete-btn" onclick="deleteMember(${index})">
                    Delete
                </button>
            </article>
        `;
    });
}

teamForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const newMember = {
        name: document.getElementById("name").value,
        role: document.getElementById("role").value,
        image: document.getElementById("image").value,
        description: document.getElementById("description").value
    };

    teamMembers.push(newMember);
    saveTeamMembers();
    displayTeamMembers();

    teamForm.reset();
});

function deleteMember(index) {
    teamMembers.splice(index, 1);
    saveTeamMembers();
    displayTeamMembers();
}

displayTeamMembers();