# 🚀 Release & Changelog Management

Proyek ini menggunakan automated changelog generation berdasarkan conventional commits.

## 📝 Format Commit yang Wajib

Gunakan format berikut untuk setiap commit:
```
type(scope): description

[optional body]

[optional footer]
```

### 🔧 Tipe Commit:
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Format kode (tidak mengubah logic)
- `refactor`: Refactoring kode
- `test`: Menambah/mengubah test
- `chore`: Build process, dependency updates
- `perf`: Performance improvements
- `ci`: CI/CD changes

### ✅ Contoh Commit yang Benar:
```bash
feat(auth): tambah login dengan Google
fix(task): perbaiki bug drag and drop
docs(readme): update installation guide
chore(deps): update React to v19.1.0
```

### ❌ Contoh Commit yang Salah:
```bash
fix : timepicker              # spasi salah
memperbaiki routing google    # tidak ikuti format
Update README                 # tidak ada type
```

## 🔄 Cara Release

### 1. **Automatic Patch Release** (1.0.0 → 1.0.1)
```bash
npm run release
```

### 2. **Minor Release** (1.0.0 → 1.1.0)
```bash
npm run release:minor
```

### 3. **Major Release** (1.0.0 → 2.0.0)
```bash
npm run release:major
```

### 4. **Specific Patch** (1.0.0 → 1.0.1)
```bash
npm run release:patch
```

### 5. **Dry Run** (preview tanpa mengubah file)
```bash
npm run release:dry
```

## 📋 Workflow Release

1. **Pastikan semua commit menggunakan conventional format**
2. **Jalankan dry run untuk preview:**
   ```bash
   npm run release:dry
   ```
3. **Jika preview sudah benar, jalankan release:**
   ```bash
   npm run release
   ```
4. **Push ke repository:**
   ```bash
   git push --follow-tags origin development
   ```

## 🔍 Validasi Commit

Proyek ini menggunakan `commitlint` untuk memvalidasi format commit. Jika format salah, commit akan ditolak.

## 📄 File yang Auto-Generated

- `CHANGELOG.md` - Diupdate otomatis setiap release
- `package.json` - Version number diupdate otomatis
- Git tags - Dibuat otomatis (v1.0.0, v1.1.0, dll)

## 🎯 Tips untuk Tim

1. **Selalu gunakan conventional commits**
2. **Lakukan commit kecil dan sering**
3. **Tulis deskripsi yang jelas dan singkat**
4. **Gunakan scope untuk menjelaskan area perubahan**
5. **Review CHANGELOG.md setelah release**

---

**Dibuat otomatis oleh standard-version** 🤖
