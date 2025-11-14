# 🔥 Forensic API Load Testing CLI

Dashboard CLI interaktif untuk **pengujian forensik**, **stress test**, dan **load analysis** terhadap endpoint HTTP yang Anda miliki izin untuk diuji.
Menampilkan statistik real-time, grafik RPS, deteksi API DOWN, deteksi FAILED SEND, dan multi-thread worker.

---

## ⚠️ Disclaimer

**Tool ini hanya untuk pengujian forensik dan load testing pada endpoint milik sendiri atau yang memiliki izin resmi.**
Segala bentuk penyalahgunaan berada di luar tanggung jawab pembuat.

---

# 🚀 Fitur Utama

### ✔ Multithread (Worker Threads)

Memanfaatkan semua core CPU untuk melakukan load test maksimal.

### ✔ Realtime CLI Dashboard

Menggunakan `blessed` & `blessed-contrib`:

* Status panel
* Grafik RPS bergerak
* Tabel worker
* Live log events

### ✔ API DOWN Detector

Mendeteksi server mati / timeout / ECONNRESET / ECONNREFUSED:

```
Worker 2: API DOWN (ETIMEDOUT)
```

### ✔ FAILED SEND Detector

Jika request gagal dikirim karena masalah jaringan:

```
Worker 3: FAILED SEND (Socket hang up)
```

### ✔ Statistik Lengkap

* Total Requests
* OK
* Error
* API DOWN
* Average Latency
* Per-worker performance

### ✔ Support Endpoint Arbitrary

Bukan hanya Telegram API, tetapi **semua HTTP endpoint apa pun**, termasuk:

* custom backend
* webhook
* proxy server
* endpoint vercel / cloudflare / firebase

---

# 📦 Instalasi

Clone repo:

```
git clone https://github.com/Dikrey/scammer-spam
cd reponame
```

Install paket:

```
npm install axios chalk cli-progress blessed contrib
```

Buat `urls.txt` berisi daftar URL target:

```
https://api.telegram.org/bot6901227784:AAGlB5-p7XPmfsBRngSmm3I3WIyX70fL724/sendMessage?parse_mode=markdown&chat_id=6785395742&text=
```

> Setiap baris = satu endpoint.

---

# ▶️ Menjalankan

```
node main.js
```

Dashboard CLI akan muncul:

* Realtime RPS graph
* Worker performance table
* Log event API DOWN
* Average latency

Keluar dari CLI:

```
q / esc / CTRL + C
```

---

# 📁 Struktur Projek

```
├── main.js          # CLI dashboard + worker manager
├── worker.js        # mesin load test per-thread
├── urls.txt         # daftar endpoint yang diuji
├── package.json
└── README.md
```

---

# 🖥 Tampilan Dashboard CLI

```
┌──────────────────── Status ──────────────────────┐
│ Total Requests : 12900                            │
│ OK Responses   : 12840                            │
│ Errors         : 20                               │
│ API DOWN       : 40                               │
│ Avg Latency    : 120.4 ms                         │
└──────────────────────────────────────────────────┘

┌───────────── RPS Chart ─────────────┐
│ ***█▇▄▂*** (grafik bergerak)        │
└─────────────────────────────────────┘

┌────────────────── Workers ────────────────────┐
│ ID      Sent     OK     Err    Down   Latency │
│ Worker1 4500     4450    5     45      120ms   │
│ Worker2 4200     4150    3     30      110ms   │
└────────────────────────────────────────────────┘

┌──────────────────── Logs ──────────────────────┐
│ Worker 1: API DOWN (ETIMEDOUT)                 │
│ Worker 2: FAILED SEND (Socket hang up)         │
│ Worker 1: batch done (1 req)                   │
└────────────────────────────────────────────────┘
```

---

# ⚙️ Konfigurasi

Ubah jumlah thread di `main.js`:

```js
const THREADS = 4;
```

Tambah URL sebanyak yang diinginkan di `urls.txt`.

---

# ❓ FAQ

### **1. Apakah tool ini bisa mendeteksi apakah API benar-benar down?**

Ya. Jika server unreachable, timeout, atau connection refused → status “API DOWN” muncul.

### **2. Apakah tool ini bisa melihat apakah pesan Telegram berhasil terkirim?**

Jika endpoint mem-forward ke Telegram (seperti server Vercel malware), maka:

* **HTTP 200** = pesan berhasil diproses
* **API DOWN** = server tidak bisa meneruskan ke Telegram
* **FAILED SEND** = request gagal masuk ke server

### **3. Apakah bisa menambah theme neon/cyberpunk?**

Ya. Tool ini modular dan mudah diperluas.

---

# 🤝 Kontribusi

Pull Request dipersilakan.
Silakan buat issue bila ada bug atau permintaan fitur.

---

# 📜 Lisensi

MIT License.

---
