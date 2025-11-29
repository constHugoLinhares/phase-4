// Usar dados compartilhados do products-data.js
// Os dados são carregados via fetchProductById

document.addEventListener('DOMContentLoaded', async function() {
    // Obter ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = '../marketplace.html';
        return;
    }
    
    try {
        const product = await fetchProductById(productId);
        renderProductDetails(product);
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        window.location.href = '../marketplace.html';
    }
});

function renderProductDetails(product) {
    // Preencher informações do produto
    document.getElementById('breadcrumbProduct').textContent = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('productUnit').textContent = product.unit;
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productDescription').textContent = product.description;
    
    // Preencher avaliações
    const starsHTML = Array(5).fill(0).map((_, i) => {
        const starClass = i < product.rating ? 'fas fa-star' : 'far fa-star';
        return `<i class="${starClass}"></i>`;
    }).join('');
    document.getElementById('productStars').innerHTML = starsHTML;
    document.getElementById('productReviews').textContent = `(${product.reviews})`;
    
    // Preencher estoque - Estilo Mercado Livre
    const stockStatusML = document.getElementById('stockStatusML');
    const stockInfo = document.getElementById('productStockInfo');
    const stockText = document.getElementById('productStock');
    
    if (product.stock === 0) {
        stockStatusML.classList.add('out-of-stock');
        stockStatusML.innerHTML = `
            <div class="d-flex align-items-center mb-2">
                <i class="fas fa-times-circle text-danger me-2"></i>
                <span class="fw-bold text-danger">Sem estoque</span>
            </div>
        `;
    } else if (product.stock <= 10) {
        stockStatusML.classList.add('low-stock');
        stockStatusML.innerHTML = `
            <div class="stock-alert-ml mb-2">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Últimas ${product.stock} unidades disponíveis!</span>
            </div>
            <div class="stock-info-ml">
                <i class="fas fa-box text-muted me-1"></i>
                <span class="text-muted">${product.stock} ${product.stock === 1 ? 'unidade disponível' : 'unidades disponíveis'}</span>
            </div>
        `;
    } else {
        stockStatusML.innerHTML = `
            <div class="d-flex align-items-center mb-2">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span class="fw-bold">Estoque disponível</span>
            </div>
            <div class="stock-info-ml">
                <i class="fas fa-box text-muted me-1"></i>
                <span class="text-muted">${product.stock} unidades disponíveis</span>
            </div>
        `;
    }
    
    // Preencher características
    const featuresHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    document.getElementById('productFeatures').innerHTML = featuresHTML;
    
    // Preencher informações do anunciante
    document.getElementById('sellerName').textContent = product.seller.name;
    document.getElementById('sellerRating').textContent = product.seller.rating.toFixed(1);
    document.getElementById('sellerSales').textContent = `${product.seller.totalSales} vendas`;
    document.getElementById('sellerDescription').textContent = product.seller.description;
    
    // Preencher estrelas do anunciante
    const sellerStarsHTML = Array(5).fill(0).map((_, i) => {
        const starClass = i < Math.floor(product.seller.rating) ? 'fas fa-star' : 'far fa-star';
        return `<i class="${starClass} text-warning"></i>`;
    }).join('');
    document.getElementById('sellerStars').innerHTML = sellerStarsHTML;
    
    // Controles de quantidade
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    // Definir máximo baseado no estoque
    quantityInput.max = product.stock;
    
    // Atualizar estado dos botões de quantidade
    function updateQuantityButtons() {
        const currentValue = parseInt(quantityInput.value);
        decreaseBtn.disabled = currentValue <= 1;
        increaseBtn.disabled = currentValue >= product.stock;
    }
    
    // Validar entrada manual no input
    function validateQuantityInput() {
        let value = quantityInput.value.replace(/\D/g, ''); // Remove não-números
        
        if (value === '' || parseInt(value) < 1) {
            value = '1';
        } else if (parseInt(value) > product.stock) {
            value = product.stock.toString();
            
            // Mostrar feedback visual quando atingir o limite
            quantityInput.style.borderColor = '#ff9800';
            quantityInput.style.backgroundColor = '#fff3e0';
            
            // Mostrar notificação de limite
            showStockLimitNotification(product.stock);
            
            setTimeout(() => {
                quantityInput.style.borderColor = '';
                quantityInput.style.backgroundColor = '';
            }, 1000);
        }
        
        quantityInput.value = value;
        updateQuantityButtons();
    }
    
    // Notificação de limite de estoque
    function showStockLimitNotification(maxStock) {
        // Remover notificação existente se houver
        const existingAlert = document.querySelector('.stock-limit-notification');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning alert-dismissible fade show position-fixed stock-limit-notification';
        alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 350px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; border-left: 4px solid #ff9800;';
        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-exclamation-triangle me-3" style="font-size: 24px; color: #ff9800;"></i>
                <div>
                    <strong style="display: block; margin-bottom: 4px;">Limite de estoque</strong>
                    <span style="font-size: 14px; color: #666;">Máximo disponível: ${maxStock} ${maxStock === 1 ? 'unidade' : 'unidades'}</span>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }
    
    // Event listeners para validação manual
    quantityInput.addEventListener('input', validateQuantityInput);
    quantityInput.addEventListener('blur', validateQuantityInput);
    
    // Permitir seleção do texto ao clicar
    quantityInput.addEventListener('focus', function() {
        this.select();
    });
    
    // Validar ao pressionar Enter
    quantityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateQuantityInput();
            this.blur();
        }
    });
    
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateQuantityButtons();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < product.stock) {
            quantityInput.value = currentValue + 1;
            updateQuantityButtons();
        }
    });
    
    // Inicializar estado dos botões
    updateQuantityButtons();
    
    // Adicionar ao carrinho - Estilo Mercado Livre
    if (product.stock === 0) {
        addToCartBtn.disabled = true;
        addToCartBtn.innerHTML = '<i class="fas fa-ban me-2"></i>Produto indisponível';
        addToCartBtn.classList.add('disabled');
    } else {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            
            // Adicionar quantidade ao carrinho de uma vez
            if (window.GermoplasmaHub && window.GermoplasmaHub.addToCartWithQuantity) {
                const success = window.GermoplasmaHub.addToCartWithQuantity(product.name, product.price, product.image, product.stock, quantity);
                
                if (!success) {
                    // Se falhou, mostrar mensagem de erro
                    return;
                }
            }
            
            // Mostrar notificação estilo Mercado Livre
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
            alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 350px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; border-left: 4px solid #7A9B6B;';
            alertDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas fa-check-circle me-3" style="font-size: 24px; color: #7A9B6B;"></i>
                    <div>
                        <strong style="display: block; margin-bottom: 4px;">Produto adicionado ao carrinho</strong>
                        <span style="font-size: 14px; color: #666;">${quantity}x ${product.name}</span>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            document.body.appendChild(alertDiv);
            
            // Animação de feedback no botão
            addToCartBtn.innerHTML = '<i class="fas fa-check me-2"></i>Adicionado!';
            addToCartBtn.style.background = '#7A9B6B';
            
            setTimeout(() => {
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart me-2"></i>Adicionar ao carrinho';
                addToCartBtn.style.background = '';
            }, 2000);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 4000);
            
            // Resetar quantidade
            quantityInput.value = 1;
            updateQuantityButtons();
        });
    }
}
