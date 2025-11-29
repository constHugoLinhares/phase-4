document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.querySelector('.checklist-list');
    const totalEl = document.getElementById('totalViveiros');
    const approvedEl = document.getElementById('approvedViveiros');

    if (!listContainer) return;

    try {
        const items = await fetchChecklists(); // função do checklists-data.js

        // atualizar resumo
        if (totalEl) totalEl.textContent = items.length;
        if (approvedEl) approvedEl.textContent = items.filter(i => i.status === 'Aprovado').length;

        // renderizar lista
        listContainer.innerHTML = items.map(item => {
            const statusBadge = item.status === 'Aprovado'
                ? '<span class="badge bg-success ms-2">Aprovado</span>'
                : item.status === 'Em Andamento'
                    ? '<span class="badge bg-warning text-dark ms-2">Em Andamento</span>'
                    : '<span class="badge bg-secondary ms-2">Pendente</span>';

            return `
                <div class="checklist-item d-flex justify-content-between align-items-center p-3 border-bottom">
                    <div class="checklist-info">
                        <h6 class="mb-1">${item.title} ${statusBadge}</h6>
                        <p class="text-muted mb-1">${item.description}</p>
                        <small class="text-muted">Local: ${item.location} • Criado em: ${item.createdAt}</small>
                    </div>
                    <div class="checklist-actions">
                        <a href="checklist-details.html?id=${item.id}" class="btn btn-view btn-outline-primary">Ver</a>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar checklists:', error);
        listContainer.innerHTML = '<p class="text-danger">Erro ao carregar viveiros. Tente novamente mais tarde.</p>';
    }
});