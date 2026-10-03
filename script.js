// ==========================================================
// PERSONAL PORTAL JAVASCRIPT
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initStudentInfo();
    initFilterAndSearch();
    initModals();
    initScrollSpy();
});

/* ==========================================================
   THEME TOGGLE (Dark / Light Mode)
   ========================================================== */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('portal_theme') || 'dark';

    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('portal_theme', 'light');
                showToast('☀️ Đã chuyển sang giao diện Sáng');
            } else {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('portal_theme', 'dark');
                showToast('🌙 Đã chuyển sang giao diện Tối');
            }
        });
    }
}

/* ==========================================================
   STUDENT INFO MANAGEMENT (LocalStorage)
   ========================================================== */
function initStudentInfo() {
    const defaultInfo = {
        name: 'Nguyễn Văn A',
        studentId: '20260001',
        studentClass: 'CNTT-01 (2026.1)'
    };

    const savedInfo = JSON.parse(localStorage.getItem('portal_student_info')) || defaultInfo;

    updateStudentDisplay(savedInfo);

    const btnEditInfo = document.getElementById('btnEditInfo');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editInfoForm');
    const inputName = document.getElementById('inputName');
    const inputId = document.getElementById('inputId');
    const inputClass = document.getElementById('inputClass');

    if (btnEditInfo && editModal) {
        btnEditInfo.addEventListener('click', () => {
            const currentInfo = JSON.parse(localStorage.getItem('portal_student_info')) || defaultInfo;
            inputName.value = currentInfo.name;
            inputId.value = currentInfo.studentId;
            inputClass.value = currentInfo.studentClass;
            editModal.classList.add('active');
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newInfo = {
                name: inputName.value.trim() || defaultInfo.name,
                studentId: inputId.value.trim() || defaultInfo.studentId,
                studentClass: inputClass.value.trim() || defaultInfo.studentClass
            };

            localStorage.setItem('portal_student_info', JSON.stringify(newInfo));
            updateStudentDisplay(newInfo);
            closeEditModal();
            showToast('✅ Đã lưu thông tin cá nhân!');
        });
    }
}

function updateStudentDisplay(info) {
    const studentNameEl = document.getElementById('studentName');
    const studentIdEl = document.getElementById('studentIdText');
    const studentClassEl = document.getElementById('studentClassText');
    const avatarEl = document.getElementById('userAvatar');

    if (studentNameEl) studentNameEl.textContent = info.name;
    if (studentIdEl) studentIdEl.textContent = info.studentId;
    if (studentClassEl) studentClassEl.textContent = info.studentClass;

    // Get initials for avatar
    if (avatarEl && info.name) {
        const parts = info.name.trim().split(' ');
        let initials = 'SV';
        if (parts.length >= 2) {
            initials = parts[0][0] + parts[parts.length - 1][0];
        } else if (parts.length === 1 && parts[0].length > 0) {
            initials = parts[0].substring(0, 2);
        }
        avatarEl.innerHTML = `<span class="avatar-letter">${initials.toUpperCase()}</span>`;
    }
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) editModal.classList.remove('active');
}

/* ==========================================================
   LIVE SEARCH & FILTER ASSIGNMENTS
   ========================================================== */
function initFilterAndSearch() {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.assignment-card');
    const badgeCount = document.getElementById('itemCountBadge');

    let currentFilter = 'all';
    let currentSearch = '';

    function applyFilterAndSearch() {
        let visibleCount = 0;

        cards.forEach(card => {
            const categories = card.getAttribute('data-category') || '';
            const searchIndex = card.getAttribute('data-title') || '';
            
            const matchesFilter = currentFilter === 'all' || categories.includes(currentFilter);
            const matchesSearch = currentSearch === '' || searchIndex.toLowerCase().includes(currentSearch.toLowerCase());

            if (matchesFilter && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (badgeCount) {
            badgeCount.textContent = `${visibleCount} Bài nộp`;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            applyFilterAndSearch();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilterAndSearch();
        });
    });
}

/* ==========================================================
   PREVIEW MODAL (IFRAME)
   ========================================================== */
let currentPreviewUrl = '';

function openPreviewModal(url, title) {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewIframe');
    const loader = document.getElementById('iframeLoader');
    const titleEl = document.getElementById('modalTitle');
    const btnOpenTab = document.getElementById('btnModalOpenTab');

    if (!modal || !iframe) return;

    currentPreviewUrl = url;
    if (titleEl) titleEl.textContent = title || 'Xem trước bài làm';
    
    if (loader) loader.classList.remove('hidden');

    iframe.onload = () => {
        if (loader) loader.classList.add('hidden');
    };

    iframe.src = url;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (btnOpenTab) {
        btnOpenTab.onclick = () => {
            window.open(url, '_blank');
        };
    }
}

function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewIframe');

    if (modal) modal.classList.remove('active');
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
}

function initModals() {
    // Close modal on click outside or Escape key
    window.addEventListener('click', (e) => {
        const previewModal = document.getElementById('previewModal');
        const editModal = document.getElementById('editModal');

        if (e.target === previewModal) closePreviewModal();
        if (e.target === editModal) closeEditModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePreviewModal();
            closeEditModal();
        }
    });
}

/* ==========================================================
   SCROLL SPY FOR NAVBAR ACTIVE LINKS
   ========================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================
   TOAST NOTIFICATION HELPER
   ========================================================== */
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
