/* ==========================================================
   script.js — otak website portofolio
   1) DATA        : semua isi website (bisa kamu ganti di sini)
   2) TAMPILKAN   : memasukkan data ke halaman
   3) PANEL EDIT  : mengubah isi lewat formulir, lalu disimpan
   ========================================================== */

/* ---------- 1) DATA AWAL ---------- */
const KUNCI = "portofolio-data-v1"; // nama "laci" penyimpanan di browser

const dataAwal = {
  nama: "Nama Kamu",
  tag: "👋 Halo, saya",
  peran: "Web Developer Pemula",
  singkat: "Saya suka membuat website yang rapi, cepat, dan nyaman dipakai.",
  tentang:
    "Saya sedang belajar membuat website dengan HTML, CSS, dan JavaScript.\n" +
    "Project yang saya kembangkan adalah website portofolio dan aplikasi sederhana " +
    "yang bisa dibuka di HP maupun laptop. Target saya: terus belajar dan membuat karya yang bermanfaat.",
  warna: "#3b6fe0",
  foto: "foto.jpg",
  pendidikan: [
    { sekolah: "Nama Sekolah / Kampus", jurusan: "Nama Jurusan", tahun: "Lulus 2024" }
  ],
  project: [
    { judul: "Website Portofolio", deskripsi: "Website pribadi yang isinya bisa diubah langsung.", link: "" },
    { judul: "Project Kedua", deskripsi: "Ceritakan project kamu di sini.", link: "" }
  ],
  kontak: { wa: "", ig: "", email: "" }
};

let data = muatData();
let fotoBaru = null; // menyimpan foto sementara sebelum klik Simpan

function salin(obj) { return JSON.parse(JSON.stringify(obj)); }

function muatData() {
  try {
    const tersimpan = localStorage.getItem(KUNCI);
    if (tersimpan) return { ...salin(dataAwal), ...JSON.parse(tersimpan) };
  } catch (e) { /* abaikan, pakai data awal */ }
  return salin(dataAwal);
}

function simpanData() {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------- Alat bantu ---------- */
const $ = (id) => document.getElementById(id);

// Mengamankan teks agar tidak dianggap kode HTML
function aman(teks) {
  const d = document.createElement("div");
  d.textContent = teks || "";
  return d.innerHTML;
}

function toast(pesan) {
  const t = $("toast");
  t.textContent = pesan;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- 2) TAMPILKAN DATA KE HALAMAN ---------- */
function tampilkan() {
  document.documentElement.style.setProperty("--main", data.warna);
  document.title = data.nama + " | Portofolio";

  $("logo").textContent = data.nama;
  $("tTag").textContent = data.tag;
  $("tNama").textContent = data.nama;
  $("tPeran").textContent = data.peran;
  $("tSingkat").textContent = data.singkat;
  $("tTentang").textContent = data.tentang;
  $("foto").src = data.foto || "foto.jpg";
  $("tFooter").textContent = "© " + new Date().getFullYear() + " " + data.nama;

  $("listPendidikan").innerHTML = data.pendidikan.map((p) =>
    `<div class="edu"><b>${aman(p.sekolah)}</b><span>${aman(p.jurusan)}</span><br><em>${aman(p.tahun)}</em></div>`
  ).join("") || `<p class="empty">Belum ada data pendidikan.</p>`;

  $("listProject").innerHTML = data.project.map((p) =>
    `<article class="card"><h4>${aman(p.judul)}</h4><p>${aman(p.deskripsi)}</p>` +
    (p.link ? `<a href="${aman(p.link)}" target="_blank" rel="noopener">Buka project</a>` : "") +
    `</article>`
  ).join("") || `<p class="empty">Belum ada project. Klik Edit untuk menambah.</p>`;

  const k = data.kontak, tombol = [];
  if (k.wa) tombol.push(`<a class="btn" target="_blank" rel="noopener" href="https://wa.me/${aman(k.wa.replace(/\D/g, ""))}">WhatsApp</a>`);
  if (k.ig) tombol.push(`<a class="btn" target="_blank" rel="noopener" href="https://instagram.com/${aman(k.ig.replace("@", ""))}">Instagram</a>`);
  if (k.email) tombol.push(`<a class="btn" href="mailto:${aman(k.email)}">Email</a>`);
  $("listKontak").innerHTML = tombol.join("") || `<p class="empty">Klik Edit untuk mengisi kontak.</p>`;
}

/* ---------- 3) PANEL EDIT ---------- */
const kolomPendidikan = [
  { k: "sekolah", ph: "Nama sekolah / kampus" },
  { k: "jurusan", ph: "Jurusan" },
  { k: "tahun", ph: "Tahun lulus (contoh: Lulus 2024)" }
];
const kolomProject = [
  { k: "judul", ph: "Judul project" },
  { k: "deskripsi", ph: "Deskripsi singkat", area: true },
  { k: "link", ph: "Link project (boleh kosong)" }
];

function tambahBaris(kotak, kolom, isi = {}) {
  const baris = document.createElement("div");
  baris.className = "row";
  kolom.forEach((f) => {
    const input = document.createElement(f.area ? "textarea" : "input");
    input.placeholder = f.ph;
    input.dataset.k = f.k;
    input.value = isi[f.k] || "";
    baris.appendChild(input);
  });
  const hapus = document.createElement("button");
  hapus.type = "button";
  hapus.className = "del";
  hapus.textContent = "🗑 Hapus";
  hapus.onclick = () => baris.remove();
  baris.appendChild(hapus);
  kotak.appendChild(baris);
}

function bacaBaris(kotak) {
  return [...kotak.querySelectorAll(".row")]
    .map((b) => {
      const o = {};
      b.querySelectorAll("[data-k]").forEach((i) => (o[i.dataset.k] = i.value.trim()));
      return o;
    })
    .filter((o) => Object.values(o).some((v) => v));
}

function bukaPanel() {
  $("fNama").value = data.nama;
  $("fTag").value = data.tag;
  $("fPeran").value = data.peran;
  $("fSingkat").value = data.singkat;
  $("fTentang").value = data.tentang;
  $("fWarna").value = data.warna;
  $("fWa").value = data.kontak.wa;
  $("fIg").value = data.kontak.ig;
  $("fEmail").value = data.kontak.email;
  fotoBaru = null;
  $("fFoto").value = "";

  $("boxPendidikan").innerHTML = "";
  data.pendidikan.forEach((p) => tambahBaris($("boxPendidikan"), kolomPendidikan, p));
  $("boxProject").innerHTML = "";
  data.project.forEach((p) => tambahBaris($("boxProject"), kolomProject, p));

  $("panel").classList.add("show");
  $("overlay").classList.add("show");
  $("panel").setAttribute("aria-hidden", "false");
}

function tutupPanel() {
  $("panel").classList.remove("show");
  $("overlay").classList.remove("show");
  $("panel").setAttribute("aria-hidden", "true");
}

// Mengecilkan foto agar muat di penyimpanan browser
$("fFoto").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const pembaca = new FileReader();
  pembaca.onload = () => {
    const gambar = new Image();
    gambar.onload = () => {
      const skala = Math.min(1, 700 / Math.max(gambar.width, gambar.height));
      const kanvas = document.createElement("canvas");
      kanvas.width = gambar.width * skala;
      kanvas.height = gambar.height * skala;
      kanvas.getContext("2d").drawImage(gambar, 0, 0, kanvas.width, kanvas.height);
      fotoBaru = kanvas.toDataURL("image/jpeg", 0.85);
      toast("Foto siap. Klik Simpan.");
    };
    gambar.src = pembaca.result;
  };
  pembaca.readAsDataURL(file);
});

$("btnSimpan").onclick = () => {
  data.nama = $("fNama").value.trim() || "Nama Kamu";
  data.tag = $("fTag").value.trim();
  data.peran = $("fPeran").value.trim();
  data.singkat = $("fSingkat").value.trim();
  data.tentang = $("fTentang").value.trim();
  data.warna = $("fWarna").value;
  data.kontak = { wa: $("fWa").value.trim(), ig: $("fIg").value.trim(), email: $("fEmail").value.trim() };
  data.pendidikan = bacaBaris($("boxPendidikan"));
  data.project = bacaBaris($("boxProject"));
  if (fotoBaru) data.foto = fotoBaru;

  tampilkan();
  tutupPanel();
  toast(simpanData() ? "Tersimpan ✅" : "Gagal menyimpan. Coba foto yang lebih kecil.");
};

$("btnReset").onclick = () => {
  if (!confirm("Kembalikan semua isi ke awal?")) return;
  try { localStorage.removeItem(KUNCI); } catch (e) {}
  data = salin(dataAwal);
  tampilkan();
  tutupPanel();
  toast("Sudah dikembalikan");
};

/* ---------- Tombol-tombol lain ---------- */
$("btnEdit").onclick = bukaPanel;
$("btnTutup").onclick = tutupPanel;
$("overlay").onclick = tutupPanel;
$("addPendidikan").onclick = () => tambahBaris($("boxPendidikan"), kolomPendidikan);
$("addProject").onclick = () => tambahBaris($("boxProject"), kolomProject);

// Menu HP: buka / tutup, dan menutup otomatis setelah link diklik
$("burger").onclick = () => $("menu").classList.toggle("open");
$("menu").onclick = () => $("menu").classList.remove("open");

/* ---------- Jalankan saat halaman dibuka ---------- */
tampilkan();
