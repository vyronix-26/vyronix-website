const usersTableBody = document.getElementById("usersTableBody");
const userSearch = document.getElementById("userSearch");

const USERS_ENDPOINT = "/admin/users";
const LOGIN_PAGE = "LogIn.html";

let allUsers = [];

function requireAdminLogin() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (!token) {
    window.location.href = LOGIN_PAGE;
    return false;
  }

  return true;
}

function getUsersArray(response) {
  return response?.data?.users || response?.data || response?.users || response || [];
}

function getUserId(user) {
  return user.id || user._id;
}

function getUserName(user) {
  return (
    user.name ||
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Unknown User"
  );
}

function renderUsers(users) {
  if (!users || users.length === 0) {
    usersTableBody.innerHTML = `<tr><td colspan="6">No users found.</td></tr>`;
    return;
  }

  usersTableBody.innerHTML = users.map((user) => {
    const id = getUserId(user);
    const name = getUserName(user);
    const email = user.email || "No email";
    const role = user.role || "CLIENT";
    const isActive = user.isActive !== false;

    return `
      <tr>
        <td>
          <div class="user-row">
            <div class="user-av">${name.charAt(0).toUpperCase()}</div>
            <div class="user-row-name">${name}</div>
          </div>
        </td>
        <td>${email}</td>
        <td><span class="role-chip ${role === "ADMIN" ? "admin" : ""}">${role}</span></td>
        <td><span class="req-badge ${isActive ? "new" : "review"}">${isActive ? "Active" : "Inactive"}</span></td>
        <td>
          <select onchange="updateUserRole('${id}', this.value)">
            <option value="CLIENT" ${role === "CLIENT" ? "selected" : ""}>CLIENT</option>
            <option value="ADMIN" ${role === "ADMIN" ? "selected" : ""}>ADMIN</option>
          </select>
        </td>
        <td>
          <button class="dots-btn" onclick="toggleUserStatus('${id}', ${isActive})">
            ${isActive ? "Deactivate" : "Activate"}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

async function loadUsers() {
  if (!requireAdminLogin()) return;

  try {
    usersTableBody.innerHTML = `<tr><td colspan="6">Loading users...</td></tr>`;

    const response = await apiRequest(USERS_ENDPOINT, "GET");

    allUsers = getUsersArray(response);
    renderUsers(allUsers);

  } catch (error) {
    console.error(error);

    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("Invalid token") ||
      error.message.includes("Access denied") ||
      error.message.includes("Forbidden")
    ) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="6">
            You must login as ADMIN to access this page.
            <br><br>
            <button class="btn-primary" onclick="window.location.href='${LOGIN_PAGE}'">
              Go to Login
            </button>
          </td>
        </tr>
      `;
      return;
    }

    usersTableBody.innerHTML = `
      <tr>
        <td colspan="6">Failed to load users. Check backend server and API.</td>
      </tr>
    `;
  }
}

async function updateUserRole(userId, role) {
  try {
    await apiRequest(`${USERS_ENDPOINT}/${userId}/role`, "PATCH", { role });
    await loadUsers();
  } catch (error) {
    console.error(error);
    alert(error.message || "Failed to update role");
    await loadUsers();
  }
}

async function toggleUserStatus(userId, currentStatus) {
  try {
    await apiRequest(`${USERS_ENDPOINT}/${userId}/status`, "PATCH", {
      isActive: !currentStatus
    });

    await loadUsers();
  } catch (error) {
    console.error(error);
    alert(error.message || "Failed to update status");
  }
}

if (userSearch) {
  userSearch.addEventListener("input", () => {
    const value = userSearch.value.trim().toLowerCase();

    const filtered = allUsers.filter((user) => {
      const name = getUserName(user).toLowerCase();
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "").toLowerCase();

      return name.includes(value) || email.includes(value) || role.includes(value);
    });

    renderUsers(filtered);
  });
}

loadUsers();
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const avatarContent = document.getElementById("avatarContent");
const profileDropdownAvatar = document.getElementById("profileDropdownAvatar");
const dropdownName = document.getElementById("dropdownName");
const dropdownEmail = document.getElementById("dropdownEmail");
const logoutBtn = document.getElementById("logoutBtn");

function setupAdminProfileMenu() {
  const storedUser = localStorage.getItem("vyronixUser") || localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const name =
    user?.name ||
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Admin";

  const email = user?.email || "admin@vyronix.com";
  const initial = name.charAt(0).toUpperCase();

  if (avatarContent) avatarContent.textContent = initial;
  if (profileDropdownAvatar) profileDropdownAvatar.textContent = initial;
  if (dropdownName) dropdownName.textContent = name;
  if (dropdownEmail) dropdownEmail.textContent = email;

  profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown?.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-menu")) {
      profileDropdown?.classList.remove("show");
    }
  });

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("vyronixUser");
    window.location.href = "LogIn.html";
  });
}

setupAdminProfileMenu();