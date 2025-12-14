# ⚡ راهنمای سریع آپلود روی GitHub

## ✅ بک‌آپ
- **بک‌آپ جدید**: `sincere-backup-20251214_185030.tar.gz`
- **مسیر**: `/Users/omid/Downloads/Omid_Shojaei/Proposal/`
- **حجم**: 38MB

---

## 🚀 روش سریع (3 مرحله)

### مرحله 1: ساخت Repository در GitHub

1. به [github.com/new](https://github.com/new) بروید
2. **Repository name**: `sincere-proposal`
3. **Public** یا **Private** انتخاب کنید
4. ⚠️ **تیک‌ها را نزنید** (README, .gitignore, license)
5. روی **"Create repository"** کلیک کنید

### مرحله 2: کپی کردن URL

بعد از ساخت repository، GitHub یک URL نشان می‌دهد. آن را کپی کنید:
```
https://github.com/YOUR_USERNAME/sincere-proposal.git
```

### مرحله 3: اجرای اسکریپت

در Terminal (که در پوشه `sincere` هستید):

```bash
./push-to-github.sh
```

سپس URL را که کپی کردید وارد کنید.

---

## 🔧 روش دستی (اگر اسکریپت کار نکرد)

```bash
# 1. اضافه کردن remote
git remote add origin https://github.com/YOUR_USERNAME/sincere-proposal.git

# 2. Push کردن
git push -u origin main
```

---

## 🌐 فعال‌سازی GitHub Pages (برای نمایش آنلاین)

1. به repository در GitHub بروید
2. **Settings** > **Pages**
3. **Source**: `main` branch
4. **Save**
5. بعد از 2-3 دقیقه، پروژه در این آدرس در دسترس است:
   ```
   https://YOUR_USERNAME.github.io/sincere-proposal/
   ```

---

## ❓ مشکل دارید؟

فایل `GITHUB_SETUP.md` را مطالعه کنید یا خطا را برای من بفرستید.

