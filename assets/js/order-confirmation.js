// ========================================
// ORDER CONFIRMATION - GermoplasmaHub
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetails();
});

// Carregar detalhes do pedido
function loadOrderDetails() {
    // Obter número do pedido da URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('order');

    if (!orderNumber) {
        // Redirecionar para marketplace se não houver número do pedido
        window.location.href = 'marketplace.html';
        return;
    }

    // Buscar pedido no localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber === orderNumber);

    if (!order) {
        // Redirecionar para marketplace se pedido não encontrado
        window.location.href = 'marketplace.html';
        return;
    }

    // Preencher informações do pedido
    displayOrderDetails(order);
}

// Exibir detalhes do pedido
function displayOrderDetails(order) {
    // Número do pedido
    document.getElementById('order-number').textContent = order.orderNumber;

    // Data do pedido
    const orderDate = new Date(order.date);
    document.getElementById('order-date').textContent = formatDate(orderDate);
    document.getElementById('timeline-confirmed').textContent = formatDate(orderDate);

    // Valor total
    document.getElementById('order-total').textContent = formatCurrency(order.total);

    // Itens do pedido
    displayOrderItems(order.items, order.subtotal, order.shipping, order.total);

    // Endereço
    displayOrderAddress(order.address);

    // Pagamento
    displayOrderPayment(order.payment, order.total);

    // Previsão de entrega (7-10 dias úteis)
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 10);
    document.getElementById('delivery-estimate').textContent = formatDate(deliveryDate);
}

// Exibir itens do pedido
function displayOrderItems(items, subtotal, shipping, total) {
    const orderItemsElement = document.getElementById('order-items');
    
    orderItemsElement.innerHTML = items.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Quantidade: ${item.quantity}</div>
            </div>
            <div class="order-item-price">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        </div>
    `).join('');

    // Adicionar resumo de valores
    orderItemsElement.innerHTML += `
        <div class="mt-3 pt-3 border-top">
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal:</span>
                <span class="fw-bold">${formatCurrency(subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Frete:</span>
                <span class="fw-bold ${shipping === 0 ? 'text-success' : ''}">
                    ${shipping === 0 ? 'GRÁTIS' : formatCurrency(shipping)}
                </span>
            </div>
            <div class="d-flex justify-content-between pt-2 border-top">
                <span class="fw-bold">Total:</span>
                <span class="fw-bold text-success fs-5">${formatCurrency(total)}</span>
            </div>
        </div>
    `;
}

// Exibir endereço de entrega
function displayOrderAddress(address) {
    const addressElement = document.getElementById('order-address');
    
    addressElement.innerHTML = `
        <strong>${address.recipientName}</strong><br>
        ${address.street}, ${address.number}
        ${address.complement ? ' - ' + address.complement : ''}<br>
        ${address.neighborhood}<br>
        ${address.city} - ${address.state}<br>
        CEP: ${address.cep}<br>
        <i class="fas fa-phone me-1"></i> ${address.recipientPhone}
    `;
}

// Exibir informações de pagamento
function displayOrderPayment(payment, total) {
    const paymentElement = document.getElementById('order-payment');
    
    if (payment.method === 'pix') {
        // Pagamento PIX
        const pixStatus = payment.pixStatus === 'paid' ? 'Pago' : 'Aguardando pagamento';
        const statusClass = payment.pixStatus === 'paid' ? 'success' : 'warning';
        
        paymentElement.innerHTML = `
            <strong><i class="fas fa-qrcode me-2 text-success"></i>PIX</strong><br>
            Status: <span class="badge bg-${statusClass}">${pixStatus}</span><br>
            Valor: ${formatCurrency(total)}<br>
            ${payment.pixCode ? `<small class="text-muted">Código gerado e pago com sucesso</small>` : ''}
        `;
    } else {
        // Pagamento com cartão
        const paymentMethodText = payment.method === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito';
        const brandText = payment.cardBrand ? capitalizeFirstLetter(payment.cardBrand) : '';
        
        let installmentText = 'À vista';
        if (payment.installments > 1) {
            if (payment.hasInterest) {
                installmentText = `${payment.installments}x de ${formatCurrency(payment.installmentValue)} com juros (3% a.m.)`;
            } else {
                installmentText = `${payment.installments}x de ${formatCurrency(payment.installmentValue)} sem juros`;
            }
        }
        
        paymentElement.innerHTML = `
            <strong>${paymentMethodText}</strong>
            ${brandText ? ` - ${brandText}` : ''}<br>
            Terminado em •••• ${payment.cardLastDigits}<br>
            Titular: ${payment.cardName}<br>
            <i class="fas fa-credit-card me-1"></i> ${installmentText}
            ${payment.hasInterest ? `<br><small class="text-muted">Total pago: ${formatCurrency(payment.totalWithInterest)}</small>` : ''}
        `;
    }
}

// ========================================
// FUNÇÕES DE COMPARTILHAMENTO
// ========================================

function shareWhatsApp() {
    const orderNumber = document.getElementById('order-number').textContent;
    const total = document.getElementById('order-total').textContent;
    
    const message = `🌱 *GermoplasmaHub* - Pedido Confirmado!\n\n` +
                   `Pedido: ${orderNumber}\n` +
                   `Valor: ${total}\n\n` +
                   `Obrigado por sua compra! 🎉`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function shareEmail() {
    const orderNumber = document.getElementById('order-number').textContent;
    const total = document.getElementById('order-total').textContent;
    
    const subject = `GermoplasmaHub - Pedido ${orderNumber} Confirmado`;
    const body = `Olá!\n\n` +
                `Seu pedido ${orderNumber} foi confirmado com sucesso!\n\n` +
                `Valor Total: ${total}\n\n` +
                `Obrigado por comprar na GermoplasmaHub!\n\n` +
                `Atenciosamente,\n` +
                `Equipe GermoplasmaHub`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function printOrder() {
    window.print();
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

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Expor funções globalmente
window.shareWhatsApp = shareWhatsApp;
window.shareEmail = shareEmail;
window.printOrder = printOrder;

