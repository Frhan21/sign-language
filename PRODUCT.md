# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pengguna utama adalah pemula yang ingin mempelajari atau memakai SIBI dan BISINDO untuk menerjemahkan gestur tangan. Mereka membutuhkan alur yang mudah dipahami di desktop maupun ponsel, termasuk sebelum memberikan izin kamera. Pengguna rutin tetap perlu mengakses kamera, input suara, penyusunan pesan, dan keluaran suara tanpa langkah yang berlebihan.

## Product Purpose

Isyarat membantu pengguna mempelajari gestur yang didukung model, menerjemahkan gestur menjadi token dan pesan, mengubah ucapan menjadi teks, serta membacakan pesan melalui suara. Keberhasilan berarti pengguna memahami langkah berikutnya, dapat memulai kamera secara sadar, melihat status pengenalan, memperbaiki pesan, dan menyampaikan hasilnya.

## Positioning

Isyarat menggabungkan dua sistem bahasa isyarat Indonesia, katalog gestur yang dapat dipelajari tanpa kamera, penerjemahan berbasis model di browser, penyusunan pesan, STT, TTS, dan pengiriman MQTT dalam satu workspace web.

## Operating Context

Pengguna membuka satu halaman berbahasa Indonesia, memilih SIBI atau BISINDO, mempelajari gestur bila perlu, lalu memulai kamera melalui tindakan eksplisit. Mereka menahan gestur sampai prediksi stabil, memeriksa token dan tingkat keyakinan, menyusun atau mengedit pesan, lalu memakai TTS. Sebagai alternatif, pengguna dapat memasukkan pesan melalui STT. Pengalaman harus tetap jelas pada ponsel dan desktop serta saat izin, model, kamera, mikrofon, atau suara tidak tersedia.

## Capabilities and Constraints

- Frontend menggunakan HTML, CSS, dan JavaScript browser tanpa framework atau build step.
- Backend menggunakan Node.js dan Express serta meneruskan token dan pesan melalui MQTT.
- Model TensorFlow.js lokal mendukung 24 label SIBI dan 47 label BISINDO.
- MediaPipe Hands dan browser camera API menyediakan landmark tangan.
- Web Speech Recognition menyediakan STT berbahasa Indonesia bila browser mendukungnya.
- SpeechSynthesis menyediakan TTS dan mengutamakan voice `id-ID` bila tersedia.
- Preferensi mode dan suara disimpan di localStorage.
- Kamera dan model hanya dimulai setelah tindakan eksplisit pengguna.
- Threshold keyakinan tetap 0,8 dan stabilisasi prediksi tetap berbasis mayoritas.
- Redesign tidak mengubah atau melatih ulang model, kontrak MQTT, label model, maupun perilaku fungsional yang sudah ada.
- Repo belum memiliki test runner frontend; verifikasi memakai syntax checks, assertion script, server/static smoke checks, dan browser smoke test.

## Brand Commitments

Nama produk adalah **Isyarat**. Antarmuka dan copy menggunakan bahasa Indonesia yang langsung, tenang, dan mudah dipahami. Identitas baru memakai keluarga warna biru serta mendukung light dan dark mode. Produk tidak boleh mengklaim bahwa aset panduan merupakan standar linguistik resmi atau jaminan hasil pengenalan.

## Evidence on Hand

- Implementasi aplikasi utama: `public/index.html`, `public/style.css`, dan `public/script.js`.
- Model lokal SIBI dan BISINDO berada di bawah `public/tfjs_model_sibi/` dan `public/tfjs_bisindo/`.
- Registry 71 label dan metadata panduan: `public/guide-data.js`.
- Aset panduan lokal: `public/assets/gestures/` dan `public/assets/guide/`.
- Spesifikasi fitur dan batasannya: `docs/issue/gesture-guide-realtime-tts/spec.md`, `docs/issue/fix-model-switching/spec.md`, dan `docs/issue/kaggle-alphabet-guide-assets/spec.md`.
- Tidak ada testimonial, angka keberhasilan model, atau validasi linguistik resmi yang boleh dibuat-buat.

## Product Principles

1. Dahulukan tugas utama dan langkah berikutnya daripada dekorasi.
2. Beri pengguna kendali eksplisit atas kamera, mikrofon, dan keluaran suara.
3. Tampilkan status sistem dan keterbatasan model dengan bahasa yang dapat ditindaklanjuti.
4. Pertahankan panduan agar dapat dipakai tanpa izin perangkat.
5. Sediakan pengalaman setara di ponsel dan desktop tanpa menghilangkan kemampuan inti.

## Accessibility & Inclusion

Antarmuka harus mendukung keyboard, focus indicator yang jelas, live status announcements, label dan alt text deskriptif, kontras teks minimum WCAG AA, target sentuh yang memadai, serta `prefers-reduced-motion`. Light dan dark mode harus mempertahankan hierarki serta kontras yang setara. Warna tidak boleh menjadi satu-satunya penanda status.
