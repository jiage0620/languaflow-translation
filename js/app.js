let currentPage = 'translate';

function navigateTo(page) {
    currentPage = page;
    
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white', 'shadow-md', 'bg-blue-50');
        btn.classList.add('text-gray-600', 'hover:bg-gray-100');
    });
    
    const activeBtn = document.getElementById(`nav-${page}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-100');
        activeBtn.classList.add('bg-primary', 'text-white', 'shadow-md');
    }

    const mobileActiveBtn = document.getElementById(`mobile-nav-${page}`);
    if (mobileActiveBtn) {
        mobileActiveBtn.classList.remove('text-gray-600', 'hover:bg-gray-100');
        mobileActiveBtn.classList.add('bg-blue-50', 'text-primary');
    }

    renderPage(page);
    
    window.history.pushState({ page }, '', `#${page}`);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function renderPage(page) {
    const container = document.getElementById('page-content');
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';

    setTimeout(() => {
        switch (page) {
            case 'translate':
                renderTranslatePage();
                break;
            case 'memory':
                renderMemoryPage();
                break;
            case 'corpus':
                renderCorpusPage();
                break;
            case 'subtitle':
                renderSubtitlePage();
                break;
            case 'api':
                renderApiPage();
                break;
            default:
                renderTranslatePage();
        }

        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 150);
}

function init() {
    const hash = window.location.hash.slice(1);
    const page = hash || 'translate';
    navigateTo(page);

    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            navigateTo(e.state.page);
        }
    });

    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.classList.add('text-gray-600', 'hover:bg-gray-100');
    });
    
    const activeBtn = document.getElementById(`nav-${page}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-primary', 'text-white', 'shadow-md');
    }
    
    const mobileActiveBtn = document.getElementById(`mobile-nav-${page}`);
    if (mobileActiveBtn) {
        mobileActiveBtn.classList.add('bg-blue-50', 'text-primary');
    }
}

document.addEventListener('DOMContentLoaded', init);