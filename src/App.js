import { useState, useEffect } from "react";

const G = {
  primary: "#1A6B5A",
  primaryLight: "#E8F4F1",
  accent: "#D4A853",
  bg: "#F7F5F2",
  card: "#FFFFFF",
  text: "#1C1C1C",
  muted: "#6B7280",
  border: "#E5E0D8",
  danger: "#C0392B",
  dangerLight: "#FDECEA",
};
document.charset = "utf-8";
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${G.bg}; color: ${G.text}; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 3px; }
  input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
`;

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const today = () => new Date().toISOString().split("T")[0];
const fmt = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("tr-TR") : "â€”";

const INIT_PATIENTS = [
  {
    id: "p1", ad: "AyÅŸe Kaya", tc: "12345678901", tel: "0532 111 2233",
    dogum: "1990-05-15", cinsiyet: "KadÄ±n", kan: "A+", adres: "Ankara, Ã‡ankaya", kayit: "2024-01-10",
    anamnez: { sigara: "HayÄ±r", alkol: "HayÄ±r", alerji: "Yok", ilac: "Yok", hastalik: "Yok", notlar: "DiÅŸ eti hassasiyeti mevcut." },
    tedaviler: [{ id: "t1", tarih: "2024-01-15", tedavi: "DiÅŸ taÅŸÄ± temizliÄŸi", dis: "Genel", hekim: "Dr. Ahmet", notlar: "BaÅŸarÄ±yla tamamlandÄ±.", durum: "TamamlandÄ±" }],
    odemeler: [{ id: "o1", tarih: "2024-01-15", aciklama: "DiÅŸ taÅŸÄ± temizliÄŸi", tutar: 800, odendi: true }]
  },
  {
    id: "p2", ad: "Mehmet Demir", tc: "98765432109", tel: "0535 444 5566",
    dogum: "1985-11-20", cinsiyet: "Erkek", kan: "B+", adres: "Ä°stanbul, KadÄ±kÃ¶y", kayit: "2024-02-05",
    anamnez: { sigara: "Evet", alkol: "HayÄ±r", alerji: "Penisilin", ilac: "Tansiyon ilacÄ±", hastalik: "Hipertansiyon", notlar: "Kan sulandÄ±rÄ±cÄ± kullanÄ±yor." },
    tedaviler: [{ id: "t2", tarih: "2024-02-10", tedavi: "Dolgu", dis: "36", hekim: "Dr. Ahmet", notlar: "Kompozit dolgu yapÄ±ldÄ±.", durum: "TamamlandÄ±" }],
    odemeler: [{ id: "o2", tarih: "2024-02-10", aciklama: "Kompozit dolgu", tutar: 1200, odendi: false }]
  },
];

const INIT_APTS = [
  { id: "a1", hastaId: "p1", hastaAd: "AyÅŸe Kaya", tarih: today(), saat: "10:00", tedavi: "Kontrol", hekim: "Dr. Ahmet", durum: "OnaylÄ±" },
  { id: "a2", hastaId: "p2", hastaAd: "Mehmet Demir", tarih: today(), saat: "11:30", tedavi: "Dolgu", hekim: "Dr. Ahmet", durum: "Bekliyor" },
];

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

// â”€â”€â”€ STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const S = {
  sidebar: { width: 220, minHeight: "100vh", background: G.primary, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 100 },
  logo: { padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)" },
  logoH: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", lineHeight: 1.2 },
  logoS: { fontSize: 11, color: "rgba(255,255,255,0.55)" },
  nav: { padding: "12px 10px", flex: 1 },
  main: { marginLeft: 220, flex: 1, padding: "28px 32px", minHeight: "100vh" },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 22, color: G.text },
  card: { background: G.card, borderRadius: 14, padding: "20px 22px", border: `1px solid ${G.border}`, marginBottom: 18 },
  cardTitle: { fontSize: 14, fontWeight: 600, marginBottom: 14, color: G.text },
  statsGrid: (cols = 4) => ({ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14, marginBottom: 20 }),
  statCard: { background: G.card, borderRadius: 12, padding: "18px 20px", border: `1px solid ${G.border}` },
  statVal: { fontSize: 26, fontWeight: 700, color: G.primary, fontFamily: "'Playfair Display', serif" },
  statLbl: { fontSize: 12, color: G.muted, marginTop: 2 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 18, padding: "28px 30px", width: "90%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 },
  fg: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12, fontWeight: 500, color: G.muted },
  input: { padding: "9px 13px", borderRadius: 9, border: `1.5px solid ${G.border}`, fontSize: 14, outline: "none", background: "#FAFAF8", color: G.text, width: "100%", transition: "border 0.15s" },
  textarea: { padding: "9px 13px", borderRadius: 9, border: `1.5px solid ${G.border}`, fontSize: 14, outline: "none", background: "#FAFAF8", color: G.text, width: "100%", resize: "vertical", minHeight: 80, fontFamily: "'DM Sans', sans-serif" },
  select: { padding: "9px 13px", borderRadius: 9, border: `1.5px solid ${G.border}`, fontSize: 14, outline: "none", background: "#FAFAF8", color: G.text, width: "100%" },
};

const btn = (variant = "primary", size = "md") => ({
  padding: size === "sm" ? "6px 13px" : "10px 20px",
  borderRadius: 9, fontSize: size === "sm" ? 13 : 14, fontWeight: 500,
  cursor: "pointer", border: "none", transition: "all 0.15s",
  ...(variant === "primary" ? { background: G.primary, color: "#fff" } : {}),
  ...(variant === "secondary" ? { background: G.primaryLight, color: G.primary } : {}),
  ...(variant === "danger" ? { background: G.dangerLight, color: G.danger } : {}),
});

const badge = (color) => {
  const map = { green: ["#E8F4F1", "#0F6E56"], yellow: ["#FEF3CD", "#92600A"], red: [G.dangerLight, G.danger], blue: ["#EBF4FF", "#1D4ED8"] };
  const [bg, c] = map[color] || map.blue;
  return { display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: bg, color: c };
};

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", borderRadius: 9, marginBottom: 3, cursor: "pointer", color: active ? "#fff" : "rgba(255,255,255,0.72)", fontSize: 14, fontWeight: 500, background: active ? "rgba(255,255,255,0.18)" : "transparent", border: "none", width: "100%", textAlign: "left", transition: "all 0.15s" }}>
      <span style={{ fontSize: 17, width: 20, textAlign: "center" }}>{icon}</span> {label}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div style={S.statCard}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={S.statVal}>{value}</div>
      <div style={S.statLbl}>{label}</div>
    </div>
  );
}

// â”€â”€â”€ DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Dashboard({ patients, appointments }) {
  const todayApts = appointments.filter(a => a.tarih === today());
  const gelir = patients.flatMap(p => p.odemeler).filter(o => o.odendi).reduce((s, o) => s + o.tutar, 0);
  const bekleyen = patients.flatMap(p => p.odemeler).filter(o => !o.odendi).reduce((s, o) => s + o.tutar, 0);

  return (
    <div>
      <div style={S.pageTitle}>ğŸ¦· Genel BakÄ±ÅŸ</div>
      <div style={S.statsGrid(4)}>
        <StatCard icon="ğŸ‘¥" value={patients.length} label="Toplam Hasta" />
        <StatCard icon="ğŸ“…" value={todayApts.length} label="BugÃ¼nkÃ¼ Randevu" />
        <StatCard icon="ğŸ’°" value={`${gelir.toLocaleString("tr-TR")} â‚º`} label="Tahsil Edilen" />
        <StatCard icon="â³" value={`${bekleyen.toLocaleString("tr-TR")} â‚º`} label="Bekleyen Ã–deme" />
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>ğŸ“… BugÃ¼nkÃ¼ Randevular â€” {fmt(today())}</div>
        {todayApts.length === 0
          ? <p style={{ fontSize: 14, color: G.muted }}>BugÃ¼n randevu bulunmuyor.</p>
          : <Table cols={["Saat", "Hasta", "Tedavi", "Hekim", "Durum"]} rows={todayApts.map(a => [
              <strong>{a.saat}</strong>, a.hastaAd, a.tedavi, a.hekim,
              <span style={badge(a.durum === "OnaylÄ±" ? "green" : "yellow")}>{a.durum}</span>
            ])} />}
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>ğŸ‘¥ KayÄ±tlÄ± Hastalar</div>
        <Table cols={["Ad Soyad", "Telefon", "Kan Grubu", "KayÄ±t Tarihi"]} rows={patients.slice(-5).reverse().map(p => [
          <strong>{p.ad}</strong>, p.tel, <span style={badge("blue")}>{p.kan}</span>, fmt(p.kayit)
        ])} />
      </div>
    </div>
  );
}

function Table({ cols, rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>{cols.map((c, i) => <th key={i} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: `1.5px solid ${G.border}` }}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 30, color: G.muted, fontSize: 14 }}>KayÄ±t bulunamadÄ±.</td></tr>
          : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${G.border}` : "none" }}>
              {row.map((cell, j) => <td key={j} style={{ padding: "11px 12px", fontSize: 14 }}>{cell}</td>)}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

// â”€â”€â”€ HASTALAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Hastalar({ patients, setPatients }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "yeni" | {id}
  const [detay, setDetay] = useState(null);
  const [detayTab, setDetayTab] = useState("anamnez");
  const [form, setForm] = useState(null);
  const [tedaviForm, setTedaviForm] = useState(null);

  const filtered = patients.filter(p =>
    p.ad.toLowerCase().includes(search.toLowerCase()) || p.tc.includes(search) || p.tel.includes(search)
  );

  const emptyForm = () => ({ ad: "", tc: "", tel: "", dogum: "", cinsiyet: "KadÄ±n", kan: "A+", adres: "", kayit: "", anamnez: { sigara: "HayÄ±r", alkol: "HayÄ±r", alerji: "", ilac: "", hastalik: "", notlar: "" } });

  const openYeni = () => { setForm(emptyForm()); setModal("yeni"); };
  const openDuzenle = (p) => { setForm(JSON.parse(JSON.stringify(p))); setModal(p.id); };

  const save = () => {
    if (!form.ad.trim() || !form.tc.trim()) return alert("Ad ve TC zorunludur.");
    if (modal === "yeni") {
      setPatients(ps => [...ps, { ...form, id: uid(), tedaviler: [], odemeler: [] }]);
    } else {
      setPatients(ps => ps.map(p => p.id === modal ? { ...p, ...form } : p));
    }
    setModal(null);
  };

  const sil = (id) => { if (window.confirm("Hasta silinsin mi?")) setPatients(ps => ps.filter(p => p.id !== id)); };

  const openDetay = (p) => { setDetay(p.id); setDetayTab("anamnez"); };

  const saveTedavi = () => {
    if (!tedaviForm.tedavi.trim()) return alert("Tedavi tÃ¼rÃ¼ zorunludur.");
    setPatients(ps => ps.map(p => p.id === detay ? { ...p, tedaviler: [...p.tedaviler, { ...tedaviForm, id: uid() }] } : p));
    setTedaviForm(null);
  };

  const detayHasta = patients.find(p => p.id === detay);

  const F = ({ label, id, type = "text", value, onChange, full, children }) => (
    <div style={{ ...S.fg, ...(full ? { gridColumn: "1/-1" } : {}) }}>
      <label style={S.label}>{label}</label>
      {children || <input type={type} style={S.input} value={value} onChange={onChange} id={id} />}
    </div>
  );

  return (
    <div>
      <div style={S.pageTitle}>ğŸ‘¥ Hasta KayÄ±tlarÄ±</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <input style={{ ...S.input, flex: 1 }} placeholder="Ad, TC veya telefon ile ara..." value={search} onChange={e => setSearch(e.target.value)} />
        <button style={btn("primary")} onClick={openYeni}>+ Yeni Hasta</button>
      </div>

      <div style={S.card}>
        <Table
          cols={["Ad Soyad", "TC", "Telefon", "Kan Grubu", "KayÄ±t", "Ä°ÅŸlemler"]}
          rows={filtered.map(p => [
            <strong>{p.ad}</strong>,
            <span style={{ fontFamily: "monospace", fontSize: 13 }}>{p.tc}</span>,
            p.tel,
            <span style={badge("blue")}>{p.kan}</span>,
            fmt(p.kayit),
            <div style={{ display: "flex", gap: 6 }}>
              <button style={btn("secondary", "sm")} onClick={() => openDetay(p)}>Detay</button>
              <button style={btn("secondary", "sm")} onClick={() => openDuzenle(p)}>DÃ¼zenle</button>
              <button style={btn("danger", "sm")} onClick={() => sil(p.id)}>Sil</button>
            </div>
          ])}
        />
      </div>

      {/* DETAY MODAL */}
      {detay && detayHasta && (
        <Modal onClose={() => setDetay(null)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 3 }}>{detayHasta.ad}</div>
              <span style={{ fontSize: 12, color: G.muted }}>{detayHasta.tel} Â· {detayHasta.kan} Â· {detayHasta.cinsiyet}</span>
            </div>
            <button style={btn("secondary", "sm")} onClick={() => setDetay(null)}>âœ• Kapat</button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["anamnez", "tedaviler"].map(t => (
              <button key={t} onClick={() => setDetayTab(t)} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: detayTab === t ? G.primary : G.primaryLight, color: detayTab === t ? "#fff" : G.primary, transition: "all 0.15s" }}>
                {t === "anamnez" ? "ğŸ“‹ Anamnez" : `ğŸ¦· Tedaviler (${detayHasta.tedaviler.length})`}
              </button>
            ))}
          </div>

          {detayTab === "anamnez" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Sigara", "sigara"], ["Alkol", "alkol"], ["Alerji", "alerji"], ["Ä°laÃ§lar", "ilac"], ["HastalÄ±klar", "hastalik"]].map(([l, k]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, color: G.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{detayHasta.anamnez[k] || "â€”"}</div>
                </div>
              ))}
              <div style={{ gridColumn: "1/-1" }}>
                <div style={{ fontSize: 12, color: G.muted, marginBottom: 3 }}>Notlar</div>
                <div style={{ fontSize: 14 }}>{detayHasta.anamnez.notlar || "â€”"}</div>
              </div>
            </div>
          )}

          {detayTab === "tedaviler" && (
            <div>
              {!tedaviForm && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <button style={btn("primary", "sm")} onClick={() => setTedaviForm({ tarih: today(), tedavi: "", dis: "", hekim: "", notlar: "", durum: "TamamlandÄ±" })}>+ Tedavi Ekle</button>
                </div>
              )}
              {tedaviForm ? (
                <div>
                  <div style={{ ...S.formGrid, marginBottom: 12 }}>
                    <div style={S.fg}><label style={S.label}>Tarih</label><input type="date" style={S.input} value={tedaviForm.tarih} onChange={e => setTedaviForm(f => ({ ...f, tarih: e.target.value }))} /></div>
                    <div style={S.fg}><label style={S.label}>DiÅŸ No</label><input style={S.input} placeholder="36" value={tedaviForm.dis} onChange={e => setTedaviForm(f => ({ ...f, dis: e.target.value }))} /></div>
                    <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Tedavi TÃ¼rÃ¼ *</label><input style={S.input} placeholder="Dolgu, kanal..." value={tedaviForm.tedavi} onChange={e => setTedaviForm(f => ({ ...f, tedavi: e.target.value }))} /></div>
                    <div style={S.fg}><label style={S.label}>Hekim</label><input style={S.input} placeholder="Dr. ..." value={tedaviForm.hekim} onChange={e => setTedaviForm(f => ({ ...f, hekim: e.target.value }))} /></div>
                    <div style={S.fg}><label style={S.label}>Durum</label><select style={S.select} value={tedaviForm.durum} onChange={e => setTedaviForm(f => ({ ...f, durum: e.target.value }))}><option>TamamlandÄ±</option><option>Devam Ediyor</option><option>PlanlandÄ±</option></select></div>
                    <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Notlar</label><textarea style={S.textarea} value={tedaviForm.notlar} onChange={e => setTedaviForm(f => ({ ...f, notlar: e.target.value }))} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={btn("secondary", "sm")} onClick={() => setTedaviForm(null)}>Ä°ptal</button>
                    <button style={btn("primary", "sm")} onClick={saveTedavi}>Kaydet</button>
                  </div>
                </div>
              ) : (
                <Table cols={["Tarih", "Tedavi", "DiÅŸ", "Hekim", "Durum"]} rows={detayHasta.tedaviler.map(t => [
                  fmt(t.tarih), t.tedavi, t.dis, t.hekim,
                  <span style={badge(t.durum === "TamamlandÄ±" ? "green" : "yellow")}>{t.durum}</span>
                ])} />
              )}
            </div>
          )}
        </Modal>
      )}

      {/* EKLE / DÃœZENLE MODAL */}
      {modal && form && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 18 }}>{modal === "yeni" ? "Yeni Hasta Ekle" : "Hasta DÃ¼zenle"}</div>
          <div style={S.formGrid}>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Ad Soyad *</label><input style={S.input} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>TC Kimlik No *</label><input style={S.input} maxLength={11} value={form.tc} onChange={e => setForm(f => ({ ...f, tc: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Telefon</label><input style={S.input} value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>DoÄŸum Tarihi</label><input type="date" style={S.input} value={form.dogum} onChange={e => setForm(f => ({ ...f, dogum: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Cinsiyet</label><select style={S.select} value={form.cinsiyet} onChange={e => setForm(f => ({ ...f, cinsiyet: e.target.value }))}><option>KadÄ±n</option><option>Erkek</option><option>DiÄŸer</option></select></div>
            <div style={S.fg}><label style={S.label}>Kan Grubu</label><select style={S.select} value={form.kan} onChange={e => setForm(f => ({ ...f, kan: e.target.value }))}>{["A+","A-","B+","B-","AB+","AB-","0+","0-"].map(k => <option key={k}>{k}</option>)}</select></div>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Adres</label><input style={S.input} value={form.adres} onChange={e => setForm(f => ({ ...f, adres: e.target.value }))} /></div>
            <div style={{ gridColumn: "1/-1", borderTop: `1px solid ${G.border}`, paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 12 }}>Anamnez</div>
              <div style={S.formGrid}>
                <div style={S.fg}><label style={S.label}>Sigara</label><select style={S.select} value={form.anamnez.sigara} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, sigara: e.target.value } }))}><option>HayÄ±r</option><option>Evet</option></select></div>
                <div style={S.fg}><label style={S.label}>Alkol</label><select style={S.select} value={form.anamnez.alkol} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, alkol: e.target.value } }))}><option>HayÄ±r</option><option>Evet</option></select></div>
                <div style={S.fg}><label style={S.label}>Alerji</label><input style={S.input} placeholder="Yok / Penisilin..." value={form.anamnez.alerji} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, alerji: e.target.value } }))} /></div>
                <div style={S.fg}><label style={S.label}>KullandÄ±ÄŸÄ± Ä°laÃ§lar</label><input style={S.input} value={form.anamnez.ilac} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, ilac: e.target.value } }))} /></div>
                <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Kronik HastalÄ±klar</label><input style={S.input} value={form.anamnez.hastalik} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, hastalik: e.target.value } }))} /></div>
                <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Notlar</label><textarea style={S.textarea} value={form.anamnez.notlar} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, notlar: e.target.value } }))} /></div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button style={btn("secondary")} onClick={() => setModal(null)}>Ä°ptal</button>
            <button style={btn("primary")} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// â”€â”€â”€ RANDEVULAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Randevular({ appointments, setAppointments, patients }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ hastaId: "", hastaAd: "", tarih: today(), saat: "09:00", tedavi: "", hekim: "", durum: "Bekliyor" });

  const sorted = [...appointments].sort((a, b) => a.tarih.localeCompare(b.tarih) || a.saat.localeCompare(b.saat));

  const save = () => {
    const hasta = patients.find(p => p.id === form.hastaId);
    if (!hasta) return alert("LÃ¼tfen hasta seÃ§in.");
    if (!form.tarih || !form.saat) return alert("Tarih ve saat zorunludur.");
    setAppointments(as => [...as, { ...form, hastaAd: hasta.ad, id: uid() }]);
    setModal(false);
  };

  const sil = (id) => { if (window.confirm("Randevu silinsin mi?")) setAppointments(as => as.filter(a => a.id !== id)); };

  const durumGuncelle = (id, durum) => setAppointments(as => as.map(a => a.id === id ? { ...a, durum } : a));

  return (
    <div>
      <div style={S.pageTitle}>ğŸ“… Randevular</div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button style={btn("primary")} onClick={() => setModal(true)}>+ Yeni Randevu</button>
      </div>

      <div style={S.card}>
        <Table
          cols={["Tarih", "Saat", "Hasta", "Tedavi", "Hekim", "Durum", "Ä°ÅŸlemler"]}
          rows={sorted.map(a => [
            fmt(a.tarih), <strong>{a.saat}</strong>, a.hastaAd, a.tedavi, a.hekim,
            <select value={a.durum} onChange={e => durumGuncelle(a.id, e.target.value)} style={{ ...S.select, width: "auto", padding: "3px 8px", fontSize: 12 }}>
              {["Bekliyor", "OnaylÄ±", "TamamlandÄ±", "Ä°ptal"].map(d => <option key={d}>{d}</option>)}
            </select>,
            <button style={btn("danger", "sm")} onClick={() => sil(a.id)}>Sil</button>
          ])}
        />
      </div>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 18 }}>Yeni Randevu</div>
          <div style={S.formGrid}>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}>
              <label style={S.label}>Hasta *</label>
              <select style={S.select} value={form.hastaId} onChange={e => setForm(f => ({ ...f, hastaId: e.target.value }))}>
                <option value="">â€” SeÃ§in â€”</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
              </select>
            </div>
            <div style={S.fg}><label style={S.label}>Tarih *</label><input type="date" style={S.input} value={form.tarih} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Saat *</label><input type="time" style={S.input} value={form.saat} onChange={e => setForm(f => ({ ...f, saat: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Tedavi</label><input style={S.input} placeholder="Kontrol, dolgu..." value={form.tedavi} onChange={e => setForm(f => ({ ...f, tedavi: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Hekim</label><input style={S.input} placeholder="Dr. ..." value={form.hekim} onChange={e => setForm(f => ({ ...f, hekim: e.target.value }))} /></div>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Durum</label><select style={S.select} value={form.durum} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}><option>Bekliyor</option><option>OnaylÄ±</option><option>Ä°ptal</option></select></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button style={btn("secondary")} onClick={() => setModal(false)}>Ä°ptal</button>
            <button style={btn("primary")} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// â”€â”€â”€ Ã–DEMELER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Odemeler({ patients, setPatients }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ aciklama: "", tutar: "", odendi: false, tarih: today() });

  const all = patients.flatMap(p => p.odemeler.map(o => ({ ...o, hastaAd: p.ad, hastaId: p.id })));
  const toplam = all.reduce((s, o) => s + o.tutar, 0);
  const tahsil = all.filter(o => o.odendi).reduce((s, o) => s + o.tutar, 0);
  const bekleyen = all.filter(o => !o.odendi).reduce((s, o) => s + o.tutar, 0);

  const save = () => {
    if (!form.aciklama.trim() || !form.tutar) return alert("AÃ§Ä±klama ve tutar zorunludur.");
    setPatients(ps => ps.map(p => p.id === modal ? { ...p, odemeler: [...p.odemeler, { ...form, tutar: Number(form.tutar), id: uid() }] } : p));
    setModal(null);
  };

  const toggle = (hastaId, odemeId) => setPatients(ps => ps.map(p => p.id === hastaId ? { ...p, odemeler: p.odemeler.map(o => o.id === odemeId ? { ...o, odendi: !o.odendi } : o) } : p));

  return (
    <div>
      <div style={S.pageTitle}>ğŸ’³ Ã–deme & Fatura</div>
      <div style={S.statsGrid(3)}>
        <StatCard icon="ğŸ“Š" value={`${toplam.toLocaleString("tr-TR")} â‚º`} label="Toplam" />
        <StatCard icon="âœ…" value={`${tahsil.toLocaleString("tr-TR")} â‚º`} label="Tahsil Edilen" />
        <StatCard icon="â³" value={`${bekleyen.toLocaleString("tr-TR")} â‚º`} label="Bekleyen" />
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={S.cardTitle}>Ã–deme KayÄ±tlarÄ±</div>
          <select style={{ ...S.select, width: "auto" }} value="" onChange={e => { if (e.target.value) { setModal(e.target.value); setForm({ aciklama: "", tutar: "", odendi: false, tarih: today() }); } }}>
            <option value="">+ Ã–deme Ekle (Hasta SeÃ§)</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
          </select>
        </div>
        <Table
          cols={["Tarih", "Hasta", "AÃ§Ä±klama", "Tutar", "Durum", "Ä°ÅŸlem"]}
          rows={[...all].sort((a, b) => (b.tarih || "").localeCompare(a.tarih || "")).map(o => [
            fmt(o.tarih), <strong>{o.hastaAd}</strong>, o.aciklama,
            <strong>{o.tutar.toLocaleString("tr-TR")} â‚º</strong>,
            <span style={badge(o.odendi ? "green" : "yellow")}>{o.odendi ? "Ã–dendi" : "Bekliyor"}</span>,
            <button style={btn("secondary", "sm")} onClick={() => toggle(o.hastaId, o.id)}>{o.odendi ? "Geri Al" : "Onayla"}</button>
          ])}
        />
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 18 }}>
            Ã–deme Ekle â€” {patients.find(p => p.id === modal)?.ad}
          </div>
          <div style={S.formGrid}>
            <div style={S.fg}><label style={S.label}>Tarih</label><input type="date" style={S.input} value={form.tarih} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Tutar (â‚º) *</label><input type="number" style={S.input} placeholder="0" value={form.tutar} onChange={e => setForm(f => ({ ...f, tutar: e.target.value }))} /></div>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>AÃ§Ä±klama *</label><input style={S.input} placeholder="Tedavi tÃ¼rÃ¼..." value={form.aciklama} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} /></div>
            <div style={{ ...S.fg, gridColumn: "1/-1", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="odendi" checked={form.odendi} onChange={e => setForm(f => ({ ...f, odendi: e.target.checked }))} style={{ width: "auto", cursor: "pointer" }} />
              <label htmlFor="odendi" style={{ ...S.label, cursor: "pointer" }}>Ã–deme alÄ±ndÄ±</label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button style={btn("secondary")} onClick={() => setModal(null)}>Ä°ptal</button>
            <button style={btn("primary")} onClick={save}>Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// â”€â”€â”€ APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useLocalStorage("dentclinic_patients", INIT_PATIENTS);
  const [appointments, setAppointments] = useLocalStorage("dentclinic_appointments", INIT_APTS);

  const nav = [
    { id: "dashboard", icon: "ğŸ ", label: "Genel BakÄ±ÅŸ" },
    { id: "hastalar", icon: "ğŸ‘¥", label: "Hastalar" },
    { id: "randevular", icon: "ğŸ“…", label: "Randevular" },
    { id: "odemeler", icon: "ğŸ’³", label: "Ã–demeler" },
  ];

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ display: "flex" }}>
        <aside style={S.sidebar}>
          <div style={S.logo}>
            <div style={S.logoH}>ğŸ¦· DentClinic</div>
            <div style={S.logoS}>Klinik YÃ¶netim Sistemi</div>
          </div>
          <nav style={S.nav}>
            {nav.map(n => <NavItem key={n.id} icon={n.icon} label={n.label} active={page === n.id} onClick={() => setPage(n.id)} />)}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>v1.0 Â· {new Date().toLocaleDateString("tr-TR")}</div>
          </div>
        </aside>
        <main style={S.main}>
          {page === "dashboard" && <Dashboard patients={patients} appointments={appointments} />}
          {page === "hastalar" && <Hastalar patients={patients} setPatients={setPatients} />}
          {page === "randevular" && <Randevular appointments={appointments} setAppointments={setAppointments} patients={patients} />}
          {page === "odemeler" && <Odemeler patients={patients} setPatients={setPatients} />}
        </main>
      </div>
    </>
  );
}
