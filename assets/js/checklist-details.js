document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const checklistId = urlParams.get('id');
    if (!checklistId) {
        window.location.href = 'checklist.html';
        return;
    }

    try {
        const checklist = await fetchChecklistById(checklistId);
        renderChecklist(checklist);
    } catch (error) {
        console.error('Erro ao carregar checklist:', error);
        window.location.href = 'checklist.html';
    }
});

function renderChecklist(data) {
    document.getElementById('breadcrumbChecklist').textContent = data.title;
    document.getElementById('checklistTitle').textContent = data.title;
    document.getElementById('checklistDescription').textContent = data.description;
    document.getElementById('checklistDate').textContent = data.createdAt;
    const statusEl = document.getElementById('checklistStatus');
    statusEl.textContent = data.status;
    statusEl.className = 'badge ' + (data.status === 'Aprovado' ? 'bg-success' : data.status === 'Em Andamento' ? 'bg-warning' : 'bg-secondary');
    document.getElementById('checklistLocation').textContent = data.location;
    document.getElementById('checklistAssigned').textContent = data.assignedTo;

    const itemsEl = document.getElementById('checklistItems');
    itemsEl.innerHTML = '';
        data.items.forEach((it, idx) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center';

            // suportar itens no formato string ou objeto { task, done }
            const taskText = (typeof it === 'string') ? it : (it.task || 'Item');
            const done = (typeof it === 'object' && it !== null) ? !!it.done : false;

            // montar conteúdo: texto + botão 'Ver' alinhado à direita
            li.innerHTML = `
                <span ${done ? 'style="text-decoration: line-through; color:#6c757d;"' : ''}>${taskText}</span>
                <button type="button" class="btn btn-view btn-outline-primary ms-auto" data-idx="${idx}" data-action="view-item">Ver</button>
            `;

            itemsEl.appendChild(li);
    });

    const notesEl = document.getElementById('checklistNotes');
    notesEl.innerHTML = data.notes ? `<strong>Observações:</strong><p class="text-muted">${data.notes}</p>` : '';

        // Lógica do botão 'Ver' para cada item — abre modal com detalhes
        document.querySelectorAll('[data-action="view-item"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'), 10);
                const item = data.items[idx];
                const taskText = (typeof item === 'string') ? item : (item.task || 'Item');
                const done = (typeof item === 'object' && item !== null) ? !!item.done : false;

                const modalTitleEl = document.getElementById('itemDetailModalLabel');
                const modalTextEl = document.getElementById('itemDetailText');
                const modalStatusEl = document.getElementById('itemDetailStatus');

                modalTitleEl.textContent = `Item ${idx + 1}`;
                modalTextEl.textContent = taskText;
                modalStatusEl.textContent = done ? 'Status: Concluído' : 'Status: Pendente';

                // mostrar modal usando Bootstrap
                const modalEl = document.getElementById('itemDetailModal');
                if (window.bootstrap && modalEl) {
                    const bsModal = new bootstrap.Modal(modalEl);
                    bsModal.show();
                }
            });
        });
}