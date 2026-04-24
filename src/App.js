import { useState, useEffect } from "react";

// ─── SUPABASE ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://dtagxninhpduxidrjxab.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0YWd4bmluaHBkdXhpZHJqeGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzYwMDgsImV4cCI6MjA5MjYxMjAwOH0.NxNWh-z7x8pEM-1vGmOgS38NYcbpDyrwbLPPZ2y1yvk";

const db = {
  async get(table) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=created_at.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async update(table, id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async delete(table, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

// ─── RENKLER ─────────────────────────────────────────────────────────────────
const G = {
  primary: "#1A6B5A",
  primaryLight: "#E8F4F1",
  bg: "#F7F5F2",
  card: "#FFFFFF",
  text: "#1C1C1C",
  muted: "#6B7280",
  border: "#E5E0D8",
  danger: "#C0392B",
  dangerLight: "#FDECEA",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${G.bg}; color: ${G.text}; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 3px; }
  input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
`;

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const today = () => new Date().toISOString().split("T")[0];
const fmt = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("tr-TR") : "-";

// ─── STILLER ─────────────────────────────────────────────────────────────────
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
  statsGrid: (cols = 3) => ({ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14, marginBottom: 20 }),
  statCard: { background: G.card, borderRadius: 12, padding: "18px 20px", border: `1px solid ${G.border}` },
  statVal: { fontSize: 26, fontWeight: 700, color: G.primary, fontFamily: "'Playfair Display', serif" },
  statLbl: { fontSize: 12, color: G.muted, marginTop: 2 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 18, padding: "28px 30px", width: "90%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" },
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
  const map = {
    green: ["#E8F4F1", "#0F6E56"],
    yellow: ["#FEF3CD", "#92600A"],
    red: [G.dangerLight, G.danger],
    blue: ["#EBF4FF", "#1D4ED8"]
  };
  const [bg, c] = map[color] || map.blue;
  return { display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: bg, color: c };
};

// ─── YARDIMCI BILESENLER ──────────────────────────────────────────────────────
function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", borderRadius: 9,
      marginBottom: 3, cursor: "pointer", color: active ? "#fff" : "rgba(255,255,255,0.72)",
      fontSize: 14, fontWeight: 500, background: active ? "rgba(255,255,255,0.18)" : "transparent",
      border: "none", width: "100%", textAlign: "left", transition: "all 0.15s"
    }}>
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
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={S.statVal}>{value}</div>
      <div style={S.statLbl}>{label}</div>
    </div>
  );
}

function Table({ cols, rows, emptyMsg }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>{cols.map((c, i) => (
          <th key={i} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: `1.5px solid ${G.border}` }}>{c}</th>
        ))}</tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 30, color: G.muted, fontSize: 14 }}>{emptyMsg || "Kayit bulunamadi."}</td></tr>
          : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${G.border}` : "none" }}>
              {row.map((cell, j) => <td key={j} style={{ padding: "11px 12px", fontSize: 14 }}>{cell}</td>)}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function Yukleniyor() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${G.border}`, borderTopColor: G.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ color: G.muted, fontSize: 14 }}>Yukluyor...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ patients, appointments }) {
  const todayApts = appointments.filter(a => a.tarih === today());

  return (
    <div>
      <div style={S.pageTitle}>Genel Bakis</div>
      <div style={S.statsGrid(2)}>
        <StatCard icon="👥" value={patients.length} label="Toplam Hasta" />
        <StatCard icon="📅" value={todayApts.length} label="Bugunku Randevu" />
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Bugunku Randevular — {fmt(today())}</div>
        {todayApts.length === 0
          ? <p style={{ fontSize: 14, color: G.muted }}>Bugun randevu bulunmuyor.</p>
          : <Table
              cols={["Saat", "Hasta", "Tedavi", "Hekim", "Durum"]}
              rows={todayApts.map(a => [
                <strong>{a.saat}</strong>, a.hasta_ad, a.tedavi, a.hekim,
                <span style={badge(a.durum === "Onaylandi" ? "green" : "yellow")}>{a.durum}</span>
              ])}
            />
        }
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Son Kayitli Hastalar</div>
        <Table
          cols={["Ad Soyad", "Telefon", "Kan Grubu", "Kayit Tarihi"]}
          rows={patients.slice(-5).reverse().map(p => [
            <strong>{p.ad}</strong>, p.tel,
            <span style={badge("blue")}>{p.kan}</span>,
            fmt(p.kayit)
          ])}
          emptyMsg="Henuz hasta kaydi yok."
        />
      </div>
    </div>
  );
}

// ─── HASTALAR ────────────────────────────────────────────────────────────────
function Hastalar({ patients, setPatients }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [detay, setDetay] = useState(null);
  const [detayTab, setDetayTab] = useState("anamnez");
  const [form, setForm] = useState(null);
  const [tedaviForm, setTedaviForm] = useState(null);
  const [tedaviDetay, setTedaviDetay] = useState(null);
  const [kayit, setKayit] = useState(false);

  const filtered = patients.filter(p =>
    p.ad.toLowerCase().includes(search.toLowerCase()) ||
    (p.tc || "").includes(search) ||
    (p.tel || "").includes(search)
  );

  const emptyForm = () => ({
    ad: "", tc: "", tel: "", dogum: "", cinsiyet: "Kadin", kan: "A+",
    adres: "", kayit: "", anamnez: { sigara: "Hayir", alkol: "Hayir", alerji: "", ilac: "", hastalik: "", notlar: "" }
  });

  const openYeni = () => { setForm(emptyForm()); setModal("yeni"); };
  const openDuzenle = (p) => { setForm(JSON.parse(JSON.stringify(p))); setModal(p.id); };

  const save = async () => {
    if (!form.ad.trim() || !form.tc.trim()) return alert("Ad ve TC zorunludur.");
    setKayit(true);
    try {
      if (modal === "yeni") {
        const result = await db.insert("hastalar", {
          ad: form.ad, tc: form.tc, tel: form.tel, dogum: form.dogum,
          cinsiyet: form.cinsiyet, kan: form.kan, adres: form.adres, kayit: form.kayit,
          anamnez: form.anamnez, tedaviler: [], odemeler: []
        });
        if (result && result[0]) setPatients(ps => [...ps, result[0]]);
      } else {
        await db.update("hastalar", modal, {
          ad: form.ad, tc: form.tc, tel: form.tel, dogum: form.dogum,
          cinsiyet: form.cinsiyet, kan: form.kan, adres: form.adres, kayit: form.kayit,
          anamnez: form.anamnez
        });
        setPatients(ps => ps.map(p => p.id === modal ? { ...p, ...form } : p));
      }
      setModal(null);
    } catch (e) { alert("Kayit sirasinda hata olustu."); }
    setKayit(false);
  };

  const sil = async (id) => {
    if (!window.confirm("Hasta silinsin mi? Tum tedavi kayitlari da silinir.")) return;
    await db.delete("hastalar", id);
    setPatients(ps => ps.filter(p => p.id !== id));
  };

  const openDetay = (p) => { setDetay(p.id); setDetayTab("anamnez"); setTedaviForm(null); setTedaviDetay(null); };

  const saveTedavi = async () => {
    if (!tedaviForm.tedavi.trim()) return alert("Tedavi turu zorunludur.");
    const hasta = patients.find(p => p.id === detay);
    const yeniTedavi = { ...tedaviForm, id: uid() };
    const yeniListe = [...(hasta.tedaviler || []), yeniTedavi];
    await db.update("hastalar", detay, { tedaviler: yeniListe });
    setPatients(ps => ps.map(p => p.id === detay ? { ...p, tedaviler: yeniListe } : p));
    setTedaviForm(null);
  };

  const detayHasta = patients.find(p => p.id === detay);

  return (
    <div>
      <div style={S.pageTitle}>Hasta Kayitlari</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <input style={{ ...S.input, flex: 1 }} placeholder="Ad, TC veya telefon ile ara..." value={search} onChange={e => setSearch(e.target.value)} />
        <button style={btn("primary")} onClick={openYeni}>+ Yeni Hasta</button>
      </div>

      <div style={S.card}>
        <Table
          cols={["Ad Soyad", "TC", "Telefon", "Kan", "Kayit Tarihi", "Islemler"]}
          rows={filtered.map(p => [
            <strong>{p.ad}</strong>,
            <span style={{ fontFamily: "monospace", fontSize: 13 }}>{p.tc}</span>,
            p.tel,
            <span style={badge("blue")}>{p.kan}</span>,
            fmt(p.kayit),
            <div style={{ display: "flex", gap: 6 }}>
              <button style={btn("secondary", "sm")} onClick={() => openDetay(p)}>Detay</button>
              <button style={btn("secondary", "sm")} onClick={() => openDuzenle(p)}>Duzenle</button>
              <button style={btn("danger", "sm")} onClick={() => sil(p.id)}>Sil</button>
            </div>
          ])}
          emptyMsg="Hasta bulunamadi."
        />
      </div>

      {/* DETAY MODAL */}
      {detay && detayHasta && (
        <Modal onClose={() => { setDetay(null); setTedaviForm(null); setTedaviDetay(null); }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 3 }}>{detayHasta.ad}</div>
              <span style={{ fontSize: 12, color: G.muted }}>{detayHasta.tel} · {detayHasta.kan} · {detayHasta.cinsiyet}</span>
            </div>
            <button style={btn("secondary", "sm")} onClick={() => { setDetay(null); setTedaviForm(null); setTedaviDetay(null); }}>Kapat</button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["anamnez", "tedaviler"].map(t => (
              <button key={t} onClick={() => { setDetayTab(t); setTedaviForm(null); setTedaviDetay(null); }}
                style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: detayTab === t ? G.primary : G.primaryLight, color: detayTab === t ? "#fff" : G.primary }}>
                {t === "anamnez" ? "Anamnez" : `Tedaviler (${(detayHasta.tedaviler || []).length})`}
              </button>
            ))}
          </div>

          {detayTab === "anamnez" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Sigara", "sigara"], ["Alkol", "alkol"], ["Alerji", "alerji"], ["Kullandigi Ilaclar", "ilac"], ["Kronik Hastaliklar", "hastalik"]].map(([l, k]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, color: G.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{(detayHasta.anamnez || {})[k] || "-"}</div>
                </div>
              ))}
              <div style={{ gridColumn: "1/-1" }}>
                <div style={{ fontSize: 12, color: G.muted, marginBottom: 3 }}>Notlar</div>
                <div style={{ fontSize: 14 }}>{(detayHasta.anamnez || {}).notlar || "-"}</div>
              </div>
            </div>
          )}

          {detayTab === "tedaviler" && (
            <div>
              {/* TEDAVİ DETAY GÖRÜNTÜLE */}
              {tedaviDetay && (
                <div style={{ background: G.bg, borderRadius: 10, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{tedaviDetay.tedavi}</div>
                    <button style={btn("secondary", "sm")} onClick={() => setTedaviDetay(null)}>Kapat</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Tarih", fmt(tedaviDetay.tarih)], ["Dis No", tedaviDetay.dis || "-"], ["Hekim", tedaviDetay.hekim || "-"], ["Durum", tedaviDetay.durum]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 11, color: G.muted, marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div>
                      </div>
                    ))}
                    {tedaviDetay.notlar && (
                      <div style={{ gridColumn: "1/-1" }}>
                        <div style={{ fontSize: 11, color: G.muted, marginBottom: 2 }}>Notlar</div>
                        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{tedaviDetay.notlar}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TEDAVİ EKLEME FORMU */}
              {tedaviForm ? (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Yeni Tedavi Ekle</div>
                  <div style={{ ...S.formGrid, marginBottom: 12 }}>
                    <div style={S.fg}><label style={S.label}>Tarih</label><input type="date" style={S.input} value={tedaviForm.tarih} onChange={e => setTedaviForm(f => ({ ...f, tarih: e.target.value }))} /></div>
                    <div style={S.fg}><label style={S.label}>Dis No</label><input style={S.input} placeholder="36" value={tedaviForm.dis} onChange={e => setTedaviForm(f => ({ ...f, dis: e.target.value }))} /></div>
                    <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Tedavi Turu *</label><input style={S.input} placeholder="Dolgu, kanal, cekme..." value={tedaviForm.tedavi} onChange={e => setTedaviForm(f => ({ ...f, tedavi: e.target.value }))} /></div>
                    <div style={S.fg}><label style={S.label}>Hekim</label><input style={S.input} placeholder="Dr. ..." value={tedaviForm.hekim} onChange={e => setTedaviForm(f => ({ ...f, hekim: e.target.value }))} /></div>
                    <div style={S.fg}><label style={S.label}>Durum</label>
                      <select style={S.select} value={tedaviForm.durum} onChange={e => setTedaviForm(f => ({ ...f, durum: e.target.value }))}>
                        <option>Tamamlandi</option><option>Devam Ediyor</option><option>Planlandi</option>
                      </select>
                    </div>
                    <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Notlar</label><textarea style={S.textarea} placeholder="Tedavi hakkinda notlar..." value={tedaviForm.notlar} onChange={e => setTedaviForm(f => ({ ...f, notlar: e.target.value }))} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={btn("secondary", "sm")} onClick={() => setTedaviForm(null)}>Iptal</button>
                    <button style={btn("primary", "sm")} onClick={saveTedavi}>Kaydet</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button style={btn("primary", "sm")} onClick={() => { setTedaviDetay(null); setTedaviForm({ tarih: "", tedavi: "", dis: "", hekim: "", notlar: "", durum: "Tamamlandi" }); }}>+ Tedavi Ekle</button>
                  </div>
                  {(detayHasta.tedaviler || []).length === 0
                    ? <p style={{ fontSize: 13, color: G.muted }}>Henuz tedavi kaydi yok.</p>
                    : <Table
                        cols={["Tarih", "Tedavi", "Dis", "Hekim", "Durum", "Not"]}
                        rows={(detayHasta.tedaviler || []).map(t => [
                          fmt(t.tarih), t.tedavi, t.dis || "-", t.hekim || "-",
                          <span style={badge(t.durum === "Tamamlandi" ? "green" : t.durum === "Devam Ediyor" ? "yellow" : "blue")}>{t.durum}</span>,
                          t.notlar
                            ? <button style={btn("secondary", "sm")} onClick={() => setTedaviDetay(t)}>Goruntule</button>
                            : <span style={{ color: G.muted, fontSize: 12 }}>-</span>
                        ])}
                      />
                  }
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {/* HASTA EKLE / DUZENLE MODAL */}
      {modal && form && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 18 }}>
            {modal === "yeni" ? "Yeni Hasta Ekle" : "Hasta Duzenle"}
          </div>
          <div style={S.formGrid}>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Ad Soyad *</label><input style={S.input} value={form.ad} onChange={e => setForm(f => ({ ...f, ad: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>TC Kimlik No *</label><input style={S.input} maxLength={11} value={form.tc} onChange={e => setForm(f => ({ ...f, tc: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Telefon</label><input style={S.input} value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Dogum Tarihi</label><input type="date" style={S.input} value={form.dogum} onChange={e => setForm(f => ({ ...f, dogum: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Cinsiyet</label>
              <select style={S.select} value={form.cinsiyet} onChange={e => setForm(f => ({ ...f, cinsiyet: e.target.value }))}>
                <option>Kadin</option><option>Erkek</option><option>Diger</option>
              </select>
            </div>
            <div style={S.fg}><label style={S.label}>Kan Grubu</label>
              <select style={S.select} value={form.kan} onChange={e => setForm(f => ({ ...f, kan: e.target.value }))}>
                {["A+","A-","B+","B-","AB+","AB-","0+","0-"].map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div style={S.fg}><label style={S.label}>Kayit Tarihi</label><input type="date" style={S.input} value={form.kayit} onChange={e => setForm(f => ({ ...f, kayit: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Adres</label><input style={S.input} value={form.adres} onChange={e => setForm(f => ({ ...f, adres: e.target.value }))} /></div>

            <div style={{ gridColumn: "1/-1", borderTop: `1px solid ${G.border}`, paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 12 }}>Anamnez</div>
              <div style={S.formGrid}>
                <div style={S.fg}><label style={S.label}>Sigara</label><select style={S.select} value={form.anamnez.sigara} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, sigara: e.target.value } }))}><option>Hayir</option><option>Evet</option></select></div>
                <div style={S.fg}><label style={S.label}>Alkol</label><select style={S.select} value={form.anamnez.alkol} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, alkol: e.target.value } }))}><option>Hayir</option><option>Evet</option></select></div>
                <div style={S.fg}><label style={S.label}>Alerji</label><input style={S.input} placeholder="Yok / Penisilin..." value={form.anamnez.alerji} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, alerji: e.target.value } }))} /></div>
                <div style={S.fg}><label style={S.label}>Kullandigi Ilaclar</label><input style={S.input} value={form.anamnez.ilac} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, ilac: e.target.value } }))} /></div>
                <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Kronik Hastaliklar</label><input style={S.input} value={form.anamnez.hastalik} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, hastalik: e.target.value } }))} /></div>
                <div style={{ ...S.fg, gridColumn: "1/-1" }}><label style={S.label}>Notlar</label><textarea style={S.textarea} value={form.anamnez.notlar} onChange={e => setForm(f => ({ ...f, anamnez: { ...f.anamnez, notlar: e.target.value } }))} /></div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button style={btn("secondary")} onClick={() => setModal(null)}>Iptal</button>
            <button style={{ ...btn("primary"), opacity: kayit ? 0.7 : 1 }} onClick={save} disabled={kayit}>
              {kayit ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── RANDEVULAR ──────────────────────────────────────────────────────────────
function Randevular({ appointments, setAppointments, patients }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ hastaId: "", hasta_ad: "", tarih: today(), saat: "09:00", tedavi: "", hekim: "", durum: "Bekliyor" });
  const [kayit, setKayit] = useState(false);

  const sorted = [...appointments].sort((a, b) => a.tarih.localeCompare(b.tarih) || a.saat.localeCompare(b.saat));

  const save = async () => {
    const hasta = patients.find(p => p.id === form.hastaId);
    if (!hasta) return alert("Lutfen hasta secin.");
    if (!form.tarih || !form.saat) return alert("Tarih ve saat zorunludur.");
    setKayit(true);
    try {
      const result = await db.insert("randevular", {
        hasta_id: hasta.id, hasta_ad: hasta.ad,
        tarih: form.tarih, saat: form.saat,
        tedavi: form.tedavi, hekim: form.hekim, durum: form.durum
      });
      if (result && result[0]) setAppointments(as => [...as, result[0]]);
      setModal(false);
    } catch { alert("Kayit hatasi."); }
    setKayit(false);
  };

  const sil = async (id) => {
    if (!window.confirm("Randevu silinsin mi?")) return;
    await db.delete("randevular", id);
    setAppointments(as => as.filter(a => a.id !== id));
  };

  const durumGuncelle = async (id, durum) => {
    await db.update("randevular", id, { durum });
    setAppointments(as => as.map(a => a.id === id ? { ...a, durum } : a));
  };

  return (
    <div>
      <div style={S.pageTitle}>Randevular</div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button style={btn("primary")} onClick={() => setModal(true)}>+ Yeni Randevu</button>
      </div>

      <div style={S.card}>
        <Table
          cols={["Tarih", "Saat", "Hasta", "Tedavi", "Hekim", "Durum", "Islem"]}
          rows={sorted.map(a => [
            fmt(a.tarih),
            <strong>{a.saat}</strong>,
            a.hasta_ad,
            a.tedavi,
            a.hekim,
            <select value={a.durum} onChange={e => durumGuncelle(a.id, e.target.value)}
              style={{ ...S.select, width: "auto", padding: "3px 8px", fontSize: 12 }}>
              {["Bekliyor", "Onaylandi", "Tamamlandi", "Iptal"].map(d => <option key={d}>{d}</option>)}
            </select>,
            <button style={btn("danger", "sm")} onClick={() => sil(a.id)}>Sil</button>
          ])}
          emptyMsg="Randevu bulunamadi."
        />
      </div>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 18 }}>Yeni Randevu</div>
          <div style={S.formGrid}>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}>
              <label style={S.label}>Hasta *</label>
              <select style={S.select} value={form.hastaId} onChange={e => setForm(f => ({ ...f, hastaId: e.target.value }))}>
                <option value="">-- Secin --</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
              </select>
            </div>
            <div style={S.fg}><label style={S.label}>Tarih *</label><input type="date" style={S.input} value={form.tarih} onChange={e => setForm(f => ({ ...f, tarih: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Saat *</label><input type="time" style={S.input} value={form.saat} onChange={e => setForm(f => ({ ...f, saat: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Tedavi</label><input style={S.input} placeholder="Kontrol, dolgu..." value={form.tedavi} onChange={e => setForm(f => ({ ...f, tedavi: e.target.value }))} /></div>
            <div style={S.fg}><label style={S.label}>Hekim</label><input style={S.input} placeholder="Dr. ..." value={form.hekim} onChange={e => setForm(f => ({ ...f, hekim: e.target.value }))} /></div>
            <div style={{ ...S.fg, gridColumn: "1/-1" }}>
              <label style={S.label}>Durum</label>
              <select style={S.select} value={form.durum} onChange={e => setForm(f => ({ ...f, durum: e.target.value }))}>
                <option>Bekliyor</option><option>Onaylandi</option><option>Iptal</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button style={btn("secondary")} onClick={() => setModal(false)}>Iptal</button>
            <button style={{ ...btn("primary"), opacity: kayit ? 0.7 : 1 }} onClick={save} disabled={kayit}>
              {kayit ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ANA UYGULAMA ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    async function yukle() {
      try {
        const [h, r] = await Promise.all([db.get("hastalar"), db.get("randevular")]);
        setPatients(Array.isArray(h) ? h : []);
        setAppointments(Array.isArray(r) ? r : []);
      } catch { }
      setYukleniyor(false);
    }
    yukle();
  }, []);

  const nav = [
    { id: "dashboard", icon: "🏠", label: "Genel Bakis" },
    { id: "hastalar", icon: "👥", label: "Hastalar" },
    { id: "randevular", icon: "📅", label: "Randevular" },
  ];

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ display: "flex" }}>
        <aside style={S.sidebar}>
          <div style={S.logo}>
            <div style={S.logoH}>DentClinic</div>
            <div style={S.logoS}>Klinik Yonetim Sistemi</div>
          </div>
          <nav style={S.nav}>
            {nav.map(n => <NavItem key={n.id} icon={n.icon} label={n.label} active={page === n.id} onClick={() => setPage(n.id)} />)}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>v2.0 · Supabase</div>
          </div>
        </aside>
        <main style={S.main}>
          {yukleniyor ? <Yukleniyor /> : (
            <>
              {page === "dashboard" && <Dashboard patients={patients} appointments={appointments} />}
              {page === "hastalar" && <Hastalar patients={patients} setPatients={setPatients} />}
              {page === "randevular" && <Randevular appointments={appointments} setAppointments={setAppointments} patients={patients} />}
            </>
          )}
        </main>
      </div>
    </>
  );
}
