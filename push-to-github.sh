#!/bin/bash

# 🚀 اسکریپت آپلود پروژه روی GitHub
# این اسکریپت پروژه را روی GitHub آپلود می‌کند

echo "🚀 آماده‌سازی برای آپلود روی GitHub..."
echo ""

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# بررسی اینکه آیا remote وجود دارد
if git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  Remote repository قبلاً تنظیم شده است:${NC}"
    git remote -v
    echo ""
    read -p "آیا می‌خواهید remote را تغییر دهید؟ (y/n): " change_remote
    if [ "$change_remote" = "y" ]; then
        read -p "لطفاً URL جدید repository را وارد کنید: " new_url
        git remote set-url origin "$new_url"
        echo -e "${GREEN}✅ Remote به‌روزرسانی شد${NC}"
    fi
else
    echo -e "${YELLOW}📝 لطفاً URL repository GitHub خود را وارد کنید:${NC}"
    echo "مثال: https://github.com/YOUR_USERNAME/sincere-proposal.git"
    read -p "URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo -e "${RED}❌ URL وارد نشد. عملیات لغو شد.${NC}"
        exit 1
    fi
    
    git remote add origin "$repo_url"
    echo -e "${GREEN}✅ Remote repository اضافه شد${NC}"
fi

echo ""
echo -e "${YELLOW}📤 در حال push کردن به GitHub...${NC}"

# Push به GitHub
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}✅ پروژه با موفقیت روی GitHub آپلود شد!${NC}"
    echo ""
    echo "🌐 برای مشاهده پروژه به آدرس زیر بروید:"
    git remote get-url origin | sed 's/\.git$//'
    echo ""
    echo "📄 برای فعال‌سازی GitHub Pages:"
    echo "   1. به Settings > Pages بروید"
    echo "   2. Source: main branch را انتخاب کنید"
    echo "   3. Save را بزنید"
    echo ""
else
    echo ""
    echo -e "${RED}❌ خطا در push کردن!${NC}"
    echo ""
    echo "🔧 راه‌حل‌های ممکن:"
    echo "   1. بررسی کنید که repository در GitHub ساخته شده باشد"
    echo "   2. بررسی کنید که authentication درست باشد"
    echo "   3. اگر از HTTPS استفاده می‌کنید، ممکن است نیاز به Personal Access Token باشد"
    echo ""
    echo "📖 برای راهنمایی بیشتر، فایل GITHUB_SETUP.md را مطالعه کنید"
    exit 1
fi

