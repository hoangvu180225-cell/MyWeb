// ==========================================================================
// JADOO THEME JAVASCRIPT — PHAN HOÀNG VŨ (20235462)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initModals();
    initScrollSpy();
});

/* ==========================================================================
   THEME TOGGLE (Light Theme Default matching Jadoo Reference)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('jadoo_theme') || 'light';

    if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('jadoo_theme', 'light');
            } else {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('jadoo_theme', 'dark');
            }
        });
    }
}

/* ==========================================================================
   LIVE PREVIEW MODAL (IFRAME)
   ========================================================================== */
function openPreviewModal(url, title) {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewIframe');
    const loader = document.getElementById('iframeLoader');
    const titleEl = document.getElementById('modalTitle');
    const btnOpenTab = document.getElementById('btnModalOpenTab');

    if (!modal || !iframe) return;

    if (titleEl) titleEl.textContent = title || 'Xem trước bài làm';
    if (loader) loader.classList.remove('hidden');

    iframe.onload = () => {
        if (loader) loader.classList.add('hidden');
    };

    iframe.src = url;
    if (btnOpenTab) {
        btnOpenTab.href = url;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewIframe');

    if (modal) modal.classList.remove('active');
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
}

function initModals() {
    window.addEventListener('click', (e) => {
        const previewModal = document.getElementById('previewModal');
        if (e.target === previewModal) {
            closePreviewModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePreviewModal();
        }
    });
}

/* ==========================================================================
   SCROLL SPY FOR NAVBAR ACTIVE LINKS
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 140;

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
