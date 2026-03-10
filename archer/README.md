# ARCHER Dashboard - Panduan Teknikal & Realtime

Dashboard ini adalah aplikasi pemantauan kripto berbasis **Vite + TypeScript** yang dioptimalkan untuk performa tinggi dengan data dari API publik. Dokumentasi ini menjelaskan bagaimana fitur realtime dan struktur proyek ini bekerja secara spesifik.

## 📁 Struktur Folder Proyek
Proyek ini menggunakan struktur modular yang bersih:
- `src/services/api.ts`: Logika pemanggilan API CoinGecko (Historical & Simple Price).
- `src/pages/Dashboard.tsx`: Komponen utama yang mengelola state data dan polling.
- `src/utils/indicators.ts`: Algoritma perhitungan indikator (RSI, EMA, ATR, Liquidity Zones).
- `src/components/`: Komponen UI modular (Sidebar, TokenHeader, PriceChart, MetricCards).
- `src/config/coins.ts`: Daftar aset koin yang didukung oleh sistem.

## ⚡ Implementasi Data Realtime (Polling)
Karena API publik gratis sering membatasi akses WebSocket, ARCHER menggunakan metode **HTTP Polling** yang efisien.

### 1. Endpoint API (`api.ts`)
Fungsi `getRealtimePrice(id)` menggunakan endpoint `/simple/price` dari CoinGecko yang sangat ringan.

### 2. Mekanisme Polling (`Dashboard.tsx`)
Data diperbarui secara otomatis tanpa refresh halaman menggunakan hook `useEffect`:

```typescript
useEffect(() => {
    const fetchRealtime = async () => {
        try {
            const price = await getRealtimePrice(selectedCoin);
            setRealtimePrice(price);
        } catch (err) {
            console.warn('[Dashboard] Realtime fetch failed:', err);
        }
    };

    fetchRealtime(); // Ambil segera saat komponen dimuat
    const interval = setInterval(fetchRealtime, 30000); // Polling setiap 30 detik
    return () => clearInterval(interval); // Cleanup saat pindah koin/halaman
}, [selectedCoin]);
```

### 3. Visualisasi Realtime (`TokenHeader.tsx`)
Harga yang diperbarui akan dikirim ke komponen `TokenHeader` dan ditampilkan dengan indikator **Live Pulse** (titik berkedip merah muda/cyan).

## 📊 Analisis & Indikator
Selain harga realtime, ARCHER melakukan analisis mendalam setiap kali data historis diperbarui via `analyzeMarket(prices)` dalam `indicators.ts`. Hasilnya mencakup:
- **Optimal Entry Range**: Zona beli terbaik.
- **Stop Loss (SL)**: Batas risiko berdasarkan volatilitas (ATR).
- **Confidence Level**: Skor keandalan sinyal (0-100%).

## 🛡️ Menghindari Limit API Gratis
Untuk menjaga aplikasi tetap berjalan lancar pada API gratis:
- **Interval 30 Detik**: Dipilih sebagai titik tengah yang aman antara aktualitas data dan batas limit API.
- **Efficient Filtering**: Data chart dikurangi kepadatannya (misal: setiap 4 data saja untuk 4H) agar rendering lebih ringan.
- **Error Handling**: Jika API gagal merespons (error 429 - Too Many Requests), sistem akan menampilkan harga terakhir yang berhasil diambil dan tetap stabil.

## 🚀 Kesimpulan
Dalam ARCHER, data realtime bukan hanya sekadar angka yang bergerak, tetapi hasil dari orkestrasi antara polling yang efisien, manajemen state React yang tepat, dan perhitungan teknikal yang akurat sesuai dengan kondisi pasar saat itu.

## 🤖 Strategi Akumulasi Spot (High Accuracy)
Sistem ini dirancang khusus untuk market **Spot** dengan fokus pada akumulasi di area harga terbaik dan target profit yang stabil berdasarkan timeframe.

### Strategi & Aturan Logika:
1.  **Timeframe-Aware targets**: 
    - Target harga (Entry, TP, SL) secara otomatis menyesuaikan diri dengan window data yang Anda pilih (4H, 1D, 1W, 1M).
2.  **Stability Anchor (EMA 200)**:
    - Menggunakan EMA 200 sebagai "anchor" tren. Jika harga di atas EMA, sistem fokus pada strategi **Buy the Dip**. Jika di bawah, sistem fokus pada **Exit di Pullback**.
3.  **Dynamic ATR Scaling**:
    - Lebar target dan batas risiko (SL) dihitung menggunakan ATR yang disesuaikan (scaled) dengan rapatnya data, memastikan angka tetap masuk akal untuk holding jangka pendek maupun panjang.
4.  **Optimal Entry Range**:
    - Zona beli dihitung berdasarkan volatilitas historis dan level support, memberikan rentang yang lebih stabil dibandingkan hanya mengikuti harga saat ini.

### Akurasi & Kedisiplinan:
Setiap sinyal dilengkapi dengan **Confidence Level**. Untuk performa terbaik, fokuslah pada sinyal dengan skor di atas 75% saat market sedang dalam sesi aktif (Volume tinggi).

---
*Dokumentasi ini disesuaikan secara khusus untuk implementasi dalam direktori `/home/pxy18/Documents/ARCHER/archer/`.*
