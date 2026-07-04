const LOGIN_PAGE = "LogIn.html";

const totalUsers = document.getElementById("totalUsers");
const totalVisitors = document.getElementById("totalVisitors");
const totalProjects = document.getElementById("totalProjects");
const totalRequests = document.getElementById("totalRequests");
const totalFeedbacks = document.getElementById("totalFeedbacks");

const analyticsVisitors = document.getElementById("analyticsVisitors");
const analyticsPageViews = document.getElementById("analyticsPageViews");
const analyticsSessions = document.getElementById("analyticsSessions");
const analyticsBounceRate = document.getElementById("analyticsBounceRate");

const recentUsersBody = document.getElementById("recentUsersBody");
const recentRequestsBody = document.getElementById("recentRequestsBody");
const recentProjectsGrid = document.getElementById("recentProjectsGrid");
const dashboardSearch = document.getElementById("dashboardSearch");
const addProjectBtn = document.getElementById("addProjectBtn");
const logoutBtn = document.getElementById("logoutBtn");

let dashboardCache = {
  users: [],
  projects: [],
  requests: [],
};

document.addEventListener("DOMContentLoaded", initDashboard);

async function initDashboard() {
  if (!requireAdminLogin()) return;

  setupActions();
  await loadDashboardData();
}

function setupActions() {
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", () => {
      window.location.href = "AdminProjects.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutAdmin);
  }

  if (dashboardSearch) {
    dashboardSearch.addEventListener("input", handleSearch);
  }
}

function requireAdminLogin() {
  const token = getToken();

  if (!token) {
    window.location.href = LOGIN_PAGE;
    return false;
  }

  return true;
}

function getToken() {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
}

function getApiBaseUrl() {
  if (typeof API_BASE_URL !== "undefined") return API_BASE_URL;
  if (window.API_BASE_URL) return window.API_BASE_URL;
  return "http://localhost:5000/api";
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 || response.status === 403) {
    logoutAdmin();
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed: ${endpoint}`);
  }

  return data;
}

async function loadDashboardData() {
  showLoadingState();

  const [usersResult, projectsResult, requestsResult] = await Promise.allSettled([
    apiRequest("/admin/users"),
    apiRequest("/projects"),
apiRequest("/project-requests"),
  ]);

  const users = extractArray(usersResult, ["users"]);
  const projects = extractArray(projectsResult, ["projects"]);
  const requests = extractArray(requestsResult, ["requests", "messages", "contacts"]);

  dashboardCache = { users, projects, requests };

  updateStats(users, projects, requests);
  renderRecentUsers(users.slice(0, 5));
  renderRecentProjects(projects.slice(0, 4));
  renderRecentRequests(requests.slice(0, 5));
}

function extractArray(result, keys = []) {
  if (result.status !== "fulfilled" || !result.value) return [];

  const response = result.value;

  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;

  for (const key of keys) {
    if (Array.isArray(response[key])) return response[key];
    if (Array.isArray(response.data?.[key])) return response.data[key];
  }

  return [];
}

function showLoadingState() {
  setText(totalUsers, "...");
  setText(totalVisitors, "0");
  setText(totalProjects, "...");
  setText(totalRequests, "...");
  setText(totalFeedbacks, "0");

  if (recentUsersBody) {
    recentUsersBody.innerHTML = emptyRow("Loading users...");
  }

  if (recentRequestsBody) {
    recentRequestsBody.innerHTML = emptyRow("Loading requests...");
  }

  if (recentProjectsGrid) {
    recentProjectsGrid.innerHTML = `<div style="color:var(--muted);padding:20px;">Loading projects...</div>`;
  }
}

function updateStats(users, projects, requests) {
  setText(totalUsers, users.length);
  setText(totalProjects, projects.length);
  setText(totalRequests, requests.length);

  setText(totalVisitors, "0");
  setText(totalFeedbacks, "0");

  setText(analyticsVisitors, "0");
  setText(analyticsPageViews, "0");
  setText(analyticsSessions, "0");
  setText(analyticsBounceRate, "0%");
}

function renderRecentUsers(users) {
  if (!recentUsersBody) return;

  if (!users.length) {
    recentUsersBody.innerHTML = emptyRow("No users found");
    return;
  }

  recentUsersBody.innerHTML = users
    .map((user) => {
      const name = escapeHtml(getUserName(user));
      const email = escapeHtml(user.email || "No email");
      const role = escapeHtml(user.role || "USER");
      const joined = formatDate(user.createdAt || user.created_at || user.joinedAt);
      const roleClass = role.toUpperCase() === "ADMIN" ? "admin" : "";

      return `
        <tr>
          <td>
            <div class="user-row">
              <div class="user-av">${getInitial(name)}</div>
              <div class="user-row-name">${name}</div>
            </div>
          </td>
          <td style="color:var(--muted);font-size:12px">${email}</td>
          <td><span class="role-chip ${roleClass}">${role}</span></td>
          <td style="color:var(--muted);font-size:11px">${joined}</td>
          <td><button class="dots-btn" type="button">⋮</button></td>
        </tr>
      `;
    })
    .join("");
}

function renderRecentProjects(projects) {
  if (!recentProjectsGrid) return;

  if (!projects.length) {
    recentProjectsGrid.innerHTML = `<div style="color:var(--muted);padding:20px;">No projects found</div>`;
    return;
  }

  recentProjectsGrid.innerHTML = projects
    .map((project) => {
      const title = escapeHtml(project.title || project.name || "Untitled Project");
      const type = escapeHtml(project.category || project.type || project.projectType || "Project");
      const date = formatDate(project.createdAt || project.created_at || project.date);
      const status = escapeHtml(project.status || "Published");
      const image = project.image || project.imageUrl || project.coverImage;

      return `
        <div class="project-card">
          <div class="project-thumb" style="${image ? `background-image:url('${escapeAttribute(image)}');background-size:cover;background-position:center;` : "background:linear-gradient(135deg,#0d1830,#1a1040)"}">
            ${image ? "" : `
              <div class="project-thumb-inner">
                <div class="mock-line accent"></div>
                <div class="mock-line w80"></div>
                <div class="mock-line w60"></div>
                <div style="display:flex;gap:4px;margin:6px 8px">
                  <div style="height:20px;width:40%;background:rgba(108,99,255,.2);border-radius:3px"></div>
                  <div style="height:20px;width:40%;background:rgba(108,99,255,.1);border-radius:3px"></div>
                </div>
              </div>
            `}
          </div>
          <div class="project-info">
            <div class="project-name">${title}</div>
            <div class="project-type">${type}</div>
          </div>
          <div class="project-footer">
            <span class="proj-date">${date}</span>
            <span class="pub-badge">${status}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderRecentRequests(requests) {
  if (!recentRequestsBody) return;

  if (!requests.length) {
    recentRequestsBody.innerHTML = emptyRow("No requests found");
    return;
  }

  recentRequestsBody.innerHTML = requests
    .map((request) => {
      const name = escapeHtml(request.name || request.clientName || request.fullName || "Unknown Client");
      const email = escapeHtml(request.email || "No email");
      const type = escapeHtml(request.projectType || request.service || request.type || request.subject || "General");
      const date = formatDate(request.createdAt || request.created_at || request.date);
      const status = escapeHtml(request.status || "New");
      const statusClass = status.toLowerCase() === "new" ? "new" : "review";

      return `
        <tr>
          <td>
            <div class="req-row">
              <div class="req-av">${getInitial(name)}</div>
              <div>
                <div style="font-weight:600;font-size:12px">${name}</div>
                <div style="font-size:11px;color:var(--muted)">${email}</div>
              </div>
            </div>
          </td>
          <td style="font-size:12px">${type}</td>
          <td style="font-size:11px;color:var(--muted)">${date}</td>
          <td><span class="req-badge ${statusClass}">${status}</span></td>
          <td><div class="actions-cell"><div class="icon-act">👁</div></div></td>
        </tr>
      `;
    })
    .join("");
}

function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();

  if (!query) {
    renderRecentUsers(dashboardCache.users.slice(0, 5));
    renderRecentProjects(dashboardCache.projects.slice(0, 4));
    renderRecentRequests(dashboardCache.requests.slice(0, 5));
    return;
  }

  const filteredUsers = dashboardCache.users.filter((user) => {
    return `${getUserName(user)} ${user.email || ""} ${user.role || ""}`.toLowerCase().includes(query);
  });

  const filteredProjects = dashboardCache.projects.filter((project) => {
    return `${project.title || project.name || ""} ${project.category || project.type || ""}`.toLowerCase().includes(query);
  });

  const filteredRequests = dashboardCache.requests.filter((request) => {
    return `${request.name || request.clientName || ""} ${request.email || ""} ${request.projectType || request.service || request.type || ""}`.toLowerCase().includes(query);
  });

  renderRecentUsers(filteredUsers.slice(0, 5));
  renderRecentProjects(filteredProjects.slice(0, 4));
  renderRecentRequests(filteredRequests.slice(0, 5));
}

function logoutAdmin() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = LOGIN_PAGE;
}

function getUserName(user) {
  return (
    user.name ||
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Unknown User"
  );
}

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitial(value) {
  return (value || "?").trim().charAt(0).toUpperCase() || "?";
}

function setText(element, value) {
  if (element) element.textContent = value;
}

function emptyRow(message) {
  return `
    <tr>
      <td colspan="5" style="text-align:center;color:var(--muted);padding:20px;">
        ${message}
      </td>
    </tr>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return String(value).replaceAll("'", "&#039;").replaceAll('"', "&quot;");
}
