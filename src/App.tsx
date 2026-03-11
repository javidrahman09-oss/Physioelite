import { useState, useEffect, useCallback } from "react";

const SK = "physio-elite-v3";

const THERAPISTS = [
  {
    name: "Dr. Javedur Rahman A",
    title: "Senior Physiotherapist",
    specialty: "Musculoskeletal & Sports",
    avatar: "JR",
  },
  {
    name: "Dr. Bharath Raja KV",
    title: "Orthopaedic Physiotherapist",
    specialty: "Ortho & Post-surgical",
    avatar: "BR",
  },
];

const TODAY = new Date().toISOString().split("T")[0];

const SEED = [
  {
    id: 1001,
    firstName: "Visakamani",
    lastName: "",
    age: 65,
    gender: "Female",
    blood: "—",
    phone: "",
    email: "",
    address: "",
    condition: "Right Lateral Epicondylitis",
    severity: "Moderate",
    therapist: "Dr. Javedur Rahman A",
    sessions: 0,
    totalSessions: 12,
    nextVisit: "",
    status: "Active",
    joinDate: TODAY,
    notes:
      "65-year-old female presenting with right lateral epicondylitis. Pain on resisted wrist extension. Advised eccentric strengthening and activity modification.",
    vitals: { bp: "", pulse: "", weight: "" },
    payments: "Pending",
    amount: 0,
    history: [],
  },
  {
    id: 1002,
    firstName: "Mr. Swaminathan",
    lastName: "",
    age: 63,
    gender: "Male",
    blood: "—",
    phone: "",
    email: "",
    address: "",
    condition: "Right SLAP Lesion",
    severity: "Moderate",
    therapist: "Dr. Bharath Raja KV",
    sessions: 0,
    totalSessions: 20,
    nextVisit: "",
    status: "Active",
    joinDate: TODAY,
    notes:
      "63-year-old male with right SLAP (Superior Labrum Anterior to Posterior) lesion. Positive O'Brien's test. Focus on rotator cuff stabilisation and posterior capsule stretching.",
    vitals: { bp: "", pulse: "", weight: "" },
    payments: "Pending",
    amount: 0,
    history: [],
  },
  {
    id: 1003,
    firstName: "Mr. Kasi",
    lastName: "",
    age: 56,
    gender: "Male",
    blood: "—",
    phone: "",
    email: "",
    address: "",
    condition: "Left Periarthritis Shoulder",
    severity: "Moderate",
    therapist: "Dr. Javedur Rahman A",
    sessions: 0,
    totalSessions: 16,
    nextVisit: "",
    status: "Active",
    joinDate: TODAY,
    notes:
      "56-year-old male with left periarthritis shoulder. Restricted ROM in all planes. Plan: Maitland Grade III-IV mobilisations, pendulum exercises, progressive strengthening.",
    vitals: { bp: "", pulse: "", weight: "" },
    payments: "Pending",
    amount: 0,
    history: [],
  },
];

const CONDITIONS = [
  "Right Lateral Epicondylitis",
  "Left Lateral Epicondylitis",
  "Right SLAP Lesion",
  "Left SLAP Lesion",
  "Right Periarthritis Shoulder",
  "Left Periarthritis Shoulder",
  "Lumbar Disc Herniation",
  "Frozen Shoulder",
  "Knee Osteoarthritis",
  "ACL Tear",
  "Cervical Spondylosis",
  "Rotator Cuff Injury",
  "Plantar Fasciitis",
  "Tennis Elbow",
  "Post-surgical Rehab",
  "Stroke Rehabilitation",
  "Other",
];
const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "—"];
const SEVERITIES = ["Mild", "Moderate", "Severe"];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "Male",
  blood: "—",
  phone: "",
  email: "",
  address: "",
  condition: "",
  severity: "Moderate",
  therapist: "",
  sessions: 0,
  totalSessions: 12,
  nextVisit: "",
  status: "Active",
  joinDate: TODAY,
  notes: "",
  vitals: { bp: "", pulse: "", weight: "" },
  payments: "Pending",
  amount: 0,
  history: [],
};

function getInitial(p) {
  const n = (p.firstName || "").replace(/^(Mr|Ms|Mrs|Dr)\.?\s*/i, "");
  return (n[0] || "?").toUpperCase();
}
function fullName(p) {
  return `${p.firstName || ""} ${p.lastName || ""}`.trim();
}
function progressPct(p) {
  return Math.min(
    Math.round((p.sessions / Math.max(p.totalSessions, 1)) * 100),
    100
  );
}
function avatarBg(name) {
  const colors = [
    "#1B4F72",
    "#145A32",
    "#6E2F0E",
    "#512E5F",
    "#6B2737",
    "#0E6655",
    "#154360",
    "#784212",
  ];
  const h = [...(name || "")].reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[h % colors.length];
}
function sevColor(s) {
  if (s === "Severe") return "#f87171";
  if (s === "Moderate") return "#fbbf24";
  return "#34d399";
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// ── Colour palette ──────────────────────────────────────────────────────────
const C = {
  bg: "#06090f",
  panel: "#0b0f1a",
  card: "#0f1623",
  border: "#1a2540",
  gold: "#c9a96e",
  goldLight: "#e8c98a",
  goldDim: "#7a6640",
  text: "#e8eaf0",
  textMid: "#7a8599",
  textDim: "#3d4a5c",
  active: "#10b981",
  activeBg: "#071f14",
  activeText: "#34d399",
  completed: "#818cf8",
  completedBg: "#13132e",
  completedText: "#a5b4fc",
  moderate: "#fbbf24",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: ${C.panel}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
  input, select, textarea {
    background: ${C.panel} !important; color: ${C.text} !important;
    border: 1px solid ${C.border} !important; border-radius: 7px !important;
    padding: 10px 14px !important; font-family: 'DM Sans', sans-serif !important;
    font-size: 13px !important; outline: none !important; width: 100% !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
  }
  input:focus, select:focus, textarea:focus {
    border-color: ${C.gold} !important;
    box-shadow: 0 0 0 3px rgba(201,169,110,0.08) !important;
  }
  select option { background: ${C.panel}; }
  label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.7px; text-transform: uppercase;
    color: ${C.textDim}; margin-bottom: 5px;
  }
  .rh { transition: background 0.12s; }
  .rh:hover { background: rgba(255,255,255,0.025) !important; }
  .btn {
    cursor: pointer; border: none; font-family: 'DM Sans', sans-serif;
    font-weight: 500; transition: all 0.18s; border-radius: 7px;
  }
  .btn-gold {
    background: linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%);
    color: #07090e; padding: 10px 22px; font-size: 13px; font-weight: 600;
  }
  .btn-gold:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(201,169,110,0.28); }
  .btn-ghost {
    background: transparent; border: 1px solid ${C.border} !important;
    color: ${C.textMid}; padding: 8px 18px; font-size: 13px;
  }
  .btn-ghost:hover { border-color: ${C.gold} !important; color: ${C.gold}; }
  .btn-danger {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.25) !important;
    color: #f87171; padding: 8px 18px; font-size: 13px;
  }
  .btn-danger:hover { background: rgba(248,113,113,0.16); }
  .btn-sm { padding: 6px 13px !important; font-size: 12px !important; }
  .nav-lnk {
    cursor: pointer; padding: 9px 13px; border-radius: 7px;
    font-size: 13px; font-weight: 500; color: ${C.textMid};
    transition: all 0.15s; display: flex; align-items: center;
    gap: 9px; border-left: 2px solid transparent;
  }
  .nav-lnk:hover { background: ${C.card}; color: ${C.text}; }
  .nav-lnk.act {
    background: linear-gradient(135deg, rgba(201,169,110,0.12), rgba(201,169,110,0.04));
    color: ${C.gold}; border-left-color: ${C.gold};
  }
  .card { background: ${C.card}; border: 1px solid ${C.border}; border-radius: 10px; }
  .tab {
    cursor: pointer; padding: 9px 18px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.8px; text-transform: uppercase; color: ${C.textMid};
    border-bottom: 2px solid transparent; transition: all 0.18s;
  }
  .tab.act { color: ${C.gold}; border-bottom-color: ${C.gold}; }
  .tab:hover { color: ${C.text}; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fu { animation: fadeUp 0.28s ease; }
  .modal-bg {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .prog { height: 5px; border-radius: 3px; background: ${C.border}; overflow: hidden; }
  .prog-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, ${C.gold}, ${C.goldLight});
    transition: width 0.6s ease;
  }
  .divider { height: 1px; background: ${C.border}; }
  .scard {
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 10px; padding: 20px 22px;
    position: relative; overflow: hidden;
  }
  .scard::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--sc);
  }
  .badge {
    display: inline-flex; align-items: center; font-size: 10px;
    font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase;
    padding: 3px 10px; border-radius: 20px;
  }
`;

// ── Reusable sub-components ─────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.9,
        textTransform: "uppercase",
        color: C.goldDim,
        marginBottom: 13,
      }}
    >
      {text}
    </div>
  );
}

function Avatar({ p, size = 38 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: avatarBg(fullName(p)),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {getInitial(p)}
    </div>
  );
}

function ProgBar({ pct }) {
  return (
    <div className="prog">
      <div className="prog-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className="badge"
      style={{
        background: isActive ? C.activeBg : C.completedBg,
        color: isActive ? C.activeText : C.completedText,
      }}
    >
      {status}
    </span>
  );
}

function PayBadge({ payments }) {
  const isPaid = payments === "Paid";
  return (
    <span
      className="badge"
      style={{
        background: isPaid ? C.activeBg : "rgba(251,191,36,0.1)",
        color: isPaid ? C.activeText : C.moderate,
      }}
    >
      {payments}
    </span>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [patients, setPatients] = useState([]);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTherapist, setFilterTherapist] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [toast, setToast] = useState(null);
  const [saveState, setSaveState] = useState(null);
  const [newHistoryEntry, setNewHistoryEntry] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Storage
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(SK, false);
        if (r && r.value) {
          setPatients(JSON.parse(r.value));
        } else {
          setPatients(SEED);
          await window.storage.set(SK, JSON.stringify(SEED), false);
        }
      } catch {
        setPatients(SEED);
        try {
          await window.storage.set(SK, JSON.stringify(SEED), false);
        } catch {}
      }
      setReady(true);
    })();
  }, []);

  const persist = useCallback(async (data) => {
    setSaveState("saving");
    try {
      await window.storage.set(SK, JSON.stringify(data), false);
      setSaveState("saved");
      setTimeout(() => setSaveState(null), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState(null), 3000);
    }
  }, []);

  useEffect(() => {
    if (ready) persist(patients);
  }, [patients, ready, persist]);

  // Derived
  const stats = {
    total: patients.length,
    active: patients.filter((p) => p.status === "Active").length,
    completed: patients.filter((p) => p.status === "Completed").length,
    todayAppts: patients.filter((p) => p.nextVisit === TODAY).length,
    pendingPayments: patients.filter((p) => p.payments === "Pending").length,
    totalRevenue: patients.reduce((s, p) => s + (p.amount || 0), 0),
  };

  const filtered = patients
    .filter((p) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        fullName(p).toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        p.phone.includes(q);
      const matchS = filterStatus === "All" || p.status === filterStatus;
      const matchT =
        filterTherapist === "All" || p.therapist === filterTherapist;
      return matchQ && matchS && matchT;
    })
    .sort((a, b) => {
      if (sortBy === "name") return fullName(a).localeCompare(fullName(b));
      if (sortBy === "date") return b.joinDate > a.joinDate ? 1 : -1;
      return b.sessions - a.sessions;
    });

  // CRUD
  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setShowForm(true);
  };
  const openEdit = (p) => {
    setForm({ ...p });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.firstName || !form.condition || !form.therapist) {
      notify("Please fill in all required fields", "error");
      return;
    }
    if (editId) {
      setPatients((ps) =>
        ps.map((p) => (p.id === editId ? { ...form, id: editId } : p))
      );
      notify("Record updated and saved");
    } else {
      setPatients((ps) => [
        ...ps,
        { ...form, id: Date.now(), sessions: 0, history: [] },
      ]);
      notify("Patient registered and saved");
    }
    setShowForm(false);
    setEditId(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleDelete = (id) => {
    setPatients((ps) => ps.filter((p) => p.id !== id));
    setConfirmDelete(null);
    setSelected(null);
    notify("Patient record deleted", "error");
  };

  const recordSession = (id) => {
    const pt = patients.find((p) => p.id === id);
    if (!pt) return;
    const entry = `${TODAY}: Session ${pt.sessions + 1} completed`;
    setPatients((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              sessions: Math.min(p.sessions + 1, p.totalSessions),
              history: [entry, ...(p.history || [])],
            }
          : p
      )
    );
    if (selected && selected.id === id) {
      setSelected((s) => ({
        ...s,
        sessions: Math.min(s.sessions + 1, s.totalSessions),
        history: [entry, ...(s.history || [])],
      }));
    }
    notify("Session recorded");
  };

  const addHistoryEntry = (id) => {
    if (!newHistoryEntry.trim()) return;
    const entry = `${TODAY}: ${newHistoryEntry.trim()}`;
    setPatients((ps) =>
      ps.map((p) =>
        p.id === id ? { ...p, history: [entry, ...(p.history || [])] } : p
      )
    );
    setSelected((s) => ({ ...s, history: [entry, ...(s.history || [])] }));
    setNewHistoryEntry("");
    notify("Note added");
  };

  const uf = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const uv = (k, v) =>
    setForm((f) => ({ ...f, vitals: { ...f.vitals, [k]: v } }));

  const goTo = (p) => {
    setPage(p);
    setSelected(null);
    setShowForm(false);
  };

  // Loading
  if (!ready)
    return (
      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            width: 52,
            height: 52,
            border: `2px solid ${C.gold}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: C.gold,
            fontSize: 24,
            letterSpacing: 3,
          }}
        >
          PhysioElite
        </div>
        <div
          style={{
            color: C.textDim,
            fontSize: 12,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Restoring Records…
        </div>
      </div>
    );

  const deleteTarget = confirmDelete
    ? patients.find((p) => p.id === confirmDelete)
    : null;

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
      }}
    >
      <style>{GLOBAL_CSS}</style>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 300,
            background:
              toast.type === "error"
                ? "rgba(20,8,8,0.97)"
                : "rgba(7,18,12,0.97)",
            border: `1px solid ${
              toast.type === "error" ? "#f87171" : C.active
            }`,
            borderRadius: 9,
            padding: "13px 20px",
            fontSize: 13,
            color: toast.type === "error" ? "#f87171" : C.activeText,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            animation: "fadeUp 0.3s ease",
          }}
        >
          <span>{toast.type === "error" ? "⚠" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="modal-bg" onClick={() => setConfirmDelete(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: 36,
              width: 420,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 14 }}>⚠️</div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Delete Patient Record?
            </div>
            <div
              style={{
                color: C.textMid,
                fontSize: 13,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              This permanently deletes{" "}
              <strong style={{ color: C.text }}>
                {deleteTarget ? fullName(deleteTarget) : ""}
              </strong>
              's complete record. This action cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <div
        style={{
          width: 252,
          background: C.panel,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "22px 20px 18px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div
              style={{
                width: 38,
                height: 38,
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              ⚕
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 19,
                  fontWeight: 700,
                  color: C.gold,
                  letterSpacing: 0.8,
                }}
              >
                PhysioElite
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: C.textDim,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                Clinic Management
              </div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "14px 12px", flex: 1, overflowY: "auto" }}>
          <div
            style={{
              fontSize: 9,
              color: C.textDim,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              padding: "0 4px",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Navigation
          </div>
          {[
            { id: "dashboard", icon: "◈", label: "Dashboard" },
            {
              id: "patients",
              icon: "◉",
              label: "Patients",
              count: patients.length,
            },
            {
              id: "schedule",
              icon: "◷",
              label: "Schedule",
              count: stats.todayAppts || null,
            },
            { id: "analytics", icon: "◎", label: "Analytics" },
          ].map((n) => (
            <div
              key={n.id}
              className={`nav-lnk${page === n.id ? " act" : ""}`}
              onClick={() => goTo(n.id)}
            >
              <span
                style={{
                  fontSize: 15,
                  width: 18,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {n.icon}
              </span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.count != null && (
                <span
                  style={{
                    background:
                      page === n.id ? "rgba(201,169,110,0.15)" : C.border,
                    color: page === n.id ? C.gold : C.textMid,
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 9,
                    fontWeight: 700,
                  }}
                >
                  {n.count}
                </span>
              )}
            </div>
          ))}

          <div
            style={{
              fontSize: 9,
              color: C.textDim,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              padding: "0 4px",
              marginBottom: 8,
              marginTop: 22,
              fontWeight: 700,
            }}
          >
            Therapists
          </div>
          {THERAPISTS.map((t) => {
            const activeCount = patients.filter(
              (p) => p.therapist === t.name && p.status === "Active"
            ).length;
            return (
              <div
                key={t.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px",
                  borderRadius: 8,
                  marginBottom: 4,
                  background: "rgba(26,37,64,0.4)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: avatarBg(t.name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.text,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim }}>
                    {t.specialty}
                  </div>
                  <div
                    style={{ fontSize: 10, color: C.activeText, marginTop: 1 }}
                  >
                    {activeCount} active patient{activeCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div
          style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 11,
            }}
          >
            {saveState === "saving" && (
              <span
                style={{
                  animation: "spin 0.9s linear infinite",
                  display: "inline-block",
                  color: C.gold,
                }}
              >
                ⟳
              </span>
            )}
            {saveState !== "saving" && (
              <span
                style={{
                  fontSize: 8,
                  color:
                    saveState === "saved"
                      ? C.active
                      : saveState === "error"
                      ? "#f87171"
                      : C.textDim,
                }}
              >
                ●
              </span>
            )}
            <span
              style={{
                color:
                  saveState === "saving"
                    ? C.gold
                    : saveState === "error"
                    ? "#f87171"
                    : C.textDim,
              }}
            >
              {saveState === "saving"
                ? "Saving…"
                : saveState === "saved"
                ? "All records saved"
                : saveState === "error"
                ? "Save failed"
                : "Auto-save active"}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {/* ── DASHBOARD ──────────────────────────────────────────────────── */}
        {page === "dashboard" && (
          <div style={{ padding: "30px 34px" }} className="fu">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 30,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 600,
                  }}
                >
                  {greeting()}
                </div>
                <div style={{ color: C.textMid, fontSize: 14, marginTop: 5 }}>
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
              <button className="btn btn-gold" onClick={openAdd}>
                + Register Patient
              </button>
            </div>

            {/* KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
                marginBottom: 26,
              }}
            >
              {[
                {
                  label: "Total Patients",
                  val: stats.total,
                  sub: "All registrations",
                  col: C.gold,
                  icon: "◉",
                },
                {
                  label: "Active Cases",
                  val: stats.active,
                  sub: "Currently in treatment",
                  col: C.active,
                  icon: "▲",
                },
                {
                  label: "Completed",
                  val: stats.completed,
                  sub: "Successfully discharged",
                  col: C.completed,
                  icon: "✓",
                },
                {
                  label: "Today's Appointments",
                  val: stats.todayAppts,
                  sub: "Scheduled today",
                  col: "#22d3ee",
                  icon: "◷",
                },
                {
                  label: "Pending Payments",
                  val: stats.pendingPayments,
                  sub: "Awaiting settlement",
                  col: C.moderate,
                  icon: "₹",
                },
                {
                  label: "Total Revenue",
                  val: `₹${stats.totalRevenue.toLocaleString()}`,
                  sub: "Lifetime collected",
                  col: "#a78bfa",
                  icon: "◈",
                },
              ].map((s) => (
                <div key={s.label} className="scard" style={{ "--sc": s.col }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.textDim,
                          fontWeight: 700,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          marginBottom: 9,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 36,
                          fontWeight: 700,
                          color: s.col,
                          lineHeight: 1,
                        }}
                      >
                        {s.val}
                      </div>
                      <div
                        style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}
                      >
                        {s.sub}
                      </div>
                    </div>
                    <div style={{ fontSize: 26, color: s.col, opacity: 0.2 }}>
                      {s.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.55fr 1fr",
                gap: 20,
              }}
            >
              <div className="card" style={{ padding: 24 }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 19,
                    fontWeight: 600,
                    color: C.goldLight,
                    marginBottom: 16,
                  }}
                >
                  Patient Overview
                </div>
                {patients.length === 0 && (
                  <div
                    style={{
                      color: C.textDim,
                      textAlign: "center",
                      padding: 28,
                      fontSize: 13,
                    }}
                  >
                    No patients registered yet.
                  </div>
                )}
                {patients.map((p) => (
                  <div
                    key={p.id}
                    className="rh"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 13,
                      padding: "12px 6px",
                      borderBottom: `1px solid ${C.border}`,
                      cursor: "pointer",
                      borderRadius: 6,
                    }}
                    onClick={() => {
                      setSelected(p);
                      setPage("patients");
                      setDetailTab("overview");
                    }}
                  >
                    <Avatar p={p} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {fullName(p)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: C.textMid,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.condition}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <StatusBadge status={p.status} />
                      <div
                        style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}
                      >
                        {p.sessions}/{p.totalSessions} sessions
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 19,
                    fontWeight: 600,
                    color: C.goldLight,
                    marginBottom: 16,
                  }}
                >
                  Therapist Workload
                </div>
                {THERAPISTS.map((t) => {
                  const a = patients.filter(
                    (p) => p.therapist === t.name && p.status === "Active"
                  ).length;
                  const total = patients.filter(
                    (p) => p.therapist === t.name
                  ).length;
                  return (
                    <div key={t.name} style={{ marginBottom: 22 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 9,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: avatarBg(t.name),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          {t.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              lineHeight: 1.3,
                            }}
                          >
                            {t.name}
                          </div>
                          <div style={{ fontSize: 10, color: C.textDim }}>
                            {t.specialty}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.gold,
                          }}
                        >
                          {a}
                          <span
                            style={{
                              color: C.textDim,
                              fontWeight: 400,
                              fontSize: 11,
                            }}
                          >
                            /{total}
                          </span>
                        </div>
                      </div>
                      <ProgBar
                        pct={
                          total
                            ? Math.min((a / Math.max(total, 1)) * 100, 100)
                            : 0
                        }
                      />
                    </div>
                  );
                })}
                <div className="divider" style={{ margin: "18px 0" }} />
                <button
                  className="btn btn-gold"
                  style={{ width: "100%" }}
                  onClick={openAdd}
                >
                  + Register New Patient
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PATIENTS LIST ───────────────────────────────────────────────── */}
        {page === "patients" && !selected && (
          <div style={{ padding: "30px 34px" }} className="fu">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 28,
                    fontWeight: 600,
                  }}
                >
                  Patient Registry
                </div>
                <div style={{ color: C.textMid, fontSize: 12, marginTop: 3 }}>
                  {filtered.length} records · 💾 Persistent auto-save active
                </div>
              </div>
              <button className="btn btn-gold" onClick={openAdd}>
                + New Patient
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <input
                placeholder="Search name, condition…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: 280 }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: 150 }}
              >
                <option>All</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
              <select
                value={filterTherapist}
                onChange={(e) => setFilterTherapist(e.target.value)}
                style={{ width: 230 }}
              >
                <option value="All">All Therapists</option>
                {THERAPISTS.map((t) => (
                  <option key={t.name}>{t.name}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: 160 }}
              >
                <option value="name">Sort: Name</option>
                <option value="date">Sort: Join Date</option>
                <option value="sessions">Sort: Sessions</option>
              </select>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "2fr 1.6fr 1.5fr 1.1fr 0.9fr 0.9fr 100px",
                  padding: "11px 20px",
                  background: C.panel,
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  color: C.textDim,
                  textTransform: "uppercase",
                }}
              >
                <div>Patient</div>
                <div>Diagnosis</div>
                <div>Therapist</div>
                <div>Progress</div>
                <div>Status</div>
                <div>Payment</div>
                <div>Actions</div>
              </div>
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: 44,
                    textAlign: "center",
                    color: C.textDim,
                    fontSize: 13,
                  }}
                >
                  No patients found.
                </div>
              )}
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="rh"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 1.6fr 1.5fr 1.1fr 0.9fr 0.9fr 100px",
                    padding: "15px 20px",
                    alignItems: "center",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelected(p);
                      setDetailTab("overview");
                    }}
                  >
                    <Avatar p={p} size={38} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {fullName(p)}
                      </div>
                      <div style={{ fontSize: 11, color: C.textDim }}>
                        {p.age}y · {p.gender}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: C.textMid,
                        marginBottom: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {p.condition}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: sevColor(p.severity),
                      }}
                    >
                      {p.severity}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.textMid, lineHeight: 1.3 }}
                  >
                    {p.therapist}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.textDim,
                        marginBottom: 5,
                      }}
                    >
                      {p.sessions}/{p.totalSessions}
                    </div>
                    <ProgBar pct={progressPct(p)} />
                  </div>
                  <div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div>
                    <PayBadge payments={p.payments} />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEdit(p)}
                    >
                      ✎
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "rgba(201,169,110,0.1)",
                        border: `1px solid ${C.goldDim}`,
                        color: C.gold,
                        borderRadius: 7,
                        cursor: "pointer",
                        padding: "6px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                      onClick={() => recordSession(p.id)}
                    >
                      +1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PATIENT DETAIL ──────────────────────────────────────────────── */}
        {page === "patients" && selected && (
          <div style={{ padding: "30px 34px" }} className="fu">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setSelected(null)}
              >
                ← Back
              </button>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 27,
                    fontWeight: 600,
                  }}
                >
                  {fullName(selected)}
                </div>
                <div style={{ fontSize: 12, color: C.textMid, marginTop: 2 }}>
                  ID #{selected.id} · Registered {selected.joinDate}
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => openEdit(selected)}
              >
                ✎ Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setConfirmDelete(selected.id)}
              >
                Delete
              </button>
            </div>

            <div
              style={{
                display: "flex",
                borderBottom: `1px solid ${C.border}`,
                marginBottom: 24,
              }}
            >
              {["overview", "vitals", "history", "notes"].map((t) => (
                <div
                  key={t}
                  className={`tab${detailTab === t ? " act" : ""}`}
                  onClick={() => setDetailTab(t)}
                  style={{ textTransform: "capitalize" }}
                >
                  {t}
                </div>
              ))}
            </div>

            {detailTab === "overview" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "320px 1fr",
                  gap: 20,
                }}
              >
                <div>
                  <div
                    className="card"
                    style={{
                      padding: 26,
                      marginBottom: 14,
                      textAlign: "center",
                    }}
                  >
                    <Avatar p={selected} size={76} />
                    <div
                      style={{
                        marginTop: 14,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 23,
                        fontWeight: 600,
                      }}
                    >
                      {fullName(selected)}
                    </div>
                    <div
                      style={{ color: C.textMid, fontSize: 13, marginTop: 3 }}
                    >
                      {selected.age} yrs · {selected.gender}
                      {selected.blood && selected.blood !== "—"
                        ? ` · ${selected.blood}`
                        : ""}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 7,
                        marginTop: 11,
                        flexWrap: "wrap",
                      }}
                    >
                      <StatusBadge status={selected.status} />
                      <span
                        className="badge"
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          color: sevColor(selected.severity),
                        }}
                      >
                        {selected.severity}
                      </span>
                    </div>
                  </div>
                  <div className="card" style={{ padding: 20 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        color: C.goldDim,
                        marginBottom: 14,
                      }}
                    >
                      Contact Details
                    </div>
                    {[
                      ["📞", "Phone", selected.phone],
                      ["✉", "Email", selected.email],
                      ["📍", "Address", selected.address],
                    ].map(([ic, k, v]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          gap: 10,
                          marginBottom: 11,
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            color: C.textDim,
                            fontSize: 13,
                            marginTop: 1,
                            flexShrink: 0,
                          }}
                        >
                          {ic}
                        </span>
                        <div>
                          <div style={{ fontSize: 10, color: C.textDim }}>
                            {k}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: v ? C.textMid : C.textDim,
                            }}
                          >
                            {v || "Not recorded"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    className="card"
                    style={{ padding: 26, marginBottom: 14 }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        color: C.goldDim,
                        marginBottom: 18,
                      }}
                    >
                      Treatment Overview
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 11,
                          color: C.textDim,
                          marginBottom: 4,
                        }}
                      >
                        Diagnosis
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 600 }}>
                        {selected.condition}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 18,
                      }}
                    >
                      {[
                        ["Therapist", selected.therapist, null],
                        ["Joined", selected.joinDate, null],
                        [
                          "Next Visit",
                          selected.nextVisit || "Not scheduled",
                          null,
                        ],
                        [
                          "Payment",
                          selected.payments,
                          selected.payments === "Paid"
                            ? C.activeText
                            : C.moderate,
                        ],
                      ].map(([k, v, col]) => (
                        <div
                          key={k}
                          style={{
                            background: C.panel,
                            borderRadius: 8,
                            padding: "12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: C.textDim,
                              marginBottom: 3,
                            }}
                          >
                            {k}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: col || C.text,
                            }}
                          >
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 7,
                        }}
                      >
                        <div style={{ fontSize: 11, color: C.textDim }}>
                          Session Progress
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: C.gold,
                          }}
                        >
                          {selected.sessions} / {selected.totalSessions} (
                          {progressPct(selected)}%)
                        </div>
                      </div>
                      <div className="prog" style={{ height: 8 }}>
                        <div
                          className="prog-fill"
                          style={{ width: `${progressPct(selected)}%` }}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className="btn btn-gold btn-sm"
                        onClick={() => recordSession(selected.id)}
                      >
                        + Record Session
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(selected)}
                      >
                        Update Record
                      </button>
                    </div>
                  </div>
                  <div className="card" style={{ padding: 20 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        color: C.goldDim,
                        marginBottom: 14,
                      }}
                    >
                      Billing Summary
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 30,
                            fontWeight: 700,
                            color: C.gold,
                          }}
                        >
                          ₹{(selected.amount || 0).toLocaleString()}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: C.textDim,
                            marginTop: 3,
                          }}
                        >
                          Total billed amount
                        </div>
                      </div>
                      <PayBadge payments={selected.payments} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailTab === "vitals" && (
              <div className="card" style={{ padding: 30 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: C.goldDim,
                    marginBottom: 22,
                  }}
                >
                  Recorded Vitals
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 18,
                  }}
                >
                  {[
                    ["Blood Pressure", selected.vitals?.bp || "—", "mmHg", "♥"],
                    ["Pulse Rate", selected.vitals?.pulse || "—", "bpm", "◉"],
                    ["Body Weight", selected.vitals?.weight || "—", "kg", "◎"],
                  ].map(([k, v, u, icon]) => (
                    <div
                      key={k}
                      style={{
                        background: C.panel,
                        borderRadius: 10,
                        padding: 28,
                        border: `1px solid ${C.border}`,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 30,
                          color: C.gold,
                          marginBottom: 14,
                          opacity: 0.7,
                        }}
                      >
                        {icon}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 38,
                          fontWeight: 700,
                          color: v !== "—" ? C.text : C.textDim,
                        }}
                      >
                        {v}
                      </div>
                      <div
                        style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}
                      >
                        {u}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.textMid,
                          marginTop: 8,
                          fontWeight: 500,
                        }}
                      >
                        {k}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailTab === "history" && (
              <div className="card" style={{ padding: 28 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: C.goldDim,
                    marginBottom: 18,
                  }}
                >
                  Session History & Clinical Log
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
                  <input
                    placeholder="Add a session note or clinical entry… (press Enter)"
                    value={newHistoryEntry}
                    onChange={(e) => setNewHistoryEntry(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addHistoryEntry(selected.id);
                    }}
                  />
                  <button
                    className="btn btn-gold btn-sm"
                    style={{ flexShrink: 0, whiteSpace: "nowrap" }}
                    onClick={() => addHistoryEntry(selected.id)}
                  >
                    Add Entry
                  </button>
                </div>
                {(selected.history || []).length === 0 && (
                  <div
                    style={{
                      color: C.textDim,
                      fontSize: 13,
                      textAlign: "center",
                      padding: 32,
                    }}
                  >
                    No history entries yet. Record a session or add a note
                    above.
                  </div>
                )}
                {(selected.history || []).map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      padding: "13px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 2,
                        background: `linear-gradient(${C.gold}, ${C.goldDim})`,
                        borderRadius: 1,
                        flexShrink: 0,
                        minHeight: 20,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 13,
                        color: C.textMid,
                        lineHeight: 1.6,
                      }}
                    >
                      {h}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {detailTab === "notes" && (
              <div className="card" style={{ padding: 28 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: C.goldDim,
                    marginBottom: 16,
                  }}
                >
                  Clinical Notes
                </div>
                <div
                  style={{
                    background: C.panel,
                    borderLeft: `3px solid ${C.gold}`,
                    borderRadius: 7,
                    padding: 22,
                    fontSize: 14,
                    color: C.textMid,
                    lineHeight: 1.9,
                    fontStyle: "italic",
                  }}
                >
                  {selected.notes || "No clinical notes recorded."}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SCHEDULE ────────────────────────────────────────────────────── */}
        {page === "schedule" && (
          <div style={{ padding: "30px 34px" }} className="fu">
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Appointment Schedule
            </div>
            <div style={{ color: C.textMid, fontSize: 13, marginBottom: 26 }}>
              Upcoming visits, ordered by date
            </div>
            {patients.filter((p) => p.nextVisit && p.status === "Active")
              .length === 0 ? (
              <div
                className="card"
                style={{
                  padding: 60,
                  textAlign: "center",
                  color: C.textDim,
                  fontSize: 14,
                }}
              >
                No upcoming appointments. Update patient records to add visit
                dates.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {patients
                  .filter((p) => p.nextVisit && p.status === "Active")
                  .sort((a, b) => (a.nextVisit > b.nextVisit ? 1 : -1))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="card rh"
                      style={{
                        padding: 22,
                        cursor: "pointer",
                        borderTop: `2px solid ${
                          p.nextVisit === TODAY ? C.gold : C.border
                        }`,
                      }}
                      onClick={() => {
                        setSelected(p);
                        setPage("patients");
                        setDetailTab("overview");
                      }}
                    >
                      {p.nextVisit === TODAY && (
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: C.gold,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}
                        >
                          ● Today
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 14,
                        }}
                      >
                        <Avatar p={p} size={42} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>
                            {fullName(p)}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: C.textMid,
                              lineHeight: 1.3,
                            }}
                          >
                            {p.condition}
                          </div>
                        </div>
                      </div>
                      <div className="divider" style={{ marginBottom: 12 }} />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                        }}
                      >
                        {[
                          ["Date", p.nextVisit],
                          ["Session #", p.sessions + 1],
                          ["Therapist", p.therapist.replace("Dr. ", "Dr.")],
                          ["Severity", p.severity],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div
                              style={{
                                fontSize: 9,
                                color: C.textDim,
                                marginBottom: 2,
                                textTransform: "uppercase",
                                letterSpacing: 0.6,
                              }}
                            >
                              {k}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color:
                                  k === "Severity" ? sevColor(v) : C.textMid,
                              }}
                            >
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS ───────────────────────────────────────────────────── */}
        {page === "analytics" && (
          <div style={{ padding: "30px 34px" }} className="fu">
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Analytics
            </div>
            <div style={{ color: C.textMid, fontSize: 13, marginBottom: 26 }}>
              Clinic performance overview
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div className="card" style={{ padding: 26 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: C.goldDim,
                    marginBottom: 18,
                  }}
                >
                  Conditions Treated
                </div>
                {patients.length === 0 ? (
                  <div style={{ color: C.textDim, fontSize: 13 }}>
                    No data yet.
                  </div>
                ) : (
                  Object.entries(
                    patients.reduce((acc, p) => {
                      acc[p.condition] = (acc[p.condition] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([cond, count]) => (
                      <div key={cond} style={{ marginBottom: 13 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            marginBottom: 5,
                          }}
                        >
                          <span style={{ color: C.textMid }}>{cond}</span>
                          <span style={{ fontWeight: 700, color: C.gold }}>
                            {count}
                          </span>
                        </div>
                        <ProgBar pct={(count / patients.length) * 100} />
                      </div>
                    ))
                )}
              </div>
              <div className="card" style={{ padding: 26 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    color: C.goldDim,
                    marginBottom: 18,
                  }}
                >
                  Severity Distribution
                </div>
                {["Severe", "Moderate", "Mild"].map((s) => {
                  const count = patients.filter((p) => p.severity === s).length;
                  return (
                    <div key={s} style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                          marginBottom: 5,
                        }}
                      >
                        <span style={{ fontWeight: 600, color: sevColor(s) }}>
                          {s}
                        </span>
                        <span style={{ fontWeight: 700, color: C.text }}>
                          {count} patients
                        </span>
                      </div>
                      <div
                        style={{
                          height: 7,
                          background: C.border,
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 4,
                            background: sevColor(s),
                            width: `${
                              patients.length
                                ? (count / patients.length) * 100
                                : 0
                            }%`,
                            transition: "width 0.5s",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="divider" style={{ margin: "18px 0" }} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      background: C.panel,
                      borderRadius: 9,
                      padding: 16,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 30,
                        fontWeight: 700,
                        color: C.gold,
                      }}
                    >
                      {patients.length
                        ? Math.round(
                            patients.reduce((s, p) => s + p.sessions, 0) /
                              patients.length
                          )
                        : 0}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: C.textDim,
                        marginTop: 3,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      Avg Sessions
                    </div>
                  </div>
                  <div
                    style={{
                      background: C.panel,
                      borderRadius: 9,
                      padding: 16,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 30,
                        fontWeight: 700,
                        color: C.active,
                      }}
                    >
                      {patients.length
                        ? Math.round((stats.completed / patients.length) * 100)
                        : 0}
                      %
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: C.textDim,
                        marginTop: 3,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      Recovery Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 26 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: C.goldDim,
                  marginBottom: 18,
                }}
              >
                Therapist Summary
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {THERAPISTS.map((t) => {
                  const rev = patients
                    .filter((p) => p.therapist === t.name)
                    .reduce((s, p) => s + (p.amount || 0), 0);
                  const cnt = patients.filter(
                    (p) => p.therapist === t.name
                  ).length;
                  const activeCnt = patients.filter(
                    (p) => p.therapist === t.name && p.status === "Active"
                  ).length;
                  return (
                    <div
                      key={t.name}
                      style={{
                        background: C.panel,
                        borderRadius: 9,
                        padding: 20,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: avatarBg(t.name),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {t.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: 11, color: C.textDim }}>
                            {t.specialty}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 24,
                              fontWeight: 700,
                              color: C.gold,
                            }}
                          >
                            ₹{rev.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 10, color: C.textDim }}>
                            Total revenue
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 24,
                              fontWeight: 700,
                              color: C.active,
                            }}
                          >
                            {activeCnt}
                            <span style={{ fontSize: 13, color: C.textDim }}>
                              /{cnt}
                            </span>
                          </div>
                          <div style={{ fontSize: 10, color: C.textDim }}>
                            Active / Total
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FORM MODAL ────────────────────────────────────────────────────── */}
      {showForm && (
        <div
          className="modal-bg"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              width: "100%",
              maxWidth: 680,
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
            }}
          >
            <div
              style={{
                padding: "22px 28px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: C.card,
                zIndex: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: C.goldLight,
                  }}
                >
                  {editId ? "Edit Patient Record" : "Register New Patient"}
                </div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                  All changes are auto-saved to persistent storage
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: C.textMid,
                  fontSize: 22,
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: 28 }}>
              <SectionLabel text="Personal Information" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 13,
                  marginBottom: 22,
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Patient Name *</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => uf("firstName", e.target.value)}
                    placeholder="Full name (e.g. Mr. Swaminathan)"
                  />
                </div>
                <div>
                  <label>Age *</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => uf("age", e.target.value)}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label>Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => uf("gender", e.target.value)}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label>Blood Group</label>
                  <select
                    value={form.blood}
                    onChange={(e) => uf("blood", e.target.value)}
                  >
                    {BLOOD_GROUPS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => uf("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => uf("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label>Join Date</label>
                  <input
                    type="date"
                    value={form.joinDate}
                    onChange={(e) => uf("joinDate", e.target.value)}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => uf("address", e.target.value)}
                    placeholder="Full address"
                  />
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 18 }} />
              <SectionLabel text="Clinical Details" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 13,
                  marginBottom: 22,
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Diagnosis / Condition *</label>
                  <select
                    value={form.condition}
                    onChange={(e) => uf("condition", e.target.value)}
                  >
                    <option value="">Select condition…</option>
                    {CONDITIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Severity</label>
                  <select
                    value={form.severity}
                    onChange={(e) => uf("severity", e.target.value)}
                  >
                    {SEVERITIES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Assigned Therapist *</label>
                  <select
                    value={form.therapist}
                    onChange={(e) => uf("therapist", e.target.value)}
                  >
                    <option value="">Select therapist…</option>
                    {THERAPISTS.map((t) => (
                      <option key={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Sessions Prescribed</label>
                  <input
                    type="number"
                    value={form.totalSessions}
                    onChange={(e) =>
                      uf("totalSessions", Number(e.target.value))
                    }
                    placeholder="12"
                  />
                </div>
                <div>
                  <label>Next Visit Date</label>
                  <input
                    type="date"
                    value={form.nextVisit}
                    onChange={(e) => uf("nextVisit", e.target.value)}
                  />
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => uf("status", e.target.value)}
                  >
                    <option>Active</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 18 }} />
              <SectionLabel text="Vitals" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 13,
                  marginBottom: 22,
                }}
              >
                <div>
                  <label>Blood Pressure</label>
                  <input
                    value={form.vitals?.bp || ""}
                    onChange={(e) => uv("bp", e.target.value)}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label>Pulse (bpm)</label>
                  <input
                    type="number"
                    value={form.vitals?.pulse || ""}
                    onChange={(e) => uv("pulse", e.target.value)}
                    placeholder="72"
                  />
                </div>
                <div>
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    value={form.vitals?.weight || ""}
                    onChange={(e) => uv("weight", e.target.value)}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 18 }} />
              <SectionLabel text="Billing" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 13,
                  marginBottom: 22,
                }}
              >
                <div>
                  <label>Amount Billed (₹)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => uf("amount", Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label>Payment Status</label>
                  <select
                    value={form.payments}
                    onChange={(e) => uf("payments", e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Partial</option>
                  </select>
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 18 }} />
              <SectionLabel text="Clinical Notes" />
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => uf("notes", e.target.value)}
                placeholder="Diagnosis details, treatment plan, home exercise programme, precautions…"
                style={{ resize: "vertical", marginBottom: 24 }}
              />

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn btn-gold"
                  style={{ flex: 1, padding: "12px" }}
                  onClick={handleSave}
                >
                  {editId ? "Save Changes" : "Register Patient"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
