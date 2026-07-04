document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:5000/api";
  const SERVER_ORIGIN = "http://localhost:5000";

  const notifMenu = document.getElementById("notifMenu");
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  const notifDot = document.getElementById("notifDot");
  const notifList = document.getElementById("notifList");
  const notifClear = document.getElementById("notifClear");

  const avatarContent = document.getElementById("avatarContent");
  const dropdownAvatar = document.getElementById("profileDropdownAvatar");
  const dropdownName = document.getElementById("dropdownName");
  const dropdownEmail = document.getElementById("dropdownEmail");
  const profileLink = document.getElementById("profileLink");
  const addAccountLink = document.querySelector('.profile-dropdown a[href="SignUp.html"]');
  const logoutBtn = document.getElementById("logoutBtn");

  function getToken() {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    return token && token !== "null" && token !== "undefined" ? token : null;
  }

  function buildFileUrl(path) {
    if (!path) return "";
    return path.startsWith("http") ? path : `${SERVER_ORIGIN}${path}`;
  }

  function getInitial(profile) {
    if (profile?.firstName) return profile.firstName.charAt(0).toUpperCase();
    if (profile?.email) return profile.email.charAt(0).toUpperCase();
    return "👤";
  }

  function renderAvatar(element, profile) {
    if (!element) return;

    if (profile?.profileImage) {
      element.innerHTML = `
        <img src="${buildFileUrl(profile.profileImage)}" alt="Avatar"
        style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;">
      `;
      return;
    }

    element.textContent = getInitial(profile);
  }

  function setupProfileDefaultState() {
    const token = getToken();

    if (profileLink) profileLink.href = token ? "profile.html" : "LogIn.html";
    if (addAccountLink) addAccountLink.hidden = Boolean(token);
    if (logoutBtn) logoutBtn.style.display = token ? "flex" : "none";

    if (!token) {
      if (dropdownName) dropdownName.textContent = "VYRONIX User";
      if (dropdownEmail) dropdownEmail.textContent = "user@vyronix.com";
    }
  }

  async function loadClientProfile() {
    const token = getToken();
    setupProfileDefaultState();

    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        if (profileLink) profileLink.href = "LogIn.html";
        if (logoutBtn) logoutBtn.style.display = "none";
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) return;

      const profile = data.data.profile;
      const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

      if (dropdownName) dropdownName.textContent = fullName || "VYRONIX User";
      if (dropdownEmail) dropdownEmail.textContent = profile.email || "user@vyronix.com";

      renderAvatar(avatarContent, profile);
      renderAvatar(dropdownAvatar, profile);

      if (profileLink) profileLink.href = "profile.html";
      if (addAccountLink) addAccountLink.hidden = true;
      if (logoutBtn) logoutBtn.style.display = "flex";
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }

  function setupNotificationsDropdown() {
    if (!notifMenu || !notifBtn || !notifDropdown || !notifList) return;

    notifMenu.style.display = "flex";

    notifBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      notifDropdown.classList.toggle("show");
      loadNotifications();
    });

    notifDropdown.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
      notifDropdown.classList.remove("show");
    });
  }

  function timeAgo(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;

    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  function getNotificationMessage(n) {
    return n.message || n.title || n.body || "New notification";
  }

  function renderNotifications(notifications, unreadCount) {
    if (!notifList) return;

    const safeNotifications = Array.isArray(notifications) ? notifications : [];

    if (notifDot) {
      notifDot.style.display = unreadCount > 0 ? "inline-block" : "none";
    }

    if (safeNotifications.length === 0) {
      notifList.innerHTML = `<p class="notif-empty">No notifications yet.</p>`;
      return;
    }

    notifList.innerHTML = safeNotifications.map((n) => `
      <a href="#" class="notif-item ${n.isRead ? "read" : "unread"}">
        <span class="notif-icon">
          <i class="bi bi-bell"></i>
        </span>
        <div>
          <p>${getNotificationMessage(n)}</p>
          <span class="notif-time">${timeAgo(n.createdAt)}</span>
        </div>
      </a>
    `).join("");
  }

  async function loadNotifications() {
    if (!notifMenu || !notifList) return;

    const token = getToken();
    notifMenu.style.display = "flex";

    if (!token) {
      if (notifDot) notifDot.style.display = "none";
      notifList.innerHTML = `<p class="notif-empty">Login to see notifications.</p>`;
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401 || res.status === 403) {
        if (notifDot) notifDot.style.display = "none";
        notifList.innerHTML = `<p class="notif-empty">Please login again.</p>`;
        return;
      }

      if (!res.ok) {
        notifList.innerHTML = `<p class="notif-empty">Failed to load notifications.</p>`;
        return;
      }

      const notifications =
        data?.data?.notifications ||
        data?.notifications ||
        [];

      const unreadCount =
        data?.data?.unreadCount ??
        data?.unreadCount ??
        notifications.filter((n) => !n.isRead).length;

      renderNotifications(notifications, unreadCount);
    } catch (err) {
      console.error("Notifications error:", err);
      notifList.innerHTML = `<p class="notif-empty">Failed to load notifications.</p>`;
    }
  }

  function setupMarkAllRead() {
    if (!notifClear) return;

    notifClear.addEventListener("click", async (e) => {
      e.preventDefault();

      const token = getToken();

      if (!token) {
        if (notifList) notifList.innerHTML = `<p class="notif-empty">Login to see notifications.</p>`;
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/notifications/read-all`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (notifList) notifList.innerHTML = `<p class="notif-empty">Failed to update notifications.</p>`;
          return;
        }

        if (notifDot) notifDot.style.display = "none";
        await loadNotifications();
      } catch (err) {
        console.error("Mark all as read error:", err);
      }
    });
  }

  function setupLogout() {
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
      const token = getToken();

      try {
        if (token) {
          await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("vyronixUser");
        window.location.href = "LogIn.html";
      }
    });
  }

  setupProfileDefaultState();
  setupNotificationsDropdown();
  setupMarkAllRead();
  setupLogout();

  loadClientProfile();
  loadNotifications();
});