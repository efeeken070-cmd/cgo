import { useState, useEffect, useRef } from "react";

// ================= ikon seti (el yapımı SVG'ler, emoji yok) =================
const CIZIMLER = {
  silah: <><path d="M12 2 L14 4 L14 13 L12 15.2 L10 13 L10 4 Z" /><path d="M7.5 15 H16.5" /><path d="M12 15.2 V19" /><circle cx="12" cy="20.6" r="1.3" /></>,
  kalkan: <><path d="M12 2.5 L19.5 5.5 V11.5 C19.5 16.5 12 21.5 12 21.5 C12 21.5 4.5 16.5 4.5 11.5 V5.5 Z" /><path d="M12 6 V17.5" opacity=".7" /><path d="M8 9.5 H16" opacity=".7" /></>,
  migfer: <><path d="M5.5 12.5 a6.5 6.5 0 0 1 13 0 V17.5 H14.8 V14 H9.2 V17.5 H5.5 Z" /><path d="M12 2.8 V6" /><path d="M9.2 17.5 v2.3 M14.8 17.5 v2.3" opacity=".7" /></>,
  zirh: <><path d="M7 4 L12 6.5 L17 4 L19.5 8 L17 10 V19.5 H7 V10 L4.5 8 Z" /><path d="M12 6.5 V19.5" opacity=".6" /><path d="M9.2 13.5 H14.8" opacity=".5" /></>,
  kupe: <><path d="M9.2 4.2 a3.2 3.2 0 0 1 5.9 1.6 c0 1.6 -1 2.4 -2.1 3.1" /><path d="M13 9 L15.6 12.6 L13 17.2 L10.4 12.6 Z" /></>,
  yuzuk: <><circle cx="12" cy="14.2" r="5.4" /><path d="M9.6 7.6 L12 4.6 L14.4 7.6 L12 9.9 Z" /></>,
  eser: <><path d="M12 2.5 L17 9 L12 21.5 L7 9 Z" /><path d="M7 9 H17" opacity=".7" /><path d="M12 2.5 V21.5" opacity=".4" /></>,
  kolye: <><path d="M5 4.5 C5 10.5 8.6 13 12 13 C15.4 13 19 10.5 19 4.5" /><path d="M12 13 V14" /><circle cx="12" cy="16.8" r="2.8" /></>,
  kemer: <><rect x="3.5" y="9.5" width="17" height="5" rx="1.2" /><rect x="9.4" y="7.8" width="5.2" height="8.4" rx="1" /><path d="M12 10.5 v3" /></>,
  eldiven: <><path d="M8.5 4 H14.5 V10 L17.6 12.4 L15.2 15.4 L14.5 14.4 V16.4 A3.4 3.4 0 0 1 8.5 16.4 Z" /><path d="M8.5 6.8 H14.5" opacity=".6" /></>,
  bot: <><path d="M8 3.5 H13 V12.3 H15.6 L18.6 17.6 H8 Z" /><path d="M6.8 20.2 H19.2" /><path d="M9.6 6 h2 M9.6 8.6 h2" opacity=".6" /></>,
  kalp: <><path d="M12 20 C4.5 14 4.8 7.2 8.8 6 C10.8 5.4 12 7.4 12 7.4 C12 7.4 13.2 5.4 15.2 6 C19.2 7.2 19.5 14 12 20 Z" /></>,
  iksir: <><path d="M10 3 H14" /><path d="M11 3.2 V8 L7.6 13 a5 5 0 1 0 8.8 0 L13 8 V3.2" /><path d="M8.4 14.6 H15.6" opacity=".7" /><circle cx="11" cy="17" r=".9" opacity=".7" /></>,
  diger: <><path d="M9 6.6 C9 4.2 15 4.2 15 6.6 L15.4 8.1 C18.9 9.6 19.4 19.5 12 19.5 C4.6 19.5 5.1 9.6 8.6 8.1 Z" /><path d="M8.6 8.1 H15.4" opacity=".7" /></>,
  para: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.6" opacity=".55" /><path d="M12 4 v2 M12 18 v2 M4 12 h2 M18 12 h2" opacity=".5" /></>,
  kure: <><circle cx="12" cy="12" r="7" /><path d="M7.8 9.2 a5.6 5.6 0 0 1 8.4 0" opacity=".55" /><circle cx="9.6" cy="9.6" r="1.1" opacity=".8" /></>,
  simsek: <><path d="M13 2.5 L5.5 13 H11 L9.5 21.5 L18.5 10 H12.8 Z" /></>,
  ruzgar: <><path d="M3.5 8 H13.8 a2.5 2.5 0 1 0 -2.4 -3.1" /><path d="M3.5 12.5 H17.8 a2.5 2.5 0 1 1 -2.4 3.1" /><path d="M3.5 17 H9.8" /></>,
  pati: <><circle cx="7.8" cy="8" r="1.6" /><circle cx="12" cy="6.6" r="1.6" /><circle cx="16.2" cy="8" r="1.6" /><path d="M12 11 C15.6 11 17.6 14.1 16.6 16.6 C15.9 18.4 13.9 18.9 12 18.9 C10.1 18.9 8.1 18.4 7.4 16.6 C6.4 14.1 8.4 11 12 11 Z" /></>,
  yonca: <><circle cx="9.1" cy="8.9" r="3" /><circle cx="14.9" cy="8.9" r="3" /><circle cx="12" cy="13.6" r="3" /><path d="M12 16.6 C12 19 13.1 20.4 14.6 21" /></>,
  hayalet: <><path d="M6 20.5 V10 a6 6 0 0 1 12 0 V20.5 L15.6 18.7 L13.2 20.5 L10.8 18.7 L8.4 20.5 Z" /><circle cx="9.8" cy="10.6" r=".9" opacity=".9" /><circle cx="14.2" cy="10.6" r=".9" opacity=".9" /></>,
  yildiz: <><path d="M12 2.8 L14.6 8.6 L20.8 9.3 L16.2 13.5 L17.5 19.7 L12 16.5 L6.5 19.7 L7.8 13.5 L3.2 9.3 L9.4 8.6 Z" /></>,
  kitap: <><path d="M12 6 C9.5 4.5 6.5 4.4 4.5 5.4 V18.5 C6.5 17.5 9.5 17.6 12 19 C14.5 17.6 17.5 17.5 19.5 18.5 V5.4 C17.5 4.4 14.5 4.5 12 6 Z" /><path d="M12 6 V19" opacity=".6" /></>,
  cekic: <><rect x="5.5" y="4" width="11" height="5.4" rx="1.2" /><path d="M12 9.4 V20" strokeWidth="2.6" /></>,
  kilit: <><rect x="6.5" y="10.5" width="11" height="9" rx="1.6" /><path d="M9 10.5 V8 a3 3 0 0 1 6 0 V10.5" /><circle cx="12" cy="14.6" r="1.1" /></>,
  firca: <><path d="M17.3 3.6 L20.4 6.7 L11 16.1 L7.9 13 Z" /><path d="M7.9 13 C5.4 13.5 4.4 15.6 4.4 18.7 C7 19 9.6 18.2 10.6 15.7" /></>,
  carki: <><circle cx="12" cy="12" r="3.1" /><path d="M12 3.6 v2.5 M12 17.9 v2.5 M3.6 12 h2.5 M17.9 12 h2.5 M6.1 6.1 l1.8 1.8 M16.1 16.1 l1.8 1.8 M17.9 6.1 l-1.8 1.8 M7.9 16.1 l-1.8 1.8" /></>,
  cop: <><path d="M5.5 6.5 H18.5" /><path d="M9.5 6.5 V4.4 H14.5 V6.5" /><path d="M7.4 6.5 L8.4 20 H15.6 L16.6 6.5" /><path d="M10.4 10 v6.4 M13.6 10 v6.4" opacity=".7" /></>,
  kalem: <><path d="M4.5 19.5 L6 15 L16.5 4.5 L19.5 7.5 L9 18 Z" /><path d="M14.8 6.2 L17.8 9.2" opacity=".7" /></>,
  parilti: <><path d="M9 3.5 L10.6 7.9 L15 9.5 L10.6 11.1 L9 15.5 L7.4 11.1 L3 9.5 L7.4 7.9 Z" /><path d="M17 12.5 L18 15.2 L20.7 16.2 L18 17.2 L17 20 L16 17.2 L13.3 16.2 L16 15.2 Z" /></>,
  kum: <><path d="M7 4 H17 L12 11.6 Z" /><path d="M7 20 H17 L12 12.4 Z" /><path d="M12 8.4 v1.4 M12 14.8 v2.6" opacity=".7" /></>,
  yenile: <><path d="M19.5 12 a7.5 7.5 0 1 1 -2.2 -5.3" /><path d="M19.5 3.8 V8.2 H15.1" /></>,
  zar: <><rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.4" /><path d="M8.6 8.6 h.01 M15.4 8.6 h.01 M12 12 h.01 M8.6 15.4 h.01 M15.4 15.4 h.01" strokeWidth="2.6" /></>,
  indir: <><path d="M12 3.5 V14.5" /><path d="M7.5 10.5 L12 15 L16.5 10.5" /><path d="M4.5 19.5 H19.5" /></>,
  yukle: <><path d="M12 15 V4" /><path d="M7.5 8.5 L12 4 L16.5 8.5" /><path d="M4.5 19.5 H19.5" /></>,
  kopya: <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M5 15.5 V6.5 a2 2 0 0 1 2 -2 h9" /></>,
};
const Ikon = ({ ad, boy = 20, renk = "currentColor", kalinlik = 1.8, stil }) => (
  <svg width={boy} height={boy} viewBox="0 0 24 24" fill="none" stroke={renk} strokeWidth={kalinlik} strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none", flexShrink: 0, filter: "drop-shadow(0 1px 2px #0009)", ...stil }}>
    {CIZIMLER[ad] || CIZIMLER.diger}
  </svg>
);

// ================= sabitler =================
const TIPLER = ["Silah", "Kalkan", "Miğfer", "Zırh", "Küpe", "Yüzük", "Eser", "Kolye", "Kemer", "Eldiven", "Bot", "Kalp", "İksir", "Diğer"];
const TIP_IKON = { Silah: "silah", Kalkan: "kalkan", "Miğfer": "migfer", "Zırh": "zirh", "Küpe": "kupe", "Yüzük": "yuzuk", Eser: "eser", Kolye: "kolye", Kemer: "kemer", Eldiven: "eldiven", Bot: "bot", Kalp: "kalp", "İksir": "iksir", "Diğer": "diger" };
const NADIRLIK = [
  { ad: "Yaygın", renk: "#b6b1c9" },
  { ad: "Sıradışı", renk: "#58e08a" },
  { ad: "Nadir", renk: "#5ab8ff" },
  { ad: "Epik", renk: "#c77bff" },
  { ad: "Efsanevi", renk: "#ffa53d" },
  { ad: "Immortal", renk: "#ff4655" },
];
const rc = (ad) => (NADIRLIK.find((r) => r.ad === ad) || NADIRLIK[0]).renk;
const nadirSinif = (ad) => (ad === "Epik" ? "epik" : ad === "Efsanevi" ? "efsanevi" : ad === "Immortal" ? "immortal" : "");

const STATLAR = [
  { key: "str", ad: "STR", ikon: "silah", not: "isabet bonusu" },
  { key: "dex", ad: "DEX", ikon: "ruzgar", not: "kaçınma bonusu" },
  { key: "vit", ad: "VIT", ikon: "kalp", not: "1 puan = +10 Can" },
  { key: "int", ad: "INT", ikon: "kure", not: "1 puan = +10 Mana" },
  { key: "end", ad: "END", ikon: "simsek", not: "1 puan = +10 AP" },
  { key: "agi", ad: "AGI", ikon: "pati", not: "çeviklik" },
  { key: "luck", ad: "LUCK", ikon: "yonca", not: "gizli şans" },
  { key: "zirh", ad: "Zırh", ikon: "kalkan", not: "gelen hasarı kısar" },
  { key: "kacinma", ad: "Kaçınma", ikon: "hayalet", not: "hasardan kaçınma" },
];
const bosStatlar = () => Object.fromEntries(STATLAR.map((s) => [s.key, 0]));

// çember dizilimi — saat yönünde, tepede miğfer, en altta bot, ortada kalp
const CEMBER = ["migfer", "kupe1", "kolye", "yuzuk1", "eser1", "anaSilah", "eldiven", "bot", "kemer", "altSilah", "eser2", "yuzuk2", "zirh", "kupe2"];
const SLOTLAR = [...CEMBER, "kalp"];
const SLOT_AD = { migfer: "Miğfer", zirh: "Zırh", kupe1: "Küpe I", kupe2: "Küpe II", yuzuk1: "Yüzük I", yuzuk2: "Yüzük II", eser1: "Eser I", eser2: "Eser II", bot: "Bot", eldiven: "Eldiven", kemer: "Kemer", kolye: "Kolye", anaSilah: "Ana Silah", altSilah: "Alt Silah", kalp: "Kalp" };
const SLOT_IKON = { migfer: "migfer", zirh: "zirh", kupe1: "kupe", kupe2: "kupe", yuzuk1: "yuzuk", yuzuk2: "yuzuk", eser1: "eser", eser2: "eser", bot: "bot", eldiven: "eldiven", kemer: "kemer", kolye: "kolye", anaSilah: "silah", altSilah: "kalkan", kalp: "kalp" };
const SLOT_TIP = {
  migfer: ["Miğfer"], zirh: ["Zırh"], kupe1: ["Küpe"], kupe2: ["Küpe"], yuzuk1: ["Yüzük"], yuzuk2: ["Yüzük"],
  eser1: ["Eser"], eser2: ["Eser"], bot: ["Bot"], eldiven: ["Eldiven"], kemer: ["Kemer"], kolye: ["Kolye"],
  anaSilah: ["Silah"], altSilah: ["Silah", "Kalkan"], kalp: ["Kalp"],
};
const CBOY = 316, SLOT_BOY = 52, YARICAP = (CBOY - SLOT_BOY) / 2 - 2;
const SLOT_POS = {};
CEMBER.forEach((s, i) => {
  const aci = (i * 2 * Math.PI) / CEMBER.length;
  SLOT_POS[s] = { left: CBOY / 2 + YARICAP * Math.sin(aci) - SLOT_BOY / 2, top: CBOY / 2 - YARICAP * Math.cos(aci) - SLOT_BOY / 2 };
});
SLOT_POS.kalp = { left: CBOY / 2 - 30, top: CBOY / 2 - 30 };

const CEP_RENK = ["#ff5f6d", "#58e08a", "#5ab8ff", "#c77bff"];
const KIMLIK_PARCA = [
  { key: "irk", ad: "Irk" },
  { key: "sinif", ad: "Sınıf" },
  { key: "arkaplan", ad: "Arkaplan" },
];

// tema
const T = {
  altin: "#f0c75e", teal: "#4ed8c3", gul: "#ff6b8f", mor: "#a78bfa", amber: "#e8a852",
  metin: "#e6e0f2", soluk: "#8f86ad", cizgi: "#2c2440", koyu: "#0e0a1a", panelBg: "linear-gradient(180deg, #151024f4, #0d0918f4)",
};

const STORAGE_KEY = "canavar-gunlugu-v5";
const V4_KEY = "canavar-gunlugu-v4";
const uid = () => Math.random().toString(36).slice(2, 9);

const bosSlotlar = () => Object.fromEntries(SLOTLAR.map((s) => [s, null]));
const bosKimlik = () => Object.fromEntries(KIMLIK_PARCA.map((p) => [p.key, { ad: "", statlar: {} }]));
const yeniKarakter = (ad) => ({
  id: uid(), ad, seviye: 1,
  xp: { mevcut: 0, hedef: 100 },
  can: { mevcut: 100, temel: 100 },
  mana: { mevcut: 50, temel: 50 },
  ap: { mevcut: 10, temel: 10, dolum: 2 },
  statlar: bosStatlar(), kimlik: bosKimlik(), puan: { toplam: 0, dagitim: {}, seviyeBasi: 3 },
  beceriler: [], yetenekler: [], etkiler: [], boostlar: [], notlar: "", altin: 0, slotFiyat: 100,
  slotlar: bosSlotlar(), canta: Array(24).fill(null), cepler: Array(4).fill(null),
});
const tamamla = (k) => {
  const y = yeniKarakter(k.ad || "İsimsiz");
  return {
    ...y, ...k,
    xp: { ...y.xp, ...k.xp }, can: { ...y.can, ...k.can }, mana: { ...y.mana, ...k.mana }, ap: { ...y.ap, ...k.ap },
    statlar: { ...bosStatlar(), ...k.statlar }, kimlik: { ...bosKimlik(), ...k.kimlik },
    puan: { toplam: (k.puan && k.puan.toplam) || 0, dagitim: (k.puan && k.puan.dagitim) || {}, seviyeBasi: (k.puan && k.puan.seviyeBasi !== undefined) ? k.puan.seviyeBasi : 3 },
    beceriler: k.beceriler || [], yetenekler: (k.yetenekler || []).map((y) => ({ cd: 0, kalan: 0, not: "", boost: { tur: "sabit", statlar: {} }, ...y })), etkiler: k.etkiler || [], boostlar: k.boostlar || [],
    notlar: k.notlar || "", altin: k.altin || 0, slotFiyat: k.slotFiyat || 100,
    slotlar: { ...bosSlotlar(), ...k.slotlar },
    canta: Array.isArray(k.canta) && k.canta.length ? k.canta : Array(24).fill(null),
    cepler: Array.isArray(k.cepler) && k.cepler.length === 4 ? k.cepler : Array(4).fill(null),
  };
};
const bosStatForm = () => Object.fromEntries(STATLAR.map((s) => [s.key, ""]));
const bosForm = () => ({ ad: "", tip: "Silah", nadirlik: "Yaygın", deger: "", aciklama: "", img: null, zar: "", statlar: bosStatForm() });
const bosYetForm = () => ({ ad: "", not: "", ap: "", can: "", mana: "", cd: "", boostTur: "sabit", boostlar: bosStatForm() });

// görseli küçült (saydamlık korunur)
const gorselKucult = (file) =>
  new Promise((cozul, hata) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => {
      const img = new Image();
      img.onload = () => {
        const B = 112;
        const c = document.createElement("canvas");
        c.width = B; c.height = B;
        const ctx = c.getContext("2d");
        const oran = Math.min(B / img.width, B / img.height);
        ctx.drawImage(img, (B - img.width * oran) / 2, (B - img.height * oran) / 2, img.width * oran, img.height * oran);
        cozul(c.toDataURL("image/png"));
      };
      img.onerror = hata;
      img.src = okuyucu.result;
    };
    okuyucu.onerror = hata;
    okuyucu.readAsDataURL(file);
  });

// ================= küçük bileşenler =================
const ItemGorsel = ({ item, boy = 40 }) =>
  item.img
    ? <img src={item.img} alt={item.ad} draggable={false} style={{ width: boy, height: boy, objectFit: "contain", pointerEvents: "none", filter: "drop-shadow(0 2px 3px #000a)" }} />
    : <Ikon ad={TIP_IKON[item.tip] || "diger"} boy={boy * 0.78} renk={rc(item.nadirlik)} />;

function Panel({ renk, ikon, baslik, ekstra, children, style }) {
  return (
    <section style={{ position: "relative", width: "100%", padding: 1.5, borderRadius: 16, background: `linear-gradient(155deg, ${renk}88, #ffffff10 32%, ${renk}22 75%, ${renk}66)`, boxShadow: `0 12px 36px #000c, 0 0 26px ${renk}1e`, ...style }}>
      <div style={{ background: T.panelBg, borderRadius: 14.5, padding: 16, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${renk}33, ${renk}0e)`, border: `1px solid ${renk}55`, boxShadow: `0 0 12px ${renk}33` }}>
            <Ikon ad={ikon} boy={17} renk={renk} />
          </span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 16.5, letterSpacing: 2, color: T.metin, textShadow: `0 0 14px ${renk}44`, flex: 1 }}>{baslik}</span>
          {ekstra}
        </div>
        <div style={{ height: 1.5, background: `linear-gradient(90deg, ${renk}aa, transparent 70%)`, borderRadius: 2, marginBottom: 12 }} />
        {children}
      </div>
    </section>
  );
}

// can / mana / ap / xp barı — bara basılı tutup sürükleyerek ayarlanır
function Bar({ ikon, ad, mevcut, max, temel, bonus, bonusAd = "stat", temelEtiket = "Temel", renkler, onMevcut, onTemel, ekstraKontrol }) {
  const ref = useRef(null);
  const [ayarAcik, setAyarAcik] = useState(false);
  const [hasar, setHasar] = useState(null);
  const onceki = useRef(mevcut);
  useEffect(() => {
    if (mevcut < onceki.current) {
      setHasar({ miktar: onceki.current - mevcut, key: Date.now() });
      const t = setTimeout(() => setHasar(null), 900);
      onceki.current = mevcut;
      return () => clearTimeout(t);
    }
    onceki.current = mevcut;
  }, [mevcut]);
  const deger = Math.max(0, Math.min(mevcut, max));
  const oran = max > 0 ? deger / max : 0;

  const konumdanAyarla = (e) => {
    const r = ref.current.getBoundingClientRect();
    const o = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    onMevcut(Math.round(o * max));
  };

  return (
    <div style={{ marginBottom: 11, position: "relative" }}>
      {hasar && (
        <span key={hasar.key} style={{ position: "absolute", right: 6, top: 14, fontSize: 13.5, fontWeight: 800, color: "#ff6b7a", textShadow: "0 1px 3px #000", animation: "hasarUc .9s ease-out forwards", pointerEvents: "none", zIndex: 3 }}>
          −{hasar.miktar}
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
        <Ikon ad={ikon} boy={13} renk={renkler[0]} />
        <span style={{ fontSize: 11.5, color: T.soluk, letterSpacing: 2, fontFamily: "'Cinzel', serif" }}>{ad}</span>
        <div style={{ flex: 1 }} />
        {ekstraKontrol}
        <input type="number" value={deger} onChange={(e) => onMevcut(Math.max(0, Math.min(max, parseInt(e.target.value) || 0)))} style={B.sayi} />
        <button style={B.mini} onClick={() => onMevcut(Math.max(0, deger - 1))}>−</button>
        <button style={B.mini} onClick={() => onMevcut(Math.min(max, deger + 1))}>+</button>
        <button style={{ ...B.mini, opacity: 0.85 }} onClick={() => setAyarAcik(!ayarAcik)}><Ikon ad="carki" boy={11} renk={T.soluk} /></button>
      </div>
      <div
        ref={ref}
        className={hasar ? "sarsil" : ""}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); konumdanAyarla(e); }}
        onPointerMove={(e) => { if (e.buttons) konumdanAyarla(e); }}
        style={{ position: "relative", height: 23, borderRadius: 7, background: "linear-gradient(180deg, #070410, #100a1f)", border: "1px solid #000", boxShadow: `inset 0 2px 7px #000d, 0 0 0 1px ${renkler[0]}22`, cursor: "ew-resize", touchAction: "none", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", inset: 1.5, width: `calc(${oran * 100}% - 3px)`, minWidth: oran > 0 ? 4 : 0, borderRadius: 5, background: `linear-gradient(180deg, ${renkler[0]}, ${renkler[1]})`, boxShadow: `0 0 14px ${renkler[0]}77`, transition: "width .15s", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #ffffff42 0%, transparent 52%)" }} />
          <div className="tarama" />
        </div>
        {hasar && <div key={hasar.key} style={{ position: "absolute", inset: 0, background: "#ff5f6d30", borderRadius: 6, animation: "solFlash .5s ease-out forwards", pointerEvents: "none" }} />}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, color: "#f6f2ff", textShadow: "0 1px 3px #000", pointerEvents: "none", letterSpacing: 0.5 }}>
          {deger} / {max}{bonus > 0 && <span style={{ color: "#7dffb0", marginLeft: 5, fontWeight: 500 }}>(+{bonus})</span>}{bonus < 0 && <span style={{ color: "#ff8f8f", marginLeft: 5, fontWeight: 500 }}>({bonus})</span>}
        </div>
      </div>
      {ayarAcik && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5, fontSize: 12, color: T.soluk, flexWrap: "wrap" }}>
          {temelEtiket}:
          <input type="number" value={temel}
            onChange={(e) => onTemel(parseInt(e.target.value) || 0)}
            style={{ width: 72, background: T.koyu, border: `1px solid ${T.cizgi}`, color: T.metin, borderRadius: 6, padding: "3px 6px", fontFamily: "inherit", fontSize: 13 }} />
          {bonus !== 0 && <span>+ {bonusAd} {bonus} = <b style={{ color: T.altin }}>{max}</b></span>}
        </div>
      )}
    </div>
  );
}
const B = {
  mini: { background: "#171128", border: `1px solid ${T.cizgi}`, color: T.altin, width: 22, height: 22, borderRadius: 6, fontSize: 13, lineHeight: 1, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  sayi: { width: 50, background: "#0c0818", border: `1px solid ${T.cizgi}`, color: T.metin, borderRadius: 6, padding: "2px 4px", fontSize: 12.5, fontFamily: "inherit", textAlign: "center", height: 22 },
};

// Immortal: kırmızı-siyah dokungaç aurası
function ImmortalAura() {
  const gid = useRef("imm" + Math.random().toString(36).slice(2, 7)).current;
  const kol = "M50 50 C42.5 36 44.5 18 50 1 C55.5 18 57.5 36 50 50 Z";
  const kisa = "M50 50 C44 40 45.5 28 50 13 C54.5 28 56 40 50 50 Z";
  return (
    <svg className="immAura" viewBox="0 0 100 100" style={{ position: "absolute", left: -34, top: -34, width: "calc(100% + 68px)", height: "calc(100% + 68px)", pointerEvents: "none", zIndex: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id={gid + "g"}><stop offset="0%" stopColor="#ff4655" stopOpacity=".6" /><stop offset="55%" stopColor="#6d0a14" stopOpacity=".45" /><stop offset="100%" stopColor="#000000" stopOpacity="0" /></radialGradient>
        <linearGradient id={gid + "t"} x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#0a0203" /><stop offset="45%" stopColor="#9c0f1e" /><stop offset="100%" stopColor="#ff4655" stopOpacity="0" /></linearGradient>
        <linearGradient id={gid + "k"} x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#050102" /><stop offset="60%" stopColor="#4d0810" /><stop offset="100%" stopColor="#9c0f1e" stopOpacity="0" /></linearGradient>
      </defs>
      <circle className="immIsik" cx="50" cy="50" r="42" fill={`url(#${gid}g)`} />
      <g className="immKollarTers" opacity=".85">
        {[25, 80, 135, 190, 250, 305].map((a) => <path key={a} d={kisa} transform={`rotate(${a} 50 50)`} fill={`url(#${gid}k)`} />)}
      </g>
      <g className="immKollar">
        {[0, 50, 105, 155, 210, 262, 312].map((a) => <path key={a} d={kol} transform={`rotate(${a} 50 50)`} fill={`url(#${gid}t)`} />)}
      </g>
    </svg>
  );
}

// Efsanevi: sarı parıltı kıvılcımları
function EfsaneviKivilcimlar() {
  const noktalar = [
    { left: -5, top: -6, sure: "2.1s", gecikme: "0s", boy: 9 },
    { right: -6, top: 10, sure: "2.7s", gecikme: ".6s", boy: 8 },
    { left: 8, bottom: -7, sure: "2.4s", gecikme: "1.1s", boy: 9 },
    { right: 4, bottom: 4, sure: "3s", gecikme: ".3s", boy: 6 },
  ];
  return (
    <>
      {noktalar.map((p, i) => (
        <span key={i} className="kivilcim" style={{ left: p.left, right: p.right, top: p.top, bottom: p.bottom, width: p.boy, height: p.boy, animationDuration: p.sure, animationDelay: p.gecikme }} />
      ))}
    </>
  );
}

// zincir kaplaması: beklemesi dolmayan ya da kaynağı yetmeyen yetenekler için (yumuşak giriş/çıkış)
function Zincirler({ aktif }) {
  const gid = useRef("zn" + Math.random().toString(36).slice(2, 7)).current;
  const Serit = ({ don, ust, ek, yon }) => (
    <svg style={{ position: "absolute", left: -10, top: ust, height: 15, width: "calc(100% + 20px)", pointerEvents: "none", zIndex: 1, opacity: aktif ? 0.95 : 0, transform: `rotate(${don}deg) translateX(${aktif ? 0 : yon * 38}px)`, transition: "opacity .45s ease, transform .55s cubic-bezier(.2,.9,.3,1.05)", filter: "drop-shadow(0 1px 2px #000c)" }}>
      <defs>
        <pattern id={gid + ek} patternUnits="userSpaceOnUse" width="19" height="15">
          <ellipse cx="6.2" cy="7.5" rx="5" ry="3.4" fill="none" stroke="#a49bc4" strokeWidth="1.8" />
          <ellipse cx="15.2" cy="7.5" rx="2.5" ry="4.6" fill="none" stroke="#78708f" strokeWidth="1.8" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="15" fill={`url(#${gid}${ek})`} />
    </svg>
  );
  return (
    <>
      <Serit don={-8} ust="30%" ek="a" yon={-1} />
      <Serit don={8} ust="55%" ek="b" yon={1} />
      <span style={{ position: "absolute", right: 8, top: "50%", zIndex: 1, width: 26, height: 26, borderRadius: "50%", background: "#0a0616ee", border: "1px solid #78708f", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", opacity: aktif ? 1 : 0, transform: `translateY(-50%) scale(${aktif ? 1 : 0.2})`, transition: "opacity .35s ease, transform .45s cubic-bezier(.3,1.5,.5,1)" }}>
        <Ikon ad="kilit" boy={13} renk="#a49bc4" />
      </span>
    </>
  );
}

// ================= uygulama =================
export default function App() {
  const [yuklendi, setYuklendi] = useState(false);
  const [karakterler, setKarakterler] = useState([]);
  const [aktifId, setAktifId] = useState(null);

  const [formAcik, setFormAcik] = useState(false);
  const [form, setForm] = useState(bosForm());
  const [duzenlenen, setDuzenlenen] = useState(null);
  const [formHata, setFormHata] = useState("");

  const [detay, setDetay] = useState(null);
  const [ghost, setGhost] = useState(null);
  const [krkFormAcik, setKrkFormAcik] = useState(false);
  const [krkAd, setKrkAd] = useState("");
  const [krkSilOnay, setKrkSilOnay] = useState(false);

  const [statDuzen, setStatDuzen] = useState(false);
  const [statTaslak, setStatTaslak] = useState({});
  const [kimlikAcik, setKimlikAcik] = useState(false);
  const [kimlikTaslak, setKimlikTaslak] = useState(null);
  const [becAd, setBecAd] = useState("");
  const [becDeger, setBecDeger] = useState("");
  const [etkiAd, setEtkiAd] = useState("");
  const [etkiTur, setEtkiTur] = useState("buff");

  const [yetForm, setYetForm] = useState(bosYetForm());
  const [yetDuzenId, setYetDuzenId] = useState(null);
  const [yetFlash, setYetFlash] = useState(null); // {id, tamam}
  const [cantaMesaj, setCantaMesaj] = useState("");
  const [fiyatAyar, setFiyatAyar] = useState(false);
  const [lvlFlash, setLvlFlash] = useState(null);
  const [kayitDurum, setKayitDurum] = useState("");
  const [kasaMesaj, setKasaMesaj] = useState("");
  const [depoVar, setDepoVar] = useState(true);
  const [kayitModal, setKayitModal] = useState(false);
  const [yedekMetin, setYedekMetin] = useState("");
  const [iceMetin, setIceMetin] = useState("");
  const [kopyaDurum, setKopyaDurum] = useState("");

  const surukleme = useRef(null);
  const kayitZamani = useRef(null);
  const dosyaRef = useRef(null);
  const iceAktarRef = useRef(null);
  const yedekRef = useRef(null);

  const aktif = karakterler.find((k) => k.id === aktifId) || null;

  // ---------- yükle / kaydet ----------
  useEffect(() => {
    (async () => {
      // depo testi: bu ortamda kalıcı kayıt çalışıyor mu?
      let depo = true;
      try {
        if (!window.storage) throw new Error("depo yok");
        await window.storage.set("cg-depo-test", "1");
      } catch (e) { depo = false; }
      setDepoVar(depo);
      let d = null;
      if (depo) {
        try {
          const r = await window.storage.get(STORAGE_KEY);
          if (r && r.value) d = JSON.parse(r.value);
        } catch (e) { /* yeni kayıt yok */ }
        if (!d) {
          try {
            const eski = await window.storage.get(V4_KEY);
            if (eski && eski.value) d = JSON.parse(eski.value);
          } catch (e) { /* eski kayıt da yok */ }
        }
      }
      if (d && d.karakterler) {
        const tam = d.karakterler.map(tamamla);
        setKarakterler(tam);
        setAktifId(d.aktifId || (tam[0] && tam[0].id) || null);
      }
      setYuklendi(true);
    })();
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    if (!depoVar) { setKayitDurum("yok"); return; }
    setKayitDurum("kaydediliyor");
    clearTimeout(kayitZamani.current);
    kayitZamani.current = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({ karakterler, aktifId }));
        setKayitDurum("kayitli");
      } catch (e) { console.error("Kayıt hatası", e); setKayitDurum("hata"); }
    }, 400);
    return () => clearTimeout(kayitZamani.current);
  }, [karakterler, aktifId, yuklendi, depoVar]);

  // ---------- yardımcılar ----------
  const aktifiGuncelle = (fn) => setKarakterler((ks) => ks.map((k) => (k.id === aktifId ? fn(structuredClone(k)) : k)));
  const konumdaki = (k, kn) => (kn.tur === "canta" ? k.canta[kn.anahtar] : kn.tur === "cep" ? k.cepler[kn.anahtar] : k.slotlar[kn.anahtar]);
  const konumaYaz = (k, kn, it) => {
    if (kn.tur === "canta") k.canta[kn.anahtar] = it;
    else if (kn.tur === "cep") k.cepler[kn.anahtar] = it;
    else k.slotlar[kn.anahtar] = it;
  };
  const sigarMi = (kn, it) => !it || kn.tur !== "slot" || SLOT_TIP[kn.anahtar].includes(it.tip);

  const tasi = (kaynak, hedef) => {
    if (kaynak.tur === hedef.tur && kaynak.anahtar === hedef.anahtar) return;
    aktifiGuncelle((k) => {
      const a = konumdaki(k, kaynak), b = konumdaki(k, hedef);
      if (!a || !sigarMi(hedef, a) || !sigarMi(kaynak, b)) return k;
      konumaYaz(k, hedef, a); konumaYaz(k, kaynak, b);
      return k;
    });
  };

  const statHesapla = (k) => {
    const temel = {}, kimlik = {}, esya = {}, puan = {}, boostSabit = {}, boostYuzde = {};
    for (const s of STATLAR) { temel[s.key] = Number(k && k.statlar[s.key]) || 0; kimlik[s.key] = 0; esya[s.key] = 0; puan[s.key] = Number(k && k.puan && k.puan.dagitim[s.key]) || 0; boostSabit[s.key] = 0; boostYuzde[s.key] = 0; }
    if (k) {
      for (const p of KIMLIK_PARCA) {
        const st = (k.kimlik[p.key] && k.kimlik[p.key].statlar) || {};
        for (const s of STATLAR) kimlik[s.key] += Number(st[s.key]) || 0;
      }
      for (const sl of SLOTLAR) {
        const it = k.slotlar[sl];
        if (it && it.statlar) for (const s of STATLAR) esya[s.key] += Number(it.statlar[s.key]) || 0;
      }
      for (const b of (k.boostlar || [])) {
        for (const s of STATLAR) {
          const v = Number(b.statlar && b.statlar[s.key]) || 0;
          if (!v) continue;
          if (b.tur === "yuzde") boostYuzde[s.key] += v; else boostSabit[s.key] += v;
        }
      }
    }
    const toplam = {}, boost = {};
    for (const s of STATLAR) {
      const alt = temel[s.key] + kimlik[s.key] + esya[s.key] + puan[s.key];
      boost[s.key] = boostSabit[s.key] + Math.round(alt * boostYuzde[s.key] / 100);
      toplam[s.key] = alt + boost[s.key];
    }
    return { temel, kimlik, esya, puan, boost, toplam };
  };
  const H = statHesapla(aktif);
  const canMax = aktif ? aktif.can.temel + H.toplam.vit * 10 : 0;
  const manaMax = aktif ? aktif.mana.temel + H.toplam.int * 10 : 0;
  const apMax = aktif ? aktif.ap.temel + H.toplam.end * 10 : 0;
  const spKalan = aktif ? aktif.puan.toplam - STATLAR.reduce((t, s) => t + (H.puan[s.key] || 0), 0) : 0;

  // ---------- sürükle & bırak ----------
  const basla = (e, konum, item) => {
    if (!item) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    surukleme.current = { konum, item, x: e.clientX, y: e.clientY, hareket: false };
  };
  const hareket = (e) => {
    const s = surukleme.current;
    if (!s) return;
    if (!s.hareket && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 7) return;
    s.hareket = true;
    setGhost({ x: e.clientX, y: e.clientY, item: s.item });
  };
  const birak = (e) => {
    const s = surukleme.current;
    surukleme.current = null;
    setGhost(null);
    if (!s) return;
    if (!s.hareket) { setDetay({ item: s.item, konum: s.konum }); return; }
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const dropEl = el && el.closest ? el.closest("[data-drop]") : null;
    if (!dropEl) return;
    const [tur, anahtar] = dropEl.getAttribute("data-drop").split("|");
    tasi(s.konum, { tur, anahtar: tur === "slot" ? anahtar : Number(anahtar) });
  };

  // ---------- item işlemleri ----------
  const itemKaydet = () => {
    if (!form.ad.trim()) { setFormHata("Eşyaya bir ad ver."); return; }
    const statlar = {};
    for (const s of STATLAR) { const v = parseInt(form.statlar[s.key]); if (v) statlar[s.key] = v; }
    const veri = { ad: form.ad, tip: form.tip, nadirlik: form.nadirlik, deger: form.deger, aciklama: form.aciklama, img: form.img, zar: (form.zar || "").trim(), statlar };
    if (duzenlenen) {
      aktifiGuncelle((k) => { konumaYaz(k, duzenlenen, { ...konumdaki(k, duzenlenen), ...veri }); return k; });
    } else {
      const bosIdx = aktif.canta.findIndex((c) => c === null);
      if (bosIdx === -1) { setFormHata("Çanta dolu! Slot satın al ya da yer aç."); return; }
      aktifiGuncelle((k) => { k.canta[bosIdx] = { id: uid(), ...veri }; return k; });
    }
    setFormAcik(false); setForm(bosForm()); setDuzenlenen(null); setFormHata("");
  };

  const itemSil = (kn) => { aktifiGuncelle((k) => { konumaYaz(k, kn, null); return k; }); setDetay(null); };
  const kusan = (kn, it) => {
    const uygun = SLOTLAR.filter((sl) => SLOT_TIP[sl].includes(it.tip));
    if (!uygun.length) return;
    tasi(kn, { tur: "slot", anahtar: uygun.find((sl) => !aktif.slotlar[sl]) || uygun[0] });
    setDetay(null);
  };
  const cikar = (kn) => {
    const bosIdx = aktif.canta.findIndex((c) => c === null);
    if (bosIdx === -1) return;
    tasi(kn, { tur: "canta", anahtar: bosIdx });
    setDetay(null);
  };

  // ---------- slot satın alma (fiyat her seferinde ikiye katlanır) ----------
  const slotSatinAl = () => {
    if (!aktif) return;
    if (aktif.altin < aktif.slotFiyat) {
      setCantaMesaj(`Yetersiz altın — ${aktif.slotFiyat} gerekiyor.`);
      setTimeout(() => setCantaMesaj(""), 2500);
      return;
    }
    aktifiGuncelle((k) => {
      k.altin -= k.slotFiyat;
      k.slotFiyat *= 2;
      k.canta = [...k.canta, null, null, null, null];
      return k;
    });
    setCantaMesaj("+4 slot açıldı!");
    setTimeout(() => setCantaMesaj(""), 2000);
  };

  // ---------- yetenekler ----------
  const yetKaydet = () => {
    if (!yetForm.ad.trim()) return;
    const bst = {};
    for (const s of STATLAR) { const v = parseInt(yetForm.boostlar[s.key]); if (v) bst[s.key] = v; }
    const y = { ad: yetForm.ad.trim(), not: (yetForm.not || "").trim(), ap: parseInt(yetForm.ap) || 0, can: parseInt(yetForm.can) || 0, mana: parseInt(yetForm.mana) || 0, cd: Math.max(0, parseInt(yetForm.cd) || 0), boost: { tur: yetForm.boostTur, statlar: bst } };
    aktifiGuncelle((k) => {
      if (yetDuzenId) k.yetenekler = k.yetenekler.map((x) => (x.id === yetDuzenId ? { ...x, ...y, kalan: Math.min(x.kalan || 0, y.cd) } : x));
      else k.yetenekler.push({ id: uid(), ...y, kalan: 0 });
      return k;
    });
    setYetForm(bosYetForm());
    setYetDuzenId(null);
  };
  const yetKullan = (y) => {
    if ((y.kalan || 0) > 0) {
      setYetFlash({ id: y.id, tamam: false });
      setTimeout(() => setYetFlash(null), 450);
      return;
    }
    const yeniAp = Math.max(0, Math.min(apMax, aktif.ap.mevcut + y.ap));
    const yeniCan = Math.max(0, Math.min(canMax, aktif.can.mevcut + y.can));
    const yeniMana = Math.max(0, Math.min(manaMax, aktif.mana.mevcut + y.mana));
    const yetersiz = (y.ap < 0 && aktif.ap.mevcut + y.ap < 0) || (y.mana < 0 && aktif.mana.mevcut + y.mana < 0) || (y.can < 0 && aktif.can.mevcut + y.can < 0);
    if (yetersiz) {
      setYetFlash({ id: y.id, tamam: false });
    } else {
      aktifiGuncelle((k) => {
        k.ap.mevcut = yeniAp; k.can.mevcut = yeniCan; k.mana.mevcut = yeniMana;
        k.yetenekler = k.yetenekler.map((x) => (x.id === y.id ? { ...x, kalan: x.cd || 0 } : x));
        if (y.boost && Object.keys(y.boost.statlar || {}).length > 0) {
          k.boostlar = (k.boostlar || []).filter((b) => b.kaynakId !== y.id);
          k.boostlar.push({ id: uid(), kaynakId: y.id, ad: y.ad, tur: y.boost.tur, statlar: y.boost.statlar });
        }
        return k;
      });
      setYetFlash({ id: y.id, tamam: true });
    }
    setTimeout(() => setYetFlash(null), 450);
  };
  // yetenek için kaynak yeterli mi?
  const yetersizMi = (y) => (y.ap < 0 && aktif.ap.mevcut + y.ap < 0) || (y.mana < 0 && aktif.mana.mevcut + y.mana < 0) || (y.can < 0 && aktif.can.mevcut + y.can < 0);
  // yeni tur: AP "tur başı dolum" kadar dolar, tüm beklemeler 1 tur azalır
  const yeniTur = () => aktifiGuncelle((k) => {
    const maxAp = k.ap.temel + statHesapla(k).toplam.end * 10;
    k.ap.mevcut = Math.min(maxAp, k.ap.mevcut + (k.ap.dolum || 0));
    k.yetenekler = k.yetenekler.map((y) => ({ ...y, kalan: Math.max(0, (y.kalan || 0) - 1) }));
    return k;
  });
  // xp işleme: bar dolunca otomatik seviye atlar, taşan xp devreder, seviye başı puan gelir
  const xpUygula = (mevcut, hedef) => {
    let m = Math.max(0, mevcut), atlanan = 0;
    while (hedef > 0 && m >= hedef) { m -= hedef; atlanan++; }
    if (atlanan > 0) {
      setLvlFlash(aktif.seviye + atlanan);
      setTimeout(() => setLvlFlash(null), 2200);
    }
    aktifiGuncelle((k) => {
      k.xp.mevcut = m; k.xp.hedef = hedef; k.seviye += atlanan;
      if (atlanan > 0) k.puan.toplam += atlanan * (k.puan.seviyeBasi || 0);
      return k;
    });
  };

  // ---------- karakter ----------
  const karakterEkle = () => {
    const ad = krkAd.trim();
    if (!ad) return;
    const k = yeniKarakter(ad);
    setKarakterler([...karakterler, k]); setAktifId(k.id);
    setKrkAd(""); setKrkFormAcik(false);
  };
  const karakterSil = () => {
    const kalan = karakterler.filter((k) => k.id !== aktifId);
    setKarakterler(kalan); setAktifId(kalan[0] ? kalan[0].id : null); setKrkSilOnay(false);
  };

  // ---------- yedekle / yükle ----------
  const dosyaIndir = (metin, ad) => {
    try {
      const blob = new Blob([metin], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = ad;
      a.click();
      URL.revokeObjectURL(a.href);
      return true;
    } catch (e) { return false; }
  };
  const veriYukle = (d) => {
    const gelen = Array.isArray(d && d.karakterler) ? d.karakterler : d && d.ad && d.slotlar ? [d] : null;
    if (!gelen || !gelen.length) return null;
    const mevcutIdler = new Set(karakterler.map((k) => k.id));
    const eklenen = gelen.map((k) => { const t = tamamla(k); if (mevcutIdler.has(t.id)) t.id = uid(); return t; });
    setKarakterler([...karakterler, ...eklenen]);
    setAktifId(eklenen[0].id);
    return eklenen.length;
  };
  const iceAktar = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const n = veriYukle(JSON.parse(await f.text()));
      setKopyaDurum(n ? `${n} karakter yüklendi ✓` : "Dosya formatı tanınmadı.");
    } catch (err) { setKopyaDurum("Dosya okunamadı ya da format tanınmadı."); }
    setTimeout(() => setKopyaDurum(""), 3500);
    e.target.value = "";
  };
  const kopyala = async () => {
    let tamam = false;
    try { await navigator.clipboard.writeText(yedekMetin); tamam = true; }
    catch (e) {
      try {
        if (yedekRef.current) { yedekRef.current.focus(); yedekRef.current.select(); tamam = document.execCommand("copy"); }
      } catch (e2) { tamam = false; }
    }
    setKopyaDurum(tamam ? "Panoya kopyalandı ✓" : "Kopyalanamadı — metne dokunup elle kopyala.");
    setTimeout(() => setKopyaDurum(""), 3000);
  };

  // ---------- hücre ----------
  const Hucre = ({ konum, item, boy, slotId, cepRenk, yuvarlak }) => (
    <div
      data-drop={`${konum.tur}|${konum.anahtar}`}
      className={item ? nadirSinif(item.nadirlik) : ""}
      onPointerDown={(e) => basla(e, konum, item)}
      onPointerMove={hareket}
      onPointerUp={birak}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: boy, height: boy, borderRadius: yuvarlak ? "50%" : 9, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        touchAction: "none", userSelect: "none",
        zIndex: item && item.nadirlik === "Immortal" ? 3 : "auto",
        background: item ? "radial-gradient(circle at 35% 28%, #2b2142, #120c20 75%)" : "linear-gradient(180deg, #0b0716, #130d22)",
        border: `${cepRenk ? 2 : 1.5}px solid ${item ? rc(item.nadirlik) : cepRenk || (slotId === "kalp" ? "#7e2b3f" : "#2c2440")}`,
        boxShadow: item
          ? `0 0 12px ${rc(item.nadirlik)}55, inset 0 0 12px #000000bb`
          : cepRenk ? `0 0 10px ${cepRenk}44, inset 0 3px 8px #000d` : `inset 0 3px 8px #000d, inset 0 -1px 0 #ffffff09${slotId === "kalp" ? ", 0 0 14px #ff465522" : ""}`,
        opacity: surukleme.current && surukleme.current.konum.tur === konum.tur && surukleme.current.konum.anahtar === konum.anahtar && ghost ? 0.25 : 1,
        cursor: item ? "grab" : "default",
      }}
    >
      {item && item.nadirlik === "Immortal" && <ImmortalAura />}
      {item && item.nadirlik === "Efsanevi" && <EfsaneviKivilcimlar />}
      {item
        ? <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><ItemGorsel item={item} boy={boy - 14} /></span>
        : slotId ? (
          <>
            <Ikon ad={SLOT_IKON[slotId]} boy={boy * 0.42} renk={slotId === "kalp" ? "#ff4655" : "#5d5480"} stil={{ opacity: 0.3 }} />
            <span style={{ position: "absolute", bottom: yuvarlak ? 5 : 2, left: 0, right: 0, textAlign: "center", fontSize: 7.5, color: "#5d5480", letterSpacing: 0.4, pointerEvents: "none" }}>{SLOT_AD[slotId]}</span>
          </>
        ) : cepRenk ? <Ikon ad="kilit" boy={boy * 0.34} renk={cepRenk} stil={{ opacity: 0.45 }} /> : null}
    </div>
  );

  // ================= render =================
  if (!yuklendi)
    return <div style={{ ...S.sayfa, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: T.altin, fontFamily: "Cinzel, serif", letterSpacing: 3 }}>Günlük açılıyor…</div></div>;

  return (
    <div style={S.sayfa}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;700&family=Alegreya:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: ${T.altin} !important; }
        button { cursor: pointer; font-family: inherit; }
        button:hover { filter: brightness(1.2); }
        ::placeholder { color: #5d5480; }
        @keyframes epikNefes { 0%,100% { box-shadow: 0 0 9px #c77bff55, inset 0 0 12px #000000bb; } 50% { box-shadow: 0 0 20px #c77bffaa, inset 0 0 12px #000000bb; } }
        .epik { animation: epikNefes 2.6s ease-in-out infinite; }
        @keyframes efsPulse { 0%,100% { box-shadow: 0 0 9px #ffd16666, inset 0 0 12px #000000bb; } 50% { box-shadow: 0 0 24px #ffd166cc, inset 0 0 12px #000000bb; } }
        .efsanevi { animation: efsPulse 2.2s ease-in-out infinite; }
        @keyframes twinkle { 0%,100% { transform: scale(.25) rotate(0deg); opacity: 0; } 50% { transform: scale(1) rotate(25deg); opacity: 1; } }
        .kivilcim { position: absolute; background: #ffd166; clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%); filter: drop-shadow(0 0 4px #ffd166); animation: twinkle ease-in-out infinite; pointer-events: none; z-index: 2; }
        @keyframes immDalga { 0%,100% { transform: scale(1) rotate(-3deg); } 50% { transform: scale(1.15) rotate(4deg); } }
        .immAura { animation: immDalga 3.4s ease-in-out infinite; transform-origin: 50% 50%; }
        .immKollar { animation: don 16s linear infinite; transform-origin: 50% 50%; }
        .immKollarTers { animation: donTers 26s linear infinite; transform-origin: 50% 50%; }
        @keyframes immPulse { 0%,100% { box-shadow: 0 0 14px #ff465538, inset 0 0 12px #000000bb; } 50% { box-shadow: 0 0 30px #ff465595, 0 0 55px #ff465535, inset 0 0 12px #000000bb; } }
        .immortal { animation: immPulse 6.5s ease-in-out infinite; }
        @keyframes immNefes { 0%,100% { opacity: .32; transform: scale(.96); } 50% { opacity: .8; transform: scale(1.08); } }
        .immIsik { animation: immNefes 6.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes lvlPop { 0% { transform: translate(-50%,-50%) scale(.5); opacity: 0; } 18% { transform: translate(-50%,-50%) scale(1.1); opacity: 1; } 32% { transform: translate(-50%,-50%) scale(1); } 78% { opacity: 1; } 100% { transform: translate(-50%,-50%) scale(1.06); opacity: 0; } }
        @keyframes hasarUc { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-26px); opacity: 0; } }
        @keyframes sars { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-3px); } 40% { transform: translateX(3px); } 60% { transform: translateX(-2px); } 80% { transform: translateX(2px); } }
        .sarsil { animation: sars .38s ease; }
        @keyframes solFlash { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes tarama { 0% { left: -55%; } 55% { left: 115%; } 100% { left: 115%; } }
        .tarama { position: absolute; top: 0; bottom: 0; width: 45%; left: -55%; background: linear-gradient(100deg, transparent, #ffffff4d, transparent); animation: tarama 3s ease-in-out infinite; }
        @keyframes don { to { transform: rotate(360deg); } }
        @keyframes donTers { to { transform: rotate(-360deg); } }
        @keyframes kor { 0% { transform: translateY(104vh) scale(1); opacity: 0; } 8% { opacity: .8; } 85% { opacity: .3; } 100% { transform: translateY(-6vh) scale(.4); opacity: 0; } }
        .kor { position: fixed; bottom: 0; width: 5px; height: 5px; border-radius: 50%; pointer-events: none; animation: kor linear infinite; }
        @media (prefers-reduced-motion: reduce) { .epik, .efsanevi, .immortal, .kivilcim, .immAura, .immIsik, .immKollar, .immKollarTers, .tarama, .kor, .donen, .donenTers { animation: none !important; } }
      `}</style>

      {/* uçuşan korlar */}
      {[
        { l: "8%", r: T.altin, s: 17 }, { l: "22%", r: T.mor, s: 23 }, { l: "37%", r: T.teal, s: 20 },
        { l: "55%", r: T.gul, s: 26 }, { l: "68%", r: T.altin, s: 19 }, { l: "81%", r: T.mor, s: 24 }, { l: "92%", r: T.teal, s: 21 },
      ].map((k, i) => (
        <span key={i} className="kor" style={{ left: k.l, background: k.r, boxShadow: `0 0 8px ${k.r}`, animationDuration: `${k.s}s`, animationDelay: `${i * 2.3}s` }} />
      ))}

      {/* ------- logo ------- */}
      <header style={S.baslik}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, opacity: 0.8 }}>
          <Ikon ad="silah" boy={16} renk={T.altin} />
          <Ikon ad="yildiz" boy={12} renk={T.gul} />
          <Ikon ad="silah" boy={16} renk={T.altin} stil={{ transform: "scaleX(-1)" }} />
        </div>
        <h1 style={S.h1}>Canavar Günlüğü</h1>
        <div style={S.online}>— ONLINE —</div>
      </header>

      {/* ------- karakter çubuğu ------- */}
      <div style={S.krkCubuk}>
        {karakterler.map((k) => (
          <button key={k.id} style={k.id === aktifId ? S.krkAktif : S.krkBtn} onClick={() => { setAktifId(k.id); setKrkSilOnay(false); setStatDuzen(false); setYetDuzenId(null); }}>
            <Ikon ad="migfer" boy={13} renk={k.id === aktifId ? T.altin : T.soluk} /> {k.ad}
          </button>
        ))}
        <button style={S.krkEkleBtn} onClick={() => setKrkFormAcik(!krkFormAcik)}>+ Karakter</button>
        <div style={{ flex: 1 }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: kayitDurum === "kayitli" ? T.teal : kayitDurum === "hata" || kayitDurum === "yok" ? "#ff8f8f" : T.soluk }}>
          {kayitDurum === "kaydediliyor" ? "Kaydediliyor…" : kayitDurum === "hata" ? "Kayıt hatası!" : kayitDurum === "yok" ? "⚠ Kalıcı kayıt yok" : kayitDurum === "kayitli" ? "✓ Kayıtlı" : ""}
        </span>
        <button style={{ ...S.aracBtn, borderColor: `${T.altin}66`, color: "#ffe9a8" }} onClick={() => { setKayitModal(true); setYedekMetin(""); setIceMetin(""); setKopyaDurum(""); }}>
          <Ikon ad="kopya" boy={13} renk={T.altin} /> Yedekle &amp; Yükle
        </button>
        <input ref={iceAktarRef} type="file" accept="application/json" onChange={iceAktar} style={{ display: "none" }} />
      </div>

      {krkFormAcik && (
        <div style={{ ...S.krkCubuk, marginTop: 0 }}>
          <input style={{ ...S.girdi, flex: 1, maxWidth: 300 }} placeholder="Karakter adı…" value={krkAd} onChange={(e) => setKrkAd(e.target.value)} onKeyDown={(e) => e.key === "Enter" && karakterEkle()} autoFocus />
          <button style={S.anaBtn} onClick={karakterEkle}>Ekle</button>
        </div>
      )}

      {!depoVar && (
        <div style={{ maxWidth: 1880, margin: "0 auto 10px", padding: "0 20px" }}>
          <div style={{ fontSize: 13.5, color: "#ffce7a", background: "#2a1c08", border: "1px solid #8a5a12", borderRadius: 10, padding: "9px 12px" }}>
            ⚠ Bu pencerede kalıcı kayıt çalışmıyor — kapatınca girdiklerin gider. Kapatmadan önce <b>"Yedekle &amp; Yükle"</b>den yedek kodunu kopyala, sonra yapıştırarak geri yükleyebilirsin.
          </div>
        </div>
      )}
      {kasaMesaj && <div style={{ maxWidth: 1880, margin: "0 auto 8px", padding: "0 20px", fontSize: 13, color: kasaMesaj.includes("okunamadı") ? "#ff8f8f" : "#7dffb0" }}>{kasaMesaj}</div>}

      {!aktif && <div style={S.bos}>Günlüğü başlatmak için yukarıdan bir karakter ekle.</div>}

      {aktif && (
        <main style={S.icerik}>
          {/* ================= KARAKTER ================= */}
          <Panel renk={T.altin} ikon="migfer" baslik={aktif.ad}
            ekstra={
              <span style={S.seviyeRozet}>
                SEVİYE
                <input type="number" value={aktif.seviye} min={1}
                  onChange={(e) => aktifiGuncelle((k) => { k.seviye = Math.max(1, parseInt(e.target.value) || 1); return k; })}
                  style={S.seviyeGirdi} />
              </span>
            }>
            {/* kimlik */}
            <div style={S.kimlikSatir}>
              {KIMLIK_PARCA.map((p, i) => (
                <span key={p.key} style={S.kimlikChip}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: [T.teal, T.gul, T.mor][i], boxShadow: `0 0 6px ${[T.teal, T.gul, T.mor][i]}` }} />
                  {p.ad}: <b style={{ color: T.metin }}>{(aktif.kimlik[p.key] && aktif.kimlik[p.key].ad) || "—"}</b>
                </span>
              ))}
              <button style={{ ...S.aracBtn, padding: "4px 9px" }} onClick={() => { setKimlikTaslak(structuredClone(aktif.kimlik)); setKimlikAcik(true); }}><Ikon ad="kalem" boy={12} renk={T.soluk} /></button>
            </div>

            {/* çember ekipman */}
            <div style={{ position: "relative", width: CBOY, height: CBOY, margin: "6px auto 0" }}>
              <svg width={CBOY} height={CBOY} viewBox={`0 0 ${CBOY} ${CBOY}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <circle className="donen" cx={CBOY / 2} cy={CBOY / 2} r={YARICAP} fill="none" stroke={T.altin} strokeWidth="1" strokeDasharray="3 9" opacity="0.35" style={{ transformOrigin: "50% 50%", animation: "don 90s linear infinite" }} />
                <circle className="donenTers" cx={CBOY / 2} cy={CBOY / 2} r={YARICAP - 34} fill="none" stroke={T.mor} strokeWidth="1" strokeDasharray="14 10" opacity="0.28" style={{ transformOrigin: "50% 50%", animation: "donTers 70s linear infinite" }} />
                <circle cx={CBOY / 2} cy={CBOY / 2} r={44} fill="none" stroke="#ff4655" strokeWidth="1" opacity="0.3" />
              </svg>
              {SLOTLAR.map((sl) => (
                <div key={sl} style={{ position: "absolute", ...SLOT_POS[sl] }}>
                  <Hucre konum={{ tur: "slot", anahtar: sl }} item={aktif.slotlar[sl]} boy={sl === "kalp" ? 60 : SLOT_BOY} slotId={sl} yuvarlak={sl === "kalp"} />
                </div>
              ))}
            </div>

            {/* kuşanılı silah zarları */}
            {(aktif.slotlar.anaSilah || aktif.slotlar.altSilah) && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
                {["anaSilah", "altSilah"].map((sl) => {
                  const it = aktif.slotlar[sl];
                  return it ? (
                    <span key={sl} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, background: "#0c0818", border: `1px solid ${rc(it.nadirlik)}66`, borderRadius: 9, padding: "5px 10px" }}>
                      <Ikon ad="zar" boy={14} renk="#ffd166" />
                      <span style={{ color: T.soluk }}>{SLOT_AD[sl]}:</span>
                      <b style={{ color: rc(it.nadirlik) }}>{it.ad}</b>
                      <span style={{ color: it.zar ? "#ffd166" : "#4a4364", fontWeight: 700 }}>{it.zar || "zar girilmemiş"}</span>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* barlar */}
            <div style={{ marginTop: 16 }}>
              <Bar ikon="kalp" ad="CAN" mevcut={aktif.can.mevcut} max={canMax} temel={aktif.can.temel} bonus={H.toplam.vit * 10} bonusAd="VIT"
                renkler={["#ff5f6d", "#7a1024"]}
                onMevcut={(v) => aktifiGuncelle((k) => { k.can.mevcut = v; return k; })}
                onTemel={(v) => aktifiGuncelle((k) => { k.can.temel = v; return k; })} />
              <Bar ikon="kure" ad="MANA" mevcut={aktif.mana.mevcut} max={manaMax} temel={aktif.mana.temel} bonus={H.toplam.int * 10} bonusAd="INT"
                renkler={["#56b6ff", "#1a3f8f"]}
                onMevcut={(v) => aktifiGuncelle((k) => { k.mana.mevcut = v; return k; })}
                onTemel={(v) => aktifiGuncelle((k) => { k.mana.temel = v; return k; })} />
              <Bar ikon="simsek" ad="AP" mevcut={aktif.ap.mevcut} max={apMax} temel={aktif.ap.temel} bonus={H.toplam.end * 10} bonusAd="END"
                renkler={["#ffd166", "#8a5a12"]}
                ekstraKontrol={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginRight: 2 }}>
                    <input type="number" title="Basış başına dolacak AP" value={aktif.ap.dolum ?? 2}
                      onChange={(e) => aktifiGuncelle((k) => { k.ap.dolum = parseInt(e.target.value) || 0; return k; })}
                      style={{ ...B.sayi, width: 38, color: "#ffd166" }} />
                    <button style={{ ...B.mini, width: "auto", padding: "0 8px", gap: 4, color: "#ffd166", borderColor: "#8a5a12" }}
                      onClick={() => aktifiGuncelle((k) => { k.ap.mevcut = Math.min(apMax, k.ap.mevcut + (k.ap.dolum || 0)); return k; })}>
                      <Ikon ad="yenile" boy={11} renk="#ffd166" /> Doldur
                    </button>
                  </span>
                }
                onMevcut={(v) => aktifiGuncelle((k) => { k.ap.mevcut = v; return k; })}
                onTemel={(v) => aktifiGuncelle((k) => { k.ap.temel = v; return k; })} />
              <Bar ikon="yildiz" ad="TECRÜBE" mevcut={aktif.xp.mevcut} max={aktif.xp.hedef} temel={aktif.xp.hedef} bonus={0} temelEtiket="Hedef XP"
                renkler={["#c07bff", "#4b1a86"]}
                onMevcut={(v) => xpUygula(v, aktif.xp.hedef)}
                onTemel={(v) => xpUygula(aktif.xp.mevcut, Math.max(1, v))} />
            </div>
          </Panel>

          {/* ================= ÇANTA ================= */}
          <Panel renk={T.teal} ikon="diger" baslik="Çanta"
            ekstra={<button style={S.anaBtn} onClick={() => { setForm(bosForm()); setDuzenlenen(null); setFormHata(""); setFormAcik(true); }}>+ Yeni Eşya</button>}>

            {/* para + slot satın alma */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <div style={S.paraKutu}>
                <Ikon ad="para" boy={19} renk={T.altin} />
                <input type="number" value={aktif.altin}
                  onChange={(e) => aktifiGuncelle((k) => { k.altin = parseInt(e.target.value) || 0; return k; })}
                  style={S.paraGirdi} />
                <span style={{ color: T.altin, fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 1 }}>ALTIN</span>
              </div>
              <button style={S.slotBtn} onClick={slotSatinAl}>
                +4 Slot <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 4 }}><Ikon ad="para" boy={13} renk="#0d1f1c" kalinlik={2.2} /> {aktif.slotFiyat}</span>
              </button>
              <button style={{ ...S.aracBtn, padding: "6px 9px" }} onClick={() => setFiyatAyar(!fiyatAyar)}><Ikon ad="carki" boy={13} renk={T.soluk} /></button>
            </div>
            {fiyatAyar && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: T.soluk, marginBottom: 10 }}>
                Sonraki slot fiyatı:
                <input type="number" value={aktif.slotFiyat}
                  onChange={(e) => aktifiGuncelle((k) => { k.slotFiyat = Math.max(1, parseInt(e.target.value) || 1); return k; })}
                  style={{ width: 90, background: T.koyu, border: `1px solid ${T.cizgi}`, color: T.metin, borderRadius: 6, padding: "4px 7px", fontSize: 13, fontFamily: "inherit" }} />
                <span style={{ fontSize: 11.5 }}>(her satın alışta ×2)</span>
              </div>
            )}
            {cantaMesaj && <div style={{ fontSize: 13, color: cantaMesaj.includes("Yetersiz") ? "#ff8f8f" : "#7dffb0", marginBottom: 8 }}>{cantaMesaj}</div>}

            {/* güvenli cepler */}
            <div style={{ margin: "2px 0 5px", fontSize: 10.5, letterSpacing: 2.5, color: T.soluk, fontFamily: "'Cinzel', serif" }}>GÜVENLİ CEPLER</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {aktif.cepler.map((item, i) => (
                <Hucre key={i} konum={{ tur: "cep", anahtar: i }} item={item} boy={54} cepRenk={CEP_RENK[i]} />
              ))}
            </div>

            <div style={{ margin: "2px 0 5px", fontSize: 10.5, letterSpacing: 2.5, color: T.soluk, fontFamily: "'Cinzel', serif" }}>
              EŞYALAR <span style={{ letterSpacing: 0.5 }}>· {aktif.canta.filter(Boolean).length}/{aktif.canta.length}</span>
            </div>
            <div style={S.cantaGrid}>
              {aktif.canta.map((item, i) => (
                <Hucre key={i} konum={{ tur: "canta", anahtar: i }} item={item} boy={54} />
              ))}
            </div>
            <div style={S.ipucu}>Dokun → detaylar · Sürükle → kuşan / taşı · Barı sürükle → değer ayarla</div>
          </Panel>

          {/* ================= YETENEKLER ================= */}
          <Panel renk={T.mor} ikon="parilti" baslik="Yetenekler"
            ekstra={<button style={{ ...S.aracBtn, borderColor: `${T.mor}88`, color: "#cdbcff" }} onClick={yeniTur}><Ikon ad="yenile" boy={13} renk={T.mor} /> Yeni Tur</button>}>
            <div style={{ fontSize: 12.5, color: T.soluk, marginBottom: 10 }}>Dokununca yazdığın kadar AP / Can / Mana harcar ya da ekler (eksi = harcama). "Yeni Tur" AP'yi doldurur ve beklemeleri 1 tur azaltır.</div>
            {aktif.yetenekler.length === 0 && <div style={{ fontSize: 13, color: T.soluk, fontStyle: "italic", marginBottom: 8 }}>Henüz yetenek yok — aşağıdan oluştur.</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
              {aktif.yetenekler.map((y) => {
                const f = yetFlash && yetFlash.id === y.id ? yetFlash : null;
                const kilitli = (y.kalan || 0) > 0 || yetersizMi(y);
                return (
                  <div key={y.id}
                    onClick={() => yetKullan(y)}
                    style={{
                      position: "relative",
                      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "9px 11px", borderRadius: 10, cursor: kilitli ? "not-allowed" : "pointer", userSelect: "none",
                      background: "linear-gradient(180deg, #1a1330, #120c22)",
                      opacity: kilitli ? 0.7 : 1,
                      border: `1.5px solid ${f ? (f.tamam ? "#7dffb0" : "#ff5f6d") : `${T.mor}55`}`,
                      boxShadow: f ? `0 0 16px ${f.tamam ? "#7dffb066" : "#ff5f6d66"}` : `0 0 8px ${T.mor}1c`,
                      transition: "border-color .2s, box-shadow .2s, opacity .4s ease",
                    }}>
                    <Zincirler aktif={kilitli} />
                    <Ikon ad="parilti" boy={15} renk={T.mor} />
                    <span style={{ flex: 1, minWidth: 90, display: "flex", flexDirection: "column", gap: 1 }}>
                      <span style={{ color: T.metin, fontWeight: 600, fontSize: 14.5 }}>{y.ad}</span>
                      {y.not && <span style={{ color: T.soluk, fontSize: 12, fontStyle: "italic", lineHeight: 1.35 }}>{y.not}</span>}
                    </span>
                    {y.ap !== 0 && <span style={{ ...S.maliyet, color: "#ffd166", borderColor: "#ffd16655" }}>AP {y.ap > 0 ? "+" : ""}{y.ap}</span>}
                    {y.can !== 0 && <span style={{ ...S.maliyet, color: "#ff8f9b", borderColor: "#ff5f6d55" }}>Can {y.can > 0 ? "+" : ""}{y.can}</span>}
                    {y.mana !== 0 && <span style={{ ...S.maliyet, color: "#8fcbff", borderColor: "#56b6ff55" }}>Mana {y.mana > 0 ? "+" : ""}{y.mana}</span>}
                    {y.boost && Object.keys(y.boost.statlar || {}).length > 0 && (
                      <span style={{ ...S.maliyet, color: "#cdbcff", borderColor: `${T.mor}66` }}>
                        ▲ {Object.entries(y.boost.statlar).map(([k2, v]) => `${(STATLAR.find((s) => s.key === k2) || {}).ad} ${v > 0 ? "+" : ""}${v}${y.boost.tur === "yuzde" ? "%" : ""}`).join(" · ")}
                      </span>
                    )}
                    {(y.cd || 0) > 0 && (y.kalan || 0) === 0 && <span style={{ ...S.maliyet, color: T.soluk, borderColor: T.cizgi, display: "inline-flex", alignItems: "center", gap: 4 }}><Ikon ad="kum" boy={10} renk={T.soluk} /> {y.cd} tur</span>}
                    {(y.kalan || 0) > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); aktifiGuncelle((k) => { k.yetenekler = k.yetenekler.map((x) => (x.id === y.id ? { ...x, kalan: Math.max(0, x.kalan - 1) } : x)); return k; }); }}
                        style={{ ...S.maliyet, position: "relative", zIndex: 2, color: "#ff9aa5", borderColor: "#ff5f6d", background: "#2a0a12", display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", boxShadow: "0 0 8px #ff5f6d33" }}>
                        <Ikon ad="kum" boy={10} renk="#ff9aa5" /> {y.kalan}/{y.cd} · −1 tur
                      </button>
                    )}
                    <button style={{ ...S.aracBtn, padding: "3px 7px", position: "relative", zIndex: 2 }} onClick={(e) => { e.stopPropagation(); setYetForm({ ad: y.ad, not: y.not || "", ap: String(y.ap || ""), can: String(y.can || ""), mana: String(y.mana || ""), cd: String(y.cd || ""), boostTur: (y.boost && y.boost.tur) || "sabit", boostlar: { ...bosStatForm(), ...Object.fromEntries(Object.entries((y.boost && y.boost.statlar) || {}).map(([k2, v]) => [k2, String(v)])) } }); setYetDuzenId(y.id); }}><Ikon ad="kalem" boy={11} renk={T.soluk} /></button>
                    <button style={{ ...S.aracBtn, padding: "3px 7px", position: "relative", zIndex: 2 }} onClick={(e) => { e.stopPropagation(); aktifiGuncelle((k) => { k.yetenekler = k.yetenekler.filter((x) => x.id !== y.id); return k; }); if (yetDuzenId === y.id) { setYetDuzenId(null); setYetForm(bosYetForm()); } }}><Ikon ad="cop" boy={11} renk="#ff8f8f" /></button>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: `1px solid ${T.cizgi}66`, paddingTop: 10 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: T.soluk, fontFamily: "'Cinzel', serif", marginBottom: 6 }}>{yetDuzenId ? "YETENEĞİ DÜZENLE" : "YENİ YETENEK"}</div>
              <input style={{ ...S.girdiTam, marginBottom: 8 }} placeholder="Yetenek adı (örn. Ateş Topu)" value={yetForm.ad} onChange={(e) => setYetForm({ ...yetForm, ad: e.target.value })} />
              <textarea style={{ ...S.girdiTam, marginBottom: 8, minHeight: 44, resize: "vertical", fontSize: 13.5 }} placeholder="Nasıl çalışır? (örn. 3 metrelik alana ateş hasarı, yanan hedefler tur başı 1d4 yanar)" value={yetForm.not} onChange={(e) => setYetForm({ ...yetForm, not: e.target.value })} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                {[["ap", "AP", "#ffd166"], ["can", "Can", "#ff8f9b"], ["mana", "Mana", "#8fcbff"], ["cd", "Bekleme", "#cdbcff"]].map(([k, ad, renk]) => (
                  <div key={k} style={{ flex: "1 1 72px", minWidth: 72 }}>
                    <div style={{ fontSize: 10.5, color: renk, marginBottom: 2, letterSpacing: 0.5 }}>{ad}</div>
                    <input type="number" style={{ ...S.girdiTam, marginBottom: 0, padding: "6px 8px", fontSize: 14 }} placeholder={k === "cd" ? "tur" : "örn. -3"}
                      value={yetForm[k]} onChange={(e) => setYetForm({ ...yetForm, [k]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0 6px" }}>
                <span style={{ fontSize: 10.5, letterSpacing: 2, color: "#cdbcff", fontFamily: "'Cinzel', serif" }}>STAT BOOST</span>
                <select style={{ ...S.girdi, padding: "4px 7px", fontSize: 12.5 }} value={yetForm.boostTur} onChange={(e) => setYetForm({ ...yetForm, boostTur: e.target.value })}>
                  <option value="sabit">Miktar (+n)</option>
                  <option value="yuzde">Yüzde (%n)</option>
                </select>
                <span style={{ fontSize: 11, color: T.soluk, fontStyle: "italic" }}>kullanınca aktif olur</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 6, marginBottom: 10 }}>
                {STATLAR.map((s) => (
                  <div key={s.key}>
                    <div style={{ fontSize: 10, color: T.soluk, marginBottom: 2, display: "flex", alignItems: "center", gap: 3 }}><Ikon ad={s.ikon} boy={10} renk={T.soluk} /> {s.ad}</div>
                    <input type="number" style={{ ...S.girdiTam, marginBottom: 0, padding: "5px 7px", fontSize: 13 }} placeholder="0"
                      value={yetForm.boostlar[s.key]} onChange={(e) => setYetForm({ ...yetForm, boostlar: { ...yetForm.boostlar, [s.key]: e.target.value } })} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...S.anaBtn, flex: 1 }} onClick={yetKaydet}>{yetDuzenId ? "Kaydet" : "Yetenek Ekle"}</button>
                {yetDuzenId && <button style={S.iptalBtn} onClick={() => { setYetDuzenId(null); setYetForm(bosYetForm()); }}>Vazgeç</button>}
              </div>
            </div>
          </Panel>

          {/* ================= STATLAR & ETKİLER ================= */}
          <Panel renk={T.gul} ikon="kalkan" baslik="Statlar"
            ekstra={!statDuzen
              ? <button style={S.aracBtn} onClick={() => { setStatTaslak(Object.fromEntries(STATLAR.map((s) => [s.key, String(aktif.statlar[s.key] || 0)]))); setStatDuzen(true); }}><Ikon ad="kalem" boy={12} renk={T.soluk} /> Temel</button>
              : <button style={S.anaBtn} onClick={() => { aktifiGuncelle((k) => { for (const s of STATLAR) k.statlar[s.key] = parseInt(statTaslak[s.key]) || 0; return k; }); setStatDuzen(false); }}>✔ Kaydet</button>}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0 10px", flexWrap: "wrap" }}>
              <Ikon ad="yildiz" boy={13} renk="#cdbcff" />
              <span style={{ fontSize: 10.5, letterSpacing: 2, color: T.soluk, fontFamily: "'Cinzel', serif" }}>SEVİYE PUANI</span>
              <span style={{ fontSize: 12, color: T.soluk }}>Toplam</span>
              <input type="number" value={aktif.puan.toplam}
                onChange={(e) => aktifiGuncelle((k) => { k.puan.toplam = parseInt(e.target.value) || 0; return k; })}
                style={{ width: 56, background: T.koyu, border: `1px solid ${T.cizgi}`, color: "#cdbcff", borderRadius: 6, padding: "3px 6px", fontSize: 13, fontFamily: "inherit", textAlign: "center" }} />
              <span style={{ fontSize: 12, color: T.soluk }}>Seviye başı</span>
              <input type="number" value={aktif.puan.seviyeBasi ?? 3}
                onChange={(e) => aktifiGuncelle((k) => { k.puan.seviyeBasi = Math.max(0, parseInt(e.target.value) || 0); return k; })}
                style={{ width: 44, background: T.koyu, border: `1px solid ${T.cizgi}`, color: "#cdbcff", borderRadius: 6, padding: "3px 6px", fontSize: 13, fontFamily: "inherit", textAlign: "center" }} />
              <span style={{ fontSize: 12.5, color: spKalan < 0 ? "#ff8f8f" : "#cdbcff" }}>Kalan: <b>{spKalan}</b></span>
              <span style={{ fontSize: 11, color: T.soluk, fontStyle: "italic" }}>· seviye atlayınca otomatik gelir</span>
            </div>
            {STATLAR.map((s) => {
              const bonus = H.kimlik[s.key] + H.esya[s.key];
              return (
                <div key={s.key} style={S.statSatir}>
                  <Ikon ad={s.ikon} boy={16} renk={T.gul} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: T.metin, fontWeight: 600, letterSpacing: 0.5 }}>{s.ad}</div>
                    <div style={{ fontSize: 10.5, color: T.soluk }}>{s.not}</div>
                  </div>
                  {statDuzen
                    ? <input type="number" value={statTaslak[s.key]} onChange={(e) => setStatTaslak({ ...statTaslak, [s.key]: e.target.value })} style={S.statGirdi} />
                    : <span style={{ fontSize: 11.5, color: T.soluk, marginRight: 4 }}>{H.temel[s.key]}{bonus !== 0 && <span style={{ color: bonus > 0 ? "#7dffb0" : "#ff8f8f" }}> {bonus > 0 ? "+" : ""}{bonus}</span>}{H.boost[s.key] !== 0 && <span style={{ color: "#b79bff" }}> ▲{H.boost[s.key] > 0 ? "+" : ""}{H.boost[s.key]}</span>}</span>}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#160f2b", border: `1px solid ${T.mor}44`, borderRadius: 8, padding: "1px 3px" }}>
                    <button style={{ ...B.mini, width: 18, height: 18, fontSize: 12, color: "#cdbcff", border: "none", background: "transparent" }}
                      onClick={() => aktifiGuncelle((k) => { const d = k.puan.dagitim; d[s.key] = Math.max(0, (d[s.key] || 0) - 1); return k; })}>−</button>
                    <span style={{ fontSize: 12.5, color: "#cdbcff", minWidth: 14, textAlign: "center" }}>{H.puan[s.key]}</span>
                    <button disabled={spKalan <= 0} style={{ ...B.mini, width: 18, height: 18, fontSize: 12, color: spKalan <= 0 ? "#4a4364" : "#cdbcff", border: "none", background: "transparent", cursor: spKalan <= 0 ? "not-allowed" : "pointer" }}
                      onClick={() => aktifiGuncelle((k) => { const d = k.puan.dagitim; d[s.key] = (d[s.key] || 0) + 1; return k; })}>+</button>
                  </span>
                  <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 17, color: T.altin, minWidth: 34, textAlign: "right" }}>{statDuzen ? (parseInt(statTaslak[s.key]) || 0) + H.kimlik[s.key] + H.esya[s.key] + H.puan[s.key] + H.boost[s.key] : H.toplam[s.key]}</span>
                </div>
              );
            })}

            <div style={S.altBolumBaslik}>ETKİLER · BUFF / DEBUFF</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {aktif.etkiler.length === 0 && (!aktif.boostlar || aktif.boostlar.length === 0) && <span style={{ fontSize: 12.5, color: T.soluk, fontStyle: "italic" }}>Aktif etki yok.</span>}
              {(aktif.boostlar || []).map((b) => (
                <span key={b.id} style={{ ...S.etkiChip, borderColor: T.mor, color: "#cdbcff", boxShadow: `0 0 8px ${T.mor}44` }}>
                  <Ikon ad="parilti" boy={11} renk="#cdbcff" /> {b.ad}: {Object.entries(b.statlar || {}).map(([k2, v]) => `${(STATLAR.find((s) => s.key === k2) || {}).ad} ${v > 0 ? "+" : ""}${v}${b.tur === "yuzde" ? "%" : ""}`).join(", ")}
                  <button style={S.chipSil} onClick={() => aktifiGuncelle((k) => { k.boostlar = (k.boostlar || []).filter((x) => x.id !== b.id); return k; })}>✕</button>
                </span>
              ))}
              {aktif.etkiler.map((et) => (
                <span key={et.id} style={{ ...S.etkiChip, borderColor: et.tur === "buff" ? "#58e08a" : "#ff5f6d", color: et.tur === "buff" ? "#8fe7a8" : "#ff9aa5", boxShadow: `0 0 8px ${et.tur === "buff" ? "#58e08a" : "#ff5f6d"}33` }}>
                  {et.tur === "buff" ? "▲" : "▼"} {et.ad}
                  <button style={S.chipSil} onClick={() => aktifiGuncelle((k) => { k.etkiler = k.etkiler.filter((x) => x.id !== et.id); return k; })}>✕</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input style={{ ...S.girdi, flex: 1, padding: "7px 10px", fontSize: 14, minWidth: 0 }} placeholder="örn. Zehir (-2 STR, 3 tur)" value={etkiAd} onChange={(e) => setEtkiAd(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && etkiAd.trim()) { aktifiGuncelle((k) => { k.etkiler.push({ id: uid(), ad: etkiAd.trim(), tur: etkiTur }); return k; }); setEtkiAd(""); } }} />
              <select style={{ ...S.girdi, padding: "7px 8px", fontSize: 13 }} value={etkiTur} onChange={(e) => setEtkiTur(e.target.value)}>
                <option value="buff">Buff</option>
                <option value="debuff">Debuff</option>
              </select>
              <button style={S.aracBtn} onClick={() => { if (etkiAd.trim()) { aktifiGuncelle((k) => { k.etkiler.push({ id: uid(), ad: etkiAd.trim(), tur: etkiTur }); return k; }); setEtkiAd(""); } }}>Ekle</button>
            </div>
          </Panel>

          {/* ================= BECERİLER & NOTLAR ================= */}
          <Panel renk={T.amber} ikon="kitap" baslik="Beceriler & Notlar">
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <Ikon ad="cekic" boy={13} renk={T.amber} />
              <span style={{ fontSize: 11, letterSpacing: 2, color: T.soluk, fontFamily: "'Cinzel', serif" }}>YAŞAM BECERİLERİ</span>
            </div>
            {aktif.beceriler.length === 0 && <div style={{ fontSize: 12.5, color: T.soluk, fontStyle: "italic", marginBottom: 8 }}>Henüz beceri yok — adını da sen koyuyorsun.</div>}
            {aktif.beceriler.map((b) => (
              <div key={b.id} style={S.beceriSatir}>
                <span style={{ flex: 1, color: T.metin }}>{b.ad}</span>
                <span style={{ color: T.altin, fontWeight: 700 }}>{b.deger}</span>
                <button style={S.chipSil} onClick={() => aktifiGuncelle((k) => { k.beceriler = k.beceriler.filter((x) => x.id !== b.id); return k; })}>✕</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <input style={{ ...S.girdi, flex: 2, padding: "7px 10px", fontSize: 14, minWidth: 0 }} placeholder="Beceri adı (örn. Balıkçılık)" value={becAd} onChange={(e) => setBecAd(e.target.value)} />
              <input style={{ ...S.girdi, flex: 1, padding: "7px 10px", fontSize: 14, minWidth: 64 }} placeholder="Lv" value={becDeger} onChange={(e) => setBecDeger(e.target.value)} />
              <button style={S.aracBtn} onClick={() => { if (becAd.trim()) { aktifiGuncelle((k) => { k.beceriler.push({ id: uid(), ad: becAd.trim(), deger: becDeger.trim() || "1" }); return k; }); setBecAd(""); setBecDeger(""); } }}>Ekle</button>
            </div>

            <div style={S.altBolumBaslik}>NOTLAR</div>
            <textarea
              style={{ ...S.girdiTam, minHeight: 130, resize: "vertical", marginBottom: 0, lineHeight: 1.55 }}
              placeholder="Görevler, ipuçları, borçlar, kan davaları…"
              value={aktif.notlar}
              onChange={(e) => aktifiGuncelle((k) => { k.notlar = e.target.value; return k; })} />
          </Panel>

          {/* karakter sil */}
          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: 2 }}>
            {!krkSilOnay
              ? <button style={{ ...S.aracBtn, color: "#ff8f8f" }} onClick={() => setKrkSilOnay(true)}>Karakteri sil</button>
              : <span>
                  <span style={{ color: "#ff8f8f", marginRight: 10, fontSize: 14 }}>{aktif.ad} silinsin mi?</span>
                  <button style={{ ...S.aracBtn, color: "#ff8f8f", borderColor: "#ff5f6d" }} onClick={karakterSil}>Evet, sil</button>
                  <button style={{ ...S.aracBtn, marginLeft: 6 }} onClick={() => setKrkSilOnay(false)}>Vazgeç</button>
                </span>}
          </div>
        </main>
      )}

      {/* ------- seviye atlama bildirimi ------- */}
      {lvlFlash && (
        <div style={{ position: "fixed", left: "50%", top: "38%", zIndex: 120, pointerEvents: "none", textAlign: "center", animation: "lvlPop 2.2s ease-out forwards", fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}>
          <div style={{ fontSize: 15, letterSpacing: 8, color: "#ffe9a8" }}>✦ ✦ ✦</div>
          <div style={{ fontSize: 46, fontWeight: 900, color: "#ffd166", textShadow: "0 0 34px #ffd166aa, 0 3px 6px #000", whiteSpace: "nowrap" }}>SEVİYE {lvlFlash}</div>
        </div>
      )}

      {/* ------- sürükleme hayaleti ------- */}
      {ghost && (
        <div style={{ position: "fixed", left: ghost.x - 30, top: ghost.y - 30, width: 60, height: 60, pointerEvents: "none", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "#191231ee", border: `2px solid ${rc(ghost.item.nadirlik)}`, borderRadius: 10, boxShadow: `0 0 24px ${rc(ghost.item.nadirlik)}88` }}>
          <ItemGorsel item={ghost.item} boy={44} />
        </div>
      )}

      {/* ------- yedekle & yükle ------- */}
      {kayitModal && (
        <div style={S.perde} onClick={() => setKayitModal(false)}>
          <div style={{ ...S.modal, maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={S.modalBaslik}>Yedekle &amp; Yükle</h2>
            {!depoVar && (
              <div style={{ fontSize: 13, color: "#ffce7a", background: "#2a1c08", border: "1px solid #8a5a12", borderRadius: 8, padding: "8px 10px", marginBottom: 12 }}>
                ⚠ Bu pencerede kalıcı kayıt çalışmıyor — kapatmadan önce yedek kodunu mutlaka kopyala.
              </div>
            )}
            <div style={{ fontSize: 12.5, color: T.soluk, marginBottom: 12, lineHeight: 1.5 }}>
              Yedek kodu her yerde çalışır: kopyala, bir yere kaydet, arkadaşına at ya da uygulamanın yeni bir sürümüne yapıştır. Dosya indirme bazı pencerelerde tarayıcı tarafından engellenir; en garantisi <b style={{ color: T.metin }}>Kopyala</b>.
            </div>

            <div style={{ fontSize: 11, letterSpacing: 2, color: "#8fe0d2", fontFamily: "'Cinzel', serif", margin: "4px 0 6px" }}>DIŞA AKTAR</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {aktif && <button style={S.aracBtn} onClick={() => setYedekMetin(JSON.stringify(aktif, null, 2))}>Aktif karakteri koda dök</button>}
              <button style={S.aracBtn} onClick={() => setYedekMetin(JSON.stringify({ karakterler, aktifId }, null, 2))}>Tüm kasayı koda dök</button>
            </div>
            <textarea ref={yedekRef} readOnly value={yedekMetin} placeholder="Yedek kodu burada görünecek…" onFocus={(e) => e.target.select()}
              style={{ ...S.girdiTam, minHeight: 110, resize: "vertical", fontSize: 11.5, fontFamily: "monospace", marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
              <button disabled={!yedekMetin} style={{ ...S.anaBtn, opacity: yedekMetin ? 1 : 0.5 }} onClick={kopyala}>
                Kopyala
              </button>
              <button disabled={!yedekMetin} style={{ ...S.aracBtn, opacity: yedekMetin ? 1 : 0.5 }} onClick={() => { if (!dosyaIndir(yedekMetin, "canavar-gunlugu-yedek.json")) { setKopyaDurum("Tarayıcı indirmeyi engelledi — Kopyala'yı kullan."); setTimeout(() => setKopyaDurum(""), 3000); } }}>
                <Ikon ad="indir" boy={13} renk={T.soluk} /> Dosya indir
              </button>
              {kopyaDurum && <span style={{ fontSize: 12.5, color: kopyaDurum.includes("✓") ? "#7dffb0" : "#ff8f8f" }}>{kopyaDurum}</span>}
            </div>

            <div style={{ fontSize: 11, letterSpacing: 2, color: "#ffce7a", fontFamily: "'Cinzel', serif", margin: "4px 0 6px" }}>İÇE AKTAR</div>
            <textarea value={iceMetin} onChange={(e) => setIceMetin(e.target.value)} placeholder="Yedek kodunu buraya yapıştır…"
              style={{ ...S.girdiTam, minHeight: 90, resize: "vertical", fontSize: 11.5, fontFamily: "monospace", marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button style={S.anaBtn} onClick={() => {
                try {
                  const n = veriYukle(JSON.parse(iceMetin));
                  setKopyaDurum(n ? `${n} karakter yüklendi ✓` : "Kod formatı tanınmadı.");
                  if (n) setIceMetin("");
                } catch (e) { setKopyaDurum("Kod çözülemedi — tamamını kopyaladığından emin ol."); }
                setTimeout(() => setKopyaDurum(""), 3000);
              }}>Koddan yükle</button>
              <button style={S.aracBtn} onClick={() => iceAktarRef.current && iceAktarRef.current.click()}>
                <Ikon ad="yukle" boy={13} renk={T.soluk} /> Dosyadan yükle
              </button>
              <div style={{ flex: 1 }} />
              <button style={S.iptalBtn} onClick={() => setKayitModal(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* ------- item detay ------- */}
      {detay && (
        <div style={S.perde} onClick={() => setDetay(null)}>
          <div style={{ ...S.modal, borderColor: rc(detay.item.nadirlik) }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 10 }}>
              <div className={nadirSinif(detay.item.nadirlik)} style={{ position: "relative", width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0818", border: `1.5px solid ${rc(detay.item.nadirlik)}`, borderRadius: 10, boxShadow: `0 0 18px ${rc(detay.item.nadirlik)}55` }}>
                {detay.item.nadirlik === "Immortal" && <ImmortalAura />}
                {detay.item.nadirlik === "Efsanevi" && <EfsaneviKivilcimlar />}
                <span style={{ position: "relative", zIndex: 1, display: "flex" }}><ItemGorsel item={detay.item} boy={56} /></span>
              </div>
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 19, fontWeight: 700, color: rc(detay.item.nadirlik), textShadow: `0 0 14px ${rc(detay.item.nadirlik)}55` }}>{detay.item.ad}</div>
                <div style={{ fontSize: 13, color: T.soluk }}>{detay.item.tip} · <span style={{ color: rc(detay.item.nadirlik) }}>{detay.item.nadirlik}</span></div>
              </div>
            </div>
            {detay.item.zar && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: "#ffd166", padding: "2px 0 6px", fontWeight: 700 }}>
                <Ikon ad="zar" boy={17} renk="#ffd166" /> Hasar: {detay.item.zar}
              </div>
            )}
            {STATLAR.map((s) => {
              const v = detay.item.statlar && detay.item.statlar[s.key];
              return v ? (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14.5, color: v > 0 ? "#7dffb0" : "#ff8f8f", padding: "1.5px 0" }}>
                  <Ikon ad={s.ikon} boy={13} renk={v > 0 ? "#7dffb0" : "#ff8f8f"} /> {v > 0 ? "+" : ""}{v} {s.ad}
                </div>
              ) : null;
            })}
            {detay.item.deger && <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, padding: "3px 0", color: T.altin }}><Ikon ad="para" boy={14} renk={T.altin} /> {detay.item.deger} altın</div>}
            {detay.item.aciklama && <div style={{ fontSize: 15, padding: "3px 0", fontStyle: "italic", color: T.soluk, marginTop: 4 }}>{detay.item.aciklama}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {detay.konum.tur !== "slot" && SLOTLAR.some((sl) => SLOT_TIP[sl].includes(detay.item.tip)) &&
                <button style={{ ...S.anaBtn, flex: 1 }} onClick={() => kusan(detay.konum, detay.item)}>Kuşan</button>}
              {detay.konum.tur === "slot" &&
                <button style={{ ...S.anaBtn, flex: 1 }} onClick={() => cikar(detay.konum)}>Çıkar</button>}
              <button style={S.aracBtn} onClick={() => {
                setForm({ ad: detay.item.ad, tip: detay.item.tip, nadirlik: detay.item.nadirlik, deger: detay.item.deger || "", aciklama: detay.item.aciklama || "", img: detay.item.img || null, zar: detay.item.zar || "", statlar: { ...bosStatForm(), ...Object.fromEntries(Object.entries(detay.item.statlar || {}).map(([k, v]) => [k, String(v)])) } });
                setDuzenlenen(detay.konum); setDetay(null); setFormHata(""); setFormAcik(true);
              }}><Ikon ad="kalem" boy={12} renk={T.soluk} /> Düzenle</button>
              <button style={{ ...S.aracBtn, color: "#ff8f8f" }} onClick={() => itemSil(detay.konum)}><Ikon ad="cop" boy={12} renk="#ff8f8f" /> Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* ------- kimlik düzenleme ------- */}
      {kimlikAcik && kimlikTaslak && (
        <div style={S.perde} onClick={() => setKimlikAcik(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={S.modalBaslik}>Irk · Sınıf · Arkaplan</h2>
            <div style={{ fontSize: 12.5, color: T.soluk, marginBottom: 12 }}>Her biri statlara artı ya da eksi verebilir (eksi için başına − koy).</div>
            {KIMLIK_PARCA.map((p) => (
              <div key={p.key} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.cizgi}66` }}>
                <label style={S.etiket}>{p.ad}</label>
                <input style={S.girdiTam} placeholder={`${p.ad} adı…`} value={kimlikTaslak[p.key].ad}
                  onChange={(e) => setKimlikTaslak({ ...kimlikTaslak, [p.key]: { ...kimlikTaslak[p.key], ad: e.target.value } })} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(86px, 1fr))", gap: 6 }}>
                  {STATLAR.map((s) => (
                    <div key={s.key}>
                      <div style={{ fontSize: 10.5, color: T.soluk, marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}><Ikon ad={s.ikon} boy={10} renk={T.soluk} /> {s.ad}</div>
                      <input type="number" style={{ ...S.girdiTam, marginBottom: 0, padding: "5px 7px", fontSize: 13 }} placeholder="0"
                        value={kimlikTaslak[p.key].statlar[s.key] === undefined || kimlikTaslak[p.key].statlar[s.key] === 0 ? "" : kimlikTaslak[p.key].statlar[s.key]}
                        onChange={(e) => setKimlikTaslak({ ...kimlikTaslak, [p.key]: { ...kimlikTaslak[p.key], statlar: { ...kimlikTaslak[p.key].statlar, [s.key]: e.target.value } } })} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.anaBtn, flex: 1 }} onClick={() => {
                aktifiGuncelle((k) => {
                  for (const p of KIMLIK_PARCA) {
                    const st = {};
                    for (const s of STATLAR) { const v = parseInt(kimlikTaslak[p.key].statlar[s.key]); if (v) st[s.key] = v; }
                    k.kimlik[p.key] = { ad: kimlikTaslak[p.key].ad, statlar: st };
                  }
                  return k;
                });
                setKimlikAcik(false);
              }}>Kaydet</button>
              <button style={S.iptalBtn} onClick={() => setKimlikAcik(false)}>Vazgeç</button>
            </div>
          </div>
        </div>
      )}

      {/* ------- item formu ------- */}
      {formAcik && (
        <div style={S.perde} onClick={() => setFormAcik(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={S.modalBaslik}>{duzenlenen ? "Eşyayı Düzenle" : "Yeni Eşya"}</h2>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 76, height: 76, background: "#0c0818", border: `1.5px dashed ${T.cizgi}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.img ? <img src={form.img} alt="" style={{ width: 64, height: 64, objectFit: "contain" }} /> : <Ikon ad={TIP_IKON[form.tip]} boy={38} renk={rc(form.nadirlik)} stil={{ opacity: 0.75 }} />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button style={S.aracBtn} onClick={() => dosyaRef.current && dosyaRef.current.click()}><Ikon ad="firca" boy={13} renk={T.teal} /> Çizimini yükle</button>
                {form.img && <button style={{ ...S.aracBtn, color: "#ff8f8f" }} onClick={() => setForm({ ...form, img: null })}>Görseli kaldır</button>}
                <input ref={dosyaRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={async (e) => {
                    const f = e.target.files && e.target.files[0];
                    if (f) { try { setForm({ ...form, img: await gorselKucult(f) }); } catch (err) { setFormHata("Görsel yüklenemedi."); } }
                    e.target.value = "";
                  }} />
              </div>
            </div>

            <label style={S.etiket}>Ad</label>
            <input style={S.girdiTam} placeholder="örn. Ejder Dişi Kılıç" value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={S.etiket}>Tip</label>
                <select style={S.girdiTam} value={form.tip} onChange={(e) => setForm({ ...form, tip: e.target.value })}>
                  {TIPLER.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={S.etiket}>Nadirlik</label>
                <select style={{ ...S.girdiTam, color: rc(form.nadirlik) }} value={form.nadirlik} onChange={(e) => setForm({ ...form, nadirlik: e.target.value })}>
                  {NADIRLIK.map((r) => <option key={r.ad}>{r.ad}</option>)}
                </select>
              </div>
            </div>

            {form.tip === "Silah" && (
              <>
                <label style={S.etiket}>Hasar Zarı</label>
                <input style={S.girdiTam} placeholder="örn. 2d6+3" value={form.zar} onChange={(e) => setForm({ ...form, zar: e.target.value })} />
              </>
            )}
            <label style={S.etiket}>Statlar (+ veya − girebilirsin)</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, marginBottom: 10 }}>
              {STATLAR.map((s) => (
                <div key={s.key}>
                  <div style={{ fontSize: 11, color: T.soluk, marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}><Ikon ad={s.ikon} boy={11} renk={T.soluk} /> {s.ad}</div>
                  <input type="number" style={{ ...S.girdiTam, marginBottom: 0, padding: "6px 8px", fontSize: 14 }} placeholder="0"
                    value={form.statlar[s.key]}
                    onChange={(e) => setForm({ ...form, statlar: { ...form.statlar, [s.key]: e.target.value } })} />
                </div>
              ))}
            </div>

            <label style={S.etiket}>Değer (altın)</label>
            <input style={S.girdiTam} placeholder="örn. 250" value={form.deger} onChange={(e) => setForm({ ...form, deger: e.target.value })} />
            <label style={S.etiket}>Özellik / Açıklama</label>
            <textarea style={{ ...S.girdiTam, minHeight: 56, resize: "vertical" }} placeholder="örn. Vuruşta %10 ihtimalle yakar…" value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} />
            {formHata && <div style={{ color: "#ff8f8f", fontSize: 14, marginBottom: 8 }}>{formHata}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={{ ...S.anaBtn, flex: 1 }} onClick={itemKaydet}>{duzenlenen ? "Kaydet" : "Çantaya Ekle"}</button>
              <button style={S.iptalBtn} onClick={() => setFormAcik(false)}>Vazgeç</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= stiller =================
const S = {
  sayfa: {
    minHeight: "100vh", color: T.metin, fontFamily: "'Alegreya', Georgia, serif", padding: "0 0 60px", overflowX: "hidden",
    backgroundColor: "#080511",
    backgroundImage: "radial-gradient(950px 480px at 50% -10%, #2a154add, transparent), radial-gradient(700px 380px at 8% 105%, #0d2f2ba8, transparent), radial-gradient(700px 380px at 94% 105%, #38102bb0, transparent), repeating-linear-gradient(45deg, #ffffff02 0 1px, transparent 1px 10px)",
  },
  baslik: { textAlign: "center", padding: "30px 16px 6px", position: "relative" },
  h1: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif", fontSize: "clamp(26px, 7vw, 48px)", margin: "6px 0 0", letterSpacing: 2, fontWeight: 900,
    backgroundImage: "linear-gradient(115deg, #ffe9a8 5%, #f0c75e 35%, #ff7ab0 70%, #c77bff 100%)",
    WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: T.altin,
    filter: "drop-shadow(0 2px 8px #000d) drop-shadow(0 0 24px #c77bff33)",
  },
  online: { color: T.teal, letterSpacing: 8, fontSize: 12, marginTop: 3, fontFamily: "'Cinzel', serif", textShadow: "0 0 12px #4ed8c366" },
  krkCubuk: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", maxWidth: 1880, margin: "18px auto 12px", padding: "0 20px", position: "relative", zIndex: 2 },
  krkBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#120c22", border: `1px solid ${T.cizgi}`, color: T.soluk, padding: "7px 14px", borderRadius: 20, fontSize: 14 },
  krkAktif: { display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(180deg, #f0c75e2e, #f0c75e10)", border: `1px solid ${T.altin}`, color: "#ffe9a8", padding: "7px 14px", borderRadius: 20, fontSize: 14, fontWeight: 700, boxShadow: "0 0 14px #f0c75e44" },
  krkEkleBtn: { background: "transparent", border: `1px dashed ${T.cizgi}`, color: T.soluk, padding: "7px 14px", borderRadius: 20, fontSize: 14 },
  aracBtn: { display: "inline-flex", alignItems: "center", gap: 5, background: "#120c22", border: `1px solid ${T.cizgi}`, color: T.soluk, padding: "6px 12px", borderRadius: 7, fontSize: 13, fontFamily: "inherit" },
  icerik: { maxWidth: 1880, margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(370px, 1fr))", gap: 20, alignItems: "start", position: "relative", zIndex: 2 },
  seviyeRozet: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9.5, letterSpacing: 2, color: T.soluk, background: "#0c0818", border: `1px solid ${T.cizgi}`, borderRadius: 8, padding: "4px 8px" },
  seviyeGirdi: { width: 46, background: "transparent", border: "none", color: "#ffe9a8", fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 17, textAlign: "center" },
  kimlikSatir: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 6 },
  kimlikChip: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: T.soluk, background: "#0c0818", border: `1px solid ${T.cizgi}`, borderRadius: 14, padding: "4px 10px" },
  cantaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(54px, 1fr))", gap: 8 },
  ipucu: { fontSize: 12, color: "#5d5480", fontStyle: "italic", textAlign: "center", marginTop: 12 },
  paraKutu: { display: "flex", alignItems: "center", gap: 8, background: "#0c0818", border: `1px solid ${T.cizgi}`, borderRadius: 9, padding: "6px 12px", boxShadow: "inset 0 2px 8px #000b", flex: 1, minWidth: 150 },
  paraGirdi: { flex: 1, background: "transparent", border: "none", color: "#ffe9a8", fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 17, minWidth: 50 },
  slotBtn: { display: "inline-flex", alignItems: "center", background: "linear-gradient(180deg, #55e0c9, #2a9a87)", border: "1px solid #1b6f61", color: "#08201c", padding: "8px 13px", borderRadius: 9, fontWeight: 700, fontSize: 13.5, fontFamily: "'Cinzel', serif", letterSpacing: 0.5, boxShadow: "0 2px 10px #000a, 0 0 14px #4ed8c344, inset 0 1px 0 #fff6" },
  maliyet: { fontSize: 11.5, fontWeight: 700, border: "1px solid", borderRadius: 10, padding: "2px 8px", background: "#0c0818", letterSpacing: 0.4 },
  statSatir: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 9, padding: "5px 0", borderBottom: `1px solid ${T.cizgi}55` },
  statGirdi: { width: 62, background: T.koyu, border: `1px solid ${T.cizgi}`, color: T.metin, borderRadius: 6, padding: "4px 7px", fontFamily: "inherit", fontSize: 14, textAlign: "center" },
  altBolumBaslik: { fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: T.soluk, margin: "16px 0 8px", textAlign: "center" },
  etkiChip: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, background: "#0c0818", border: "1.5px solid", borderRadius: 14, padding: "4px 10px" },
  chipSil: { background: "transparent", border: "none", color: T.soluk, fontSize: 12, padding: 0, lineHeight: 1 },
  beceriSatir: { display: "flex", alignItems: "center", gap: 10, padding: "6px 2px", borderBottom: `1px solid ${T.cizgi}55`, fontSize: 14.5 },
  bos: { textAlign: "center", color: T.soluk, fontStyle: "italic", padding: "40px 16px" },
  girdi: { background: "#120c22", border: `1px solid ${T.cizgi}`, color: T.metin, padding: "9px 12px", borderRadius: 7, fontSize: 15, fontFamily: "inherit" },
  girdiTam: { background: T.koyu, border: `1px solid ${T.cizgi}`, color: T.metin, padding: "9px 12px", borderRadius: 7, fontSize: 15, fontFamily: "inherit", width: "100%", marginBottom: 10 },
  anaBtn: { background: "linear-gradient(180deg, #ffd98a, #c9973f)", border: "1px solid #8a6a26", color: "#1c130a", padding: "9px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: "'Cinzel', serif", letterSpacing: 0.5, boxShadow: "0 2px 10px #000a, 0 0 16px #f0c75e33, inset 0 1px 0 #fff6" },
  iptalBtn: { background: "transparent", border: `1px solid ${T.cizgi}`, color: T.soluk, padding: "9px 16px", borderRadius: 8, fontSize: 14 },
  perde: { position: "fixed", inset: 0, background: "#03020abb", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 },
  modal: { background: "linear-gradient(180deg, #1a1230, #100a1e)", border: `1.5px solid ${T.altin}55`, borderRadius: 14, padding: "20px 18px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 16px 60px #000e, 0 0 40px #c77bff1c", position: "relative" },
  modalBaslik: { fontFamily: "'Cinzel', serif", color: "#ffe9a8", margin: "0 0 14px", fontSize: 19, letterSpacing: 1 },
  etiket: { display: "block", fontSize: 13, color: T.soluk, marginBottom: 4, letterSpacing: 0.5 },
};