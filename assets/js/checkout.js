// ========================================
// CHECKOUT SYSTEM - GermoplasmaHub
// ========================================

// Configurações
const SHIPPING_CONFIGS = {
    freeShippingThreshold: 500,
    standardShipping: 25.00,
    expressShipping: 45.00,
    installmentThreshold: 250,
    maxInstallmentsNoInterest: 3,
    maxInstallmentsWithInterest: 12,
    interestRate: 0.03 // 3% ao mês
};

// Estado do checkout
let checkoutData = {
    currentStep: 1,
    address: {},
    payment: {},
    cart: [],
    shipping: SHIPPING_CONFIGS.standardShipping,
    subtotal: 0,
    total: 0
};

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    updateOrderSummary();
    setupEventListeners();
    checkEmptyCart();
});

// Carregar dados do carrinho
function loadCartData() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        checkoutData.cart = JSON.parse(savedCart);
        checkoutData.subtotal = calculateSubtotal();
        updateShipping();
    }
}

// Verificar se o carrinho está vazio
function checkEmptyCart() {
    if (checkoutData.cart.length === 0) {
        document.getElementById('empty-cart-message').style.display = 'block';
        document.getElementById('checkout-main').style.display = 'none';
    } else {
        document.getElementById('empty-cart-message').style.display = 'none';
        document.getElementById('checkout-main').style.display = 'block';
    }
}

// ========================================
// MÁSCARAS DE ENTRADA
// ========================================

function setupEventListeners() {
    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });

        cepInput.addEventListener('blur', function(e) {
            if (e.target.value.length === 9) {
                searchCEP(e.target.value);
            }
        });
    }

    // Máscara de telefone
    const phoneInput = document.getElementById('recipient-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    }

    // Máscara de cartão
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value.substring(0, 19);
            
            // Detectar bandeira e validar
            detectCardBrand(value.replace(/\s/g, ''));
        });
    }

    // Máscara de validade
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Máscara de CVV
    const cardCvvInput = document.getElementById('card-cvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Atualizar parcelamento quando mudar método de pagamento
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(radio => {
        radio.addEventListener('change', function() {
            togglePaymentFields(this.value);
            updateInstallments();
        });
    });
    
    // Atualizar resumo quando mudar parcelas
    const installmentsSelect = document.getElementById('installments');
    if (installmentsSelect) {
        installmentsSelect.addEventListener('change', function() {
            updateOrderSummaryWithInstallments();
        });
    }
}

// ========================================
// PIX PAYMENT SYSTEM
// ========================================

// Alternar campos de pagamento baseado no método selecionado
function togglePaymentFields(paymentMethod) {
    const cardFields = [
        document.getElementById('card-number'),
        document.getElementById('card-name'),
        document.getElementById('card-expiry'),
        document.getElementById('card-cvv')
    ];
    
    const installmentsContainer = document.getElementById('installments-container');
    const pixInfo = document.getElementById('pix-info');
    
    if (paymentMethod === 'pix') {
        // Mostrar informações do PIX
        pixInfo.style.display = 'block';
        installmentsContainer.style.display = 'none';
        
        // Ocultar e desabilitar campos de cartão
        cardFields.forEach((field, index) => {
            if (field) {
                field.closest('.mb-3').style.display = 'none';
                field.removeAttribute('required');
            }
            // Ocultar linha de validade e CVV
            if (index === 2) {
                field.closest('.row').style.display = 'none';
            }
        });
    } else {
        // Mostrar campos de cartão
        pixInfo.style.display = 'none';
        installmentsContainer.style.display = 'block';
        
        // Mostrar e habilitar campos de cartão
        cardFields.forEach((field, index) => {
            if (field) {
                field.closest('.mb-3').style.display = 'block';
                field.setAttribute('required', 'required');
            }
            // Mostrar linha de validade e CVV
            if (index === 2) {
                field.closest('.row').style.display = 'flex';
            }
        });
    }
}

// Gerar código PIX simulado
function generatePixCode(orderValue, orderNumber) {
    // Formato simulado de código PIX
    // Em produção, isso viria do backend/gateway de pagamento
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    
    const pixCode = `00020126580014br.gov.bcb.pix0136${randomString}` +
                   `52040000530398654${orderValue.toFixed(2)}5802BR5925GERMOPLASMA` +
                   `HUB6009SAO PAULO62${orderNumber.length.toString().padStart(2, '0')}${orderNumber}6304`;
    
    // Adicionar checksum simulado
    return pixCode + calculateChecksum(pixCode);
}

// Calcular checksum simulado
function calculateChecksum(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return (sum % 9999).toString().padStart(4, '0');
}

// Gerar QR Code do PIX
function generatePixQRCode(pixCode) {
    const qrCodeElement = document.getElementById('qr-code');
    qrCodeElement.innerHTML = ''; // Limpar QR Code anterior
    
    new QRCode(qrCodeElement, {
        text: pixCode,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Copiar código PIX
function copyPixCode() {
    const pixCodeInput = document.getElementById('pix-code');
    pixCodeInput.select();
    pixCodeInput.setSelectionRange(0, 99999); // Para mobile
    
    navigator.clipboard.writeText(pixCodeInput.value).then(() => {
        showNotification('Código PIX copiado com sucesso!', 'success');
    }).catch(() => {
        // Fallback para navegadores antigos
        document.execCommand('copy');
        showNotification('Código PIX copiado!', 'success');
    });
}

// Timer do PIX (10 minutos)
let pixTimerInterval;
function startPixTimer() {
    let timeLeft = 600; // 10 minutos em segundos
    const timerElement = document.getElementById('pix-timer');
    
    // Limpar timer anterior se existir
    if (pixTimerInterval) {
        clearInterval(pixTimerInterval);
    }
    
    pixTimerInterval = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(pixTimerInterval);
            timerElement.textContent = 'EXPIRADO';
            timerElement.style.color = 'red';
            showNotification('QR Code do PIX expirou. Por favor, gere um novo.', 'error');
        }
    }, 1000);
}

// Simular pagamento PIX (para testes)
function simulatePixPayment() {
    const statusElement = document.getElementById('pix-status');
    statusElement.style.display = 'block';
    statusElement.className = 'alert alert-info';
    statusElement.innerHTML = `
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Processando...</span>
        </div>
        Processando pagamento...
    `;
    
    // Simular aprovação após 2 segundos
    setTimeout(() => {
        statusElement.className = 'alert alert-success';
        statusElement.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Pagamento aprovado!</strong><br>
            Redirecionando para confirmação...
        `;
        
        // Parar o timer
        if (pixTimerInterval) {
            clearInterval(pixTimerInterval);
        }
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('pixModal'));
            modal.hide();
            
            // Finalizar pedido
            finishPixOrder();
        }, 2000);
    }, 2000);
}

// ========================================
// BUSCA DE CEP (API ViaCEP)
// ========================================

async function searchCEP(cep) {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
        showNotification('CEP inválido', 'error');
        return;
    }

    const cepInput = document.getElementById('cep');
    cepInput.classList.add('cep-searching');
    cepInput.disabled = true;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();

        if (data.erro) {
            showNotification('CEP não encontrado', 'error');
            clearAddressFields();
        } else {
            fillAddressFields(data);
            showNotification('CEP encontrado!', 'success');
        }
    } catch (error) {
        showNotification('Erro ao buscar CEP. Tente novamente.', 'error');
        console.error('Erro ao buscar CEP:', error);
    } finally {
        cepInput.classList.remove('cep-searching');
        cepInput.disabled = false;
    }
}

function fillAddressFields(data) {
    document.getElementById('street').value = data.logradouro || '';
    document.getElementById('neighborhood').value = data.bairro || '';
    document.getElementById('city').value = data.localidade || '';
    document.getElementById('state').value = data.uf || '';
    
    // Focar no campo de número
    document.getElementById('number').focus();
}

function clearAddressFields() {
    document.getElementById('street').value = '';
    document.getElementById('neighborhood').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
}

// ========================================
// VALIDAÇÃO DE CARTÃO DE CRÉDITO
// ========================================

// Algoritmo de Luhn para validar número do cartão
function validateCardNumber(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Detectar bandeira do cartão
function detectCardBrand(cardNumber) {
    const cardBrandElement = document.getElementById('card-brand');
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        elo: /^(4011|4312|4389|4514|4576|5041|5066|5067|6277|6362|6363|6504|6505|6516)/,
        hipercard: /^(38|60)/,
        diners: /^3(?:0[0-5]|[68])/,
        discover: /^6(?:011|5)/
    };

    let brand = '';
    for (const [key, pattern] of Object.entries(patterns)) {
        if (pattern.test(cardNumber)) {
            brand = key;
            break;
        }
    }

    if (brand) {
        const brandNames = {
            visa: 'Visa',
            mastercard: 'Mastercard',
            amex: 'American Express',
            elo: 'Elo',
            hipercard: 'Hipercard',
            diners: 'Diners Club',
            discover: 'Discover'
        };
        cardBrandElement.textContent = `Bandeira: ${brandNames[brand]}`;
        cardBrandElement.className = 'text-success';
        
        // Validar cartão completo
        if (cardNumber.length >= 13) {
            if (validateCardNumber(cardNumber)) {
                cardBrandElement.textContent += ' ✓ Válido';
            } else {
                cardBrandElement.textContent = 'Número de cartão inválido';
                cardBrandElement.className = 'text-danger';
            }
        }
    } else {
        cardBrandElement.textContent = '';
    }

    return brand;
}

// Validar data de validade
function validateExpiry(expiry) {
    const [month, year] = expiry.split('/');
    
    if (!month || !year || month.length !== 2 || year.length !== 2) {
        return false;
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (monthNum < 1 || monthNum > 12) {
        return false;
    }

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        return false;
    }

    return true;
}

// ========================================
// CÁLCULO DE FRETE E PARCELAMENTO
// ========================================

function calculateSubtotal() {
    return checkoutData.cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function updateShipping() {
    const subtotal = checkoutData.subtotal;
    
    if (subtotal >= SHIPPING_CONFIGS.freeShippingThreshold) {
        checkoutData.shipping = 0;
        document.getElementById('free-shipping-badge').style.display = 'inline-block';
        document.getElementById('free-shipping-info').style.display = 'block';
        document.getElementById('shipping-saved').textContent = formatCurrency(SHIPPING_CONFIGS.standardShipping);
        document.getElementById('shipping-progress').style.display = 'none';
    } else {
        checkoutData.shipping = SHIPPING_CONFIGS.standardShipping;
        document.getElementById('free-shipping-badge').style.display = 'none';
        document.getElementById('free-shipping-info').style.display = 'none';
        
        // Mostrar progresso para frete grátis
        const remaining = SHIPPING_CONFIGS.freeShippingThreshold - subtotal;
        const progress = (subtotal / SHIPPING_CONFIGS.freeShippingThreshold) * 100;
        
        document.getElementById('shipping-progress').style.display = 'block';
        document.getElementById('shipping-remaining').textContent = formatCurrency(remaining);
        document.getElementById('shipping-progress-bar').style.width = progress + '%';
    }

    checkoutData.total = subtotal + checkoutData.shipping;
}

function updateInstallments() {
    const total = checkoutData.total;
    const installmentsSelect = document.getElementById('installments');
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    installmentsSelect.innerHTML = '';

    if (paymentMethod === 'debit') {
        // Débito: apenas à vista
        const option = document.createElement('option');
        option.value = '1';
        option.textContent = `1x de ${formatCurrency(total)} à vista`;
        installmentsSelect.appendChild(option);
        
        document.getElementById('installments-info').style.display = 'none';
    } else {
        // Crédito: parcelamento sempre disponível
        const maxInstallments = SHIPPING_CONFIGS.maxInstallmentsWithInterest;
        const isAboveThreshold = total >= SHIPPING_CONFIGS.installmentThreshold;

        for (let i = 1; i <= maxInstallments; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            
            if (i === 1) {
                // À vista
                option.textContent = `1x de ${formatCurrency(total)} à vista`;
            } else if (isAboveThreshold && i <= SHIPPING_CONFIGS.maxInstallmentsNoInterest) {
                // Sem juros (2x ou 3x) - apenas para valores acima de R$ 250
                const installmentValue = total / i;
                option.textContent = `${i}x de ${formatCurrency(installmentValue)} sem juros`;
            } else {
                // Com juros - para valores abaixo de R$ 250 (todas) ou acima de R$ 250 (4x a 12x)
                const installmentData = calculateInstallmentWithInterest(total, i, SHIPPING_CONFIGS.interestRate);
                option.textContent = `${i}x de ${formatCurrency(installmentData.installmentValue)} com juros (total: ${formatCurrency(installmentData.totalWithInterest)})`;
            }
            
            installmentsSelect.appendChild(option);
        }

        // Mostrar informação de parcelamento
        if (maxInstallments > 1) {
            let infoHTML = '<i class="fas fa-info-circle me-2"></i><strong>Parcelamento disponível!</strong><br>';
            
            if (isAboveThreshold) {
                // Acima de R$ 250: destaque para sem juros
                const noInterestValue = total / SHIPPING_CONFIGS.maxInstallmentsNoInterest;
                const withInterestData = calculateInstallmentWithInterest(total, SHIPPING_CONFIGS.maxInstallmentsWithInterest, SHIPPING_CONFIGS.interestRate);
                
                infoHTML += `
                    <span class="text-success">
                        <i class="fas fa-check-circle me-1"></i>
                        <strong>Até ${SHIPPING_CONFIGS.maxInstallmentsNoInterest}x de ${formatCurrency(noInterestValue)} SEM JUROS</strong>
                    </span><br>
                    • Ou até ${SHIPPING_CONFIGS.maxInstallmentsWithInterest}x de ${formatCurrency(withInterestData.installmentValue)} com juros de 3% a.m.
                `;
            } else {
                // Abaixo de R$ 250: todas as parcelas com juros
                const withInterestData2x = calculateInstallmentWithInterest(total, 2, SHIPPING_CONFIGS.interestRate);
                const withInterestData12x = calculateInstallmentWithInterest(total, SHIPPING_CONFIGS.maxInstallmentsWithInterest, SHIPPING_CONFIGS.interestRate);
                
                infoHTML += `
                    <span class="text-warning">
                        <i class="fas fa-exclamation-circle me-1"></i>
                        Parcelas com juros de 3% ao mês
                    </span><br>
                    <small class="text-muted">
                        💡 <strong>Dica:</strong> Compras acima de R$ 250 têm até 3x sem juros!
                    </small>
                `;
            }
            
            document.getElementById('installments-info').innerHTML = infoHTML;
            document.getElementById('installments-info').style.display = 'block';
        } else {
            document.getElementById('installments-info').style.display = 'none';
        }
    }
}

// Calcular parcela com juros compostos
function calculateInstallmentWithInterest(principal, installments, monthlyRate) {
    // Fórmula de juros compostos: PMT = PV × [i × (1 + i)^n] / [(1 + i)^n - 1]
    const i = monthlyRate;
    const n = installments;
    
    const installmentValue = principal * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const totalWithInterest = installmentValue * installments;
    
    return {
        installmentValue: installmentValue,
        totalWithInterest: totalWithInterest,
        totalInterest: totalWithInterest - principal
    };
}

// ========================================
// RESUMO DO PEDIDO
// ========================================

function updateOrderSummary() {
    const summaryItemsElement = document.getElementById('summary-items');
    
    if (!summaryItemsElement) return;

    summaryItemsElement.innerHTML = checkoutData.cart.map(item => {
        const atStockLimit = item.quantity >= item.stock;
        
        return `
            <div class="summary-item" data-product-name="${item.name}">
                <img src="${item.image}" alt="${item.name}">
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-price">
                        ${formatCurrency(item.price)} cada
                    </div>
                    <div class="summary-item-controls">
                        <button class="btn-quantity" onclick="updateCheckoutQuantity('${item.name}', -1)" title="Diminuir">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="btn-quantity" onclick="updateCheckoutQuantity('${item.name}', 1)" 
                                ${atStockLimit ? 'disabled title="Estoque máximo"' : 'title="Aumentar"'}>
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-remove" onclick="removeFromCheckout('${item.name}')" title="Remover">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="summary-item-total">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('summary-subtotal').textContent = formatCurrency(checkoutData.subtotal);
    document.getElementById('summary-shipping').textContent = checkoutData.shipping === 0 
        ? 'GRÁTIS' 
        : formatCurrency(checkoutData.shipping);
    document.getElementById('summary-total').textContent = formatCurrency(checkoutData.total);

    updateInstallments();
}

// Atualizar resumo com informação de parcelas
function updateOrderSummaryWithInstallments() {
    const installmentsSelect = document.getElementById('installments');
    if (!installmentsSelect) return;
    
    const selectedInstallments = parseInt(installmentsSelect.value);
    
    // Verificar se tem juros
    if (selectedInstallments > SHIPPING_CONFIGS.maxInstallmentsNoInterest) {
        const installmentData = calculateInstallmentWithInterest(
            checkoutData.total,
            selectedInstallments,
            SHIPPING_CONFIGS.interestRate
        );
        
        // Atualizar total com informação de juros
        document.getElementById('summary-total').innerHTML = `
            ${formatCurrency(checkoutData.total)}<br>
            <small class="text-warning" style="font-size: 0.75rem; font-weight: normal;">
                Com juros: ${formatCurrency(installmentData.totalWithInterest)}
            </small>
        `;
    } else {
        // Voltar ao normal
        document.getElementById('summary-total').textContent = formatCurrency(checkoutData.total);
    }
}

// ========================================
// NAVEGAÇÃO ENTRE ETAPAS
// ========================================

function nextStep(step) {
    // Validar etapa atual antes de avançar
    if (step === 2 && !validateAddressForm()) {
        showNotification('Por favor, preencha todos os campos obrigatórios do endereço.', 'error');
        return;
    }

    if (step === 3 && !validatePaymentForm()) {
        showNotification('Por favor, preencha todos os campos de pagamento corretamente.', 'error');
        return;
    }

    // Salvar dados
    if (step === 2) {
        saveAddressData();
    } else if (step === 3) {
        savePaymentData();
        updateReviewSection();
    }

    // Atualizar UI
    updateStepUI(step);
    checkoutData.currentStep = step;

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    updateStepUI(step);
    checkoutData.currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepUI(step) {
    // Atualizar círculos de etapas
    for (let i = 1; i <= 3; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        const sectionElement = document.getElementById(`section-${getSectionName(i)}`);
        
        if (i < step) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (i === step) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
        } else {
            stepElement.classList.remove('active', 'completed');
        }

        if (i === step) {
            sectionElement.classList.add('active');
        } else {
            sectionElement.classList.remove('active');
        }
    }
}

function getSectionName(step) {
    const sections = {
        1: 'address',
        2: 'payment',
        3: 'review'
    };
    return sections[step];
}

// ========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ========================================

function validateAddressForm() {
    const form = document.getElementById('address-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });

    // Validar CEP
    const cep = document.getElementById('cep').value;
    if (cep.replace(/\D/g, '').length !== 8) {
        document.getElementById('cep').classList.add('is-invalid');
        isValid = false;
    }

    return isValid;
}

function validatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Se for PIX, não precisa validar cartão
    if (paymentMethod === 'pix') {
        return true;
    }
    
    const form = document.getElementById('payment-form');
    let isValid = true;

    // Validar número do cartão
    const cardNumber = document.getElementById('card-number').value;
    if (!validateCardNumber(cardNumber)) {
        document.getElementById('card-number').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('card-number').classList.remove('is-invalid');
        document.getElementById('card-number').classList.add('is-valid');
    }

    // Validar nome no cartão
    const cardName = document.getElementById('card-name').value;
    if (cardName.trim().length < 3) {
        document.getElementById('card-name').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('card-name').classList.remove('is-invalid');
        document.getElementById('card-name').classList.add('is-valid');
    }

    // Validar validade
    const cardExpiry = document.getElementById('card-expiry').value;
    if (!validateExpiry(cardExpiry)) {
        document.getElementById('card-expiry').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('card-expiry').classList.remove('is-invalid');
        document.getElementById('card-expiry').classList.add('is-valid');
    }

    // Validar CVV
    const cardCvv = document.getElementById('card-cvv').value;
    if (cardCvv.length < 3 || cardCvv.length > 4) {
        document.getElementById('card-cvv').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('card-cvv').classList.remove('is-invalid');
        document.getElementById('card-cvv').classList.add('is-valid');
    }

    return isValid;
}

// ========================================
// SALVAR DADOS DO CHECKOUT
// ========================================

function saveAddressData() {
    checkoutData.address = {
        cep: document.getElementById('cep').value,
        street: document.getElementById('street').value,
        number: document.getElementById('number').value,
        complement: document.getElementById('complement').value,
        neighborhood: document.getElementById('neighborhood').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        recipientName: document.getElementById('recipient-name').value,
        recipientPhone: document.getElementById('recipient-phone').value
    };
}

function savePaymentData() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (paymentMethod === 'pix') {
        // Dados do PIX
        checkoutData.payment = {
            method: 'pix',
            pixCode: null, // Será gerado na finalização
            pixStatus: 'pending'
        };
    } else {
        // Dados do cartão
        const cardNumber = document.getElementById('card-number').value;
        const lastFourDigits = cardNumber.replace(/\D/g, '').slice(-4);
        const installments = parseInt(document.getElementById('installments').value);
        
        let installmentValue = checkoutData.total / installments;
        let totalWithInterest = checkoutData.total;
        let hasInterest = false;
        
        const isAboveThreshold = checkoutData.total >= SHIPPING_CONFIGS.installmentThreshold;
        
        // Calcular juros se aplicável
        // Regra: Abaixo de R$ 250 = todas as parcelas (exceto 1x) têm juros
        //        Acima de R$ 250 = até 3x sem juros, 4x+ com juros
        if (installments > 1) {
            if (!isAboveThreshold || installments > SHIPPING_CONFIGS.maxInstallmentsNoInterest) {
                // Tem juros se:
                // - Valor abaixo de R$ 250 E parcelas > 1
                // - OU valor acima de R$ 250 E parcelas > 3
                const installmentData = calculateInstallmentWithInterest(
                    checkoutData.total, 
                    installments, 
                    SHIPPING_CONFIGS.interestRate
                );
                installmentValue = installmentData.installmentValue;
                totalWithInterest = installmentData.totalWithInterest;
                hasInterest = true;
            }
        }
        
        checkoutData.payment = {
            method: paymentMethod,
            cardBrand: detectCardBrand(cardNumber.replace(/\D/g, '')),
            cardLastDigits: lastFourDigits,
            cardName: document.getElementById('card-name').value,
            installments: installments,
            installmentValue: installmentValue,
            hasInterest: hasInterest,
            totalWithInterest: totalWithInterest
        };
        
        // Atualizar total do checkout se houver juros
        if (hasInterest) {
            checkoutData.totalWithInterest = totalWithInterest;
        }
    }
}

// ========================================
// SEÇÃO DE REVISÃO
// ========================================

function updateReviewSection() {
    // Atualizar endereço
    const reviewAddress = document.getElementById('review-address');
    reviewAddress.innerHTML = `
        <strong>${checkoutData.address.recipientName}</strong><br>
        ${checkoutData.address.street}, ${checkoutData.address.number}
        ${checkoutData.address.complement ? ' - ' + checkoutData.address.complement : ''}<br>
        ${checkoutData.address.neighborhood}<br>
        ${checkoutData.address.city} - ${checkoutData.address.state}<br>
        CEP: ${checkoutData.address.cep}<br>
        Telefone: ${checkoutData.address.recipientPhone}
    `;

    // Atualizar pagamento
    const reviewPayment = document.getElementById('review-payment');
    
    if (checkoutData.payment.method === 'pix') {
        reviewPayment.innerHTML = `
            <strong><i class="fas fa-qrcode me-2 text-success"></i>PIX</strong><br>
            Pagamento via QR Code<br>
            <span class="badge bg-success">Aprovação Imediata</span><br>
            <small class="text-muted mt-2 d-block">O QR Code será gerado após a confirmação</small>
        `;
    } else {
        const paymentMethodText = checkoutData.payment.method === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito';
        
        let installmentText = 'À vista';
        let installmentBadge = '';
        
        if (checkoutData.payment.installments > 1) {
            if (checkoutData.payment.hasInterest) {
                installmentText = `${checkoutData.payment.installments}x de ${formatCurrency(checkoutData.payment.installmentValue)} com juros (3% a.m.)`;
                installmentBadge = '<span class="badge bg-warning text-dark ms-2">Com Juros</span>';
            } else {
                installmentText = `${checkoutData.payment.installments}x de ${formatCurrency(checkoutData.payment.installmentValue)} sem juros`;
                installmentBadge = '<span class="badge bg-success ms-2">Sem Juros</span>';
            }
        }
        
        reviewPayment.innerHTML = `
            <strong>${paymentMethodText}</strong><br>
            Terminado em •••• ${checkoutData.payment.cardLastDigits}<br>
            Titular: ${checkoutData.payment.cardName}<br>
            Parcelamento: ${installmentText} ${installmentBadge}
            ${checkoutData.payment.hasInterest ? `<br><small class="text-muted">Total a pagar: ${formatCurrency(checkoutData.payment.totalWithInterest)}</small>` : ''}
        `;
    }

    // Atualizar itens
    const reviewItems = document.getElementById('review-items');
    reviewItems.innerHTML = checkoutData.cart.map(item => `
        <div class="d-flex align-items-center mb-3 p-2 bg-light rounded">
            <img src="${item.image}" alt="${item.name}" 
                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 1rem;">
            <div class="flex-grow-1">
                <div class="fw-bold">${item.name}</div>
                <small class="text-muted">Quantidade: ${item.quantity}</small>
            </div>
            <div class="fw-bold">${formatCurrency(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

// ========================================
// FINALIZAR PEDIDO
// ========================================

async function finishOrder() {
    const btnFinish = document.getElementById('btn-finish');
    const originalText = btnFinish.innerHTML;
    
    btnFinish.disabled = true;
    btnFinish.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processando...';

    try {
        // Verificar se é pagamento PIX
        if (checkoutData.payment.method === 'pix') {
            btnFinish.disabled = false;
            btnFinish.innerHTML = originalText;
            
            // Abrir modal do PIX
            await openPixModal();
            return;
        }

        // Processar pagamento com cartão
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Gerar número do pedido
        const orderNumber = generateOrderNumber();
        
        // Salvar pedido no localStorage
        saveOrder(orderNumber);

        // Limpar carrinho
        localStorage.removeItem('shoppingCart');
        
        // Redirecionar para página de confirmação
        window.location.href = `order-confirmation.html?order=${orderNumber}`;
        
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        showNotification('Erro ao processar o pedido. Tente novamente.', 'error');
        btnFinish.disabled = false;
        btnFinish.innerHTML = originalText;
    }
}

// Abrir modal do PIX
async function openPixModal() {
    // Gerar número do pedido
    const orderNumber = generateOrderNumber();
    
    // Gerar código PIX
    const pixCode = generatePixCode(checkoutData.total, orderNumber);
    
    // Salvar código PIX
    checkoutData.payment.pixCode = pixCode;
    checkoutData.orderNumber = orderNumber;
    
    // Preencher código no input
    document.getElementById('pix-code').value = pixCode;
    
    // Gerar QR Code
    generatePixQRCode(pixCode);
    
    // Iniciar timer
    startPixTimer();
    
    // Abrir modal
    const pixModal = new bootstrap.Modal(document.getElementById('pixModal'));
    pixModal.show();
}

// Finalizar pedido PIX (após pagamento simulado)
async function finishPixOrder() {
    try {
        // Marcar como pago
        checkoutData.payment.pixStatus = 'paid';
        
        // Salvar pedido no localStorage
        saveOrder(checkoutData.orderNumber);

        // Limpar carrinho
        localStorage.removeItem('shoppingCart');
        
        // Redirecionar para página de confirmação
        window.location.href = `order-confirmation.html?order=${checkoutData.orderNumber}`;
        
    } catch (error) {
        console.error('Erro ao finalizar pedido PIX:', error);
        showNotification('Erro ao processar o pedido. Tente novamente.', 'error');
    }
}

function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `GH${timestamp}${random}`;
}

function saveOrder(orderNumber) {
    const order = {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: checkoutData.cart,
        address: checkoutData.address,
        payment: checkoutData.payment,
        subtotal: checkoutData.subtotal,
        shipping: checkoutData.shipping,
        total: checkoutData.total,
        totalWithInterest: checkoutData.totalWithInterest || checkoutData.total
    };

    // Salvar no histórico de pedidos
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// ========================================
// UTILITÁRIOS
// ========================================

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    alertDiv.innerHTML = `
        <i class="fas fa-${icon} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 4000);
}

// ========================================
// EDIÇÃO DO CARRINHO NO CHECKOUT
// ========================================

// Atualizar quantidade de item no checkout
function updateCheckoutQuantity(productName, change) {
    const item = checkoutData.cart.find(item => item.name === productName);
    
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    // Verificar limite de estoque
    if (newQuantity > item.stock) {
        showNotification(
            `⚠️ Limite de estoque atingido!\nApenas ${item.stock} unidades disponíveis.`, 
            'warning'
        );
        return;
    }
    
    // Se quantidade ficar 0 ou menor, confirmar remoção
    if (newQuantity <= 0) {
        removeFromCheckout(productName);
        return;
    }
    
    // Animação visual antes de atualizar
    const itemElement = document.querySelector(`.summary-item[data-product-name="${productName}"]`);
    if (itemElement) {
        itemElement.style.transform = 'scale(0.98)';
        setTimeout(() => {
            itemElement.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Atualizar quantidade
    const oldQuantity = item.quantity;
    item.quantity = newQuantity;
    
    // Salvar no localStorage
    syncCartWithLocalStorage();
    
    // Recalcular totais
    recalculateCheckout();
    
    // Atualizar UI
    updateOrderSummary();
    
    // Atualizar badge do carrinho na navbar
    updateNavbarCartBadge();
    
    // Feedback visual com informação detalhada
    const changeText = change > 0 ? 'aumentada' : 'diminuída';
    showNotification(
        `✓ Quantidade ${changeText}: ${oldQuantity} → ${newQuantity}`, 
        'success'
    );
}

// Remover item do checkout
function removeFromCheckout(productName) {
    // Se for o último item, pedir confirmação
    if (checkoutData.cart.length === 1) {
        // Criar modal de confirmação personalizado
        const confirmed = confirm(
            '⚠️ Este é o único item no carrinho!\n\n' +
            'Se você removê-lo, o carrinho ficará vazio e você será redirecionado para o marketplace.\n\n' +
            'Deseja realmente remover este item?'
        );
        
        if (!confirmed) {
            return; // Usuário cancelou
        }
        
        // Limpar carrinho
        checkoutData.cart = [];
        localStorage.removeItem('shoppingCart');
        
        // Mostrar mensagem e redirecionar
        showNotification('Carrinho vazio! Redirecionando para o marketplace...', 'info');
        
        setTimeout(() => {
            window.location.href = 'marketplace.html';
        }, 2000);
        
        return;
    }
    
    // Adicionar animação de remoção
    const itemElement = document.querySelector(`.summary-item[data-product-name="${productName}"]`);
    if (itemElement) {
        itemElement.classList.add('removing');
    }
    
    // Aguardar animação antes de remover
    setTimeout(() => {
        // Remover item
        checkoutData.cart = checkoutData.cart.filter(item => item.name !== productName);
        
        // Salvar no localStorage
        syncCartWithLocalStorage();
        
        // Recalcular totais
        recalculateCheckout();
        
        // Atualizar UI
        updateOrderSummary();
        
        // Atualizar badge do carrinho na navbar (se existir)
        updateNavbarCartBadge();
        
        // Feedback visual
        showNotification(`${productName} removido do carrinho.`, 'success');
    }, 300); // Tempo da animação
}

// Sincronizar carrinho com localStorage
function syncCartWithLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(checkoutData.cart));
}

// Recalcular todos os valores do checkout
function recalculateCheckout() {
    // Recalcular subtotal
    checkoutData.subtotal = calculateSubtotal();
    
    // Recalcular frete
    updateShipping();
    
    // Atualizar parcelamento (se aplicável)
    if (document.getElementById('installments')) {
        updateInstallments();
    }
}

// Atualizar badge do carrinho na navbar
function updateNavbarCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = checkoutData.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Expor funções globalmente
window.nextStep = nextStep;
window.prevStep = prevStep;
window.finishOrder = finishOrder;
window.searchCEP = searchCEP;
window.copyPixCode = copyPixCode;
window.simulatePixPayment = simulatePixPayment;
window.updateCheckoutQuantity = updateCheckoutQuantity;
window.removeFromCheckout = removeFromCheckout;

