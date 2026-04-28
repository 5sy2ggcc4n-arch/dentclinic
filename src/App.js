import { useState, useEffect } from "react";

const SUPABASE_URL = "https://dtagxninhpduxidrjxab.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0YWd4bmluaHBkdXhpZHJqeGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzYwMDgsImV4cCI6MjA5MjYxMjAwOH0.NxNWh-z7x8pEM-1vGmOgS38NYcbpDyrwbLPPZ2y1yvk";

const db = {
  async get(table) {
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + table + "?order=created_at.asc", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY }
    });
    return res.json();
  },
  async insert(table, data) {
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async update(table, id, data) {
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async delete(table, id) {
    await fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY }
    });
  }
};

const storage = {
  async upload(file, path) {
    const res = await fetch(SUPABASE_URL + "/storage/v1/object/tedavi%20fotograflar/" + path, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "Content-Type": file.type },
      body: file
    });
    return res.json();
  },
  url(path) {
    return SUPABASE_URL + "/storage/v1/object/public/tedavi%20fotograflar/" + path;
  }
};

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
  body { font-family: 'DM Sans', sans-serif; background: #F7F5F2; color: #1C1C1C; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #E5E0D8; border-radius: 3px; }
  input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const uid = () => Date.now() + "-" + Math.random().toString(36).slice(2);
const today = () => new Date().toISOString().split("T")[0];
const fmt = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("tr-TR") : "-";

const S = {
  sidebar: { width: 220, minHeight: "100vh", background: G.primary, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 100 },
  logo: { padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)" },
  logoH: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", lineHeight: 1.2 },
  logoS: { fontSize: 11, color: "rgba(255,255,255,0.55)" },
  nav: { padding: "12px 10px", flex: 1 },
  main: { marginLeft: 220, flex: 1, padding: "28px 32px", minHeight: "100vh" },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 22, color: G.text },
  card: { background: G.card, borderRadius: 14, padding: "20px 22px", border: "1px solid #E5E0D8", marginBottom: 18 },
  cardTitle: { fontSize: 14, fontWeight: 600, marginBottom: 14, color: G.text },
  statsGrid: function(cols) { return { display: "grid", gridTemplateColumns: "repeat(" + (cols || 2) + ", 1fr)", gap: 14, marginBottom: 20 }; },
  statCard: { background: G.card, borderRadius: 12, padding: "18px 20px", border: "1px solid #E5E0D8" },
  statVal: { fontSize: 26, fontWeight: 700, color: G.primary, fontFamily: "'Playfair Display', serif" },
  statLbl: { fontSize: 12, color: G.muted, marginTop: 2 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 18, padding: "28px 30px", width: "90%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 },
  fg: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12, fontWeight: 500, color: G.muted },
  input: { padding: "9px 13px", borderRadius: 9, border: "1.5px solid #E5E0D8", fontSize: 14, outline: "none", background: "#FAFAF8", color: G.text, width: "100%" },
  textarea: { padding: "9px 13px", borderRadius: 9, border: "1.5px solid #E5E0D8", fontSize: 14, outline: "none", background: "#FAFAF8", color: G.text, width: "100%", resize: "vertical", minHeight: 80, fontFamily: "'DM Sans', sans-serif" },
  select: { padding: "9px 13px", borderRadius: 9, border: "1.5px solid #E5E0D8", fontSize: 14, outline: "none", background: "#FAFAF8", color: G.text, width: "100%" },
};

function btn(variant, size) {
  return {
    padding: size === "sm" ? "6px 13px" : "10px 20px",
    borderRadius: 9, fontSize: size === "sm" ? 13 : 14, fontWeight: 500,
    cursor: "pointer", border: "none", transition: "all 0.15s",
    background: variant === "danger" ? G.dangerLight : variant === "secondary" ? G.primaryLight : G.primary,
    color: variant === "danger" ? G.danger : variant === "secondary" ? G.primary : "#fff",
  };
}

function badge(color) {
  var map = { green: ["#E8F4F1", "#0F6E56"], yellow: ["#FEF3CD", "#92600A"], red: ["#FDECEA", "#C0392B"], blue: ["#EBF4FF", "#1D4ED8"] };
  var pair = map[color] || map.blue;
  return { display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: pair[0], color: pair[1] };
}

function NavItem({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", borderRadius: 9,
      marginBottom: 3, cursor: "pointer", color: active ? "#fff" : "rgba(255,255,255,0.72)",
      fontSize: 14, fontWeight: 500, background: active ? "rgba(255,255,255,0.18)" : "transparent",
      border: "none", width: "100%", textAlign: "left",
    }}>
      {label}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={function(e) { e.stopPropagation(); }}>{children}</div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div style={S.statCard}>
      <div style={S.statVal}>{value}</div>
      <div style={S.statLbl}>{label}</div>
    </div>
  );
}

function Table({ cols, rows, emptyMsg }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>{cols.map(function(c, i) {
          return <th key={i} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: "1.5px solid #E5E0D8" }}>{c}</th>;
        })}</tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 30, color: G.muted, fontSize: 14 }}>{emptyMsg || "Kayit bulunamadi."}</td></tr>
          : rows.map(function(row, i) {
            return (
              <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #E5E0D8" : "none" }}>
                {row.map(function(cell, j) { return <td key={j} style={{ padding: "11px 12px", fontSize: 14 }}>{cell}</td>; })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

function Yukleniyor() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 40, height: 40, border: "3px solid #E5E0D8", borderTopColor: G.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ color: G.muted, fontSize: 14 }}>Yukleniyor...</div>
    </div>
  );
}

function Dashboard({ patients, appointments, onHastaDetay }) {
  var todayApts = appointments.filter(function(a) { return a.tarih === today(); });
  var devamEden = patients.flatMap(function(p) {
    return (p.tedaviler || []).filter(function(t) { return t.durum === "Devam Ediyor"; }).map(function(t) {
      return Object.assign({}, t, { hastaAd: p.ad, hastaId: p.id });
    });
  });
  return (
    <div>
      <div style={S.pageTitle}>Genel Bakis</div>
      <div style={S.statsGrid(2)}>
        <StatCard value={patients.length} label="Toplam Hasta" />
        <StatCard value={todayApts.length} label="Bugunku Randevu" />
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>{"Bugunku Randevular - " + fmt(today())}</div>
        {todayApts.length === 0
          ? <p style={{ fontSize: 14, color: G.muted }}>Bugun randevu bulunmuyor.</p>
          : <Table
              cols={["Saat", "Hasta", "Tedavi", "Hekim", "Durum"]}
              rows={todayApts.map(function(a) { return [
                <strong>{a.saat}</strong>, a.hasta_ad, a.tedavi, a.hekim,
                <span style={badge(a.durum === "Onaylandi" ? "green" : "yellow")}>{a.durum}</span>
              ]; })}
            />
        }
      </div>
      <div style={Object.assign({}, S.card, { borderLeft: "4px solid #D4A853" })}>
        <div style={S.cardTitle}>Devam Eden Tedaviler</div>
        {devamEden.length === 0
          ? <p style={{ fontSize: 14, color: G.muted }}>Devam eden tedavi bulunmuyor.</p>
          : <Table
              cols={["Hasta", "Tedavi", "Dis No", "Hekim", "Tarih", "Detay"]}
              rows={devamEden.map(function(t) { return [
                <strong>{t.hastaAd}</strong>, t.tedavi, t.dis || "-", t.hekim || "-", fmt(t.tarih),
                <button style={btn("secondary", "sm")} onClick={function() { onHastaDetay(t.hastaId); }}>Hasta Detayi</button>
              ]; })}
            />
        }
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Son Kayitli Hastalar</div>
        <Table
          cols={["Ad Soyad", "Telefon", "Kan Grubu", "Kayit Tarihi"]}
          rows={patients.slice(-5).reverse().map(function(p) { return [
            <strong>{p.ad}</strong>, p.tel,
            <span style={badge("blue")}>{p.kan}</span>,
            fmt(p.kayit)
          ]; })}
          emptyMsg="Henuz hasta kaydi yok."
        />
      </div>
    </div>
  );
}

function Hastalar({ patients, setPatients, acikHastaId, onAcikHastaClear }) {
  var [search, setSearch] = useState("");
  var [modal, setModal] = useState(null);
  var [detay, setDetay] = useState(null);
  var [detayTab, setDetayTab] = useState("anamnez");
  var [form, setForm] = useState(null);
  var [tedaviForm, setTedaviForm] = useState(null);
  var [tedaviDetay, setTedaviDetay] = useState(null);
  var [anamnezDuzenle, setAnamnezDuzenle] = useState(false);
  var [anamnezForm, setAnamnezForm] = useState(null);
  var [kayit, setKayit] = useState(false);

  useEffect(function() {
    if (acikHastaId) {
      setDetay(acikHastaId);
      setDetayTab("tedaviler");
      if (onAcikHastaClear) onAcikHastaClear();
    }
  }, [acikHastaId]);

  var filtered = patients.filter(function(p) {
    return p.ad.toLowerCase().includes(search.toLowerCase()) ||
      (p.tc || "").includes(search) ||
      (p.tel || "").includes(search);
  });

  function emptyForm() {
    return { ad: "", tc: "", tel: "", dogum: "", cinsiyet: "Kadin", kan: "A+", adres: "", kayit: "", anamnez: { sigara: "Hayir", alkol: "Hayir", alerji: "", ilac: "", hastalik: "", notlar: "" } };
  }

  function openYeni() { setForm(emptyForm()); setModal("yeni"); }
  function openDuzenle(p) { setForm(JSON.parse(JSON.stringify(p))); setModal(p.id); }

  async function save() {
    if (!form.ad.trim() || !form.tc.trim()) return alert("Ad ve TC zorunludur.");
    setKayit(true);
    try {
      if (modal === "yeni") {
        var result = await db.insert("hastalar", { ad: form.ad, tc: form.tc, tel: form.tel, dogum: form.dogum, cinsiyet: form.cinsiyet, kan: form.kan, adres: form.adres, kayit: form.kayit, anamnez: form.anamnez, tedaviler: [], odemeler: [] });
        if (result && result[0]) setPatients(function(ps) { return [...ps, result[0]]; });
      } else {
        await db.update("hastalar", modal, { ad: form.ad, tc: form.tc, tel: form.tel, dogum: form.dogum, cinsiyet: form.cinsiyet, kan: form.kan, adres: form.adres, kayit: form.kayit, anamnez: form.anamnez });
        setPatients(function(ps) { return ps.map(function(p) { return p.id === modal ? Object.assign({}, p, form) : p; }); });
      }
      setModal(null);
    } catch(e) { alert("Kayit sirasinda hata olustu."); }
    setKayit(false);
  }

  async function saveAnamnez() {
    setKayit(true);
    try {
      await db.update("hastalar", detay, { anamnez: anamnezForm });
      setPatients(function(ps) { return ps.map(function(p) { return p.id === detay ? Object.assign({}, p, { anamnez: anamnezForm }) : p; }); });
      setAnamnezDuzenle(false);
    } catch(e) { alert("Kayit sirasinda hata olustu."); }
    setKayit(false);
  }

  async function sil(id) {
    if (!window.confirm("Hasta silinsin mi?")) return;
    await db.delete("hastalar", id);
    setPatients(function(ps) { return ps.filter(function(p) { return p.id !== id; }); });
  }

  function openDetay(p) { setDetay(p.id); setDetayTab("anamnez"); setTedaviForm(null); setTedaviDetay(null); setAnamnezDuzenle(false); }

  async function saveTedavi() {
    if (!tedaviForm.tedavi.trim()) return alert("Tedavi turu zorunludur.");
    var hasta = patients.find(function(p) { return p.id === detay; });
    var fotografUrl = "";
    if (tedaviForm.fotografDosya) {
      var temizAd = tedaviForm.fotografDosya.name.replace(/[^a-zA-Z0-9.]/g, "_");
      var path = detay + "/" + uid() + "-" + temizAd;
      await storage.upload(tedaviForm.fotografDosya, path);
      fotografUrl = storage.url(path);
    }
    var yeniTedavi = { id: uid(), tarih: tedaviForm.tarih, tedavi: tedaviForm.tedavi, dis: tedaviForm.dis, hekim: tedaviForm.hekim, notlar: tedaviForm.notlar, durum: tedaviForm.durum };
    if (fotografUrl) yeniTedavi.fotografUrl = fotografUrl;
    var yeniListe = [...(hasta.tedaviler || []), yeniTedavi];
    await db.update("hastalar", detay, { tedaviler: yeniListe });
    setPatients(function(ps) { return ps.map(function(p) { return p.id === detay ? Object.assign({}, p, { tedaviler: yeniListe }) : p; }); });
    setTedaviForm(null);
  }

  async function silTedavi(tedaviId) {
    if (!window.confirm("Bu tedavi kaydi silinsin mi?")) return;
    var hasta = patients.find(function(p) { return p.id === detay; });
    var yeniListe = (hasta.tedaviler || []).filter(function(t) { return t.id !== tedaviId; });
    await db.update("hastalar", detay, { tedaviler: yeniListe });
    setPatients(function(ps) { return ps.map(function(p) { return p.id === detay ? Object.assign({}, p, { tedaviler: yeniListe }) : p; }); });
    setTedaviDetay(null);
  }

  async function guncelleTedavi() {
    var hasta = patients.find(function(p) { return p.id === detay; });
    var yeniListe = (hasta.tedaviler || []).map(function(t) {
      return t.id === tedaviDetay.id ? Object.assign({}, t, { durum: tedaviDetay.durum, tamamTarih: tedaviDetay.tamamTarih }) : t;
    });
    await db.update("hastalar", detay, { tedaviler: yeniListe });
    setPatients(function(ps) { return ps.map(function(p) { return p.id === detay ? Object.assign({}, p, { tedaviler: yeniListe }) : p; }); });
    setTedaviDetay(null);
  }

  var detayHasta = patients.find(function(p) { return p.id === detay; });

  return (
    <div>
      <div style={S.pageTitle}>Hasta Kayitlari</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <input style={Object.assign({}, S.input, { flex: 1 })} placeholder="Ad, TC veya telefon ile ara..." value={search} onChange={function(e) { setSearch(e.target.value); }} />
        <button style={btn("primary")} onClick={openYeni}>+ Yeni Hasta</button>
      </div>
      <div style={S.card}>
        <Table
          cols={["Ad Soyad", "TC", "Telefon", "Kan", "Kayit Tarihi", "Islemler"]}
          rows={filtered.map(function(p) { return [
            <strong>{p.ad}</strong>,
            <span style={{ fontFamily: "monospace", fontSize: 13 }}>{p.tc}</span>,
            p.tel,
            <span style={badge("blue")}>{p.kan}</span>,
            fmt(p.kayit),
            <div style={{ display: "flex", gap: 6 }}>
              <button style={btn("secondary", "sm")} onClick={function() { openDetay(p); }}>Detay</button>
              <button style={btn("secondary", "sm")} onClick={function() { openDuzenle(p); }}>Duzenle</button>
              <button style={btn("danger", "sm")} onClick={function() { sil(p.id); }}>Sil</button>
            </div>
          ]; })}
          emptyMsg="Hasta bulunamadi."
        />
      </div>

      {detay && detayHasta && (
        <Modal onClose={function() { setDetay(null); setTedaviForm(null); setTedaviDetay(null); setAnamnezDuzenle(false); }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 3 }}>{detayHasta.ad}</div>
              <span style={{ fontSize: 12, color: G.muted }}>{detayHasta.tel} - {detayHasta.kan} - {detayHasta.cinsiyet}</span>
            </div>
            <button style={btn("secondary", "sm")} onClick={function() { setDetay(null); setTedaviForm(null); setTedaviDetay(null); setAnamnezDuzenle(false); }}>Kapat</button>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["anamnez", "tedaviler"].map(function(t) {
              return (
                <button key={t} onClick={function() { setDetayTab(t); setTedaviForm(null); setTedaviDetay(null); setAnamnezDuzenle(false); }}
                  style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: detayTab === t ? G.primary : G.primaryLight, color: detayTab === t ? "#fff" : G.primary }}>
                  {t === "anamnez" ? "Anamnez" : "Tedaviler (" + (detayHasta.tedaviler || []).length + ")"}
                </button>
              );
            })}
          </div>

          {detayTab === "anamnez" && (
            <div>
              {anamnezDuzenle ? (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Anamnezi Duzenle</div>
                  <div style={S.formGrid}>
                    <div style={S.fg}><label style={S.label}>Sigara</label><select style={S.select} value={anamnezForm.sigara} onChange={function(e) { setAnamnezForm(function(f) { return Object.assign({}, f, { sigara: e.target.value }); }); }}><option>Hayir</option><option>Evet</option></select></div>
                    <div style={S.fg}><label style={S.label}>Alkol</label><select style={S.select} value={anamnezForm.alkol} onChange={function(e) { setAnamnezForm(function(f) { return Object.assign({}, f, { alkol: e.target.value }); }); }}><option>Hayir</option><option>Evet</option></select></div>
                    <div style={S.fg}><label style={S.label}>Alerji</label><input style={S.input} value={anamnezForm.alerji} onChange={function(e) { setAnamnezForm(function(f) { return Object.assign({}, f, { alerji: e.target.value }); }); }} /></div>
                    <div style={S.fg}><label style={S.label}>Kullandigi Ilaclar</label><input style={S.input} value={anamnezForm.ilac} onChange={function(e) { setAnamnezForm(function(f) { return Object.assign({}, f, { ilac: e.target.value }); }); }} /></div>
                    <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}><label style={S.label}>Kronik Hastaliklar</label><input style={S.input} value={anamnezForm.hastalik} onChange={function(e) { setAnamnezForm(function(f) { return Object.assign({}, f, { hastalik: e.target.value }); }); }} /></div>
                    <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}><label style={S.label}>Notlar</label><textarea style={S.textarea} value={anamnezForm.notlar} onChange={function(e) { setAnamnezForm(function(f) { return Object.assign({}, f, { notlar: e.target.value }); }); }} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
                    <button style={btn("secondary", "sm")} onClick={function() { setAnamnezDuzenle(false); }}>Iptal</button>
                    <button style={Object.assign({}, btn("primary", "sm"), { opacity: kayit ? 0.7 : 1 })} onClick={saveAnamnez} disabled={kayit}>{kayit ? "Kaydediliyor..." : "Kaydet"}</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button style={btn("primary", "sm")} onClick={function() { setAnamnezForm(Object.assign({ sigara: "Hayir", alkol: "Hayir", alerji: "", ilac: "", hastalik: "", notlar: "" }, detayHasta.anamnez || {})); setAnamnezDuzenle(true); }}>Anamnezi Duzenle</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[["Sigara", "sigara"], ["Alkol", "alkol"], ["Alerji", "alerji"], ["Kullandigi Ilaclar", "ilac"], ["Kronik Hastaliklar", "hastalik"]].map(function(item) {
                      return (
                        <div key={item[1]}>
                          <div style={{ fontSize: 12, color: G.muted, marginBottom: 3 }}>{item[0]}</div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{(detayHasta.anamnez || {})[item[1]] || "-"}</div>
                        </div>
                      );
                    })}
                    <div style={{ gridColumn: "1/-1" }}>
                      <div style={{ fontSize: 12, color: G.muted, marginBottom: 3 }}>Notlar</div>
                      <div style={{ fontSize: 14 }}>{(detayHasta.anamnez || {}).notlar || "-"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {detayTab === "tedaviler" && (
            <div>
              {tedaviDetay && (
                <div style={{ background: G.bg, borderRadius: 10, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{tedaviDetay.tedavi}</div>
                    <button style={btn("secondary", "sm")} onClick={function() { setTedaviDetay(null); }}>Kapat</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    {[["Baslangic Tarihi", fmt(tedaviDetay.tarih)], ["Dis No", tedaviDetay.dis || "-"], ["Hekim", tedaviDetay.hekim || "-"]].map(function(item) {
                      return (
                        <div key={item[0]}>
                          <div style={{ fontSize: 11, color: G.muted, marginBottom: 2 }}>{item[0]}</div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{item[1]}</div>
                        </div>
                      );
                    })}
                    {tedaviDetay.notlar && (
                      <div style={{ gridColumn: "1/-1" }}>
                        <div style={{ fontSize: 11, color: G.muted, marginBottom: 2 }}>Notlar</div>
                        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{tedaviDetay.notlar}</div>
                      </div>
                    )}
                    {tedaviDetay.fotografUrl && (
                      <div style={{ gridColumn: "1/-1" }}>
                        <div style={{ fontSize: 11, color: G.muted, marginBottom: 6 }}>Fotograf</div>
                        <img src={tedaviDetay.fotografUrl} alt="Tedavi fotografi" style={{ width: "100%", borderRadius: 8, maxHeight: 300, objectFit: "cover", cursor: "pointer" }} onClick={function() { window.open(tedaviDetay.fotografUrl, "_blank"); }} />
                      </div>
                    )}
                  </div>
                  <div style={{ borderTop: "1px solid #E5E0D8", paddingTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: G.muted, marginBottom: 10 }}>Durumu Guncelle</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <div style={S.fg}>
                        <label style={S.label}>Durum</label>
                        <select style={S.select} value={tedaviDetay.durum} onChange={function(e) { setTedaviDetay(function(d) { return Object.assign({}, d, { durum: e.target.value }); }); }}>
                          <option>Tamamlandi</option><option>Devam Ediyor</option><option>Planlandi</option>
                        </select>
                      </div>
                      <div style={S.fg}>
                        <label style={S.label}>Tamamlanma Tarihi</label>
                        <input type="date" style={S.input} value={tedaviDetay.tamamTarih || ""} onChange={function(e) { setTedaviDetay(function(d) { return Object.assign({}, d, { tamamTarih: e.target.value }); }); }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button style={btn("primary", "sm")} onClick={guncelleTedavi}>Kaydet</button>
                    </div>
                  </div>
                </div>
              )}

              {tedaviForm ? (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Yeni Tedavi Ekle</div>
                  <div style={Object.assign({}, S.formGrid, { marginBottom: 12 })}>
                    <div style={S.fg}><label style={S.label}>Tarih</label><input type="date" style={S.input} value={tedaviForm.tarih} onChange={function(e) { setTedaviForm(function(f) { return Object.assign({}, f, { tarih: e.target.value }); }); }} /></div>
                    <div style={S.fg}><label style={S.label}>Dis No</label><input style={S.input} placeholder="36" value={tedaviForm.dis} onChange={function(e) { setTedaviForm(function(f) { return Object.assign({}, f, { dis: e.target.value }); }); }} /></div>
                    <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}><label style={S.label}>Tedavi Turu *</label><input style={S.input} placeholder="Dolgu, kanal, cekme..." value={tedaviForm.tedavi} onChange={function(e) { setTedaviForm(function(f) { return Object.assign({}, f, { tedavi: e.target.value }); }); }} /></div>
                    <div style={S.fg}><label style={S.label}>Hekim</label><input style={S.input} placeholder="Dr. ..." value={tedaviForm.hekim} onChange={function(e) { setTedaviForm(function(f) { return Object.assign({}, f, { hekim: e.target.value }); }); }} /></div>
                    <div style={S.fg}><label style={S.label}>Durum</label>
                      <select style={S.select} value={tedaviForm.durum} onChange={function(e) { setTedaviForm(function(f) { return Object.assign({}, f, { durum: e.target.value }); }); }}>
                        <option>Tamamlandi</option><option>Devam Ediyor</option><option>Planlandi</option>
                      </select>
                    </div>
                    <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}><label style={S.label}>Notlar</label><textarea style={S.textarea} placeholder="Tedavi hakkinda notlar..." value={tedaviForm.notlar} onChange={function(e) { setTedaviForm(function(f) { return Object.assign({}, f, { notlar: e.target.value }); }); }} /></div>
                    <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}>
                      <label style={S.label}>Fotograf Ekle (istege bagli)</label>
                      <input type="file" accept="image/*" style={Object.assign({}, S.input, { padding: "6px 13px" })} onChange={function(e) { setTedaviForm(function(f) { return Object.assign({}, f, { fotografDosya: e.target.files[0] }); }); }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={btn("secondary", "sm")} onClick={function() { setTedaviForm(null); }}>Iptal</button>
                    <button style={btn("primary", "sm")} onClick={saveTedavi}>Kaydet</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button style={btn("primary", "sm")} onClick={function() { setTedaviDetay(null); setTedaviForm({ tarih: "", tedavi: "", dis: "", hekim: "", notlar: "", durum: "Tamamlandi", fotografDosya: null }); }}>+ Tedavi Ekle</button>
                  </div>
                  {(detayHasta.tedaviler || []).length === 0
                    ? <p style={{ fontSize: 13, color: G.muted }}>Henuz tedavi kaydi yok.</p>
                    : <Table
                        cols={["Tarih", "Tedavi", "Dis", "Durum", "Detay", "Sil"]}
                        rows={(detayHasta.tedaviler || []).map(function(t) { return [
                          fmt(t.tarih), t.tedavi, t.dis || "-",
                          <span style={badge(t.durum === "Tamamlandi" ? "green" : t.durum === "Devam Ediyor" ? "yellow" : "blue")}>{t.durum}</span>,
                          <button style={btn("secondary", "sm")} onClick={function() { setTedaviDetay(t); }}>Goruntule</button>,
                          <button style={btn("danger", "sm")} onClick={function() { silTedavi(t.id); }}>Sil</button>
                        ]; })}
                      />
                  }
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {modal && form && (
        <Modal onClose={function() { setModal(null); }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 18 }}>
            {modal === "yeni" ? "Yeni Hasta Ekle" : "Hasta Duzenle"}
          </div>
          <div style={S.formGrid}>
            <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}><label style={S.label}>Ad Soyad *</label><input style={S.input} value={form.ad} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { ad: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>TC Kimlik No *</label><input style={S.input} maxLength={11} value={form.tc} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { tc: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>Telefon</label><input style={S.input} value={form.tel} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { tel: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>Dogum Tarihi</label><input type="date" style={S.input} value={form.dogum} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { dogum: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>Cinsiyet</label>
              <select style={S.select} value={form.cinsiyet} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { cinsiyet: e.target.value }); }); }}>
                <option>Kadin</option><option>Erkek</option><option>Diger</option>
              </select>
            </div>
            <div style={S.fg}><label style={S.label}>Kan Grubu</label>
              <select style={S.select} value={form.kan} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { kan: e.target.value }); }); }}>
                {["A+","A-","B+","B-","AB+","AB-","0+","0-"].map(function(k) { return <option key={k}>{k}</option>; })}
              </select>
            </div>
            <div style={S.fg}><label style={S.label}>Kayit Tarihi</label><input type="date" style={S.input} value={form.kayit} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { kayit: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>Adres</label><input style={S.input} value={form.adres} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { adres: e.target.value }); }); }} /></div>
            <div style={{ gridColumn: "1/-1", borderTop: "1px solid #E5E0D8", paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 12 }}>Anamnez</div>
              <div style={S.formGrid}>
                <div style={S.fg}><label style={S.label}>Sigara</label><select style={S.select} value={form.anamnez.sigara} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { anamnez: Object.assign({}, f.anamnez, { sigara: e.target.value }) }); }); }}><option>Hayir</option><option>Evet</option></select></div>
                <div style={S.fg}><label style={S.label}>Alkol</label><select style={S.select} value={form.anamnez.alkol} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { anamnez: Object.assign({}, f.anamnez, { alkol: e.target.value }) }); }); }}><option>Hayir</option><option>Evet</option></select></div>
                <div style={S.fg}><label style={S.label}>Alerji</label><input style={S.input} placeholder="Yok / Penisilin..." value={form.anamnez.alerji} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { anamnez: Object.assign({}, f.anamnez, { alerji: e.target.value }) }); }); }} /></div>
                <div style={S.fg}><label style={S.label}>Kullandigi Ilaclar</label><input style={S.input} value={form.anamnez.ilac} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { anamnez: Object.assign({}, f.anamnez, { ilac: e.target.value }) }); }); }} /></div>
                <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}><label style={S.label}>Kronik Hastaliklar</label><input style={S.input} value={form.anamnez.hastalik} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { anamnez: Object.assign({}, f.anamnez, { hastalik: e.target.value }) }); }); }} /></div>
                <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}><label style={S.label}>Notlar</label><textarea style={S.textarea} value={form.anamnez.notlar} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { anamnez: Object.assign({}, f.anamnez, { notlar: e.target.value }) }); }); }} /></div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button style={btn("secondary")} onClick={function() { setModal(null); }}>Iptal</button>
            <button style={Object.assign({}, btn("primary"), { opacity: kayit ? 0.7 : 1 })} onClick={save} disabled={kayit}>
              {kayit ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Randevular({ appointments, setAppointments, patients }) {
  var [modal, setModal] = useState(false);
  var [form, setForm] = useState({ hastaId: "", hasta_ad: "", tarih: today(), saat: "09:00", tedavi: "", hekim: "", durum: "Bekliyor" });
  var [kayit, setKayit] = useState(false);

  var sorted = [...appointments].sort(function(a, b) { return a.tarih.localeCompare(b.tarih) || a.saat.localeCompare(b.saat); });

  async function save() {
    var hasta = patients.find(function(p) { return p.id === form.hastaId; });
    if (!hasta) return alert("Lutfen hasta secin.");
    if (!form.tarih || !form.saat) return alert("Tarih ve saat zorunludur.");
    setKayit(true);
    try {
      var result = await db.insert("randevular", { hasta_id: hasta.id, hasta_ad: hasta.ad, tarih: form.tarih, saat: form.saat, tedavi: form.tedavi, hekim: form.hekim, durum: form.durum });
      if (result && result[0]) setAppointments(function(as) { return [...as, result[0]]; });
      setModal(false);
    } catch(e) { alert("Kayit hatasi."); }
    setKayit(false);
  }

  async function sil(id) {
    if (!window.confirm("Randevu silinsin mi?")) return;
    await db.delete("randevular", id);
    setAppointments(function(as) { return as.filter(function(a) { return a.id !== id; }); });
  }

  async function durumGuncelle(id, durum) {
    await db.update("randevular", id, { durum: durum });
    setAppointments(function(as) { return as.map(function(a) { return a.id === id ? Object.assign({}, a, { durum: durum }) : a; }); });
  }

  return (
    <div>
      <div style={S.pageTitle}>Randevular</div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button style={btn("primary")} onClick={function() { setModal(true); }}>+ Yeni Randevu</button>
      </div>
      <div style={S.card}>
        <Table
          cols={["Tarih", "Saat", "Hasta", "Tedavi", "Hekim", "Durum", "Islem"]}
          rows={sorted.map(function(a) { return [
            fmt(a.tarih),
            <strong>{a.saat}</strong>,
            a.hasta_ad, a.tedavi, a.hekim,
            <select value={a.durum} onChange={function(e) { durumGuncelle(a.id, e.target.value); }}
              style={Object.assign({}, S.select, { width: "auto", padding: "3px 8px", fontSize: 12 })}>
              {["Bekliyor", "Onaylandi", "Tamamlandi", "Iptal"].map(function(d) { return <option key={d}>{d}</option>; })}
            </select>,
            <button style={btn("danger", "sm")} onClick={function() { sil(a.id); }}>Sil</button>
          ]; })}
          emptyMsg="Randevu bulunamadi."
        />
      </div>
      {modal && (
        <Modal onClose={function() { setModal(false); }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 18 }}>Yeni Randevu</div>
          <div style={S.formGrid}>
            <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}>
              <label style={S.label}>Hasta *</label>
              <select style={S.select} value={form.hastaId} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { hastaId: e.target.value }); }); }}>
                <option value="">-- Secin --</option>
                {patients.map(function(p) { return <option key={p.id} value={p.id}>{p.ad}</option>; })}
              </select>
            </div>
            <div style={S.fg}><label style={S.label}>Tarih *</label><input type="date" style={S.input} value={form.tarih} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { tarih: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>Saat *</label><input type="time" style={S.input} value={form.saat} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { saat: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>Tedavi</label><input style={S.input} placeholder="Kontrol, dolgu..." value={form.tedavi} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { tedavi: e.target.value }); }); }} /></div>
            <div style={S.fg}><label style={S.label}>Hekim</label><input style={S.input} placeholder="Dr. ..." value={form.hekim} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { hekim: e.target.value }); }); }} /></div>
            <div style={Object.assign({}, S.fg, { gridColumn: "1/-1" })}>
              <label style={S.label}>Durum</label>
              <select style={S.select} value={form.durum} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { durum: e.target.value }); }); }}>
                <option>Bekliyor</option><option>Onaylandi</option><option>Iptal</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button style={btn("secondary")} onClick={function() { setModal(false); }}>Iptal</button>
            <button style={Object.assign({}, btn("primary"), { opacity: kayit ? 0.7 : 1 })} onClick={save} disabled={kayit}>
              {kayit ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function App() {
  var [page, setPage] = useState("dashboard");
  var [patients, setPatients] = useState([]);
  var [appointments, setAppointments] = useState([]);
  var [yukleniyor, setYukleniyor] = useState(true);
  var [acikHasta, setAcikHasta] = useState(null);

  useEffect(function() {
    async function yukle() {
      try {
        var results = await Promise.all([db.get("hastalar"), db.get("randevular")]);
        setPatients(Array.isArray(results[0]) ? results[0] : []);
        setAppointments(Array.isArray(results[1]) ? results[1] : []);
      } catch(e) {}
      setYukleniyor(false);
    }
    yukle();
  }, []);

  var nav = [
    { id: "dashboard", label: "Genel Bakis" },
    { id: "hastalar", label: "Hastalar" },
    { id: "randevular", label: "Randevular" },
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
            {nav.map(function(n) { return <NavItem key={n.id} label={n.label} active={page === n.id} onClick={function() { setPage(n.id); }} />; })}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>v2.0</div>
          </div>
        </aside>
        <main style={S.main}>
          {yukleniyor ? <Yukleniyor /> : (
            <>
              {page === "dashboard" && <Dashboard patients={patients} appointments={appointments} onHastaDetay={function(id) { setAcikHasta(id); setPage("hastalar"); }} />}
              {page === "hastalar" && <Hastalar patients={patients} setPatients={setPatients} acikHastaId={acikHasta} onAcikHastaClear={function() { setAcikHasta(null); }} />}
              {page === "randevular" && <Randevular appointments={appointments} setAppointments={setAppointments} patients={patients} />}
            </>
          )}
        </main>
      </div>
    </>
  );
}
