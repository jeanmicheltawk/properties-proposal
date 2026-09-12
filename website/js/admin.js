const app = document.getElementById("app");
const progress = document.getElementById("progress");

function path() {
  return (location.hash.replace(/^#\/?/, "") || "overview").split("?")[0] || "overview";
}
function go(p) { location.hash = "#/" + p.replace(/^#\/?/, ""); }
function toast(text) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
function needStaff() {
  const s = Store.session();
  return s && (s.role === "owner" || s.role === "admin");
}
function rows() {
  return Store.scopedReservations(Store.session());
}

function shell(title, inner) {
  const s = Store.session();
  const p = path();
  const links = [
    ["overview", "Overview"],
    ["reservations", "Reservations"],
    ["calendar", "Calendar"],
    ["rooms", "Rooms"],
    ["guests", "Guests"],
    ["contact", "Contact"],
    ["support", "Support"],
    ["reports", "Reports"],
    ["content", "Content"],
    ["team", "Team"],
    ["settings", "Settings"]
  ];
  return `
    <nav class="top staff-top">
      <a class="brand" href="#/overview">Three Properties · Admin</a>
      <span class="muted" style="font-size:12px">${s.name} · ${s.role}</span>
      <button class="btn" type="button" data-out>Sign out</button>
    </nav>
    <div class="admin">
      <aside class="aside">
        <b>The desk</b>
        ${links.map(([l, label]) => `<a class="${p === l || p.startsWith(l + "/") ? "on" : ""}" href="#/${l}">${label}</a>`).join("")}
      </aside>
      <main class="admin-main">
        <p class="kicker">Uganda · Staff</p>
        <h2>${title}</h2>
        ${inner}
      </main>
    </div>`;
}

function loginView() {
  return `
    <section class="page wrap">
      <div class="auth">
        <p class="kicker">Staff</p>
        <h2>Sign in</h2>
        <form id="staff-login" style="margin-top:22px">
          <div class="field"><label>Email</label><input type="email" name="email" required value="owner@demo.com"></div>
          <div class="field"><label>Password</label><input type="password" name="password" required value="demo"></div>
          <button class="btn btn-solid" type="submit" style="width:100%">Enter dashboard</button>
        </form>
        <p class="hint">Owner: owner@demo.com / demo<br>Lodge admin: emburara@demo.com / demo</p>
        <p class="hint"><a class="gold" href="index.html">Back to website</a></p>
      </div>
    </section>`;
}

function overview() {
  const list = rows();
  const today = list.filter((r) => r.status === "due-in" || r.status === "confirmed").length;
  const occ = { samara: 82, emburara: 78, chimpundu: 64 };
  const scoped = Store.all().properties.filter((p) => {
    const s = Store.session();
    return !(s.role === "admin" && s.propertyId) || p.id === s.propertyId;
  });
  const photos = { samara: "img/samara.jpg", emburara: "img/emburara.jpg", chimpundu: "img/chimpundu.jpg" };
  return shell("Today", `
    <p class="muted" style="margin:8px 0 28px">Lake · Highland · Forest — one desk for all three.</p>
    <div class="kpis">
      <div class="kpi"><b>${list.length}</b><span>Reservations</span></div>
      <div class="kpi"><b>${today}</b><span>Active stays</span></div>
      <div class="kpi"><b>${Store.all().tickets.filter((t) => t.status !== "closed").length}</b><span>Open tickets</span></div>
      <div class="kpi"><b>${Store.all().messages.filter((m) => m.unread).length}</b><span>Unread contact</span></div>
    </div>
    <div class="admin-places">
      ${scoped.map((p) => `
        <article class="admin-place">
          <div class="admin-place-photo" style="background-image:url('${photos[p.id]}')"></div>
          <div class="admin-place-copy">
            <small>${p.kind} · ${p.town}</small>
            <h3>${p.title}</h3>
            <div class="track"><div class="fill" style="width:${occ[p.id]}%"></div></div>
            <span>${occ[p.id]}% occupied</span>
          </div>
        </article>`).join("")}
    </div>
    <table style="margin-top:28px">
      <tr><th>ID</th><th>Guest</th><th>Property</th><th>Status</th></tr>
      ${list.slice(0, 6).map((r) => `<tr class="clickable" data-res="${r.id}"><td>${r.id}</td><td>${r.name}</td><td>${Store.property(r.propertyId).name}</td><td class="status">${r.status}</td></tr>`).join("")}
    </table>
  `);
}

function reservations(detailId) {
  if (detailId) {
    const r = Store.reservation(detailId);
    if (!r) return shell("Missing", "<p>Not found</p>");
    const p = Store.property(r.propertyId);
    const room = Store.room(r.roomId);
    return shell(r.id, `
      <p class="muted">${r.name} · ${r.email}</p>
      <div class="grid-2" style="margin-top:22px">
        <div class="room">
          <p>${p.title} · ${room.name}</p>
          <p>${r.arrive} → ${r.depart}</p>
          <p>${Store.ugx(r.amount)}</p>
        </div>
        <form id="res-edit">
          <div class="field"><label>Status</label>
            <select name="status">
              ${["confirmed", "due-in", "past", "cancelled"].map((st) =>
                `<option ${st === r.status ? "selected" : ""}>${st}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label>Notes</label><textarea name="notes">${r.notes || ""}</textarea></div>
          <button class="btn btn-solid" type="submit">Save</button>
        </form>
      </div>
    `);
  }
  return shell("Reservations", `
    <input id="search" placeholder="Search ID or email" style="max-width:320px;margin:18px 0">
    <table id="res-table">
      <tr><th>ID</th><th>Guest</th><th>Email</th><th>Property</th><th>Dates</th><th>Status</th><th>Amount</th></tr>
      ${rows().map((r) => `
        <tr class="clickable" data-res="${r.id}">
          <td>${r.id}</td><td>${r.name}</td><td>${r.email}</td>
          <td>${Store.property(r.propertyId).name}</td>
          <td>${r.arrive} → ${r.depart}</td>
          <td class="status">${r.status}</td><td>${Store.ugx(r.amount)}</td>
        </tr>`).join("")}
    </table>
  `);
}

function calendar() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells = [];
  for (let i = 0; i < 30; i++) {
    const d = i + 1;
    const busy = rows().some((r) => {
      const a = Number(r.arrive.slice(-2));
      const b = Number(r.depart.slice(-2));
      return r.arrive.startsWith("2026-10") && d >= a && d < b;
    });
    cells.push(`<span class="${busy ? "busy" : ""}">${d}</span>`);
  }
  return shell("Calendar · October 2026", `
    <p class="muted" style="margin:12px 0 20px">Gold days have a stay in this demo month.</p>
    <div class="cal">${days.map((d) => `<b>${d}</b>`).join("")}${cells.join("")}</div>
  `);
}

function roomsView() {
  const rooms = Store.all().rooms.filter((r) => {
    const s = Store.session();
    return !(s.role === "admin" && s.propertyId) || r.propertyId === s.propertyId;
  });
  return shell("Rooms", `
    <div class="grid-2" style="margin-top:22px">
      ${rooms.map((r) => `
        <article class="room">
          <p class="kicker">${Store.property(r.propertyId).title}</p>
          <h3>${r.name}</h3>
          <p>${Store.ugx(r.rate)} · ${r.occupancy} guests</p>
          <p class="status">vacant</p>
        </article>`).join("")}
    </div>
  `);
}

function guests() {
  const guests = Store.all().users.filter((u) => u.role === "guest");
  return shell("Guests", `
    <table style="margin-top:22px">
      <tr><th>Name</th><th>Email</th><th>Stays</th></tr>
      ${guests.map((u) => `
        <tr><td>${u.name}</td><td>${u.email}</td><td>${Store.reservationsFor(u.email).map((r) => r.id).join(", ") || "—"}</td></tr>
      `).join("")}
    </table>
  `);
}

function contact() {
  return shell("Contact inbox", `
    ${Store.all().messages.map((m) => `
      <article class="room" style="margin-top:14px">
        <p class="kicker">${m.date} · ${m.unread ? "Unread" : "Read"}</p>
        <h3>${m.name}</h3>
        <p class="muted">${m.email} · ${m.propertyId ? Store.property(m.propertyId).title : "Any"}</p>
        <p>${m.body}</p>
      </article>`).join("") || `<div class="empty">No messages</div>`}
  `);
}

function support() {
  return shell("Support", `
    ${Store.all().tickets.map((t) => `
      <article class="room" style="margin-top:14px">
        <p class="kicker">${t.id} · ${t.reservationId} · ${t.status}</p>
        <h3>${t.subject}</h3>
        <p>${t.body}</p>
        <form class="ticket-form" data-id="${t.id}" style="margin-top:12px">
          <div class="field"><label>Reply</label><input name="body" required></div>
          <button class="btn btn-solid" type="submit">Reply</button>
          <button class="btn" type="button" data-close="${t.id}">Close</button>
        </form>
      </article>`).join("") || `<div class="empty">No tickets</div>`}
  `);
}

function reports() {
  const list = rows();
  const total = list.reduce((s, r) => s + r.amount, 0);
  return shell("Reports", `
    <div class="kpis">
      <div class="kpi"><b>${list.length}</b><span>Bookings</span></div>
      <div class="kpi"><b>${Store.ugx(total)}</b><span>Recorded revenue</span></div>
    </div>
    <p class="muted">Demo figures from the static reservations. Filter is already applied if you are a property admin.</p>
  `);
}

function content() {
  return shell("Website content", `
    <p class="muted" style="margin:12px 0 20px">Text guests see on each property page. Saved in this browser only.</p>
    ${Store.all().properties.map((p) => `
      <form class="content-form room" data-id="${p.id}" style="margin-bottom:14px">
        <p class="kicker">${p.title}</p>
        <div class="field"><label>Short line</label><input name="blurb" value="${p.blurb}"></div>
        <div class="field"><label>About</label><textarea name="about">${p.about}</textarea></div>
        <button class="btn btn-solid" type="submit">Save</button>
      </form>`).join("")}
  `);
}

function team() {
  const staff = Store.all().users.filter((u) => u.role !== "guest");
  return shell("Team", `
    <table style="margin-top:22px">
      <tr><th>Name</th><th>Email</th><th>Role</th><th>Property</th></tr>
      ${staff.map((u) => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.propertyId || "All"}</td></tr>`).join("")}
    </table>
  `);
}

function settings() {
  if (Store.session().role !== "owner") return shell("Settings", `<p class="muted">Owner only.</p>`);
  return shell("Settings", `
    <div class="room" style="margin-top:22px">
      <p>Currency default: UGX</p>
      <p>Pay: card and mobile money</p>
      <p>Properties: Hotel Samara (Entebbe), Lodge Emburara (Mbarara), Lodge Chimpundu (Kebale)</p>
    </div>
  `);
}

function render() {
  if (!needStaff()) {
    app.innerHTML = loginView();
    document.getElementById("staff-login")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const res = Store.login(f.get("email"), f.get("password"), "staff");
      if (res.error) return toast(res.error);
      go("overview");
    });
    return;
  }
  const raw = path();
  const [base, id] = raw.split("/");
  if (base === "overview") app.innerHTML = overview();
  else if (base === "reservations") app.innerHTML = reservations(id);
  else if (base === "calendar") app.innerHTML = calendar();
  else if (base === "rooms") app.innerHTML = roomsView();
  else if (base === "guests") app.innerHTML = guests();
  else if (base === "contact") app.innerHTML = contact();
  else if (base === "support") app.innerHTML = support();
  else if (base === "reports") app.innerHTML = reports();
  else if (base === "content") app.innerHTML = content();
  else if (base === "team") app.innerHTML = team();
  else if (base === "settings") app.innerHTML = settings();
  else app.innerHTML = overview();
  bind();
}

function bind() {
  document.querySelector("[data-out]")?.addEventListener("click", () => {
    Store.logout();
    go("login");
    render();
  });
  document.querySelectorAll("[data-res]").forEach((el) => {
    el.addEventListener("click", () => go("reservations/" + el.dataset.res));
  });
  document.getElementById("search")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll("#res-table tr.clickable").forEach((tr) => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
  document.getElementById("res-edit")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    Store.updateReservation(path().split("/")[1], { status: f.get("status"), notes: f.get("notes") });
    toast("Reservation updated");
  });
  document.querySelectorAll(".ticket-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Store.replyTicket(form.dataset.id, new FormData(form).get("body"), "admin");
      toast("Reply saved");
      render();
    });
  });
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      Store.setTicketStatus(btn.dataset.close, "closed");
      render();
    });
  });
  document.querySelectorAll(".content-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const d = Store.all();
      const p = d.properties.find((x) => x.id === form.dataset.id);
      p.blurb = f.get("blurb");
      p.about = f.get("about");
      localStorage.setItem("tp-demo-v1", JSON.stringify(d));
      toast("Website text saved");
    });
  });
}

window.addEventListener("hashchange", render);
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
}, { passive: true });

if (!location.hash) location.hash = "#/overview";
render();
