import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import {
  dmsApi,
  formatDateTime,
  formatMoney,
  getConnectionLabel,
  clinicName,
  clinicPhone,
  clinicEmail,
  clinicAddress,
  isDmsConfigured,
  isOwnerRole,
  roleLabel,
  whatsappUrl,
} from './dmsClient.js';
import { supabase } from "./lib/supabase";

const phone = '+91 98493 26242';
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Sri%20B.G%20Reddy%20Dental%20Clinic&query_place_id=ChIJu7OqUvuOyzsRp7eapGfA-6I';

const services = [
  { title: 'Braces & Orthodontics', desc: 'Braces-focused smile correction for spacing, crowding, alignment and bite improvement with regular follow-up care.', icon: '😁' },
  { title: 'Root Canal Treatment', desc: 'Careful RCT care with patient comfort, clear explanation and quality capping options.', icon: '🦷' },
  { title: 'Caps & Bridges', desc: 'Ceramic caps, crowns and bridges planned for strength, smile appearance and chewing comfort.', icon: '✨' },
  { title: 'Painless Extraction', desc: 'Gentle tooth removal approach with proper guidance before and after treatment.', icon: '🛡️' },
  { title: 'Implants & Dentures', desc: 'Missing teeth replacement support using modern implant and denture treatment planning.', icon: '🔩' },
  { title: 'Scaling & Polishing', desc: 'Professional cleaning for fresh breath, gum care and long-term oral hygiene.', icon: '💧' },
  { title: 'Fillings & Checkups', desc: 'Dental checkups, cavity fillings, X-rays and family dental care under one roof.', icon: '✅' }
];

const reviews = [
  { name: 'Thatikonda Suhitha', text: 'Great services. Doctors are really patient and considerate. Services are affordable compared to other clinics.' },
  { name: 'Sanjeeva Reddy', text: 'RCT by Dr. Rajashekar Reddy with patience, good treatment and affordable cost.' },
  { name: 'Mihir', text: 'Reasonably priced and painless. RCT capping completed in two visits including measurements.' },
  { name: 'Rambabu Latchireddi', text: 'Front tooth post and core treatment done. Ceramic cap provided and fully satisfied.' }
];

const gallery = [
  { img: '/gallery/gallery-1.svg', title: 'Clinic entrance' },
  { img: '/gallery/gallery-2.svg', title: 'Treatment room' },
  { img: '/gallery/gallery-3.svg', title: 'Dental equipment' },
  { img: '/gallery/gallery-4.svg', title: 'Sterilization care' },
  { img: '/gallery/gallery-5.svg', title: 'Reception' },
  { img: '/gallery/gallery-6.svg', title: 'Smile care' }
];

function IconLogo({ dark = false }) {
  return <img className="logo-img" src={dark ? '/assets/logo-black.png' : '/assets/logo-icon.png'} alt="BG Reddy Dental Clinic logo" />;
}

function Header({ portalOpen, onOpenPortal, onLogout, profile }) {
  const [open, setOpen] = useState(false);
  const nav = ['services', 'quality', 'gallery', 'reviews', 'appointment'];
  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <header className="topbar">
      <div className="nav-shell">
        <button className="brand" onClick={() => portalOpen ? onOpenPortal(false) : go('home')} aria-label="Home">
          <IconLogo />
          <span><b>BG Reddy</b><small>Dental Clinic</small></span>
        </button>

        {!portalOpen && (
          <nav className={open ? 'nav-menu show' : 'nav-menu'}>
            {nav.map((n) => <button key={n} onClick={() => go(n)}>{n}</button>)}
            <button onClick={() => { setOpen(false); onOpenPortal(true); }}>{profile ? 'Owner Dashboard' : 'Clinic Login'}</button>
          </nav>
        )}

        {portalOpen ? (
          <button className="desktop-call" onClick={onLogout}>Logout</button>
        ) : (
          <button className="desktop-call" onClick={() => onOpenPortal(true)}>{profile ? 'Owner Dashboard' : 'Clinic Login'}</button>
        )}

        {!portalOpen && <button className="hamb" onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button>}
      </div>
    </header>
  );
}

function Hero({ onOpenPortal }) {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="pill">⭐ 4.9 Google rating • 308 reviews</div>
          <h1>Premium dental care in Gandimaisamma.</h1>
          <p className="lead">Sri B.G Reddy Dental Clinic combines patient-friendly treatment with modern dental equipment, clean clinical protocols and quality-first care by Dr. Rajashekar Reddy.</p>
          <div className="hero-actions">
            <a className="btn primary" href={`tel:${phone}`}>Call Clinic</a>
            <a className="btn ghost" href="#appointment">Book Appointment</a>
            <button className="btn dark" onClick={onOpenPortal}>Owner Login</button>
          </div>
          <div className="quick-grid">
            <span>Braces</span><span>RCT</span><span>Capping</span><span>Extraction</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="black-logo-card"><IconLogo dark /></div>
          <div className="rating-card"><b>4.9</b><span>Trusted local clinic</span></div>
          <div className="equipment-card"><strong>DMS connected</strong><p>Owner login opens live clinic dashboard, patients, dues, appointments and staff control.</p></div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip">
      <div><b>308</b><span>Google reviews</span></div>
      <div><b>4.9</b><span>Overall rating</span></div>
      <div><b>500043</b><span>Gandimaisamma</span></div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section">
      <div className="section-title"><span>Services</span><h2>Dental treatments patients ask for most.</h2><p>Focused on everyday family care and advanced restorative dental treatments.</p></div>
      <div className="cards services-grid">
        {services.map((s) => <article className="service-card" key={s.title}><div className="emoji">{s.icon}</div><h3>{s.title}</h3><p>{s.desc}</p></article>)}
      </div>
    </section>
  );
}

function Quality() {
  return (
    <section id="quality" className="section blue-section">
      <div className="quality-wrap">
        <div>
          <span className="kicker">Quality-first clinic</span>
          <h2>Built to show the confidence behind the clinic.</h2>
          <p>Dr. Rajashekar Reddy has invested seriously in dental equipment and clinic setup. The website presents that strength clearly: modern tools, sterilization care, patient comfort and no-compromise treatment quality.</p>
          <div className="quality-list">
            <p>✓ Modern dental equipment showcase</p>
            <p>✓ Sterilized instruments and neat clinic positioning</p>
            <p>✓ RCT, capping and extraction trust signals</p>
            <p>✓ Braces and smile correction treatment focus</p>
          </div>
        </div>
        <div className="device-card">
          <div className="device-top"><span></span><span></span><span></span></div>
          <div className="device-body">
            <IconLogo />
            <h3>Smile planning</h3>
            <p>Secure clinic dashboard for authorized owner access.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="section">
      <div className="section-title"><span>Gallery</span><h2>Clinic showcase designed for mobile first.</h2><p>Real clinic, equipment and treatment room photos can replace these clean showcase frames.</p></div>
      <div className="gallery-scroll">
        {gallery.map((g) => <figure key={g.title}><img src={g.img} alt={g.title} /><figcaption>{g.title}</figcaption></figure>)}
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="section reviews-section">
      <div className="section-title"><span>Reviews</span><h2>Patients highlight patience, affordability and painless care.</h2></div>
      <div className="review-grid">
        {reviews.map((r) => <article className="review" key={r.name}><div className="stars">★★★★★</div><p>“{r.text}”</p><b>{r.name}</b><small>Google review</small></article>)}
      </div>
    </section>
  );
}

function Appointment() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', treatment: '', concern: '' });

  function requestAppointment(event) {
    event.preventDefault();
    const message = `Hello Sri B.G Reddy Dental Clinic, I want to book an appointment.%0A%0AName: ${form.name}%0AMobile: ${form.phone}%0ATreatment: ${form.treatment || 'Not selected'}%0AConcern: ${form.concern || 'Not mentioned'}`;
    setSent(true);
    window.open(`https://wa.me/919849326242?text=${message}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="appointment" className="section appointment-section">
      <div className="appointment-card">
        <div className="appointment-copy">
          <span className="kicker">Book appointment</span>
          <h2>Schedule a dental visit.</h2>
          <p>Share basic details on WhatsApp and the clinic team can confirm availability.</p>
          <div className="contact-row">📞 {phone}</div>
          <div className="contact-row">📍 BGR Arcade, Gandi Maisamma X Rd, Hyderabad 500043</div>
        </div>
        <form className="form" onSubmit={requestAppointment}>
          <input placeholder="Patient name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Mobile number" inputMode="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} required>
            <option value="" disabled>Select treatment</option>
            <option>Dental checkup</option><option>Braces / orthodontics</option><option>RCT / tooth pain</option><option>Capping / crown</option><option>Extraction</option><option>Implants / dentures</option><option>Other</option>
          </select>
          <textarea placeholder="Tell us the concern" rows="3" value={form.concern} onChange={(e) => setForm({ ...form, concern: e.target.value })}></textarea>
          <button className="btn primary" type="submit">Request on WhatsApp</button>
          {sent && <p className="success">WhatsApp opened with appointment details.</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div><IconLogo /><b>Sri B.G Reddy Dental Clinic</b><p>Premium dental care in Gandimaisamma.</p></div>
      <a href={mapsUrl} target="_blank" rel="noreferrer">Open Google Maps</a>
    </footer>
  );
}

function MobileBar({ onOpenPortal }) {
  return <div className="mobile-bar"><a href={`tel:${phone}`}>Call</a><a href="#appointment">Book</a><button onClick={onOpenPortal}>Login</button></div>;
}

function PublicWebsite({ onOpenPortal }) {
  return <main><Hero onOpenPortal={onOpenPortal} /><TrustStrip /><Services /><Quality /><Gallery /><Reviews /><Appointment /></main>;
}

function LoginPanel({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await dmsApi.login(email, password);
      const profile = await dmsApi.getProfile();

      if (!profile) {
        throw new Error('No DMS profile found for this login. Create clinic/profile in DMS app first.');
      }

      if (!isOwnerRole(profile.role)) {
        throw new Error(`This web dashboard is for owner/head doctor only. Current role: ${roleLabel(profile.role)}.`);
      }

      const clinic = await dmsApi.getClinic(profile.clinic_id);
      onLoginSuccess({ profile, clinic });
    } catch (err) {
      dmsApi.clearSession();
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="portal-login-wrap">
      <section className="portal-login-card">
        <div className="login-brand"><IconLogo dark /><h2>Owner Login</h2><p>Login with the same DMS owner/head doctor account. After login, the owner dashboard opens directly with full clinic control.</p></div>
        <form className="login-box" onSubmit={submit}>
          <div className={isDmsConfigured ? "success-box" : "error-box"}>{getConnectionLabel()}</div>
          {!isDmsConfigured && <div className="error-box">DMS is not connected in this build. Since you added .env, stop the server and run npm run dev again. For hosting, add the same variables in Cloudflare/Vercel and redeploy.</div>}
          <input placeholder="Owner email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn primary" disabled={loading || !isDmsConfigured}>{loading ? 'Checking DMS...' : 'Login to owner dashboard'}</button>
          {error && <p className="error-text">{error}</p>}
          <div className="role-pills"><span>Owner</span><span>Head Doctor</span><span>Full Control</span></div>
        </form>
      </section>
    </main>
  );
}


function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const text = String(value).replace(/\r?\n|\r/g, ' ').trim();

  if (/[",]/.test(text)) return `"${text.replace(/"/g, '""')}"`;

  return text;
}

function toCsv(rows = []) {
  if (!rows.length) return '';

  const headers = Object.keys(rows[0]);

  return [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');
}

function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function downloadCsv(filename, rows = []) {
  if (!rows.length) {
    alert('No data available to export.');
    return;
  }

  downloadTextFile(filename, toCsv(rows), 'text/csv;charset=utf-8');
}

function downloadJson(filename, data) {
  downloadTextFile(filename, JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
}

function ownerExportDate() {
  return new Date().toISOString().slice(0, 10);
}

function fileTypeLabel(type) {
  const labels = {
    xray: 'X-ray',
    prescription: 'Prescription',
    before_photo: 'Before Photo',
    after_photo: 'After Photo',
    report: 'Report',
    other: 'Other',
  };

  return labels[type] || type || 'File';
}

function DashboardStat({ label, value, icon }) {
  return <div className="dashboard-stat"><span>{icon}</span><small>{label}</small><b>{value}</b></div>;
}

function PortalTabs({ active, onChange }) {
  const tabs = [
    ['overview', 'Overview'],
    ['patients', 'Patients'],
    ['appointments', 'Appointments'],
    ['gallery', 'Gallery Audit'],
    ['visits', 'Visit Audit'],
    ['dues', 'Dues'],
    ['exports', 'Exports'],
    ['staff', 'Staff'],
    ['clinic', 'Clinic'],
  ];

  return <div className="portal-tabs">{tabs.map(([key, label]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => onChange(key)}>{label}</button>)}</div>;
}

function Empty({ title, message }) {
  return <div className="empty"><b>{title}</b><p>{message}</p></div>;
}

function OwnerDashboard({ profile, clinic, onLogout }) {
  const [active, setActive] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState({
    summary: {},
    patients: [],
    appointments: [],
    pending: [],
    followups: [],
    visits: [],
    galleryAudit: [],
    staff: [],
    invites: [],
    clinic,
  });

  async function loadAll() {
    setRefreshing(true);
    setError('');
    try {
      const [summary, patients, appointments, pending, followups, visits, galleryAudit, staff, invites] = await Promise.all([
        dmsApi.getOwnerSummary().catch(() => ({})),
        dmsApi.getPatients().catch(() => []),
        dmsApi.getAppointments('today').catch(() => []),
        dmsApi.getPendingPayments().catch(() => []),
        dmsApi.getFollowups('today').catch(() => []),
        dmsApi.getVisitAudit().catch(() => []),
        dmsApi.getGalleryAudit().catch(() => []),
        dmsApi.getStaff().catch(() => []),
        dmsApi.getInvites().catch(() => []),
      ]);
      setState((prev) => ({ ...prev, summary, patients, appointments, pending, followups, visits, galleryAudit, staff, invites }));
    } catch (err) {
      setError(err.message || 'Dashboard load failed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const summary = state.summary || {};
  const todayRevenue = summary.today_revenue ?? summary.todayRevenue ?? 0;
  const pendingAmount = summary.pending_payments ?? summary.pendingPayments ?? 0;
  const waitingCount = summary.waiting_count ?? 0;
  const completedCount = summary.completed_count ?? 0;
  const todayPatients = summary.today_patient_count ?? 0;

  return (
    <main className="portal-shell">
      <section className="portal-hero-card">
        <div>
          <span className="kicker">DMS Owner Dashboard</span>
          <h1>{clinicName(state.clinic || clinic)}</h1>
          <p>Logged in as {profile.name || profile.email} • {roleLabel(profile.role)} • {getConnectionLabel()}</p>
        </div>
        <div className="portal-actions">
          <button className="btn ghost" onClick={loadAll}>{refreshing ? 'Refreshing...' : 'Refresh'}</button>
          <button className="btn dark" onClick={onLogout}>Logout</button>
        </div>
      </section>

      {error && <div className="error-box">{error}</div>}
      <div className="success-box">{getConnectionLabel()} • If data is empty, confirm the logged-in account is the DMS head doctor/owner and redeploy after .env changes.</div>
      {loading ? <div className="loading-panel">Loading live DMS data...</div> : (
        <>
          <PortalTabs active={active} onChange={setActive} />

          {active === 'overview' && <OverviewTab summary={{ todayRevenue, pendingAmount, waitingCount, completedCount, todayPatients }} state={state} setActive={setActive} />}
          {active === 'patients' && <PatientsTab />}
          {active === 'appointments' && <AppointmentsTab />}
          {active === 'gallery' && <GalleryAuditTab />}
          {active === 'visits' && <VisitAuditTab />}
          {active === 'dues' && <DuesTab />}
          {active === 'exports' && <ExportsTab />}
          {active === 'staff' && <StaffTab onReload={loadAll} staff={state.staff} invites={state.invites} />}
          {active === 'clinic' && <ClinicTab clinic={state.clinic || clinic} onUpdated={(nextClinic) => setState((prev) => ({ ...prev, clinic: nextClinic }))} />}
        </>
      )}
    </main>
  );

  function OverviewTab({ summary, state, setActive }) {
    return (
      <div className="dashboard-grid">
        <DashboardStat label="Today's Revenue" value={formatMoney(summary.todayRevenue)} icon="₹" />
        <DashboardStat label="Pending Amount" value={formatMoney(summary.pendingAmount)} icon="⚠️" />
        <DashboardStat label="Waiting Queue" value={summary.waitingCount} icon="🪑" />
        <DashboardStat label="Completed Today" value={summary.completedCount} icon="✅" />
        <DashboardStat label="Patients Today" value={summary.todayPatients} icon="👥" />
        <DashboardStat label="Total Patients" value={state.patients.length} icon="📁" />
        <DashboardStat label="Visits Recorded" value={state.visits.length} icon="🦷" />
        <DashboardStat label="Gallery Uploads" value={state.galleryAudit.length} icon="🖼️" />
        <DashboardStat label="Staff Accounts" value={state.staff.length} icon="👨‍⚕️" />

        <div className="portal-card wide-card">
          <div className="card-title"><h3>Owner control shortcuts</h3><p>Manage the key clinic areas from this dashboard.</p></div>
          <div className="shortcut-grid">
            <button onClick={() => setActive('patients')}>Patients</button>
            <button onClick={() => setActive('appointments')}>Appointments</button>
            <button onClick={() => setActive('dues')}>Due Payments</button>
            <button onClick={() => setActive('gallery')}>Gallery Audit</button>
            <button onClick={() => setActive('visits')}>Visit Audit</button>
            <button onClick={() => setActive('exports')}>Export Reports</button>
            <button onClick={() => setActive('staff')}>Staff Access</button>
            <button onClick={() => setActive('clinic')}>Clinic Details</button>
          </div>
        </div>

        <div className="portal-card">
          <div className="card-title"><h3>Today appointments</h3><p>{state.appointments.length} records</p></div>
          <MiniAppointmentList items={state.appointments.slice(0, 5)} />
        </div>

        <div className="portal-card">
          <div className="card-title"><h3>Pending dues</h3><p>{state.pending.length} patients</p></div>
          <MiniDueList items={state.pending.slice(0, 5)} />
        </div>

        <div className="portal-card">
          <div className="card-title"><h3>Recent visits</h3><p>Doctor audit</p></div>
          <MiniVisitList items={state.visits.slice(0, 5)} />
        </div>

        <div className="portal-card">
          <div className="card-title"><h3>Recent uploads</h3><p>Photo upload audit</p></div>
          <MiniGalleryList items={state.galleryAudit.slice(0, 5)} />
        </div>
      </div>
    );
  }

  function PatientsTab() {
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState(state.patients);
    const [busy, setBusy] = useState(false);

    async function searchPatients(event) {
      event?.preventDefault();
      setBusy(true);
      try {
        setRows(await dmsApi.getPatients(search));
      } catch (err) {
        setError(err.message || 'Patient search failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title"><h3>Patients</h3><p>Search and monitor clinic patients. Add/update full records from the DMS mobile app.</p></div>
        <form className="portal-search" onSubmit={searchPatients}>
          <input placeholder="Search name, phone or patient ID" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn primary" disabled={busy}>{busy ? 'Searching...' : 'Search'}</button>
          <button className="btn ghost" type="button" onClick={() => downloadCsv(`patients-${ownerExportDate()}.csv`, rows)}>Export</button>
        </form>
        <div className="table-list">
          {rows.length ? rows.map((p) => <div className="table-row patient-row" key={p.id}><div><b>{p.name}</b><small>{p.phone || 'No phone'} {p.patient_code ? `• ${p.patient_code}` : ''} {p.gender ? `• ${p.gender}` : ''} {p.created_at ? `• Added ${formatDateTime(p.created_at)}` : ''}</small></div><span>{p.age || '-'} yrs</span></div>) : <Empty title="No patients" message="No patient records found." />}
        </div>
      </div>
    );
  }

  function AppointmentsTab() {
    const [filter, setFilter] = useState('today');
    const [rows, setRows] = useState(state.appointments);
    const [busy, setBusy] = useState(false);

    async function changeFilter(next) {
      setFilter(next);
      setBusy(true);
      try {
        setRows(await dmsApi.getAppointments(next));
      } catch (err) {
        setError(err.message || 'Appointments load failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title"><h3>Appointments & follow-ups</h3><p>Track waiting, scheduled, overdue and completed patient flow.</p></div>
        <div className="filter-pills">
          {['today', 'upcoming', 'overdue'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => changeFilter(item)}>{item}</button>)}
        </div>
        {busy ? <div className="loading-panel compact">Loading appointments...</div> : <MiniAppointmentList items={rows} large />}
      </div>
    );
  }

  function DuesTab() {
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState(state.pending);
    const [busy, setBusy] = useState(false);

    async function searchDues(event) {
      event?.preventDefault();
      setBusy(true);
      try {
        setRows(await dmsApi.getPendingPayments(search));
      } catch (err) {
        setError(err.message || 'Pending dues load failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title"><h3>Due payments</h3><p>Owner can monitor pending amount and send WhatsApp reminders.</p></div>
        <form className="portal-search" onSubmit={searchDues}>
          <input placeholder="Search patient name, phone or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn primary" disabled={busy}>{busy ? 'Searching...' : 'Search'}</button>
        </form>
        <MiniDueList items={rows} large />
      </div>
    );
  }


  function GalleryAuditTab() {
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState(state.galleryAudit);
    const [busy, setBusy] = useState(false);

    async function searchGallery(event) {
      event?.preventDefault();
      setBusy(true);
      try {
        setRows(await dmsApi.getGalleryAudit(search));
      } catch (err) {
        setError(err.message || 'Gallery audit load failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title"><h3>Gallery audit</h3><p>Owner can see every uploaded X-ray, prescription, report, before/after photo, who uploaded it and which patient it belongs to.</p></div>
        <form className="portal-search" onSubmit={searchGallery}>
          <input placeholder="Search patient, phone, file type, file name or uploader" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn primary" disabled={busy}>{busy ? 'Loading...' : 'Search'}</button>
          <button className="btn ghost" type="button" onClick={() => downloadCsv(`gallery-upload-audit-${ownerExportDate()}.csv`, rows)}>Export</button>
        </form>

        {busy ? <div className="loading-panel compact">Loading gallery audit...</div> : <MiniGalleryList items={rows} large />}
      </div>
    );
  }

  function VisitAuditTab() {
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState(state.visits);
    const [busy, setBusy] = useState(false);

    async function searchVisits(event) {
      event?.preventDefault();
      setBusy(true);
      try {
        setRows(await dmsApi.getVisitAudit(search));
      } catch (err) {
        setError(err.message || 'Visit audit load failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title"><h3>Visit audit</h3><p>Every visit record with patient details, chief complaint, follow-up date and which doctor added the visit.</p></div>
        <form className="portal-search" onSubmit={searchVisits}>
          <input placeholder="Search patient, phone, doctor or complaint" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn primary" disabled={busy}>{busy ? 'Loading...' : 'Search'}</button>
          <button className="btn ghost" type="button" onClick={() => downloadCsv(`visit-audit-${ownerExportDate()}.csv`, rows)}>Export</button>
        </form>

        {busy ? <div className="loading-panel compact">Loading visit audit...</div> : <MiniVisitList items={rows} large />}
      </div>
    );
  }

  function ExportsTab() {
    const [busy, setBusy] = useState(false);

    async function exportFresh(type) {
      setBusy(true);
      setError('');

      try {
        const bundle = await dmsApi.getOwnerExportBundle();
        const date = ownerExportDate();

        if (type === 'patients') downloadCsv(`patients-${date}.csv`, bundle.patients);
        if (type === 'visits') downloadCsv(`visit-audit-${date}.csv`, bundle.visits);
        if (type === 'gallery') downloadCsv(`gallery-upload-audit-${date}.csv`, bundle.gallery);
        if (type === 'dues') downloadCsv(`pending-dues-${date}.csv`, bundle.pending);
        if (type === 'payments') downloadCsv(`payments-${date}.csv`, bundle.payments);
        if (type === 'invoices') downloadCsv(`invoices-${date}.csv`, bundle.invoices);
        if (type === 'appointments') downloadCsv(`appointments-${date}.csv`, bundle.appointments);
        if (type === 'staff') downloadCsv(`staff-${date}.csv`, bundle.staff);
        if (type === 'json') downloadJson(`bg-reddy-dms-owner-full-audit-${date}.json`, bundle);
      } catch (err) {
        setError(err.message || 'Export failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title">
          <h3>Owner export center</h3>
          <p>Export crucial clinic details for owner review: patients, visits, doctors, photo uploaders, dues, invoices, payments, appointments and staff.</p>
        </div>

        <div className="export-grid">
          <button disabled={busy} onClick={() => exportFresh('patients')}><b>Patients CSV</b><span>Name, phone, patient ID, age, gender</span></button>
          <button disabled={busy} onClick={() => exportFresh('visits')}><b>Visit Audit CSV</b><span>Patient, complaint, doctor who added visit, follow-up</span></button>
          <button disabled={busy} onClick={() => exportFresh('gallery')}><b>Gallery Uploads CSV</b><span>File type, patient, uploaded by, upload time</span></button>
          <button disabled={busy} onClick={() => exportFresh('dues')}><b>Pending Dues CSV</b><span>Patient, pending amount, invoices</span></button>
          <button disabled={busy} onClick={() => exportFresh('payments')}><b>Payments CSV</b><span>Collected amount, method, date, patient</span></button>
          <button disabled={busy} onClick={() => exportFresh('invoices')}><b>Invoices CSV</b><span>Total, paid, due, status, type</span></button>
          <button disabled={busy} onClick={() => exportFresh('appointments')}><b>Appointments CSV</b><span>Follow-ups, status, patient, doctor</span></button>
          <button disabled={busy} onClick={() => exportFresh('staff')}><b>Staff CSV</b><span>Doctor/receptionist accounts and roles</span></button>
          <button disabled={busy} className="full-export" onClick={() => exportFresh('json')}><b>Full Owner Audit JSON</b><span>Complete backup-style export in one file</span></button>
        </div>

        {busy ? <div className="loading-panel compact">Preparing export...</div> : null}

        <div className="audit-note">
          <b>Owner audit note</b>
          <p>For clinic safety, exports include who added visits and who uploaded clinical photos whenever those staff IDs are available in DMS.</p>
        </div>
      </div>
    );
  }


  function StaffTab({ staff, invites, onReload }) {
    const [form, setForm] = useState({ name: '', email: '', role: 'receptionist' });
    const [busy, setBusy] = useState(false);

    async function inviteStaff(event) {
      event.preventDefault();
      setBusy(true);
      setError('');
      try {
        await dmsApi.createStaffInvite(form);
        setForm({ name: '', email: '', role: 'receptionist' });
        await onReload();
      } catch (err) {
        setError(err.message || 'Staff invite failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title"><h3>Staff control</h3><p>Owner can see clinic staff and create invite codes.</p></div>
        <form className="staff-form" onSubmit={inviteStaff}>
          <input placeholder="Staff name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Staff email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="receptionist">Receptionist</option>
            <option value="working_doctor">Working Doctor</option>
            <option value="head_doctor">Head Doctor / Owner</option>
          </select>
          <button className="btn primary" disabled={busy}>{busy ? 'Creating...' : 'Create invite'}</button>
        </form>
        <div className="split-grid">
          <div><h4>Active staff</h4>{staff.length ? staff.map((s) => <div className="table-row" key={s.id}><div><b>{s.name || s.email}</b><small>{s.email || 'No email'}</small></div><span>{roleLabel(s.role)}</span></div>) : <Empty title="No staff" message="No staff found." />}</div>
          <div><h4>Invites</h4>{invites.length ? invites.map((i) => <div className="table-row" key={i.id}><div><b>{i.name || i.email}</b><small>{i.email} • {i.accepted_at ? 'Accepted' : `Code: ${i.invite_code || '-'}`}</small></div><span>{roleLabel(i.role)}</span></div>) : <Empty title="No invites" message="No pending invite found." />}</div>
        </div>
      </div>
    );
  }

  function ClinicTab({ clinic, onUpdated }) {
    const [form, setForm] = useState({
      name: clinicName(clinic),
      phone: clinicPhone(clinic),
      email: clinicEmail(clinic),
      address: clinicAddress(clinic),
    });
    const [busy, setBusy] = useState(false);

    async function saveClinic(event) {
      event.preventDefault();
      setBusy(true);
      try {
        const rows = await dmsApi.updateClinic(clinic.id, form);
        onUpdated(rows?.[0] || { ...clinic, ...form });
      } catch (err) {
        setError(err.message || 'Clinic update failed');
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="portal-card full-card">
        <div className="card-title"><h3>Clinic details</h3><p>Owner can update clinic details shown inside DMS.</p></div>
        <form className="clinic-form" onSubmit={saveClinic}>
          <input placeholder="Clinic name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Clinic phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Clinic email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea placeholder="Clinic address" rows="3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button className="btn primary" disabled={busy}>{busy ? 'Saving...' : 'Save clinic details'}</button>
        </form>
      </div>
    );
  }
}

function MiniAppointmentList({ items = [], large = false }) {
  if (!items.length) return <Empty title="No appointments" message="No appointments found for this filter." />;
  return <div className="table-list">{items.map((item) => {
    const patient = Array.isArray(item.patients) ? item.patients[0] : item.patients;
    return <div className={large ? 'table-row large' : 'table-row'} key={item.id}><div><b>{patient?.name || 'Patient'}</b><small>{formatDateTime(item.appointment_time)} • {item.notes || 'No notes'}</small></div><span>{item.status || 'scheduled'}</span></div>;
  })}</div>;
}

function MiniDueList({ items = [], large = false }) {
  if (!items.length) return <Empty title="No dues" message="No pending payments found." />;
  return <div className="table-list">{items.map((item) => {
    const message = `Hello ${item.patient_name}, this is a payment due reminder from Sri B.G Reddy Dental Clinic. Your pending amount is ${formatMoney(item.pending_amount)}. Please reply or contact reception. Thank you.`;
    const url = whatsappUrl(item.patient_phone, message);
    return <div className={large ? 'table-row large' : 'table-row'} key={item.patient_id}><div><b>{item.patient_name}</b><small>{item.patient_phone || 'No phone'} • {item.invoice_count || 0} invoice(s)</small></div><span>{formatMoney(item.pending_amount)}</span>{large && url ? <a className="mini-link" href={url} target="_blank" rel="noreferrer">WhatsApp</a> : null}</div>;
  })}</div>;
}


function MiniVisitList({ items = [], large = false }) {
  if (!items.length) return <Empty title="No visit audit records" message="No visit records found." />;

  return (
    <div className="table-list">
      {items.map((item) => (
        <div className={large ? 'table-row audit-row large' : 'table-row audit-row'} key={item.visit_id || `${item.patient_id}-${item.created_at}`}>
          <div>
            <b>{item.patient_name || 'Patient'}</b>
            <small>
              {item.patient_phone || 'No phone'}
              {item.patient_code ? ` • ${item.patient_code}` : ''}
              {item.visit_date ? ` • ${formatDateTime(item.visit_date)}` : ''}
            </small>
            <small>
              Complaint: {item.chief_complaint || 'Not recorded'}
              {item.next_appointment_date ? ` • Follow-up: ${formatDateTime(item.next_appointment_date)}` : ''}
            </small>
          </div>
          <span>{item.doctor_name || 'Doctor not recorded'}</span>
          {large ? <small className="audit-chip">Added by doctor</small> : null}
        </div>
      ))}
    </div>
  );
}

function MiniGalleryList({ items = [], large = false }) {
  if (!items.length) return <Empty title="No gallery uploads" message="No clinical photos/files found." />;

  return (
    <div className="table-list gallery-audit-list">
      {items.map((item) => (
        <div className={large ? 'table-row audit-row large' : 'table-row audit-row'} key={item.file_id || `${item.patient_id}-${item.created_at}-${item.file_name}`}>
          <div className="gallery-audit-main">
            {item.file_url ? <a className="file-thumb" href={item.file_url} target="_blank" rel="noreferrer"><img src={item.file_url} alt={item.file_name || 'Clinical file'} /></a> : <div className="file-thumb placeholder">📄</div>}
            <div>
              <b>{fileTypeLabel(item.file_type)}</b>
              <small>
                {item.patient_name || 'Patient'}
                {item.patient_phone ? ` • ${item.patient_phone}` : ''}
                {item.patient_code ? ` • ${item.patient_code}` : ''}
              </small>
              <small>
                Uploaded by: {item.uploaded_by_name || 'Not recorded'}
                {item.created_at ? ` • ${formatDateTime(item.created_at)}` : ''}
              </small>
              {item.file_name ? <small>File: {item.file_name}</small> : null}
            </div>
          </div>
          <span>{item.uploaded_by_role ? roleLabel(item.uploaded_by_role) : 'Uploader'}</span>
          {large && item.file_url ? <a className="mini-link" href={item.file_url} target="_blank" rel="noreferrer">View</a> : null}
        </div>
      ))}
    </div>
  );
}


function App() {
  const [portalOpen, setPortalOpen] = useState(window.location.hash === '#dms');
  const [sessionState, setSessionState] = useState({ profile: null, clinic: null });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    async function boot() {
      if (!dmsApi.token) {
        setBooting(false);
        return;
      }

      try {
        const profile = await dmsApi.getProfile();
        if (profile && isOwnerRole(profile.role)) {
          const clinic = await dmsApi.getClinic(profile.clinic_id);
          setSessionState({ profile, clinic });
        }
      } catch {
        dmsApi.clearSession();
      } finally {
        setBooting(false);
      }
    }
    boot();
  }, []);

  function openPortal(open) {
    setPortalOpen(open);
    if (open) window.location.hash = 'dms';
    else if (window.location.hash === '#dms') history.pushState('', document.title, window.location.pathname + window.location.search);
  }

  function logout() {
    dmsApi.clearSession();
    setSessionState({ profile: null, clinic: null });
    setPortalOpen(false);
  }

  return (
    <>
      <Header portalOpen={portalOpen} onOpenPortal={openPortal} onLogout={logout} profile={sessionState.profile} />
      {booting ? <main className="loading-panel full">Opening...</main> : portalOpen ? (
        sessionState.profile ? <OwnerDashboard profile={sessionState.profile} clinic={sessionState.clinic} onLogout={logout} /> : <LoginPanel onLoginSuccess={setSessionState} />
      ) : <PublicWebsite onOpenPortal={() => openPortal(true)} />}
      {!portalOpen && <Footer />}
      {!portalOpen && <MobileBar onOpenPortal={() => openPortal(true)} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
