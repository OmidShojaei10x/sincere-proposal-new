#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
اسکریپت دانلود تصاویر و ویدیوهای اینستاگرام سینسیر
"""

import os
import requests
import json
import time
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import re

# تنظیمات
DOWNLOAD_FOLDER = "/Users/omid/Downloads/Omid_Shojaei/Proposal/sincere/Sincere"
URLS_FILE = "instagram_urls.json"  # فایل حاوی URLهای استخراج شده

def ensure_folder():
    """ایجاد پوشه دانلود در صورت عدم وجود"""
    Path(DOWNLOAD_FOLDER).mkdir(parents=True, exist_ok=True)
    print(f"✅ پوشه دانلود: {DOWNLOAD_FOLDER}")

def get_file_extension(url, default='webp'):
    """تعیین پسوند فایل از URL"""
    parsed = urlparse(url)
    path = parsed.path.lower()
    
    if '.jpg' in path or 'jpg' in path:
        return 'jpg'
    elif '.jpeg' in path or 'jpeg' in path:
        return 'jpg'
    elif '.png' in path:
        return 'png'
    elif '.mp4' in path or 'video' in path:
        return 'mp4'
    elif '.webm' in path:
        return 'webm'
    else:
        return default

def clean_filename(filename):
    """پاکسازی نام فایل از کاراکترهای غیرمجاز"""
    # حذف کاراکترهای غیرمجاز
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # حذف فاصله‌های اضافی
    filename = re.sub(r'\s+', '_', filename)
    return filename

def download_file(url, folder, filename=None, retry=3):
    """دانلود یک فایل"""
    try:
        # تعیین نام فایل
        if not filename:
            parsed = urlparse(url)
            # استخراج نام فایل از URL
            url_filename = os.path.basename(parsed.path)
            if not url_filename or '.' not in url_filename:
                # استفاده از hash URL به عنوان نام
                import hashlib
                url_hash = hashlib.md5(url.encode()).hexdigest()[:12]
                ext = get_file_extension(url)
                filename = f"sincere-media-{url_hash}.{ext}"
            else:
                filename = clean_filename(url_filename)
        
        filepath = os.path.join(folder, filename)
        
        # بررسی وجود فایل
        if os.path.exists(filepath):
            print(f"⏭️  فایل موجود است: {filename}")
            return True
        
        # دانلود فایل
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.instagram.com/',
        }
        
        response = requests.get(url, headers=headers, stream=True, timeout=30)
        response.raise_for_status()
        
        # ذخیره فایل
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        file_size = os.path.getsize(filepath) / 1024  # KB
        print(f"✅ دانلود شد: {filename} ({file_size:.1f} KB)")
        return True
        
    except Exception as e:
        if retry > 0:
            print(f"⚠️  خطا در دانلود {url}: {e}. تلاش مجدد...")
            time.sleep(2)
            return download_file(url, folder, filename, retry-1)
        else:
            print(f"❌ خطا در دانلود {url}: {e}")
            return False

def load_urls_from_file(filepath):
    """بارگذاری URLها از فایل JSON"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('images', []), data.get('videos', [])
    except FileNotFoundError:
        print(f"❌ فایل {filepath} پیدا نشد!")
        return [], []
    except json.JSONDecodeError:
        print(f"❌ خطا در خواندن فایل JSON!")
        return [], []

def download_from_urls_file():
    """دانلود فایل‌ها از فایل URLها"""
    ensure_folder()
    
    # بارگذاری URLها
    images, videos = load_urls_from_file(URLS_FILE)
    
    if not images and not videos:
        print("❌ هیچ URLی پیدا نشد!")
        print("\n📝 لطفاً ابتدا اسکریپت JavaScript را در Console کروم اجرا کنید:")
        print("   فایل: extract_urls.js")
        return
    
    print(f"\n📊 پیدا شد: {len(images)} تصویر، {len(videos)} ویدیو\n")
    
    # دانلود تصاویر
    if images:
        print("📸 دانلود تصاویر...")
        for i, url in enumerate(images, 1):
            print(f"[{i}/{len(images)}] ", end='')
            download_file(url, DOWNLOAD_FOLDER)
            time.sleep(0.5)  # تاخیر کوتاه
    
    # دانلود ویدیوها
    if videos:
        print("\n🎬 دانلود ویدیوها...")
        for i, url in enumerate(videos, 1):
            print(f"[{i}/{len(videos)}] ", end='')
            download_file(url, DOWNLOAD_FOLDER)
            time.sleep(1)  # تاخیر بیشتر برای ویدیوها
    
    print(f"\n✅ دانلود تمام فایل‌ها تکمیل شد!")
    print(f"📁 محل ذخیره: {DOWNLOAD_FOLDER}")

if __name__ == "__main__":
    print("🚀 شروع دانلود محتوای اینستاگرام سینسیر...\n")
    download_from_urls_file()

