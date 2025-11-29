document.addEventListener('DOMContentLoaded', () => {
    // Determinar o caminho relativo baseado na profundidade da URL
    const getBasePath = () => {
        const path = window.location.pathname;
        const depth = path.split('/').filter(p => p && p.endsWith('.html')).length;
        
        // Se está em pages/products/ (2 níveis)
        if (path.includes('/products/')) {
            return '../../';
        }
        // Se está em pages/ (1 nível)
        else if (path.includes('/pages/')) {
            return '../';
        }
        // Se está na raiz
        return '';
    };

    const basePath = getBasePath();

    const loadPartial = async (selector, url) => {
        const target = document.querySelector(selector);
        if (!target) return;
        try {
            const response = await fetch(basePath + url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            target.innerHTML = await response.text();
        } catch (error) {
            console.error(`Falha ao carregar ${url}:`, error);
        }
    };

    const initNavbar = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'marketplace.html';
        const links = document.querySelectorAll('#navbar .nav-link');
        
        // Corrigir links baseado na profundidade
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                // Se o link não tem caminho completo, adicionar basePath
                if (!href.startsWith('../') && !href.startsWith('./')) {
                    const newHref = basePath + 'pages/' + href;
                    link.setAttribute('href', newHref);
                }
            }
            
            const hrefPage = href.split('/').pop();
            if (hrefPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Corrigir link do logo
        const brandLink = document.querySelector('.navbar-brand');
        if (brandLink) {
            brandLink.setAttribute('href', basePath + 'index.html');
        }
    };

    const initFooter = () => {
        const yearEl = document.querySelector('#footer #footerYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    };

    const initCartDropdown = () => {
        // Prevenir que o dropdown feche ao clicar dentro dele
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (cartDropdown) {
            cartDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    };

    Promise.all([
        loadPartial('#navbar', 'partials/navbar.html'),
        loadPartial('#footer', 'partials/footer.html')
    ]).then(() => {
        initNavbar();
        initFooter();
        initCartDropdown();
    });
});