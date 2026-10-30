## Summary 
Ini adalah aplikasi penerjemah bahasa isyarat (Sign Language) menggunakan berbasis model machine learning dan mediapipe hand-landmark. Terdapat 2 model machine learning yang dilatih untuk mendeteksi gestur tangan manusia dari 2 jenis bahasa isyarat, yaitu SIBI dan BISINDO. Aplikasi berbasis website ini juga disertai dengan fitur STT (Speech to Text) dan TTS (Text to Speech). Eksekusi model menggunakan web engine dengan memanfaatkan model dalam ekstensi .tfjs agar model dapat dieksekusi dengan bahasa javascript.



## Workflow Agentic (WAJIB)

> Setiap task agentic — tanpa kecuali — wajib lewat 3 fase berurutan di bawah. **Jangan mulai menulis kode sebelum Fase 1 dan Fase 2 selesai.**

### Fase 1 — Planning (`grill`)

Selalu mulai dengan salah satu skill interview:

- `/grill-me` — interview relaks untuk sharpening rencana
- `/grill-with-docs` — sama, tapi sekalian bikin ADR + glossary (`domain-modeling`) sepanjang jalan
- `/grilling` — interview penuh dengan design tree multi-round

Aturan fase ini:

- Tentukan **feature-slug** (kebab-case) untuk task ini — ini nanti jadi nama folder di `docs/issue/`
- Fact finding itu tugas agent (baca codebase, cek env, cari dependensi), **jangan** ditanyakan ke user
- Fase 1 selesai hanya kalau frontier design tree sudah habis dan user mengonfirmasi shared understanding
- Output Fase 1: daftar keputusan yang sudah settled

### Fase 2 — Spec & Tickets (`to-spec` → `to-tickets`)

Setelah Fase 1 selesai, jalankan berurutan:

1. **`/to-spec`** — synthesize spec dari hasil interview (tanpa interview ulang). Tentukan seam testing dulu dan konfirmasi ke user. Spec ditulis ke `docs/issue/<feature-slug>/spec.md`
2. **`/to-tickets`** — pecah spec menjadi tracer-bullet tickets. Quiz granularity + blocking edges ke user, lalu tulis **satu file per ticket** ke `docs/issue/<feature-slug>/issues/<NN>-<slug>.md` (mulai `01`, urut dependency — blocker duluan)

Ticket harus **tracer-bullet vertikal**: potongan tipis tapi lengkap lintas layer (schema → API → UI → test), bukan horizontal per-layer. Format file ticket mengikuti template di `docs/agents/issue-tracker.md`: `What to build`, `Blocked by`, `Status: ready-for-agent`, checklist acceptance criteria.

### Fase 3 — Implementasi (`implement`)

Langsung implementasikan dari ticket + spec:

1. Ambil **frontier ticket** (semua blocker-nya sudah `resolved`) dari `docs/issue/<feature-slug>/issues/`
2. Kerjakan via `/implement` — panggil `/tdd` di seam yang sudah disepakati, jalankan typecheck sering, test suite penuh sekali di akhir. Repo ini belum punya test framework, jadi saat Fase 2 menentukan seam, konfirmasi ke user dulu apakah perlu setup test runner atau verifikasi lewat lint + build + smoke test
3. Setelah selesai, panggil `/code-review` untuk review hasil kerja, lalu perbaiki semua temuan
4. Update file ticket: `Status: resolved` + catat hasil di `## Comments` (atau `## Answer`)
5. Selesai — **jangan commit otomatis**. Tampilkan `git status` + `git diff --stat` plus ringkasan singkat hasil kerja, lalu tunggu user commit sendiri (lihat `## Git & GitHub (WAJIB)`)

Untuk banyak ticket yang bisa jalan paralel, `/implement-spec` (variant multi-agent + worktree per ticket) boleh dipakai; hasilnya tetap masuk ke branch yang sama.

### Struktur folder issue

```
docs/issue/
├── 01-<slug>.md     # ticket — blocker duluan
├── 02-<slug>.md
└── 03-<slug>.md
```

## Git & GitHub (WAJIB)

> Agent **tidak boleh** melakukan aksi tulis ke GitHub secara otomatis. Aturan ini berlaku di semua fase workflow dan untuk semua task, tanpa kecuali.

### Dilarang (tanpa persetujuan eksplisit user di percakapan itu)

- **`git commit`** — termasuk `git commit -a`, `git commit --amend`. Setelah pekerjaan selesai, agent hanya menampilkan `git status` + `git diff --stat` dan menunggu user commit sendiri
- **`git push`** — ke branch mana pun, ke remote mana pun
- **`git push --force` / `--force-with-lease`** — tanpa kecuali
- **`git reset --hard`, `git rebase`, `git cherry-pick`, `git revert`** pada branch yang sudah pernah di-push, atau pada branch `production`
- **`gh issue create` / `gh issue comment` / `gh issue close` / `gh pr create` / `gh pr merge` / `gh pr review` / `gh label create`** — lewat `gh` CLI maupun GitHub MCP
- **Push workflow CI/CD**, trigger deploy, atau menyalakan GitHub Action

### Boleh (read-only, untuk mencari fakta)

- `git status`, `git diff`, `git log`, `git show`, `git remote -v`, `git branch`, `git blame`
- `gh issue view`, `gh pr view`, `gh repo view`, `gh api` (method GET), `gh search`
- Fetch URL publik (webfetch, firecrawl)

### Kalau sebuah langkah butuh commit/push

Agent **berhenti** dan meminta persetujuan eksplisit lebih dulu. Sebutkan command persisnya, branch tujuan, dan apa yang bakal masuk. Contoh: "Saya siap commit `feat: tambah filter kategori` ke branch `feature/filter-kategori` (3 file berubah). Lanjut?"

Jangan pernah menganggap "melanjutkan workflow" atau "finalisasi" sebagai izin commit.

Aturan ini **mengoverride** langkah bawaan skill yang menyebut commit/push — termasuk langkah "Commit your work to the current branch" di skill `/implement` dan `/implement-spec`. Kalau sebuah skill memerintahkan commit/push, agent berhenti dan minta izin, bukan langsung menjalankan.
