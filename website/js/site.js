const app = document.getElementById("app");
const progress = document.getElementById("progress");

function qs(k) {
  return new URLSearchParams(location.hash.split("?")[1] || "").get(k);
}
function hashPath() {
  const raw = (location.hash.replace(/^#\/?/, "") || "home").split("?")[0];
  return raw || "home";
}
function go(path) {
  location.hash = "#/" + path.replace(/^#\/?/, "");
}
function toast(text) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

const PHOTOS = {
  hero: ["img/hero-3.jpg", "img/hero-1.jpg", "img/samara.jpg", "img/emburara.jpg", "img/chimpundu.jpg"],
  samara: "img/samara.jpg",
  emburara: "img/emburara.jpg",
  chimpundu: "img/chimpundu.jpg",
  wild: "img/wild.jpg"
};

function hills(draw) {
  return `<div class="hills ${draw ? "hills-draw" : ""}">${HILLS}</div>`;
}
function mark() {
  return `<div class="mark">${HILLS}</div>`;
}

function nav() {
  const s = Store.session();
  const guest = s && s.role === "guest";
  return `
    <nav class="top">
      <button class="menu-btn" type="button" data-menu>Menu</button>
      <a class="brand" href="#/home">Three Properties</a>
      <a class="nav-cta book" href="#/booking">Book now</a>
    </nav>
    <div class="overlay" id="menu">
      <button class="close-menu" type="button" data-menu>Close</button>
      <a href="#/home" data-menu>Home</a>
      <a href="#/properties" data-menu>Properties</a>
      <a href="#/rooms" data-menu>Rooms</a>
      <a href="#/booking" data-menu>Book</a>
      <a href="#/contact" data-menu>Enquire</a>
      <a href="#/support" data-menu>Support</a>
      ${guest ? `<a href="#/account" data-menu>${s.name.split(" ")[0]}</a>` : `<a href="#/signin" data-menu>Sign in</a>`}
      <a href="admin.html">Staff</a>
    </div>`;
}

function footer() {
  return `
    <footer class="site">
      <span>Hotel Samara · Entebbe</span>
      <span>Lodge Emburara · Mbarara</span>
      <span>Lodge Chimpundu · Kebale</span>
      <a href="admin.html">Staff</a>
    </footer>`;
}

function propertyCard(p) {
  return `
    <a class="dest-photo" href="#/property/${p.id}">
      <img src="${PHOTOS[p.id]}" alt="${p.title}">
      <div class="dest-copy">
        <span class="num">${p.kind} · ${p.town}</span>
        <h3>${p.name}</h3>
        <p class="dest-more">${p.blurb}</p>
      </div>
    </a>`;
}

function home() {
  const props = Store.all().properties;
  const slides = PHOTOS.hero.map((src, i) =>
    `<div class="slide ${i === 0 ? "on" : ""}" style="background-image:url('${src}')"></div>`).join("");
  const dust = Array.from({ length: 26 }, (_, i) => {
    const left = ((i * 37) % 100);
    const size = 1 + (i % 4);
    const dur = 10 + (i % 9);
    const delay = -(i * 0.7);
    return `<i class="mote" style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:${delay}s"></i>`;
  }).join("");
  return `
    <section class="hero" id="hero">
      <div class="hero-slides">${slides}</div>
      <div class="hero-haze"></div>
      <div class="hero-rays"></div>
      <div class="hero-dust" aria-hidden="true">${dust}</div>
      <svg class="hero-birds" viewBox="0 0 240 60" aria-hidden="true">
        <path class="bird b1" d="M2 28c6-5 11-2 16 1 5-6 12-8 18-2"/>
        <path class="bird b2" d="M8 40c5-4 9-1 13 1 4-5 10-6 15-1"/>
        <path class="bird b3" d="M0 18c4-3 8-1 11 1 3-4 8-5 12-1"/>
      </svg>
      <div class="hero-center">
        <p class="welcome">Welcome to</p>
        <h1>Three Properties</h1>
        <div class="hero-rule">
          <span class="hero-line"></span>
          <button class="hero-play" id="hero-play" type="button" aria-label="Pause film">
            <span class="bars" aria-hidden="true"><i></i><i></i></span>
            <span class="tri" aria-hidden="true"></span>
          </button>
          <span class="hero-line"></span>
        </div>
      </div>
      <div class="hero-base">
        <p class="coords">
          <span>Entebbe <em>0.0528° N · 32.4637° E</em></span>
          <span>Mbarara <em>0.6074° S · 30.6545° E</em></span>
          <span>Kebale <em>1.2486° S · 29.9894° E</em></span>
        </p>
        <p class="hero-note">Three stays across Uganda — lake water, highland grass, and forest mist.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap split-copy reveal-up">
        <div>
          <p class="tag">We are three properties</p>
          <h2>Discover Uganda’s lake, highland, and forest stays.</h2>
        </div>
        <div>
          <p>Hotel Samara in Entebbe. Lodge Emburara in Mbarara. Lodge Chimpundu in Kebale. Each place is chosen for where it sits — not as one brand wearing three names.</p>
          <p class="muted" style="margin-top:16px">Book on this site. Staff run all three from one dashboard. Same reservation ID on both sides.</p>
        </div>
      </div>
    </section>
    <section class="full-photo reveal-up" style="background-image:url('${PHOTOS.wild}')">
      <div class="shade wrap">
        <div>
          <p class="tag">#threeproperties</p>
          <h2>Untamed places. A quiet stay.</h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="reveal-up">
          <p class="tag">Our properties</p>
          <h2>Iconic destinations</h2>
          <p class="muted" style="max-width:640px;margin:12px 0 0">Three properties. Three towns. Open a place to see its rooms.</p>
        </div>
        <div class="dests reveal-up">${props.map(propertyCard).join("")}</div>
      </div>
    </section>
    <section class="collect">
      <div class="collect-sun" aria-hidden="true"></div>
      <svg class="collect-land" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 128 C180 118 260 142 420 130 C560 120 640 148 820 128 C980 110 1100 146 1440 124 V180 H0 Z"/>
        <g class="acacias">
          <g transform="translate(210,86)"><path d="M0 42 V18"/><path d="M-22 16 C-10 2 10 2 22 16 C8 10 -8 10 -22 16"/><path d="M-14 22 C-4 12 6 12 16 22"/></g>
          <g transform="translate(720,78)"><path d="M0 50 V16"/><path d="M-28 16 C-12 -2 12 -2 28 16 C10 8 -10 8 -28 16"/><path d="M-16 24 C-4 12 8 12 20 24"/></g>
          <g transform="translate(1188,92)"><path d="M0 36 V14"/><path d="M-18 14 C-8 2 8 2 18 14 C8 9 -8 9 -18 14"/></g>
        </g>
      </svg>
      <div class="wrap reveal-up">
        <p class="tag">The collection</p>
        <p class="collect-route">Lake · Highland · Forest</p>
        <div class="stats">
          <article>
            <span class="stat-num" data-count="3">00</span>
            <h3>Properties</h3>
            <ul>
              <li>Hotel Samara <em>Lake</em></li>
              <li>Lodge Emburara <em>Highland</em></li>
              <li>Lodge Chimpundu <em>Forest</em></li>
            </ul>
          </article>
          <article>
            <span class="stat-num" data-count="3">00</span>
            <h3>Towns</h3>
            <ul>
              <li>Entebbe <em>0.0528° N · 32.4637° E</em></li>
              <li>Mbarara <em>0.6074° S · 30.6545° E</em></li>
              <li>Kebale <em>1.2486° S · 29.9894° E</em></li>
            </ul>
          </article>
          <article>
            <span class="stat-num" data-count="1">00</span>
            <h3>Stay</h3>
            <ul>
              <li>Pick dates</li>
              <li>Choose a room</li>
              <li>Pay here</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
    <section class="xp-band">
      <div class="xp-stage" id="xp-stage">
        <button class="xp-circle xp-prev" type="button" data-xp="-1" aria-label="Previous stay">
          <img id="xp-prev" src="${PHOTOS.chimpundu}" alt="">
        </button>
        <div class="xp-center">
          <div class="xp-circle xp-main">
            <img id="xp-img" src="${PHOTOS.samara}" alt="">
          </div>
          <div class="xp-panel">
            <h2 id="xp-title">Lake — Entebbe</h2>
            <p id="xp-copy">Hotel Samara sits by the water at the start of most Uganda journeys.</p>
            <a class="xp-cta" id="xp-cta" href="#/property/samara"><span></span> Hotel Samara</a>
            <p class="xp-loc" id="xp-loc">Entebbe</p>
          </div>
        </div>
        <button class="xp-circle xp-next" type="button" data-xp="1" aria-label="Next stay">
          <img id="xp-next" src="${PHOTOS.emburara}" alt="">
        </button>
      </div>
      <div class="xp-foot">
        <span id="xp-count">01 / 03</span>
        <button type="button" data-xp="-1" aria-label="Previous">←</button>
        <button type="button" data-xp="1" aria-label="Next">→</button>
      </div>
    </section>
    <section class="full-photo reveal-up" style="background-image:url('${PHOTOS.emburara}')">
      <div class="shade wrap">
        <div>
          <p class="tag">Plan your stay</p>
          <h2>Dates, room, pay — on this site.</h2>
          <a class="btn" style="margin-top:22px" href="#/booking">Book now</a>
        </div>
      </div>
    </section>`;
}

function properties() {
  return `
    <section class="page wrap">
      <p class="kicker">The collection</p>
      <h2>Where you can stay.</h2>
      <p class="lead" style="margin:16px 0 8px">Each property has its own rooms and rates.</p>
      <div class="dests">${Store.all().properties.map(propertyCard).join("")}</div>
    </section>`;
}

function propertyPage(id) {
  const p = Store.property(id);
  if (!p) return `<section class="page wrap"><h2>Not found</h2></section>`;
  const rooms = Store.roomsFor(id);
  const logo = p.id === "samara" ? `<img class="logo" src="samara-logo-dark.png" alt="Hotel Samara">` : "";
  return `
    <section class="prop-hero" style="width:100%;padding:140px 6vw 48px;background-image:linear-gradient(180deg,rgba(16,16,14,.25),rgba(16,16,14,.78)),url('${PHOTOS[p.id]}');background-size:cover;background-position:center">
      ${logo}
      <p class="kicker">${p.kind} · ${p.town}</p>
      <h1>${p.title}</h1>
      <p class="lead" style="margin-left:0">${p.about}</p>
      <div class="hero-actions" style="justify-content:flex-start">
        <a class="btn btn-solid" href="#/booking?property=${p.id}">Check dates</a>
      </div>
    </section>
    <section class="section wrap">
      <p class="kicker">Rooms</p>
      <div class="grid-2" style="margin-top:24px">
        ${rooms.map((r) => `
          <article class="room">
            <p class="kicker">${r.occupancy} guests</p>
            <h3>${r.name}</h3>
            <p class="price">${Store.ugx(r.rate)} <span class="muted">/ night</span></p>
            <p class="muted">${r.note}</p>
            <a class="btn btn-solid" style="margin-top:16px" href="#/booking?property=${p.id}&room=${r.id}">Book</a>
          </article>`).join("")}
      </div>
    </section>`;
}

function roomsPage() {
  const filter = qs("property") || "";
  const rooms = Store.roomsFor(filter);
  const chips = [`<button class="chip ${!filter ? "on" : ""}" data-filter="">All</button>`]
    .concat(Store.all().properties.map((p) =>
      `<button class="chip ${filter === p.id ? "on" : ""}" data-filter="${p.id}">${p.name}</button>`)).join("");
  return `
    <section class="page wrap">
      <p class="kicker">Rooms</p>
      <h2>Rates in UGX.</h2>
      <div class="chips" id="filters">${chips}</div>
      <div class="grid-2">
        ${rooms.map((r) => {
          const p = Store.property(r.propertyId);
          return `
            <article class="room">
              <p class="kicker">${p.title} · ${p.town}</p>
              <h3>${r.name}</h3>
              <p class="price">${Store.ugx(r.rate)} <span class="muted">/ night</span></p>
              <p class="muted">${r.occupancy} guests · ${r.note}</p>
              <a class="btn btn-solid" style="margin-top:16px" href="#/booking?property=${r.propertyId}&room=${r.id}">Book</a>
            </article>`;
        }).join("")}
      </div>
    </section>`;
}

const PLACE = {
  samara: { land: "Lake", coords: "0.0528° N · 32.4637° E" },
  emburara: { land: "Highland", coords: "0.6074° S · 30.6545° E" },
  chimpundu: { land: "Forest", coords: "1.2486° S · 29.9894° E" }
};

function bookingPage() {
  const s = Store.session();
  const props = Store.all().properties;
  const preP = qs("property") || "";
  const dust = Array.from({ length: 14 }, (_, i) => {
    const left = (i * 29) % 100;
    return `<i class="mote" style="left:${left}%;width:${1 + i % 3}px;height:${1 + i % 3}px;animation-duration:${11 + i % 7}s;animation-delay:${-(i * 0.8)}s"></i>`;
  }).join("");
  const places = props.map((p) => `
    <button type="button" class="book-place ${preP === p.id ? "on" : ""}" data-property="${p.id}">
      <img src="${PHOTOS[p.id]}" alt="">
      <span>
        <small>${PLACE[p.id].land} · ${p.town}</small>
        <strong>${p.title}</strong>
        <em>${PLACE[p.id].coords}</em>
      </span>
    </button>`).join("");
  return `
    <section class="book-journey" id="book-journey" data-step="1">
      <div class="book-sky" id="book-sky" style="background-image:url('${PHOTOS[preP] || PHOTOS.hero[0]}')"></div>
      <div class="book-veil"></div>
      <div class="hero-dust" aria-hidden="true">${dust}</div>
      <div class="book-sun" aria-hidden="true"></div>
      <div class="wrap book-wrap">
        <p class="kicker">A stay in Uganda</p>
        <ol class="book-trail" id="book-trail">
          <li class="on"><b>01</b> Place</li>
          <li><b>02</b> Dates</li>
          <li><b>03</b> Room</li>
          <li><b>04</b> Pay</li>
        </ol>
        <form id="book-form">
          <input type="hidden" name="propertyId" value="${preP}">
          <input type="hidden" name="roomId" value="${qs("room") || ""}">
          <div class="book-pane on" data-step="1">
            <h2>Where will you stay?</h2>
            <p class="book-sub">Lake · Highland · Forest</p>
            <div class="book-places">${places}</div>
            <div class="book-nav">
              <button type="button" class="btn btn-solid" data-next>Continue</button>
            </div>
          </div>
          <div class="book-pane" data-step="2">
            <h2>When do you arrive?</h2>
            <p class="book-sub">The land is quiet in the morning. Pick your days.</p>
            <div class="book-dates">
              <div class="field"><label>Arrival</label><input type="date" name="arrive" value="2026-10-18"></div>
              <div class="field"><label>Departure</label><input type="date" name="depart" value="2026-10-22"></div>
              <div class="field"><label>Guests</label><input type="number" name="guests" min="1" max="8" value="2"></div>
            </div>
            <div class="book-nav">
              <button type="button" class="btn" data-back>Back</button>
              <button type="button" class="btn btn-solid" data-next>Continue</button>
            </div>
          </div>
          <div class="book-pane" data-step="3">
            <h2>Which room?</h2>
            <p class="book-sub">Each property keeps its own rooms.</p>
            <div class="book-rooms" id="book-rooms"></div>
            <div class="book-nav">
              <button type="button" class="btn" data-back>Back</button>
              <button type="button" class="btn btn-solid" data-next>Continue</button>
            </div>
          </div>
          <div class="book-pane" data-step="4">
            <h2>Confirm your stay.</h2>
            <p class="book-sub" id="book-recap"></p>
            <div class="book-pay">
              <div class="field"><label>Full name</label><input name="name" required value="${s && s.role === "guest" ? s.name : ""}"></div>
              <div class="field"><label>Email</label><input type="email" name="email" required value="${s && s.role === "guest" ? s.email : ""}"></div>
              <div class="field"><label>Pay</label>
                <select name="pay"><option>Mobile money</option><option>Card</option></select>
              </div>
              <p class="book-quote" id="quote"></p>
            </div>
            <div class="book-nav">
              <button type="button" class="btn" data-back>Back</button>
              <button class="btn btn-solid" type="submit">Confirm booking</button>
            </div>
          </div>
        </form>
      </div>
    </section>`;
}

function fillRooms(preR) {
  const box = document.getElementById("book-rooms");
  const form = document.getElementById("book-form");
  if (!box || !form) return;
  const rooms = Store.roomsFor(form.propertyId.value);
  const chosen = preR || form.roomId.value;
  box.innerHTML = rooms.map((r) => `
    <button type="button" class="book-room ${r.id === chosen ? "on" : ""}" data-room="${r.id}">
      <small>${r.occupancy} guests</small>
      <strong>${r.name}</strong>
      <span>${Store.ugx(r.rate)} <em>/ night</em></span>
      <p>${r.note}</p>
    </button>`).join("");
  box.querySelectorAll("[data-room]").forEach((btn) => {
    btn.addEventListener("click", () => {
      form.roomId.value = btn.dataset.room;
      box.querySelectorAll(".book-room").forEach((el) => el.classList.toggle("on", el === btn));
    });
  });
  if (chosen && rooms.some((r) => r.id === chosen)) form.roomId.value = chosen;
}
function quote() {
  const form = document.getElementById("book-form");
  const recap = document.getElementById("book-recap");
  const out = document.getElementById("quote");
  if (!form || !out) return;
  const prop = Store.property(form.propertyId.value);
  const room = Store.room(form.roomId.value);
  if (!prop || !room) {
    out.textContent = "";
    if (recap) recap.textContent = "";
    return;
  }
  const n = Store.nights(form.arrive.value, form.depart.value);
  const land = PLACE[prop.id]?.land || "";
  if (recap) recap.textContent = `${prop.title} · ${land} · ${prop.town}. ${room.name}. ${form.arrive.value} — ${form.depart.value}.`;
  out.textContent = `${n} night${n > 1 ? "s" : ""} · ${form.guests.value} guests · ${Store.ugx(room.rate * n)}`;
}

function contactPage() {
  return `
    <section class="page wrap">
      <div class="auth">
        <p class="kicker">Contact</p>
        <h2>Write to us.</h2>
        <form id="contact-form" style="margin-top:22px">
          <div class="field"><label>Name</label><input name="name" required></div>
          <div class="field"><label>Email</label><input type="email" name="email" required></div>
          <div class="field"><label>Property</label>
            <select name="propertyId">
              <option value="">Any</option>
              ${Store.all().properties.map((p) => `<option value="${p.id}">${p.title}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label>Message</label><textarea name="body" required></textarea></div>
          <button class="btn btn-solid" type="submit" style="width:100%">Send</button>
        </form>
      </div>
    </section>`;
}

function supportPage() {
  const s = Store.session();
  const stays = s && s.role === "guest" ? Store.reservationsFor(s.email) : [];
  return `
    <section class="page wrap">
      <div class="auth">
        <p class="kicker">Support</p>
        <h2>An existing stay.</h2>
        <form id="support-form" style="margin-top:22px">
          <div class="field"><label>Email</label><input type="email" name="email" required value="${s && s.role === "guest" ? s.email : ""}"></div>
          <div class="field"><label>Reservation ID</label>
            ${stays.length
              ? `<select name="reservationId">${stays.map((r) => `<option>${r.id}</option>`).join("")}</select>`
              : `<input name="reservationId" required placeholder="RES-1842">`}
          </div>
          <div class="field"><label>Subject</label><input name="subject" required></div>
          <div class="field"><label>Message</label><textarea name="body" required></textarea></div>
          <button class="btn btn-solid" type="submit" style="width:100%">Open ticket</button>
        </form>
      </div>
    </section>`;
}

function authPage(mode) {
  const signup = mode === "signup";
  return `
    <section class="page wrap">
      <div class="auth">
        <p class="kicker">${signup ? "Guest" : "Welcome back"}</p>
        <h2>${signup ? "Create account" : "Sign in"}</h2>
        <form id="auth-form" style="margin-top:22px">
          ${signup ? `<div class="field"><label>Full name</label><input name="name" required></div>` : ""}
          <div class="field"><label>Email</label><input type="email" name="email" required></div>
          <div class="field"><label>Password</label><input type="password" name="password" required></div>
          ${signup ? `<div class="field"><label>Phone</label><input name="phone"></div>` : ""}
          <button class="btn btn-solid" type="submit" style="width:100%">${signup ? "Create account" : "Sign in"}</button>
        </form>
        <p class="hint">${signup ? `Already have an account? <a class="gold" href="#/signin">Sign in</a>` : `New here? <a class="gold" href="#/signup">Sign up</a><br>Demo guest: guest@demo.com / demo`}</p>
      </div>
    </section>`;
}

function accountPage() {
  const s = Store.session();
  if (!s || s.role !== "guest") {
    go("signin");
    return "";
  }
  const tab = qs("tab") || "stays";
  const stays = Store.reservationsFor(s.email);
  const tickets = Store.all().tickets.filter((t) => t.email === s.email);
  const user = Store.all().users.find((u) => u.email === s.email);
  let main = "";
  if (tab === "stays") {
    main = stays.length ? `
      <table>
        <tr><th>ID</th><th>Property</th><th>Dates</th><th>Status</th></tr>
        ${stays.map((r) => {
          const p = Store.property(r.propertyId);
          return `<tr class="clickable" data-open="${r.id}"><td>${r.id}</td><td>${p.name}</td><td>${r.arrive} → ${r.depart}</td><td class="status">${r.status}</td></tr>`;
        }).join("")}
      </table>` : `<div class="empty">No reservations yet.<br><a class="btn btn-solid" style="margin-top:16px" href="#/booking">Book a stay</a></div>`;
  } else if (tab === "support") {
    main = tickets.length ? tickets.map((t) => `
      <article class="room" style="margin-bottom:12px">
        <p class="kicker">${t.id} · ${t.status}</p>
        <h3>${t.subject}</h3>
        <p class="muted">${t.body}</p>
      </article>`).join("") : `<div class="empty">No tickets. <a class="gold" href="#/support">Open support</a></div>`;
  } else {
    main = `
      <form id="profile-form">
        <div class="field"><label>Name</label><input name="name" value="${user.name}"></div>
        <div class="field"><label>Phone</label><input name="phone" value="${user.phone || ""}"></div>
        <p class="muted">Email stays ${user.email}</p>
        <button class="btn btn-solid" type="submit" style="margin-top:16px">Save</button>
        <button class="btn" type="button" data-out style="margin-top:10px">Sign out</button>
      </form>`;
  }
  return `
    <section class="page wrap">
      <p class="kicker">My account</p>
      <h2>${s.name}</h2>
      <div class="account" style="margin-top:28px">
        <aside class="side">
          <a class="${tab === "stays" ? "on" : ""}" href="#/account?tab=stays">Reservations</a>
          <a class="${tab === "support" ? "on" : ""}" href="#/account?tab=support">Support</a>
          <a class="${tab === "profile" ? "on" : ""}" href="#/account?tab=profile">Profile</a>
        </aside>
        <div>${main}</div>
      </div>
    </section>`;
}

function stayPage(id) {
  const s = Store.session();
  const r = Store.reservation(id);
  if (!r || !s || r.email !== s.email) return `<section class="page wrap"><h2>Stay not found</h2></section>`;
  const p = Store.property(r.propertyId);
  const room = Store.room(r.roomId);
  return `
    <section class="page wrap">
      <p class="kicker">${r.id}</p>
      <h2>${p.title}</h2>
      <p class="muted">${p.town} · ${room.name}</p>
      <div class="grid-2" style="margin-top:28px">
        <div class="room">
          <p class="kicker">Stay</p>
          <p>${r.arrive} → ${r.depart}</p>
          <p>${r.guests} guests</p>
          <p class="status">${r.status}</p>
        </div>
        <div class="room">
          <p class="kicker">Paid</p>
          <p class="price">${Store.ugx(r.amount)}</p>
          <p class="muted">Extras: ${r.extras}</p>
          <a class="btn" href="#/support">Contact support</a>
        </div>
      </div>
    </section>`;
}

function successPage(id) {
  const r = Store.reservation(id);
  if (!r) return `<section class="page wrap"><h2>Not found</h2></section>`;
  return `
    <section class="page wrap" style="text-align:center">
      <p class="kicker">Confirmed</p>
      <h2>Your stay is booked.</h2>
      <p class="success-id">${r.id}</p>
      <p class="muted">We sent this to ${r.email}. Sign in with that email to see it under My account. Staff see the same ID.</p>
      <div class="hero-actions">
        <a class="btn btn-solid" href="#/account">My reservations</a>
        <a class="btn" href="#/home">Home</a>
      </div>
    </section>`;
}

function render() {
  const path = hashPath();
  const [base, id] = path.split("/");
  let body = "";
  if (base === "home") body = home();
  else if (base === "properties") body = properties();
  else if (base === "property") body = propertyPage(id);
  else if (base === "rooms") body = roomsPage();
  else if (base === "booking") body = bookingPage();
  else if (base === "contact") body = contactPage();
  else if (base === "support") body = supportPage();
  else if (base === "signin") body = authPage("signin");
  else if (base === "signup") body = authPage("signup");
  else if (base === "account") body = accountPage();
  else if (base === "stay") body = stayPage(id);
  else if (base === "success") body = successPage(id);
  else body = home();
  app.innerHTML = nav() + body + footer();
  app.classList.remove("leaving");
  app.classList.add("enter");
  bind();
}

function bind() {
  document.querySelectorAll("[data-menu]").forEach((el) => {
    el.addEventListener("click", () => document.getElementById("menu")?.classList.toggle("open"));
  });
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => go("rooms" + (btn.dataset.filter ? "?property=" + btn.dataset.filter : "")));
  });
  if (document.getElementById("book-form")) {
    const form = document.getElementById("book-form");
    const journey = document.getElementById("book-journey");
    const sky = document.getElementById("book-sky");
    const marks = [...document.querySelectorAll("#book-trail li")];
    const panes = [...document.querySelectorAll(".book-pane")];
    let step = 1;
    const showSky = (id) => {
      if (sky && PHOTOS[id]) sky.style.backgroundImage = `url('${PHOTOS[id]}')`;
    };
    const showStep = (n, dir) => {
      step = n;
      journey.dataset.step = String(n);
      journey.classList.remove("fwd", "back");
      void journey.offsetWidth;
      journey.classList.add(dir > 0 ? "fwd" : "back");
      panes.forEach((p) => p.classList.toggle("on", Number(p.dataset.step) === n));
      marks.forEach((m, i) => {
        m.classList.toggle("on", i === n - 1);
        m.classList.toggle("done", i < n - 1);
      });
      if (n === 3) fillRooms();
      if (n === 4) quote();
    };
    const canGo = (from) => {
      if (from === 1 && !form.propertyId.value) return toast("Pick a place first."), false;
      if (from === 2) {
        if (!form.arrive.value || !form.depart.value) return toast("Pick your dates."), false;
        if (new Date(form.depart.value) <= new Date(form.arrive.value)) return toast("Departure must be after arrival."), false;
      }
      if (from === 3 && !form.roomId.value) return toast("Pick a room."), false;
      return true;
    };
    document.querySelectorAll("[data-property]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.property;
        if (form.propertyId.value !== id) form.roomId.value = "";
        form.propertyId.value = id;
        document.querySelectorAll(".book-place").forEach((el) => el.classList.toggle("on", el === btn));
        showSky(id);
      });
    });
    form.querySelectorAll("[data-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!canGo(step)) return;
        showStep(Math.min(4, step + 1), 1);
      });
    });
    form.querySelectorAll("[data-back]").forEach((btn) => {
      btn.addEventListener("click", () => showStep(Math.max(1, step - 1), -1));
    });
    form.arrive.addEventListener("change", quote);
    form.depart.addEventListener("change", quote);
    form.guests.addEventListener("change", quote);
    if (form.propertyId.value) showSky(form.propertyId.value);
    if (qs("room") && form.propertyId.value) fillRooms(qs("room"));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!canGo(1) || !canGo(2) || !canGo(3)) return;
      const f = new FormData(form);
      const row = Store.addReservation({
        propertyId: f.get("propertyId"),
        roomId: f.get("roomId"),
        arrive: f.get("arrive"),
        depart: f.get("depart"),
        guests: Number(f.get("guests")),
        name: f.get("name"),
        email: f.get("email")
      });
      go("success/" + row.id);
    });
  }
  document.getElementById("contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    Store.addMessage({ name: f.get("name"), email: f.get("email"), propertyId: f.get("propertyId"), body: f.get("body") });
    toast("Message sent");
    e.target.reset();
  });
  document.getElementById("support-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const email = String(f.get("email"));
    const reservationId = String(f.get("reservationId"));
    const stay = Store.reservation(reservationId);
    if (!stay || stay.email.toLowerCase() !== email.toLowerCase()) {
      toast("Email and reservation ID do not match");
      return;
    }
    Store.addTicket({ email, reservationId, subject: f.get("subject"), body: f.get("body") });
    toast("Ticket opened");
    go("account?tab=support");
  });
  document.getElementById("auth-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const signup = hashPath() === "signup";
    const res = signup
      ? Store.signup({ name: f.get("name"), email: f.get("email"), password: f.get("password"), phone: f.get("phone") })
      : Store.login(f.get("email"), f.get("password"), "guest");
    if (res.error) return toast(res.error);
    go("account");
  });
  document.querySelector("[data-out]")?.addEventListener("click", () => {
    Store.logout();
    go("home");
  });
  document.getElementById("profile-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const d = Store.all();
    const u = d.users.find((x) => x.email === Store.session().email);
    u.name = f.get("name");
    u.phone = f.get("phone");
    d.session.name = u.name;
    localStorage.setItem("tp-demo-v1", JSON.stringify(d));
    toast("Saved");
  });
  document.querySelectorAll("[data-open]").forEach((row) => {
    row.addEventListener("click", () => go("stay/" + row.dataset.open));
  });
  const slides = [...document.querySelectorAll(".hero-slides .slide")];
  const playBtn = document.getElementById("hero-play");
  const hero = document.getElementById("hero");
  if (slides.length) {
    let i = 0;
    let playing = true;
    const step = () => {
      slides[i].classList.remove("on");
      i = (i + 1) % slides.length;
      slides[i].classList.add("on");
    };
    const start = () => {
      clearInterval(window.__hero);
      window.__hero = setInterval(step, 6200);
    };
    clearInterval(window.__hero);
    start();
    playBtn?.addEventListener("click", () => {
      playing = !playing;
      playBtn.classList.toggle("paused", !playing);
      hero?.classList.toggle("is-paused", !playing);
      playBtn.setAttribute("aria-label", playing ? "Pause film" : "Play film");
      if (playing) start();
      else clearInterval(window.__hero);
    });
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      hero?.addEventListener("mousemove", (e) => {
        const x = (e.clientX / innerWidth - 0.5) * 16;
        const y = (e.clientY / innerHeight - 0.5) * 10;
        document.querySelector(".hero-slides").style.transform = `translate(${x}px, ${y}px) scale(1.08)`;
      });
    }
  }
  const xp = [
    { img: PHOTOS.samara, title: "Lake — Entebbe", copy: "Hotel Samara sits by the water at the start of most Uganda journeys.", href: "#/property/samara", cta: "Hotel Samara", loc: "Entebbe" },
    { img: PHOTOS.emburara, title: "Highland — Mbarara", copy: "Lodge Emburara is a highland stay. Its own rooms, same booking flow.", href: "#/property/emburara", cta: "Lodge Emburara", loc: "Mbarara" },
    { img: PHOTOS.chimpundu, title: "Forest — Kebale", copy: "Lodge Chimpundu is in the southwest. Forest light, separate inventory.", href: "#/property/chimpundu", cta: "Lodge Chimpundu", loc: "Kebale" }
  ];
  let xpI = 0;
  const paintXp = () => {
    const item = xp[xpI];
    const next = xp[(xpI + 1) % xp.length];
    const prev = xp[(xpI - 1 + xp.length) % xp.length];
    const img = document.getElementById("xp-img");
    if (!img) return;
    img.src = item.img;
    document.getElementById("xp-next").src = next.img;
    document.getElementById("xp-prev").src = prev.img;
    document.getElementById("xp-title").textContent = item.title;
    document.getElementById("xp-copy").textContent = item.copy;
    document.getElementById("xp-cta").href = item.href;
    document.getElementById("xp-cta").lastChild.textContent = " " + item.cta;
    document.getElementById("xp-loc").textContent = item.loc;
    document.getElementById("xp-count").textContent = String(xpI + 1).padStart(2, "0") + " / 03";
  };
  const moveXp = (dir) => {
    const stage = document.getElementById("xp-stage");
    if (!stage || stage.classList.contains("moving")) return;
    stage.classList.remove("xp-in");
    stage.classList.add("moving", dir > 0 ? "go-next" : "go-prev");
    setTimeout(() => {
      xpI = (xpI + dir + xp.length) % xp.length;
      paintXp();
      stage.classList.remove("go-next", "go-prev", "moving");
      requestAnimationFrame(() => stage.classList.add("xp-in"));
    }, 620);
  };
  document.querySelectorAll("[data-xp]").forEach((btn) => {
    btn.addEventListener("click", () => moveXp(Number(btn.dataset.xp)));
  });
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (nums.length) {
    const countIo = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting || e.target.dataset.done) return;
        e.target.dataset.done = "1";
        const end = Number(e.target.dataset.count);
        const startAt = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - startAt) / 1100);
          const eased = 1 - Math.pow(1 - t, 3);
          e.target.textContent = String(Math.round(end * eased)).padStart(2, "0");
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    nums.forEach((n) => countIo.observe(n));
  }
}

window.addEventListener("hashchange", () => {
  app.classList.add("leaving");
  setTimeout(render, 180);
});
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
}, { passive: true });

if (!location.hash) location.hash = "#/home";
render();
