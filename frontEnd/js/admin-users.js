const usersTableBody = document.getElementById("usersTableBody");
const userSearch = document.getElementById("userSearch");

let allUsers = [];

async function loadUsers() {
  try {
    const response = await apiRequest("/admin/users", "GET");

    allUsers = response.data || response.users || response;

    renderUsers(allUsers);
  } catch (error) {
    console.error(error);

    usersTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          Failed to load users. Make sure you are logged in as ADMIN.
        </td>
      </tr>
    `;
  }
}

function renderUsers(users) {
  if (!users || users.length === 0) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="6">No users found.</td>
      </tr>
    `;
    return;
  }

  usersTableBody.innerHTML = users.map(user => `
    <tr>
      <td>
        <div class="user-row">
          <div class="user-av">${(user.name || user.fullName || "U").charAt(0).toUpperCase()}</div>
          <div class="user-row-name">${user.name || user.fullName || "Unknown User"}</div>
        </div>
      </td>

      <td>${user.email || "No email"}</td>

      <td>
        <span class="role-chip ${user.role === "ADMIN" ? "admin" : ""}">
          ${user.role || "CLIENT"}
        </span>
      </td>

      <td>
        <span class="badge ${user.isActive === false ? "" : "active"}">
          ${user.isActive === false ? "Inactive" : "Active"}
        </span>
      </td>

      <td>
        <select onchange="updateUserRole(${user.id}, this.value)">
          <option value="CLIENT" ${user.role === "CLIENT" ? "selected" : ""}>CLIENT</option>
          <option value="ADMIN" ${user.role === "ADMIN" ? "selected" : ""}>ADMIN</option>
        </select>
      </td>

      <td>
        <button class="dots-btn" onclick="toggleUserStatus(${user.id}, ${user.isActive !== false})">
          ${user.isActive === false ? "Activate" : "Deactivate"}
        </button>
      </td>
    </tr>
  `).join("");
}

async function updateUserRole(userId, role) {
  try {
    await apiRequest(`/admin/users/${userId}/role`, "PATCH", { role });
    alert("User role updated successfully");
    loadUsers();
  } catch (error) {
    alert("Failed to update role");
    console.error(error);
  }
}

async function toggleUserStatus(userId, currentStatus) {
  try {
    await apiRequest(`/admin/users/${userId}/status`, "PATCH", {
      isActive: !currentStatus
    });

    alert("User status updated successfully");
    loadUsers();
  } catch (error) {
    alert("Failed to update status");
    console.error(error);
  }
}

userSearch.addEventListener("input", () => {
  const value = userSearch.value.toLowerCase();

  const filtered = allUsers.filter(user =>
    (user.name || "").toLowerCase().includes(value) ||
    (user.fullName || "").toLowerCase().includes(value) ||
    (user.email || "").toLowerCase().includes(value) ||
    (user.role || "").toLowerCase().includes(value)
  );

  renderUsers(filtered);
});

loadUsers();