document.addEventListener("DOMContentLoaded", function () {
  const notifMenu = document.getElementById("notifMenu");
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  const notifDot = document.getElementById("notifDot");
  const notifList = document.getElementById("notifList");
  const notifClear = document.getElementById("notifClear");

  const API_BASE = "http://localhost:5000/api";

  function getToken() {
    return localStorage.getItem("accessToken") || localStorage.getItem("token");
  }

  if (!notifMenu || !notifBtn || !notifDropdown) return;

  notifMenu.style.display = getToken() ? "inline-flex" : "none";

notifBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  console.log("Notification button clicked");

  notifDropdown.classList.toggle("show");
}, true);

  notifDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    notifDropdown.classList.remove("show");
  });

  async function loadNotifications() {
    const token = getToken();

    if (!token) {
      notifMenu.style.display = "none";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Notifications failed:", res.status, data);
        notifList.innerHTML = `<p class="notif-empty">Failed to load notifications.</p>`;
        return;
      }

      const notifications = data?.data?.notifications || data?.notifications || [];
      const unreadCount = data?.data?.unreadCount || data?.unreadCount || 0;

      if (notifDot) {
        notifDot.style.display = unreadCount > 0 ? "inline-block" : "none";
      }

      notifList.innerHTML = notifications.length
        ? notifications.map(n => `
          <a href="#" class="notif-item ${n.isRead ? "read" : "unread"}">
            <span class="notif-icon"><i class="bi bi-bell"></i></span>
            <div>
              <p>${n.message || "New notification"}</p>
              <span class="notif-time">${n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</span>
            </div>
          </a>
        `).join("")
        : `<p class="notif-empty">No notifications yet.</p>`;

    } catch (err) {
      console.error("Notifications error:", err);
      notifList.innerHTML = `<p class="notif-empty">Failed to load notifications.</p>`;
    }
  }

  notifClear?.addEventListener("click", async function (e) {
    e.preventDefault();

    const token = getToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE}/admin/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      loadNotifications();
    } catch (err) {
      console.error("Mark notifications read error:", err);
    }
  });

  loadNotifications();
});
