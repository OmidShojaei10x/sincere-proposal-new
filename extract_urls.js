// اسکریپت استخراج URLهای تصاویر و ویدیوها از صفحه اینستاگرام
// این کد را در Console کروم (F12) کپی و اجرا کنید

(function extractInstagramMedia() {
  console.log('🔍 شروع استخراج محتوا...');
  
  const urls = {
    images: [],
    videos: []
  };
  
  // تابع حذف تکراری‌ها
  function addUniqueUrl(array, url) {
    const cleanUrl = url.split('?')[0]; // حذف query parameters
    if (!array.includes(cleanUrl) && cleanUrl && !cleanUrl.includes('data:')) {
      array.push(cleanUrl);
    }
  }
  
  // استخراج تصاویر
  console.log('📸 در حال پیدا کردن تصاویر...');
  const imageSelectors = [
    'img[src*="scontent"]',
    'img[src*="cdninstagram"]',
    'img[src*="instagram"]',
    'article img',
    '[role="img"] img'
  ];
  
  imageSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(img => {
      if (img.src) {
        addUniqueUrl(urls.images, img.src);
      }
      // بررسی srcset
      if (img.srcset) {
        img.srcset.split(',').forEach(src => {
          const url = src.trim().split(' ')[0];
          addUniqueUrl(urls.images, url);
        });
      }
    });
  });
  
  // استخراج ویدیوها
  console.log('🎬 در حال پیدا کردن ویدیوها...');
  const videoSelectors = [
    'video source',
    'video[src]',
    'video'
  ];
  
  videoSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(video => {
      const src = video.src || video.getAttribute('src');
      if (src) {
        addUniqueUrl(urls.videos, src);
      }
      // بررسی source elements
      if (video.tagName === 'VIDEO') {
        video.querySelectorAll('source').forEach(source => {
          const sourceSrc = source.src || source.getAttribute('src');
          if (sourceSrc) {
            addUniqueUrl(urls.videos, sourceSrc);
          }
        });
      }
    });
  });
  
  // فیلتر کردن تصاویر کوچک (آیکون‌ها و ...)
  urls.images = urls.images.filter(url => {
    // حذف URLهای کوچک که احتمالاً آیکون هستند
    if (url.includes('profile_pic') || url.includes('avatar')) {
      return false;
    }
    // فقط URLهای با کیفیت خوب
    return url.includes('scontent') || url.includes('cdninstagram');
  });
  
  console.log(`\n✅ پیدا شد: ${urls.images.length} تصویر، ${urls.videos.length} ویدیو\n`);
  
  // نمایش URLها
  console.log('📸 تصاویر:');
  urls.images.forEach((url, i) => {
    console.log(`${i + 1}. ${url}`);
  });
  
  if (urls.videos.length > 0) {
    console.log('\n🎬 ویدیوها:');
    urls.videos.forEach((url, i) => {
      console.log(`${i + 1}. ${url}`);
    });
  }
  
  // ذخیره در localStorage و clipboard
  const dataStr = JSON.stringify(urls, null, 2);
  localStorage.setItem('instagram_media_urls', dataStr);
  
  // کپی به clipboard
  const textToCopy = JSON.stringify(urls, null, 2);
  navigator.clipboard.writeText(textToCopy).then(() => {
    console.log('\n✅ URLها در clipboard کپی شدند!');
    console.log('📋 همچنین در localStorage ذخیره شدند (کلید: instagram_media_urls)');
    console.log('\n💡 حالا می‌توانید:');
    console.log('   1. محتوای clipboard را در فایل instagram_urls.json ذخیره کنید');
    console.log('   2. یا از اسکریپت Python استفاده کنید');
  }).catch(err => {
    console.log('\n⚠️  نتوانست به clipboard کپی کند، اما در localStorage ذخیره شد');
  });
  
  // نمایش لینک دانلود JSON
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'instagram_urls.json';
  document.body.appendChild(a);
  console.log('\n📥 برای دانلود فایل JSON، این دستور را اجرا کنید:');
  console.log('   a.click();');
  
  // ذخیره در window برای دسترسی بعدی
  window.instagramMediaUrls = urls;
  
  return urls;
})();

