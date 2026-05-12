# 🚪 RFID Door Lock System with Real-Time Monitoring

Sistem akses pintu berbasis RFID dengan monitoring real-time melalui web dashboard. Sistem ini memungkinkan pengguna terdaftar untuk membuka pintu menggunakan kartu RFID, merekam foto saat akses berlangsung, serta memantau aktivitas akses secara langsung melalui antarmuka web.

## ✨ Fitur

- 🔑 **Akses Pintu via RFID** — Buka pintu menggunakan kartu/tag RFID yang telah terdaftar
- 📷 **Foto Otomatis saat Akses** — ESP32-CAM mengambil foto setiap kali akses terjadi
- 🌐 **Monitoring Real-Time via Web** — Pantau aktivitas akses pintu secara langsung melalui web dashboard
- 📋 **Riwayat Akses** — Rekam dan tampilkan log setiap kejadian akses

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Mikrokontroler | ESP32 |
| Kamera | ESP32-CAM |
| Backend | Express.js (Node.js) |
| Frontend | React.js + Vite + Tailwind CSS |
| Database | MySQL |

## 📁 Struktur Repository

```
rfid-doorlock-lpm-unsika/
├── esp32-main/
│   └── esp32_main/
│       └── esp32_main.ino     # Kode ESP32 utama (RFID + relay)
├── esp32-cam/
│   └── esp32_cam/
│       └── esp32_cam.ino      # Kode ESP32-CAM (pengambilan foto)
├── backend/                   # REST API dengan Express.js
│   ├── config/
│   ├── controllers/
│   ├── jobs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── app.js
│   ├── hash.js
│   ├── .env.example
│   └── package.json
├── frontend/                  # Web dashboard dengan React.js
│   ├── public/
│   ├── src/
│   └── package.json
├── database/
│   └── schema.sql             # Struktur database MySQL
└── README.md
```

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js v18+
- MySQL
- Arduino IDE (untuk upload ke ESP32)
- Board ESP32 & ESP32-CAM

---

### 1. Database

```bash
# Buat database baru di MySQL
CREATE DATABASE doorlock_iot;

# Import schema
mysql -u root -p doorlock_iot < database/schema.sql
```

---

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Salin file environment
cp .env.example .env

# Isi variabel di file .env sesuai konfigurasi lokal
# Lalu jalankan server
npm run dev
```

---

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

---

### 4. ESP32

1. Buka Arduino IDE
2. Buka file `esp32-main/esp32_main/esp32_main.ino`
3. Sesuaikan konfigurasi WiFi dan URL backend di dalam kode
4. Upload ke board ESP32

Ulangi langkah yang sama untuk `esp32-cam/esp32_cam/esp32_cam.ino` dan upload ke board ESP32-CAM.

## 👤 Author

**Bhanu Azizi**  
NIM: 2210631170013  
Universitas Singaperbangsa Karawang (UNSIKA)

## 📄 Lisensi

Repository ini dibuat untuk keperluan akademik.
