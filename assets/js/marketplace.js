// Renderização dinâmica do Marketplace

document.addEventListener('DOMContentLoaded', async function() {
    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortFilter');
    const paginationContainer = document.querySelector('.pagination');
    
    let allProducts = [];
    let filteredProducts = [];
    let displayedProducts = []; // Produtos que estão sendo exibidos (após filtros)
    let currentPage = 1;
    const itemsPerPage = 24;
    
    // Carregar produtos (simulando chamada de API)
    async function loadProducts() {
        try {
            productGrid.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
            
            allProducts = await fetchProducts();
            filteredProducts = [...allProducts];
            displayedProducts = [...allProducts];
            currentPage = 1;
            renderProducts(displayedProducts);
            renderPagination(displayedProducts);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productGrid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-danger">Erro ao carregar produtos. Tente novamente.</p></div>';
        }
    }
    
    // Renderizar produtos no grid (apenas da página atual)
    function renderProducts(products) {
        if (products.length === 0) {
            productGrid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">Nenhum produto encontrado.</p></div>';
            return;
        }
        
        // Calcular produtos da página atual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = products.slice(startIndex, endIndex);
        
        productGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        
        // Os botões de carrinho são inicializados via event delegation em main.js
        // Não é necessário adicionar listeners aqui
    }
    
    // Renderizar paginação
    function renderPagination(products) {
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(products.length / itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Botão Anterior
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
            </li>
        `;
        
        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                paginationHTML += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationHTML += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
        }
        
        // Botão Próximo
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Próximo</a>
            </li>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
        
        // Adicionar event listeners aos links de paginação
        paginationContainer.querySelectorAll('.page-link[data-page]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.dataset.page);
                if (page >= 1 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    renderProducts(displayedProducts);
                    renderPagination(displayedProducts);
                    // Scroll para o topo do grid
                    productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    // Criar card de produto
    function createProductCard(product) {
        const stockBadge = getStockBadge(product.stock);
        const stockInfo = getStockInfo(product.stock);
        const stars = getStarsHTML(product.rating);
        const addToCartButton = getAddToCartButton(product);
        
        return `
            <div class="col-md-2 mb-4">
                <div class="product-card" style="cursor: pointer;" onclick="window.location.href='products/product-details.html?id=${product.id}'">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy" onload="this.style.opacity='1'" onerror="console.error('Erro ao carregar imagem:', '${product.name}', this.src); this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'600\'%3E%3Crect fill=\'%239FC088\' width=\'600\' height=\'600\'/%3E%3Ctext fill=\'%23FFFFFF\' font-family=\'Arial\' font-size=\'24\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E'" style="opacity: 0; transition: opacity 0.3s;">
                        ${stockBadge}
                    </div>
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <p class="product-description">${product.description}</p>
                        <div class="product-seller mb-2">
                            <i class="fas fa-store text-muted"></i>
                            <span class="text-muted">${product.seller.name}</span>
                        </div>
                        <div class="product-price">
                            <span class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                            <span class="unit">${product.unit}</span>
                        </div>
                        ${stockInfo}
                        <div class="product-rating">
                            ${stars}
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                        ${addToCartButton}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Obter badge de estoque
    function getStockBadge(stock) {
        if (stock === 0) {
            return '<div class="product-badge bg-danger">Sem Estoque</div>';
        } else if (stock <= 10) {
            return '<div class="product-badge bg-warning">Estoque Baixo</div>';
        } else {
            return '<div class="product-badge">Em Estoque</div>';
        }
    }
    
    // Obter informação de estoque
    function getStockInfo(stock) {
        if (stock === 0) {
            return `
                <div class="product-stock mb-2">
                    <i class="fas fa-times-circle text-danger"></i>
                    <span class="text-danger">Indisponível</span>
                </div>
            `;
        } else if (stock <= 10) {
            return `
                <div class="product-stock mb-2">
                    <i class="fas fa-exclamation-triangle text-warning"></i>
                    <span class="text-warning">${stock} unidades disponíveis</span>
                </div>
            `;
        } else {
            return `
                <div class="product-stock mb-2">
                    <i class="fas fa-box text-success"></i>
                    <span class="text-success">${stock} unidades disponíveis</span>
                </div>
            `;
        }
    }
    
    // Obter HTML das estrelas
    function getStarsHTML(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        return starsHTML;
    }
    
    // Obter botão de adicionar ao carrinho
    function getAddToCartButton(product) {
        if (product.stock === 0) {
            return `
                <button class="btn btn-primary btn-sm" disabled onclick="event.stopPropagation()">
                    <i class="fas fa-ban me-1"></i>Indisponível
                </button>
            `;
        } else {
            return `
                <button class="btn btn-primary btn-sm add-to-cart" 
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-stock="${product.stock}" 
                    data-image="${product.image}">
                    <i class="fas fa-cart-plus me-1"></i>Adicionar ao Carrinho
                </button>
            `;
        }
    }
    
    // Filtrar produtos por busca
    function filterBySearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(product => {
                return product.name.toLowerCase().includes(term) ||
                       product.description.toLowerCase().includes(term) ||
                       product.seller.name.toLowerCase().includes(term);
            });
        }
        
        currentPage = 1; // Resetar para primeira página ao filtrar
        const category = categorySelect ? categorySelect.value : '';
        filterByCategory(category);
    }
    
    // Filtrar produtos por categoria
    function filterByCategory(category) {
        if (!category || category === 'Todas as categorias' || category === '') {
            displayedProducts = [...filteredProducts];
        } else {
            displayedProducts = filteredProducts.filter(product => product.category === category);
        }
        
        currentPage = 1;
        sortProducts();
    }
    
    // Ordenar produtos
    function sortProducts() {
        const sortValue = sortSelect ? sortSelect.value : 'default';
        
        if (sortValue === 'default') {
            // Manter ordem original
        } else if (sortValue === 'price-asc') {
            displayedProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            displayedProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'name-asc') {
            displayedProducts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        } else if (sortValue === 'name-desc') {
            displayedProducts.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
        } else if (sortValue === 'rating-desc') {
            displayedProducts.sort((a, b) => b.rating - a.rating);
        } else if (sortValue === 'stock-desc') {
            displayedProducts.sort((a, b) => b.stock - a.stock);
        }
        
        currentPage = 1;
        renderProducts(displayedProducts);
        renderPagination(displayedProducts);
    }
    
    // Event listeners para filtros
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterBySearch(this.value);
        });
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            filterByCategory(this.value);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts();
        });
    }
    
    // Carregar produtos ao iniciar
    await loadProducts();
});

