# راهنمای دانلود محتوای اینستاگرام سینسیر

## روش 1: استفاده از اسکریپت JavaScript + Python (پیشنهادی)

### مرحله 1: استخراج URLها از Console کروم

1. صفحه اینستاگرام سینسیر را در کروم باز کنید:
   - `https://www.instagram.com/sincere.restaurant/`
   - یا هر صفحه خاص که می‌خواهید

2. Developer Tools را باز کنید (F12 یا راست‌کلیک → Inspect)

3. به تب **Console** بروید

4. محتوای فایل `extract_urls.js` را کپی کرده و در Console اجرا کنید

5. اسکرول کنید تا تمام پست‌ها لود شوند (برای پست‌های بیشتر)

6. دوباره اسکریپت را اجرا کنید

7. URLها در clipboard کپی می‌شوند و همچنین در Console نمایش داده می‌شوند

### مرحله 2: ذخیره URLها در فایل JSON

1. محتوای clipboard را در یک فایل با نام `instagram_urls.json` ذخیره کنید
2. یا از Console این دستور را اجرا کنید:
   ```javascript
   // دانلود خودکار فایل JSON
   const data = JSON.stringify(window.instagramMediaUrls, null, 2);
   const blob = new Blob([data], { type: 'application/json' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'instagram_urls.json';
   a.click();
   ```

3. فایل `instagram_urls.json` را در همان پوشه پروژه قرار دهید

### مرحله 3: اجرای اسکریپت Python

```bash
# نصب کتابخانه‌های مورد نیاز
pip install requests

# اجرای اسکریپت
python download_instagram.py
```

## روش 2: دانلود دستی از Network Tab

1. Developer Tools را باز کنید (F12)
2. به تب **Network** بروید
3. فیلتر را روی `jpg|webp|mp4` تنظیم کنید
4. صفحه را رفرش کنید یا اسکرول کنید
5. فایل‌های media را در لیست ببینید
6. راست‌کلیک → Open in new tab
7. در تب جدید: راست‌کلیک → Save

## نکات مهم

- برای پست‌های کاروسل: بین اسلایدها حرکت کنید تا همه تصاویر لود شوند
- برای ویدیوها: ممکن است نیاز باشد ویدیو را پلی کنید تا در Network ثبت شود
- اگر صفحه طولانی است: به پایین اسکرول کنید تا همه پست‌ها لود شوند

## عیب‌یابی

- اگر URLها پیدا نشدند: مطمئن شوید صفحه کاملاً لود شده است
- اگر دانلود نشد: بررسی کنید که فایل `instagram_urls.json` درست ایجاد شده باشد
- برای فایل‌های بزرگ: ممکن است نیاز به صبر بیشتر باشد

