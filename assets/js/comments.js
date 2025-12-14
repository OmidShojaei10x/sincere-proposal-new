// Comment System

class CommentSystem {
    constructor() {
        this.comments = this.loadComments();
        this.currentSection = null;
        this.initCommentSections();
    }

    loadComments() {
        const saved = localStorage.getItem('proposal_comments');
        return saved ? JSON.parse(saved) : {};
    }

    saveComments() {
        localStorage.setItem('proposal_comments', JSON.stringify(this.comments));
    }

    initCommentSections() {
        document.querySelectorAll('.comment-section').forEach(section => {
            const sectionId = section.dataset.section;
            
            // Add click handler
            section.addEventListener('click', (e) => {
                if (e.target.classList.contains('comment-section')) {
                    this.openCommentDialog(sectionId);
                }
            });

            // Display existing comments count
            this.updateCommentBadge(sectionId);
        });
    }

    updateCommentBadge(sectionId) {
        const section = document.querySelector(`[data-section="${sectionId}"]`);
        if (!section) return;

        const comments = this.comments[sectionId] || [];
        
        // Remove existing badge
        const existingBadge = section.querySelector('.comment-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        if (comments.length > 0) {
            section.classList.add('has-comments');
            const badge = document.createElement('div');
            badge.className = 'comment-badge';
            badge.textContent = comments.length;
            section.appendChild(badge);
        } else {
            section.classList.remove('has-comments');
        }
    }

    openCommentDialog(sectionId) {
        this.currentSection = sectionId;
        
        const dialog = this.createCommentDialog();
        document.body.appendChild(dialog);

        // Focus on textarea
        setTimeout(() => {
            dialog.querySelector('textarea').focus();
        }, 100);
    }

    createCommentDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        dialog.onclick = (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        };

        dialog.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">افزودن کامنت</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">نام شما:</label>
                    <input type="text" id="comment-author" placeholder="نام و نام‌خانوادگی" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">نوع کامنت:</label>
                    <select id="comment-type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400">
                        <option value="question">❓ سوال</option>
                        <option value="suggestion">💡 پیشنهاد</option>
                        <option value="concern">⚠️ نگرانی</option>
                        <option value="approval">✅ تایید</option>
                        <option value="general">💬 نظر عمومی</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2">متن کامنت:</label>
                    <textarea id="comment-text" rows="4" placeholder="نظر خود را بنویسید..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 resize-none"></textarea>
                </div>

                <div class="flex gap-3">
                    <button onclick="commentSystem.submitComment()" 
                        class="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 font-bold py-3 rounded-lg hover:shadow-lg transition">
                        ثبت کامنت
                    </button>
                    <button onclick="this.closest('.fixed').remove()" 
                        class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        انصراف
                    </button>
                </div>

                <div class="mt-6 pt-6 border-t">
                    <h4 class="font-bold mb-3">کامنت‌های قبلی:</h4>
                    <div id="existing-comments" class="space-y-3 max-h-64 overflow-y-auto">
                        ${this.renderExistingComments()}
                    </div>
                </div>
            </div>
        `;

        return dialog;
    }

    renderExistingComments() {
        const comments = this.comments[this.currentSection] || [];
        
        if (comments.length === 0) {
            return '<p class="text-gray-400 text-sm text-center py-4">هنوز کامنتی ثبت نشده است.</p>';
        }

        return comments.map((comment, index) => `
            <div class="bg-gray-50 rounded-lg p-3 text-sm">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <span class="font-bold">${comment.author}</span>
                        <span class="text-xs text-gray-500">${comment.type}</span>
                    </div>
                    <button onclick="commentSystem.deleteComment(${index})" 
                        class="text-red-500 hover:text-red-700 text-xs">
                        حذف
                    </button>
                </div>
                <p class="text-gray-700">${comment.text}</p>
                <p class="text-xs text-gray-400 mt-2">${comment.timestamp}</p>
            </div>
        `).join('');
    }

    submitComment() {
        const author = document.getElementById('comment-author').value.trim();
        const type = document.getElementById('comment-type').value;
        const text = document.getElementById('comment-text').value.trim();

        if (!author || !text) {
            alert('لطفاً نام و متن کامنت را وارد کنید.');
            return;
        }

        const comment = {
            author,
            type,
            text,
            timestamp: new Date().toLocaleString('fa-IR')
        };

        if (!this.comments[this.currentSection]) {
            this.comments[this.currentSection] = [];
        }

        this.comments[this.currentSection].push(comment);
        this.saveComments();
        this.updateCommentBadge(this.currentSection);

        // Update sidebar if open
        this.updateSidebar();

        // Close dialog
        document.querySelector('.fixed.inset-0').remove();

        // Show success message
        this.showNotification('کامنت با موفقیت ثبت شد', 'success');
    }

    deleteComment(index) {
        if (confirm('آیا از حذف این کامنت مطمئن هستید؟')) {
            this.comments[this.currentSection].splice(index, 1);
            this.saveComments();
            this.updateCommentBadge(this.currentSection);

            // Refresh dialog
            const existingDialog = document.querySelector('.fixed.inset-0');
            if (existingDialog) {
                existingDialog.remove();
                this.openCommentDialog(this.currentSection);
            }

            this.showNotification('کامنت حذف شد', 'info');
        }
    }

    updateSidebar() {
        const sidebar = document.getElementById('comments-list');
        if (!sidebar) return;

        let html = '';
        
        for (const [section, comments] of Object.entries(this.comments)) {
            if (comments.length > 0) {
                html += `
                    <div class="mb-6">
                        <h4 class="font-bold text-sm mb-2 text-gray-600">${this.getSectionTitle(section)}</h4>
                        ${comments.map(comment => `
                            <div class="bg-gray-50 rounded-lg p-3 mb-2 text-sm">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="font-bold text-xs">${comment.author}</span>
                                    <span class="text-xs">${this.getCommentTypeIcon(comment.type)}</span>
                                </div>
                                <p class="text-gray-700 text-xs">${comment.text}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }

        sidebar.innerHTML = html || '<p class="text-gray-400 text-center">هنوز کامنتی ثبت نشده</p>';
    }

    getSectionTitle(sectionId) {
        const titles = {
            'hero': 'سربرگ',
            'toc': 'فهرست',
            'summary': 'خلاصه اجرایی',
            'analysis': 'تحلیل وضعیت',
            'goals': 'اهداف',
            'strategy': 'استراتژی',
            'services': 'خدمات',
            'timeline': 'تقویم',
            'budget': 'بودجه',
            'kpis': 'معیارها',
            'checklist': 'چک‌لیست'
        };
        return titles[sectionId] || sectionId;
    }

    getCommentTypeIcon(type) {
        const icons = {
            'question': '❓',
            'suggestion': '💡',
            'concern': '⚠️',
            'approval': '✅',
            'general': '💬'
        };
        return icons[type] || '💬';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 left-4 bg-${type === 'success' ? 'green' : 'blue'}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    exportComments() {
        const blob = new Blob([JSON.stringify(this.comments, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'proposal-comments.json';
        link.click();
    }
}

// Initialize comment system
const commentSystem = new CommentSystem();

// Toggle comment sidebar
function toggleComments() {
    const sidebar = document.getElementById('comment-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
        
        if (sidebar.classList.contains('-translate-x-full')) {
            // Sidebar is closed
        } else {
            // Sidebar is open
            commentSystem.updateSidebar();
        }
    }
}

// Export comments function
function exportComments() {
    commentSystem.exportComments();
}