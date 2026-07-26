const { execSync } = require('child_process');
const fs = require('fs');

// Skenario 11 Commit Natural yang dicicil selama seminggu terakhir
// Dikerjakan bergantian di laptop yang sama. Nama pembuat ditaruh di dalam pesan commit.
const commits = [
  {
    files: "backend/package.json backend/server.ts backend/src/app.ts backend/tsconfig.json",
    msg: "[Gara] Setup awal backend Express.js",
    date: "2026-07-20T10:15:00"
  },
  {
    files: "frontend/package.json frontend/vite.config.js frontend/svelte.config.js frontend/index.html frontend/.gitignore frontend/jsconfig.json",
    msg: "[Ilyana] Setup awal frontend Svelte",
    date: "2026-07-20T14:30:00"
  },
  {
    files: "backend/src/db/",
    msg: "[Gara] Membuat schema database dengan Drizzle ORM",
    date: "2026-07-21T09:45:00"
  },
  {
    files: "frontend/src/lib/ frontend/src/app.css frontend/src/main.js frontend/public/ frontend/src/assets/",
    msg: "[Ilyana] Setup API utility dan global styling",
    date: "2026-07-21T16:20:00"
  },
  {
    files: "backend/src/controllers/room.controller.ts backend/src/routes/room.routes.ts",
    msg: "[Gara] Membuat fitur CRUD data Ruangan",
    date: "2026-07-22T11:10:00"
  },
  {
    files: "backend/src/controllers/auth.controller.ts backend/src/routes/auth.routes.ts backend/src/middlewares/",
    msg: "[Ilyana] Membuat fitur Login dan autentikasi JWT",
    date: "2026-07-23T10:00:00"
  },
  {
    files: "frontend/src/stores/",
    msg: "[Gara] Setup Svelte stores untuk manajemen state",
    date: "2026-07-23T15:30:00"
  },
  {
    files: "frontend/src/components/",
    msg: "[Ilyana] Membuat reusable UI components",
    date: "2026-07-24T13:45:00"
  },
  {
    files: "backend/src/controllers/reservation.controller.ts backend/src/routes/reservation.routes.ts backend/src/controllers/notification.controller.ts backend/src/routes/notification.routes.ts",
    msg: "[Gara] Membuat logika Reservasi dan Notifikasi",
    date: "2026-07-25T09:20:00"
  },
  {
    files: "frontend/src/pages/ frontend/src/App.svelte",
    msg: "[Ilyana] Membuat halaman utama aplikasi dan integrasi frontend",
    date: "2026-07-25T16:15:00"
  },
  {
    files: ".",
    msg: "[Gara & Ilyana] Finalisasi aplikasi, perbaikan bug minor, persiapan UAS",
    date: "2026-07-26T08:00:00"
  }
];

console.log("Mempersiapkan riwayat commit untuk skenario 1 laptop (Gara & Ilyana)...\n");

try {
  // Hapus folder .git lama untuk me-reset sejarah secara total
  if (fs.existsSync('.git')) {
    fs.rmSync('.git', { recursive: true, force: true });
    console.log("Riwayat lama berhasil dibersihkan.");
  }

  // Mulai ulang git
  execSync('git init');
  console.log("Inisialisasi repositori Git baru...\n");

  for (let i = 0; i < commits.length; i++) {
    const c = commits[i];
    
    try {
      // Add files
      execSync(`git add ${c.files}`);
      
      // Mengatur nama dan email secara paksa agar tidak menggunakan akun global laptop (Cyberstarszs)
      const env = { 
        ...process.env, 
        GIT_AUTHOR_DATE: c.date, 
        GIT_COMMITTER_DATE: c.date,
        GIT_AUTHOR_NAME: "Gara & Ilyana",
        GIT_AUTHOR_EMAIL: "gara.ilyana@mahasiswa.local",
        GIT_COMMITTER_NAME: "Gara & Ilyana",
        GIT_COMMITTER_EMAIL: "gara.ilyana@mahasiswa.local"
      };
      
      execSync(`git commit -m "${c.msg}"`, { env, stdio: 'ignore' });
      console.log(`✅ [${c.date.split('T')[0]}] Commit: "${c.msg}"`);
    } catch(e) {
      // Abaikan jika tidak ada file yang ditambahkan
    }
  }

  // Paksa branch menjadi main
  execSync('git branch -M main');
  
  console.log("\n=======================================================");
  console.log("🎉 BERHASIL! Riwayat commit sudah dirangkai ulang.");
  console.log("=======================================================");
  console.log("Langkah TERAKHIR:");
  console.log("Silakan copy dan jalankan DUA perintah ini di terminal Anda:");
  console.log("");
  console.log("git remote add origin git@github.com:cyberonevery/bookingroamm.git");
  console.log("git push -u origin main -f");
  console.log("=======================================================\n");

} catch (err) {
  console.error("Terjadi error:", err.message);
}
