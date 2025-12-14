#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
اسکریپت خودکار دانلود تصاویر و ویدیوهای اینستاگرام با Selenium
نیاز به نصب: pip install selenium requests
"""

import os
import time
import json
import requests
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import re

# تنظیمات
INSTAGRAM_URL = "https://www.instagram.com/sincere.restaurant/"
DOWNLOAD_FOLDER = "/Users/omid/Downloads/Omid_Shojaei/Proposal/sincere/Sincere"
SCROLL_PAUSE_TIME = 2
MAX_SCROLLS = 10  # حداکثر تعداد اسکرول

def setup_driver():
    """تنظیم Chrome Driver"""
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # User Agent واقعی
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver
    except Exception as e:
        print(f"❌ خطا در راه‌اندازی Chrome Driver: {e}")
        print("💡 لطفاً ChromeDriver را نصب کنید یا از روش دستی استفاده کنید")
        return None

def ensure_folder():
    """ایجاد پوشه دانلود"""
    Path(DOWNLOAD_FOLDER).mkdir(parents=True, exist_ok=True)
    print(f"✅ پوشه دانلود: {DOWNLOAD_FOLDER}")

def scroll_page(driver, max_scrolls=MAX_SCROLLS):
    """اسکرول صفحه برای لود کردن تمام پست‌ها"""
    print("📜 در حال اسکرول صفحه...")
    last_height = driver.execute_script("return document.body.scrollHeight")
    scrolls = 0
    
    while scrolls < max_scrolls:
        # اسکرول به پایین
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE_TIME)
        
        # محاسبه ارتفاع جدید
        new_height = driver.execute_script("return document.body.scrollHeight")
        
        if new_height == last_height:
            break
        
        last_height = new_height
        scrolls += 1
        print(f"  اسکرول {scrolls}/{max_scrolls}...")
    
    print(f"✅ اسکرول کامل شد ({scrolls} بار)")

def extract_media_urls(driver):
    """استخراج URLهای تصاویر و ویدیوها"""
    print("🔍 در حال استخراج URLها...")
    
    urls = {
        'images': [],
        'videos': []
    }
    
    # استخراج تصاویر
    try:
        images = driver.find_elements(By.CSS_SELECTOR, 'img[src*="scontent"], img[src*="cdninstagram"]')
        for img in images:
            src = img.get_attribute('src')
            if src and 'scontent' in src and src not in urls['images']:
                # حذف query parameters برای URL اصلی
                clean_url = src.split('?')[0]
                if clean_url not in urls['images']:
                    urls['images'].append(clean_url)
        
        # بررسی srcset
        images_with_srcset = driver.find_elements(By.CSS_SELECTOR, 'img[srcset]')
        for img in images_with_srcset:
            srcset = img.get_attribute('srcset')
            if srcset:
                for src in srcset.split(','):
                    url = src.strip().split(' ')[0]
                    if 'scontent' in url and url not in urls['images']:
                        clean_url = url.split('?')[0]
                        if clean_url not in urls['images']:
                            urls['images'].append(clean_url)
    except Exception as e:
        print(f"⚠️  خطا در استخراج تصاویر: {e}")
    
    # استخراج ویدیوها
    try:
        videos = driver.find_elements(By.CSS_SELECTOR, 'video source, video[src]')
        for video in videos:
            src = video.get_attribute('src')
            if src and src not in urls['videos']:
                clean_url = src.split('?')[0]
                if clean_url not in urls['videos']:
                    urls['videos'].append(clean_url)
    except Exception as e:
        print(f"⚠️  خطا در استخراج ویدیوها: {e}")
    
    # فیلتر کردن تصاویر کوچک
    urls['images'] = [url for url in urls['images'] 
                     if not any(x in url.lower() for x in ['profile_pic', 'avatar', 'icon'])]
    
    print(f"✅ پیدا شد: {len(urls['images'])} تصویر، {len(urls['videos'])} ویدیو")
    return urls

def download_file(url, folder, filename=None, retry=3):
    """دانلود یک فایل"""
    try:
        if not filename:
            # استخراج نام فایل از URL
            parsed_url = url.split('?')[0]
            url_filename = os.path.basename(parsed_url)
            
            if not url_filename or '.' not in url_filename:
                # استفاده از hash
                import hashlib
                url_hash = hashlib.md5(url.encode()).hexdigest()[:12]
                ext = 'webp' if 'webp' in url else ('mp4' if 'mp4' in url else 'jpg')
                filename = f"sincere-media-{url_hash}.{ext}"
            else:
                filename = re.sub(r'[<>:"/\\|?*]', '_', url_filename)
        
        filepath = os.path.join(folder, filename)
        
        # بررسی وجود فایل
        if os.path.exists(filepath):
            print(f"⏭️  موجود: {filename}")
            return True
        
        # دانلود
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Referer': 'https://www.instagram.com/',
        }
        
        response = requests.get(url, headers=headers, stream=True, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        file_size = os.path.getsize(filepath) / 1024
        print(f"✅ دانلود: {filename} ({file_size:.1f} KB)")
        return True
        
    except Exception as e:
        if retry > 0:
            time.sleep(2)
            return download_file(url, folder, filename, retry-1)
        else:
            print(f"❌ خطا: {url[:50]}... - {e}")
            return False

def main():
    """تابع اصلی"""
    print("🚀 شروع دانلود خودکار محتوای اینستاگرام سینسیر\n")
    
    ensure_folder()
    
    driver = setup_driver()
    if not driver:
        print("\n💡 می‌توانید از روش دستی استفاده کنید:")
        print("   1. فایل extract_urls.js را در Console اجرا کنید")
        print("   2. سپس download_instagram.py را اجرا کنید")
        return
    
    try:
        print(f"🌐 باز کردن صفحه: {INSTAGRAM_URL}")
        driver.get(INSTAGRAM_URL)
        time.sleep(5)  # منتظر لود شدن صفحه
        
        # اگر نیاز به لاگین باشد
        try:
            login_prompt = driver.find_element(By.XPATH, "//button[contains(text(), 'Log in')]")
            if login_prompt:
                print("⚠️  نیاز به لاگین است. لطفاً دستی لاگین کنید و Enter بزنید...")
                input("پس از لاگین، Enter را بزنید...")
        except:
            pass
        
        # اسکرول صفحه
        scroll_page(driver)
        time.sleep(2)
        
        # استخراج URLها
        urls = extract_media_urls(driver)
        
        # ذخیره URLها در فایل
        urls_file = os.path.join(os.path.dirname(DOWNLOAD_FOLDER), "instagram_urls.json")
        with open(urls_file, 'w', encoding='utf-8') as f:
            json.dump(urls, f, indent=2, ensure_ascii=False)
        print(f"💾 URLها در {urls_file} ذخیره شدند\n")
        
        # دانلود تصاویر
        if urls['images']:
            print("📸 دانلود تصاویر...")
            for i, url in enumerate(urls['images'], 1):
                print(f"[{i}/{len(urls['images'])}] ", end='')
                download_file(url, DOWNLOAD_FOLDER)
                time.sleep(0.5)
        
        # دانلود ویدیوها
        if urls['videos']:
            print("\n🎬 دانلود ویدیوها...")
            for i, url in enumerate(urls['videos'], 1):
                print(f"[{i}/{len(urls['videos'])}] ", end='')
                download_file(url, DOWNLOAD_FOLDER)
                time.sleep(1)
        
        print(f"\n✅ دانلود کامل شد!")
        print(f"📁 محل ذخیره: {DOWNLOAD_FOLDER}")
        
    except Exception as e:
        print(f"❌ خطا: {e}")
    finally:
        print("\n🔒 بستن مرورگر...")
        driver.quit()

if __name__ == "__main__":
    main()

