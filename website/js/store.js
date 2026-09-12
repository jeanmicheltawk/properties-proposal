const STORE_KEY = "tp-demo-v1";

const HILLS = `
<svg viewBox="0 0 220 80" aria-hidden="true">
  <circle cx="158" cy="13" r="3.4"/>
  <path d="M22 58 C 48 58, 58 30, 82 34 C 100 37, 110 22, 132 26 C 150 29, 160 40, 198 50"/>
  <path d="M32 62 C 54 61, 64 38, 86 41 C 104 44, 114 32, 134 35 C 152 38, 162 46, 192 54"/>
  <path d="M42 66 C 60 65, 70 46, 90 48 C 108 50, 118 42, 136 44 C 154 46, 164 52, 186 58"/>
</svg>`;

const SEED = {
  properties: [
    {
      id: "samara",
      kind: "Hotel",
      name: "Samara",
      title: "Hotel Samara",
      town: "Entebbe",
      blurb: "A hotel stay in Entebbe. Own rooms, own rates, same booking system.",
      about: "Hotel Samara sits in Entebbe. This page is the hotel’s own face on the shared site — rooms and availability live here, not under another property’s name."
    },
    {
      id: "emburara",
      kind: "Lodge",
      name: "Emburara",
      title: "Lodge Emburara",
      town: "Mbarara",
      blurb: "A lodge stay in Mbarara. Separate inventory, same booking flow.",
      about: "Lodge Emburara is in Mbarara. Guests pick this property, then a room and dates. Staff see the same stay in the dashboard."
    },
    {
      id: "chimpundu",
      kind: "Lodge",
      name: "Chimpundu",
      title: "Lodge Chimpundu",
      town: "Kebale",
      blurb: "A lodge stay in Kebale. Separate inventory, same booking flow.",
      about: "Lodge Chimpundu is in Kebale. Same structure as the other two properties so the brand stays one system."
    }
  ],
  rooms: [
    { id: "sa-deluxe", propertyId: "samara", name: "Deluxe Room", occupancy: 2, rate: 480000, note: "One room. Quiet, simple, for two." },
    { id: "sa-twin", propertyId: "samara", name: "Twin Room", occupancy: 2, rate: 420000, note: "Two beds. Useful for colleagues or friends." },
    { id: "sa-suite", propertyId: "samara", name: "Suite", occupancy: 3, rate: 720000, note: "More space. Still a room stay — extras only if you add them." },
    { id: "em-garden", propertyId: "emburara", name: "Garden Room", occupancy: 2, rate: 390000, note: "Ground-level room at the lodge." },
    { id: "em-family", propertyId: "emburara", name: "Family Cottage", occupancy: 4, rate: 560000, note: "One cottage. Sleeps a small family." },
    { id: "ch-forest", propertyId: "chimpundu", name: "Forest Room", occupancy: 2, rate: 410000, note: "A lodge room looking into the trees." },
    { id: "ch-hill", propertyId: "chimpundu", name: "Hill View Cottage", occupancy: 3, rate: 540000, note: "Cottage with a wider view." }
  ],
  users: [
    { email: "guest@demo.com", password: "demo", name: "Amina Okello", phone: "+256 700 000 001", role: "guest" },
    { email: "owner@demo.com", password: "demo", name: "Owner", phone: "", role: "owner" },
    { email: "emburara@demo.com", password: "demo", name: "Emburara desk", phone: "", role: "admin", propertyId: "emburara" }
  ],
  reservations: [
    { id: "RES-1842", email: "guest@demo.com", name: "Amina Okello", propertyId: "emburara", roomId: "em-garden", arrive: "2026-10-18", depart: "2026-10-22", guests: 2, amount: 1560000, status: "confirmed", extras: "None", notes: "" },
    { id: "RES-1843", email: "nambi@email.com", name: "Maria Nambi", propertyId: "chimpundu", roomId: "ch-hill", arrive: "2026-09-14", depart: "2026-09-17", guests: 2, amount: 1620000, status: "due-in", extras: "None", notes: "" },
    { id: "RES-1901", email: "guest@demo.com", name: "Amina Okello", propertyId: "samara", roomId: "sa-deluxe", arrive: "2026-03-02", depart: "2026-03-05", guests: 2, amount: 1440000, status: "past", extras: "None", notes: "" }
  ],
  messages: [
    { id: "M-01", name: "David K.", email: "david@email.com", propertyId: "samara", body: "Do you have a room for 20 September?", date: "2026-09-10", unread: true }
  ],
  tickets: [
    { id: "T-01", email: "guest@demo.com", reservationId: "RES-1842", subject: "Arrival time", body: "We land late in Entebbe and drive to Mbarara. Can we arrive after 8pm?", status: "open", replies: [] }
  ],
  session: null
};

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      localStorage.setItem(STORE_KEY, JSON.stringify(SEED));
      return structuredClone(SEED);
    }
    const data = JSON.parse(raw);
    if (!data.properties || !data.rooms) {
      localStorage.setItem(STORE_KEY, JSON.stringify(SEED));
      return structuredClone(SEED);
    }
    return data;
  } catch {
    return structuredClone(SEED);
  }
}

function save(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

const Store = {
  hills: HILLS,
  all() { return load(); },
  property(id) { return load().properties.find((p) => p.id === id); },
  room(id) { return load().rooms.find((r) => r.id === id); },
  roomsFor(propertyId) {
    return load().rooms.filter((r) => !propertyId || r.propertyId === propertyId);
  },
  ugx(n) { return "UGX " + Number(n).toLocaleString("en-UG"); },
  nights(a, b) {
    const ms = new Date(b) - new Date(a);
    return Math.max(1, Math.round(ms / 86400000));
  },
  session() { return load().session; },
  logout() {
    const d = load();
    d.session = null;
    save(d);
  },
  login(email, password, expect) {
    const d = load();
    const user = d.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { error: "Wrong email or password." };
    if (expect === "staff" && user.role === "guest") return { error: "This is a guest account. Use the public Sign in." };
    if (expect === "guest" && user.role !== "guest") return { error: "Staff sign in at the dashboard." };
    d.session = { email: user.email, name: user.name, role: user.role, propertyId: user.propertyId || null };
    save(d);
    return { user: d.session };
  },
  signup({ name, email, password, phone }) {
    const d = load();
    if (d.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: "That email already has an account." };
    }
    d.users.push({ email, password, name, phone: phone || "", role: "guest" });
    d.session = { email, name, role: "guest" };
    save(d);
    return { user: d.session };
  },
  nextResId() {
    const d = load();
    const nums = d.reservations.map((r) => Number(String(r.id).replace(/\D/g, "")) || 0);
    return "RES-" + (Math.max(1800, ...nums) + 1);
  },
  addReservation(payload) {
    const d = load();
    const id = Store.nextResId();
    const room = d.rooms.find((r) => r.id === payload.roomId);
    const nights = Store.nights(payload.arrive, payload.depart);
    const row = {
      id,
      email: payload.email,
      name: payload.name,
      propertyId: payload.propertyId,
      roomId: payload.roomId,
      arrive: payload.arrive,
      depart: payload.depart,
      guests: payload.guests,
      amount: room.rate * nights,
      status: "confirmed",
      extras: payload.extras || "None",
      notes: ""
    };
    d.reservations.unshift(row);
    save(d);
    return row;
  },
  updateReservation(id, patch) {
    const d = load();
    const row = d.reservations.find((r) => r.id === id);
    if (!row) return;
    Object.assign(row, patch);
    save(d);
  },
  reservationsFor(email) {
    return load().reservations.filter((r) => r.email.toLowerCase() === email.toLowerCase());
  },
  reservation(id) {
    return load().reservations.find((r) => r.id === id);
  },
  addMessage(msg) {
    const d = load();
    d.messages.unshift({ id: "M-" + Date.now(), unread: true, date: new Date().toISOString().slice(0, 10), ...msg });
    save(d);
  },
  addTicket(t) {
    const d = load();
    const row = { id: "T-" + Date.now(), status: "open", replies: [], ...t };
    d.tickets.unshift(row);
    save(d);
    return row;
  },
  replyTicket(id, body, from) {
    const d = load();
    const t = d.tickets.find((x) => x.id === id);
    if (!t) return;
    t.replies.push({ from, body, date: new Date().toISOString().slice(0, 10) });
    t.status = from === "admin" ? "in-progress" : t.status;
    save(d);
  },
  setTicketStatus(id, status) {
    const d = load();
    const t = d.tickets.find((x) => x.id === id);
    if (t) t.status = status;
    save(d);
  },
  scopedReservations(session) {
    const d = load();
    if (session && session.role === "admin" && session.propertyId) {
      return d.reservations.filter((r) => r.propertyId === session.propertyId);
    }
    return d.reservations;
  }
};

window.Store = Store;
window.HILLS = HILLS;
