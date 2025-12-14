// پروپوزال تبلیغاتی رستوران سینسیر - main.js

function showSnackbar(message) {
    const bar = document.getElementById('snackbar');
    if (!bar) return;
    bar.textContent = message;
    bar.classList.add('show');
    setTimeout(() => bar.classList.remove('show'), 2000);
}

// Editable Text Elements - لایو ادیت
function initEditableElements() {
    document.querySelectorAll('.editable-text').forEach(el => {
        const field = el.dataset.field;
        if (!field) return;
        
        // Set initial value from localStorage
        const saved = localStorage.getItem('proposal_data');
        if (saved) {
            const data = JSON.parse(saved);
            if (data[field]) {
                el.textContent = data[field];
            }
        }

        // Add visual indicator
        el.style.cursor = 'text';
        
        // Make editable on click
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.getAttribute('contenteditable') !== 'true') {
                this.setAttribute('contenteditable', 'true');
                this.focus();
                
                // Select all text
                const range = document.createRange();
                range.selectNodeContents(this);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });

        // Save on blur
        el.addEventListener('blur', function() {
            this.setAttribute('contenteditable', 'false');
            const value = this.textContent.trim();
            
            // Save to localStorage
            const saved = localStorage.getItem('proposal_data') || '{}';
            const data = JSON.parse(saved);
            data[field] = value;
            localStorage.setItem('proposal_data', JSON.stringify(data));
            
            // Update all elements with same field
            document.querySelectorAll(`[data-field="${field}"]`).forEach(otherEl => {
                if (otherEl !== this) {
                    otherEl.textContent = value;
                }
            });
            
            showSnackbar('متن به‌روزرسانی شد');
        });

        // Save on Enter
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
    });
}

// Helper function to convert Persian digits to English
function persianToEnglish(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = str;
    for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
    }
    return result;
}

// Helper function to format number with commas (real-time)
function formatNumberWithCommas(value) {
    // Remove all non-digit characters
    const cleanValue = value.toString().replace(/[^\d]/g, '');
    if (!cleanValue) return '';
    
    // Add commas every 3 digits from right
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ویرایش اعداد قابل ویرایش - لایو ادیت
function initEditableNumbers() {
    document.querySelectorAll('.editable-number').forEach(element => {
        // Add visual indicator
        element.style.cursor = 'text';
        element.classList.add('editable-number-active');
        
        // Store original value
        let originalValue = element.textContent.trim();
        
        // Make editable on click
        element.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.getAttribute('contenteditable') !== 'true') {
                this.setAttribute('contenteditable', 'true');
                originalValue = this.textContent.trim();
                
                // Get raw number (remove commas and convert Persian to English)
                let rawValue = this.textContent.trim();
                rawValue = persianToEnglish(rawValue);
                rawValue = rawValue.replace(/,/g, '');
                
                // Set raw value for editing
                this.textContent = rawValue;
                this.focus();
                
                // Select all text
                const range = document.createRange();
                range.selectNodeContents(this);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
        
        // Real-time formatting while typing
        element.addEventListener('input', function() {
            let value = this.textContent.trim();
            
            // Convert Persian to English
            value = persianToEnglish(value);
            
            // Remove all non-digit characters
            value = value.replace(/[^\d]/g, '');
            
            // Format with commas
            const formatted = formatNumberWithCommas(value);
            
            // Update display (but keep cursor position)
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const cursorPosition = range.startOffset;
            
            this.textContent = formatted;
            
            // Restore cursor position (approximate)
            try {
                const newRange = document.createRange();
                const textNode = this.firstChild;
                if (textNode) {
                    const newPosition = Math.min(cursorPosition, textNode.textContent.length);
                    newRange.setStart(textNode, newPosition);
                    newRange.setEnd(textNode, newPosition);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            } catch (e) {
                // If cursor restoration fails, just set cursor to end
                const range = document.createRange();
                range.selectNodeContents(this);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        
        // Save on blur
        element.addEventListener('blur', function() {
            this.setAttribute('contenteditable', 'false');
            const field = this.getAttribute('data-field');
            let value = this.textContent.trim();
            
            // Convert Persian to English
            value = persianToEnglish(value);
            
            // Remove commas and non-digit characters
            value = value.replace(/,/g, '').replace(/[^\d]/g, '');
            
            if (value && !isNaN(value) && value !== '') {
                const numValue = parseFloat(value);
                const formatted = numValue.toLocaleString('fa-IR');
                
                // Update all elements with same field
                document.querySelectorAll(`[data-field="${field}"]`).forEach(el => {
                    if (el !== this) {
                        el.textContent = formatted;
                    } else {
                        this.textContent = formatted;
                    }
                });
                
                // Update budget total if needed
                if (field && (field.startsWith('budget-') || element.classList.contains('budget-item'))) {
                    if (typeof updateBudgetTotal === 'function') {
                        setTimeout(() => {
                            updateBudgetTotal();
                        }, 100);
                    }
                }
                
                // Save to localStorage
                if (field) {
                    const saved = localStorage.getItem('proposal_data') || '{}';
                    const data = JSON.parse(saved);
                    data[field] = formatted;
                    localStorage.setItem('proposal_data', JSON.stringify(data));
                }
                
                showSnackbar('عدد به‌روزرسانی شد');
            } else {
                // Restore previous value if invalid
                const saved = localStorage.getItem('proposal_data');
                if (saved) {
                    const data = JSON.parse(saved);
                    const field = this.getAttribute('data-field');
                    if (field && data[field]) {
                        this.textContent = data[field];
                    } else {
                        this.textContent = originalValue;
                    }
                } else {
                    this.textContent = originalValue;
                }
            }
        });
        
        // Prevent Enter key from creating new line
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });
        
        // Load saved value
        const field = element.getAttribute('data-field');
        if (field) {
            const saved = localStorage.getItem('proposal_data');
            if (saved) {
                const data = JSON.parse(saved);
                if (data[field]) {
                    element.textContent = data[field];
                }
            }
        }
    });
}

// Re-initialize after dynamic content loads
function reinitEditableNumbers() {
    initEditableNumbers();
    initEditableElements();
}

// اسکرول نرم برای لینک‌های داخلی
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { 
            target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
    });
});

// پیشرفت صفحه و فعال‌سازی لینک‌های ناوبری
window.addEventListener('scroll', () => {
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
    
    const sections = document.querySelectorAll('.section-card');
    const links = document.querySelectorAll('#floating-links a');
    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
            links.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`#floating-links a[href="#${sec.id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

// ذخیره و بارگذاری چک‌باکس‌ها
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
    const savedState = localStorage.getItem(`checkbox-${index}`);
    if (savedState === 'true') checkbox.checked = true;
    checkbox.addEventListener('change', function() { 
        localStorage.setItem(`checkbox-${index}`, this.checked); 
        showSnackbar(this.checked ? 'آیتم تیک خورد' : 'آیتم برداشته شد'); 
    });
});

// توابع کمکی
function scrollToSection(id) { 
    const target = document.querySelector(id); 
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'}); 
}

function openTimelineModal() { 
    const modal = document.getElementById('timeline-modal');
    if (modal) modal.style.display = 'flex'; 
}

function closeTimelineModal() { 
    const modal = document.getElementById('timeline-modal');
    if (modal) modal.style.display = 'none'; 
}

// توابع مورد نیاز برای index.html
function exportToPDF() {
    window.print();
}

function toggleComments() {
    const sidebar = document.getElementById('comment-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('translate-x-full');
        if (typeof commentSystem !== 'undefined' && !sidebar.classList.contains('translate-x-full')) {
            commentSystem.updateSidebar();
        }
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize editable elements
    initEditableNumbers();
    initEditableElements();
    renderSummaryBudgetDonut();
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Reading progress bar
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // Load sections dynamically
    loadSections();
});

// Initialize charts after sections load
function initializeChartsAfterLoad() {
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        if (typeof initCharts === 'function') {
            initCharts();
        }
        // Also refresh AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 500);
}

// Load sections from HTML files
async function loadSections() {
    const sectionsContainer = document.getElementById('content-sections');
    if (!sectionsContainer) {
        console.error('content-sections container not found!');
        return;
    }
    
    console.log('Loading sections...');
    
    const sections = [
        { id: 'summary', file: 'sections/executive-summary.html' },
        { id: 'analysis', file: 'sections/current-analysis.html' },
        { id: 'goals', file: 'sections/goals.html' },
        { id: 'strategy', file: 'sections/strategy.html' },
        { id: 'services', file: 'sections/services/social-media.html' },
        { id: 'timeline', file: 'sections/timeline.html' },
        { id: 'budget', file: 'sections/budget.html' },
        { id: 'kpis', file: 'sections/kpis.html' },
        { id: 'checklist', file: 'sections/checklist.html' },
    ];
    
    let loadedCount = 0;
    
    for (const section of sections) {
        try {
            const response = await fetch(section.file);
            if (response.ok) {
                const html = await response.text();
                if (!html || html.trim() === '') {
                    console.warn(`⚠️ Empty file: ${section.file}`);
                    continue;
                }
                
                // Remove loading message if exists (only once, before first section)
                if (loadedCount === 0) {
                    const loadingMsg = sectionsContainer.querySelector('.text-center');
                    if (loadingMsg && loadingMsg.textContent.includes('در حال بارگذاری')) {
                        loadingMsg.remove();
                    }
                }
                
                // Parse HTML and extract section element
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const sectionElement = tempDiv.querySelector('section');
                
                if (sectionElement) {
                    // Clone the section element to avoid issues
                    const clonedSection = sectionElement.cloneNode(true);
                    // Set ID on the cloned section element (preserve original if exists)
                    if (!clonedSection.id || clonedSection.id === '') {
                        clonedSection.id = section.id;
                    }
                    // Append the cloned section directly
                    clonedSection.classList.add('pro-section');
                    sectionsContainer.appendChild(clonedSection);
                    console.log(`✅ Section ${section.id} appended to DOM`);
                } else {
                    // Fallback: create wrapper div
                    console.warn(`⚠️ No <section> tag found in ${section.file}, using wrapper`);
                    const wrapper = document.createElement('div');
                    wrapper.id = section.id;
                    wrapper.className = 'section-content mb-12';
                    wrapper.innerHTML = html;
                    wrapper.classList.add('pro-section');
                    sectionsContainer.appendChild(wrapper);
                }
                loadedCount++;
                console.log(`✅ Loaded: ${section.id}`);
                
                       // Re-initialize AOS for new content
                       if (typeof AOS !== 'undefined') {
                           AOS.refresh();
                       }
                       
                       // Re-initialize editable numbers and text after loading section
                       setTimeout(() => {
                           if (typeof initEditableNumbers === 'function') {
                               initEditableNumbers();
                           }
                           if (typeof initEditableElements === 'function') {
                               initEditableElements();
                           }
                           applySectionSkin(sectionsContainer);
                           initChecklistInteractions(sectionsContainer);
                       }, 200);
                       
                       // Initialize charts after loading specific sections
                       if (section.id === 'goals' || section.id === 'budget' || section.id === 'timeline' || section.id === 'kpis') {
                           setTimeout(() => {
                               if (typeof initCharts === 'function') {
                                   console.log(`📊 Initializing charts for section: ${section.id}`);
                                   initCharts();
                               }
                           }, 800);
                       }
            } else {
                console.error(`❌ Failed to load ${section.file}: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error(`❌ Error loading section: ${section.file}`, error);
        }
    }
    
    console.log(`📊 Loaded ${loadedCount}/${sections.length} sections`);
    
    // Ensure loading message is removed
    const loadingMsg = sectionsContainer.querySelector('.text-center');
    if (loadingMsg && loadingMsg.textContent.includes('در حال بارگذاری')) {
        loadingMsg.remove();
    }
    
    // Initialize charts after all sections are loaded
    setTimeout(() => {
        console.log('📈 Initializing all charts after sections loaded...');
        if (typeof initCharts === 'function') {
            initCharts();
        }
        // Retry charts initialization multiple times to ensure all charts load
        setTimeout(() => {
            if (typeof initCharts === 'function') {
                console.log('🔄 Retrying charts initialization (1st retry)...');
                initCharts();
            }
        }, 2000);
        setTimeout(() => {
            if (typeof initCharts === 'function') {
                console.log('🔄 Retrying charts initialization (2nd retry)...');
                initCharts();
            }
        }, 3500);
        setTimeout(() => {
            if (typeof initCharts === 'function') {
                console.log('🔄 Retrying charts initialization (3rd retry)...');
                initCharts();
            }
        }, 5000);
        if (typeof updateBudgetTotal === 'function') {
            updateBudgetTotal();
        }
        // Re-initialize editable numbers and text
        if (typeof initEditableNumbers === 'function') {
            initEditableNumbers();
        }
        if (typeof initEditableElements === 'function') {
            initEditableElements();
        }
        applySectionSkin(sectionsContainer);
        initChecklistInteractions(sectionsContainer);
        // Refresh AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 2000);

    // Draw budget donut on summary if present
    setTimeout(renderSummaryBudgetDonut, 800);
}

// Checklist interactions (ticking and uploads)
function initChecklistInteractions(root = document) {
    const checklistSection = root.querySelector ? root.querySelector('#checklist') : document.getElementById('checklist');
    if (!checklistSection) return;

    const progressText = checklistSection.querySelector('#progress-percentage');
    const progressBar = checklistSection.querySelector('#progress-bar');

    const updateProgress = () => {
        const boxes = checklistSection.querySelectorAll('.checklist-checkbox');
        const checked = checklistSection.querySelectorAll('.checklist-checkbox.checked');
        if (!progressText || !progressBar || boxes.length === 0) return;
        const pct = Math.round((checked.length / boxes.length) * 100);
        progressText.textContent = `${pct}٪`;
        progressBar.style.width = `${pct}%`;
    };

    checklistSection.querySelectorAll('.checklist-checkbox').forEach(box => {
        if (box.dataset.bound === '1') return;
        box.dataset.bound = '1';
        box.classList.add('cursor-pointer');
        box.addEventListener('click', () => {
            box.classList.toggle('checked');
            updateProgress();
            if (typeof showSnackbar === 'function') {
                showSnackbar('آیتم به‌روزرسانی شد');
            }
        });
    });

    checklistSection.querySelectorAll('.checklist-upload').forEach(btn => {
        if (btn.dataset.bound === '1') return;
        btn.dataset.bound = '1';
        btn.type = 'button';
        btn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = () => {
                const count = input.files ? input.files.length : 0;
                if (count > 0) {
                    btn.textContent = '✅ آپلود شد';
                    btn.classList.add('bg-green-50', 'text-green-700', 'border-green-300');
                    if (typeof showSnackbar === 'function') {
                        showSnackbar(`فایل${count > 1 ? '‌ها' : ''} دریافت شد`);
                    }
                }
            };
            input.click();
        });
    });

    checklistSection.querySelectorAll('.checklist-action').forEach(btn => {
        if (btn.dataset.bound === '1') return;
        btn.dataset.bound = '1';
        btn.type = 'button';
        btn.addEventListener('click', () => {
            const action = btn.dataset.action || 'text';
            if (action === 'text') {
                const value = window.prompt('لطفاً متن مورد نظر را وارد کنید:');
                if (value && value.trim().length > 0) {
                    btn.textContent = '✅ دریافت شد';
                    btn.classList.add('bg-green-50', 'text-green-700', 'border-green-300');
                    btn.dataset.savedValue = value.trim();
                    if (typeof showSnackbar === 'function') {
                        showSnackbar('متن دریافت شد');
                    }
                }
            } else if (action === 'invite') {
                if (typeof showSnackbar === 'function') {
                    showSnackbar('درخواست دسترسی ثبت شد');
                }
                btn.textContent = '✅ ارسال درخواست';
                btn.classList.add('bg-green-50', 'text-green-700', 'border-green-300');
            }
        });
    });

    const submitBtn = checklistSection.querySelector('.checklist-submit-btn');
    if (submitBtn && submitBtn.dataset.bound !== '1') {
        submitBtn.dataset.bound = '1';
        submitBtn.addEventListener('click', () => {
            updateProgress();
            if (typeof showSnackbar === 'function') {
                showSnackbar('درخواست همکاری ثبت شد (دمو)');
            }
            alert('در نسخه فعلی، این دکمه به صورت نمایشی است و برای ارسال نهایی باید اطلاعات را به تیم یکتانت تحویل دهید.');
        });
    }

    updateProgress();
}

// Apply unified visual skin to sections
function applySectionSkin(root = document) {
    const sections = root.querySelectorAll ? root.querySelectorAll('#content-sections section') : [];
    sections.forEach(sec => {
        sec.classList.add('pro-section');
        const firstChild = sec.querySelector(':scope > div');
        if (firstChild) {
            firstChild.classList.add('pro-card-shell');
        }
    });
}

function renderSummaryBudgetDonut() {
    const canvas = document.getElementById('budget-donut');
    if (!canvas || typeof Chart === 'undefined') return;
    if (canvas._chartInstance) return;

    // Ensure size for visibility
    if (!canvas.getAttribute('width')) {
        canvas.setAttribute('width', '200');
        canvas.setAttribute('height', '200');
    }

    const ctx = canvas.getContext('2d');
    const data = {
        labels: ['رسانه', 'محتوا', 'ابزار'],
        datasets: [{
            data: [45, 35, 20],
            backgroundColor: ['#3b82f6', '#22c55e', '#a855f7'],
            borderWidth: 0
        }]
    };
    const options = {
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        cutout: '60%'
    };
    canvas._chartInstance = new Chart(ctx, { type: 'doughnut', data, options });
}

// لاگ کنسول
console.log('%c📊 پروپوزال تبلیغاتی سینسیر', 'font-size: 24px; color: #fed813; font-weight: bold;');
