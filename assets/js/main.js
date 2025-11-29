// Função para inicializar o dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips do Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers do Bootstrap
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Validação do formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {

            // Validar campos obrigatórios
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            let isValid = true;

            // Validar nome
            if (!firstName.value.trim()) {
                firstName.setCustomValidity('Por favor, informe seu nome.');
                isValid = false;
            } else {
                firstName.setCustomValidity('');
            }

            // Validar sobrenome
            if (!lastName.value.trim()) {
                lastName.setCustomValidity('Por favor, informe seu sobrenome.');
                isValid = false;
            } else {
                lastName.setCustomValidity('');
            }

            // Validar e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                email.setCustomValidity('Por favor, informe um e-mail válido.');
                isValid = false;
            } else {
                email.setCustomValidity('');
            }

            // Validar assunto
            if (!subject.value) {
                subject.setCustomValidity('Por favor, selecione um assunto.');
                isValid = false;
            } else {
                subject.setCustomValidity('');
            }

            // Validar mensagem
            if (!message.value.trim() || message.value.trim().length < 10) {
                message.setCustomValidity('Por favor, escreva uma mensagem com pelo menos 10 caracteres.');
                isValid = false;
            } else {
                message.setCustomValidity('');
            }

            // Validar telefone se informado (também checar letras)
            const phone = document.getElementById('phone');
            if (phone && phone.value.trim()) {
                const rawPhone = phone.value;

                // Se houver letras, considerar inválido imediatamente
                if (/[A-Za-zÀ-ÿ]/.test(rawPhone)) {
                    phone.setCustomValidity('Por favor, informe apenas números no telefone.');
                    isValid = false;
                } else {
                    const digits = rawPhone.replace(/\D/g, '');
                    const phoneRegex = /^[0-9]{10,11}$/;
                    if (!phoneRegex.test(digits)) {
                        phone.setCustomValidity('Por favor, informe um telefone válido (10 ou 11 dígitos).');
                        isValid = false;
                    } else {
                        phone.setCustomValidity('');
                    }
                }
            }

            // Adicionar classes de validação
            contactForm.classList.add('was-validated');

            if (isValid) {
                // Simular envio do formulário
                showSuccessMessage();
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }
        });
    }

    // Immediate feedback for phone field: validate on input and blur
    (function(){
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;

        const validatePhoneField = () => {
            const raw = (phoneInput.value || '').trim();
            const digits = raw.replace(/\D/g, '');

            // vazio -> limpar estado
            if (!raw) {
                phoneInput.classList.remove('is-invalid');
                phoneInput.classList.remove('is-valid');
                phoneInput.setCustomValidity('');
                return;
            }

            // se houver letras, marcar inválido (feedback imediato)
            if (/[A-Za-zÀ-ÿ]/.test(raw)) {
                phoneInput.classList.add('is-invalid');
                phoneInput.classList.remove('is-valid');
                phoneInput.setCustomValidity('Por favor, informe apenas números no telefone.');
                return;
            }

            if (digits.length === 10 || digits.length === 11) {
                phoneInput.classList.remove('is-invalid');
                phoneInput.classList.add('is-valid');
                phoneInput.setCustomValidity('');
            } else {
                phoneInput.classList.add('is-invalid');
                phoneInput.classList.remove('is-valid');
                phoneInput.setCustomValidity('Por favor, informe um telefone válido (10 ou 11 dígitos).');
            }
        };

        phoneInput.addEventListener('input', validatePhoneField);
        phoneInput.addEventListener('blur', validatePhoneField);
    })();

    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Mensagem enviada com sucesso! Entraremos em contato em breve.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.insertAdjacentElement('afterend', alertDiv);
            
            // Remover o alerta após 5 segundos
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }

    // Função para adicionar produto ao carrinho
    function addToCart(productName) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-shopping-cart me-2"></i>
            ${productName} adicionado ao carrinho!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.insertAdjacentElement('afterend', alertDiv);
            
            // Remover o alerta após 3 segundos
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 3000);
        }
    }

    // Adicionar event listeners para botões de carrinho
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        if (button.textContent.includes('Adicionar ao Carrinho')) {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h5').textContent;
                addToCart(productName);
            });
        }
    });

    // Função para filtrar produtos
    function filterProducts() {
        const searchInput = document.querySelector('input[placeholder*="Buscar"]');
        const categorySelect = document.querySelector('select');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const productCards = document.querySelectorAll('.product-card');
                
                productCards.forEach(card => {
                    const productName = card.querySelector('h5').textContent.toLowerCase();
                    const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
                    
                    if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
        
        if (categorySelect) {
            categorySelect.addEventListener('change', function() {
                const selectedCategory = this.value;
                const productCards = document.querySelectorAll('.product-card');
                
                productCards.forEach(card => {
                    if (selectedCategory === 'Todas as categorias') {
                        card.style.display = 'block';
                    } else {
                        // Aqui você pode implementar a lógica de filtro por categoria
                        // Por enquanto, apenas mostra todos os produtos
                        card.style.display = 'block';
                    }
                });
            });
        }
    }

    // Inicializar filtros
    filterProducts();

    // Função para animar números nos cards de estatísticas
    function animateNumbers() {
        const numberElements = document.querySelectorAll('.stat-content h3, .stock-content h4, .checklist-content h4');
        
        // Evitar múltiplas execuções
        if (window.numbersAnimated) {
            return;
        }
        window.numbersAnimated = true;
        
        numberElements.forEach(element => {
            // Verificar se já foi animado
            if (element.dataset.animated === 'true') {
                return;
            }
            element.dataset.animated = 'true';
            
            const originalText = element.textContent;
            const finalNumber = parseInt(originalText.replace(/[^\d]/g, ''));
            
            // Para números muito grandes, não animar para evitar problemas de performance
            const maxAnimatedNumber = 10000; // 10 mil
            
            if (finalNumber > maxAnimatedNumber) {
                // Apenas formatar o número sem animação
                const formattedNumber = finalNumber.toLocaleString('pt-BR');
                // Substituir apenas a primeira ocorrência do padrão de número completo
                element.textContent = originalText.replace(/[\d,\.]+/, formattedNumber);
                return;
            }
            
            if (finalNumber === 0) {
                return;
            }
            
            const duration = Math.min(1500, finalNumber * 0.1); // Máximo 1.5 segundos
            const increment = finalNumber / (duration / 16); // 60 FPS
            let currentNumber = 0;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                    element.animationTimer = null;
                }
                
                // Manter o formato original (com vírgulas, %, etc.)
                const formattedNumber = Math.floor(currentNumber).toLocaleString('pt-BR');
                // Substituir apenas a primeira ocorrência do padrão de número completo
                element.textContent = originalText.replace(/[\d,\.]+/, formattedNumber);
            }, 16);
            
            // Armazenar o timer no elemento para poder limpar depois
            element.animationTimer = timer;
        });
    }

    // Função para limpar timers de animação
    function clearAnimationTimers() {
        const numberElements = document.querySelectorAll('.stat-content h3, .stock-content h4, .checklist-content h4');
        numberElements.forEach(element => {
            if (element.animationTimer) {
                clearInterval(element.animationTimer);
                element.animationTimer = null;
            }
        });
    }

    // Inicializar animação de números quando a página carregar (apenas uma vez)
    if (!window.numbersAnimated) {
        setTimeout(animateNumbers, 500);
    }

    // Limpar timers quando a página for descarregada
    window.addEventListener('beforeunload', clearAnimationTimers);

    // Função para resetar animações (útil para debugging)
    function resetAnimations() {
        window.numbersAnimated = false;
        clearAnimationTimers();
        const numberElements = document.querySelectorAll('.stat-content h3, .stock-content h4, .checklist-content h4');
        numberElements.forEach(element => {
            element.dataset.animated = 'false';
        });
    }

    // Expor função globalmente para debugging
    window.resetAnimations = resetAnimations;

    // Função para adicionar efeito de hover nos cards
    function addHoverEffects() {
        const cards = document.querySelectorAll('.stat-card, .product-card, .stock-summary-card, .checklist-summary-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            });
        });
    }

    // Inicializar efeitos de hover
    addHoverEffects();

    // Função para mostrar/ocultar sidebar em dispositivos móveis
    function toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const toggleButton = document.querySelector('.navbar-toggler');
        
        if (toggleButton && sidebar) {
            toggleButton.addEventListener('click', function() {
                sidebar.classList.toggle('show');
            });
        }
    }

    // Inicializar toggle da sidebar
    toggleSidebar();

    // Função para adicionar loading nos botões
    function addLoadingToButtons() {
        const buttons = document.querySelectorAll('button[type="submit"], .btn-primary');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.type === 'submit' || this.textContent.includes('Adicionar')) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processando...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                }
            });
        });
    }

    // Inicializar loading nos botões
    addLoadingToButtons();

    // Função para adicionar confirmação antes de excluir
    function addDeleteConfirmation() {
        const deleteButtons = document.querySelectorAll('.btn-outline-danger');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (confirm('Tem certeza que deseja excluir este item?')) {
                    // Aqui você pode implementar a lógica de exclusão
                    const row = this.closest('tr');
                    if (row) {
                        row.style.opacity = '0.5';
                        row.style.textDecoration = 'line-through';
                        
                        setTimeout(() => {
                            row.remove();
                        }, 1000);
                    }
                }
            });
        });
    }

    // Inicializar confirmação de exclusão
    addDeleteConfirmation();
});

// Função utilitária para formatar números
function formatNumber(number) {
    return number.toLocaleString('pt-BR');
}

// Função utilitária para formatar moeda
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

// Função utilitária para validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função utilitária para validar telefone
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// ========================================
// SHOPPING CART FUNCTIONALITY
// ========================================

// Carrinho de compras
let shoppingCart = [];

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        shoppingCart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

// Adicionar item ao carrinho
function addToCartHandler(productName, productPrice, productImage, productStock) {
    const existingItem = shoppingCart.find(item => item.name === productName);
    
    // Verificar estoque disponível
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const stock = productStock ? parseInt(productStock) : 999;
    
    if (currentQuantity >= stock) {
        showStockLimitNotification(productName, stock);
        return false;
    }
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.stock = stock;
    } else {
        shoppingCart.push({
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: 1,
            stock: stock
        });
    }
    
    saveCart();
    updateCartUI();
    showCartNotification(productName);
    return true;
}

// Adicionar múltiplas unidades ao carrinho de uma vez
function addToCartWithQuantity(productName, productPrice, productImage, productStock, quantity) {
    const existingItem = shoppingCart.find(item => item.name === productName);
    
    // Verificar estoque disponível
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const stock = productStock ? parseInt(productStock) : 999;
    const requestedQuantity = parseInt(quantity) || 1;
    
    if (currentQuantity + requestedQuantity > stock) {
        showStockLimitNotification(productName, stock);
        return false;
    }
    
    if (existingItem) {
        existingItem.quantity += requestedQuantity;
        existingItem.stock = stock;
    } else {
        shoppingCart.push({
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: requestedQuantity,
            stock: stock
        });
    }
    
    saveCart();
    updateCartUI();
    return true;
}

// Remover item do carrinho
function removeFromCart(productName) {
    shoppingCart = shoppingCart.filter(item => item.name !== productName);
    saveCart();
    updateCartUI();
}

// Atualizar quantidade
function updateQuantity(productName, change) {
    const item = shoppingCart.find(item => item.name === productName);
    if (item) {
        const newQuantity = item.quantity + change;
        
        // Verificar limite de estoque
        if (newQuantity > item.stock) {
            showStockLimitNotification(productName, item.stock);
            return;
        }
        
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Calcular total do carrinho
function calculateTotal() {
    return shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Atualizar UI do carrinho
function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    // Se os elementos não existem ainda (navbar carregando), tentar novamente
    if (!cartBadge || !cartItems) {
        setTimeout(updateCartUI, 500);
        return;
    }
    
    // Atualizar badge
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Atualizar lista de itens
    if (shoppingCart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = shoppingCart.map(item => {
            const atStockLimit = item.quantity >= item.stock;
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                        <div class="cart-item-quantity">
                            <button onclick="updateQuantity('${item.name}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.name}', 1)" ${atStockLimit ? 'disabled title="Estoque máximo atingido"' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.name}')" title="Remover">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        if (cartFooter) cartFooter.style.display = 'block';
        if (cartTotal) {
            const total = calculateTotal();
            cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }
}

// Mostrar notificação ao adicionar ao carrinho
function showCartNotification(productName) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>${productName}</strong> adicionado ao carrinho!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// Mostrar notificação de limite de estoque
function showStockLimitNotification(productName, stock) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Limite de estoque atingido!</strong><br>
        Apenas ${stock} unidades de <strong>${productName}</strong> disponíveis.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 4000);
}

// Inicializar event listeners para botões de adicionar ao carrinho
let cartButtonsInitialized = false;

function initCartButtons() {
    // Prevenir múltiplas inicializações
    if (cartButtonsInitialized) return;
    
    // Event delegation - funciona para elementos dinâmicos
    document.body.addEventListener('click', function(e) {
        const button = e.target.closest('.add-to-cart');
        if (button) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const productName = button.dataset.name;
            const productPrice = button.dataset.price;
            const productImage = button.dataset.image;
            const productStock = button.dataset.stock;
            
            if (productName && productPrice) {
                addToCartHandler(productName, productPrice, productImage, productStock);
            }
        }
    }, true);
    
    cartButtonsInitialized = true;
}

// Carregar carrinho quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    initCartButtons();
});

// Exportar funções para uso global
window.addToCartHandler = addToCartHandler;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

window.GermoplasmaHub = {
    formatNumber,
    formatCurrency,
    isValidEmail,
    isValidPhone,
    addToCart: addToCartHandler,
    addToCartWithQuantity,
    removeFromCart,
    updateQuantity,
    initCartButtons,
    getCart: () => shoppingCart,
    clearCart: () => {
        shoppingCart = [];
        saveCart();
        updateCartUI();
    }
};
