// Mock de dados dos checklists/viveiros (informações de viveiros no Brasil)
const checklistsData = {
    1: {
        id: 1,
        title: 'Vistoria Técnica - Viveiro São Jorge',
        description: 'Inspeção de produção de mudas nativas e ornamentais, foco em qualidade do substrato e irrigação.',
        createdAt: '2025-02-18',
        status: 'Aprovado',
        location: 'Curitiba - PR',
        assignedTo: 'Equipe Técnica Curitiba',
        items: [
            'Verificar funcionamento do sistema de irrigação',
            'Avaliar qualidade do substrato nas bandejas',
            'Medir temperatura e umidade nas bancadas',
            'Coletar amostras para análise de solo'
        ],
        notes: 'Substrato apresentou boa drenagem. Amostras enviadas ao laboratório para confirmar nutrientes.'
    },
    2: {
        id: 2,
        title: 'Ronda Fitossanitária - Viveiro Mata Atlântica',
        description: 'Ronda semanal para controle de pragas e monitoramento de sanidade das mudas nativas de restauro florestal.',
        createdAt: '2025-03-05',
        status: 'Em Andamento',
        location: 'Petrópolis - RJ',
        assignedTo: 'Vigilância Fitossanitária RJ',
        items: [
            'Inspecionar ocorrência de afídeos e ácaros',
            'Aplicar tratamento biológico onde necessário',
            'Registrar danos foliares por lote',
            'Revisar programas de rotação de bandejas'
        ],
        notes: 'Detectado aumento pontual de ácaros em lote 3; monitoramento reforçado.'
    },
    3: {
        id: 3,
        title: 'Verificação Estrutural - Viveiro Cerrado Verde',
        description: 'Checagem de clima controlado e infraestrutura para produção de mudas adaptadas ao bioma Cerrado.',
        createdAt: '2025-01-27',
        status: 'Pendente',
        location: 'Goiânia - GO',
        assignedTo: 'Equipe de Clima e Irrigação',
        items: [
            'Calibrar sensores de temperatura e umidade',
            'Verificar sistema de ventilação e sombreamento',
            'Checar estoque e aplicação de fertilizantes',
            'Verificar sistema de irrigação automatizado'
        ],
        notes: 'Aguardando técnicos de instrumentação para calibração dos sensores.'
    },
    4: {
        id: 4,
        title: 'Auditoria de Qualidade - Viveiro Florestal Amazônia',
        description: 'Auditoria completa de qualidade e certificação de mudas nativas para reflorestamento da região amazônica.',
        createdAt: '2025-03-10',
        status: 'Em Andamento',
        location: 'Manaus - AM',
        assignedTo: 'Equipe de Certificação Florestal',
        items: [
            'Verificar certificação de origem das sementes',
            'Avaliar taxa de germinação por espécie',
            'Inspecionar condições de armazenamento',
            'Revisar documentação fitossanitária'
        ],
        notes: 'Processo de certificação em andamento. Taxa de germinação acima de 85% em todas as espécies avaliadas.'
    },
    5: {
        id: 5,
        title: 'Monitoramento Fitossanitário - Viveiro Sul Brasil',
        description: 'Monitoramento semanal de pragas e doenças em mudas de espécies nativas do bioma Mata Atlântica.',
        createdAt: '2025-03-12',
        status: 'Aprovado',
        location: 'Florianópolis - SC',
        assignedTo: 'Equipe Fitossanitária SC',
        items: [
            'Inspecionar ocorrência de insetos-praga',
            'Avaliar sintomas de doenças fúngicas',
            'Verificar eficácia de tratamentos preventivos',
            'Registrar índices de sanidade por lote'
        ],
        notes: 'Nenhuma ocorrência de pragas ou doenças detectada. Viveiro em excelente condição sanitária.'
    },
    6: {
        id: 6,
        title: 'Vistoria de Infraestrutura - Viveiro Nordeste Verde',
        description: 'Vistoria completa da infraestrutura física e sistemas de produção de mudas adaptadas ao clima semiárido.',
        createdAt: '2025-02-28',
        status: 'Pendente',
        location: 'Recife - PE',
        assignedTo: 'Equipe de Engenharia',
        items: [
            'Verificar estruturas de sombreamento',
            'Avaliar sistema de captação de água',
            'Inspecionar bancadas e estufas',
            'Checar sistema de drenagem'
        ],
        notes: 'Aguardando liberação de recursos para melhorias na infraestrutura de captação de água.'
    },
    7: {
        id: 7,
        title: 'Controle de Qualidade - Viveiro Pampa Gaúcho',
        description: 'Controle de qualidade de mudas de gramíneas nativas para restauração de campos nativos do Pampa.',
        createdAt: '2025-03-08',
        status: 'Aprovado',
        location: 'Porto Alegre - RS',
        assignedTo: 'Equipe Técnica RS',
        items: [
            'Avaliar desenvolvimento radicular',
            'Verificar uniformidade das mudas',
            'Medir altura e diâmetro do colo',
            'Testar taxa de sobrevivência'
        ],
        notes: 'Mudas apresentando excelente desenvolvimento. Taxa de sobrevivência acima de 90%.'
    },
    8: {
        id: 8,
        title: 'Inspeção de Substrato - Viveiro Caatinga',
        description: 'Análise e inspeção da qualidade do substrato utilizado na produção de mudas do bioma Caatinga.',
        createdAt: '2025-03-01',
        status: 'Em Andamento',
        location: 'Salvador - BA',
        assignedTo: 'Equipe de Análise de Solo',
        items: [
            'Coletar amostras de substrato',
            'Analisar pH e condutividade elétrica',
            'Verificar composição nutricional',
            'Avaliar capacidade de retenção de água'
        ],
        notes: 'Amostras coletadas e enviadas ao laboratório. Resultados esperados para próxima semana.'
    },
    9: {
        id: 9,
        title: 'Ronda de Segurança - Viveiro Mata Atlântica SP',
        description: 'Ronda de segurança e verificação de equipamentos de proteção e sistemas de alarme do viveiro.',
        createdAt: '2025-03-15',
        status: 'Aprovado',
        location: 'São Paulo - SP',
        assignedTo: 'Equipe de Segurança',
        items: [
            'Verificar cercas e portões',
            'Testar sistema de alarme',
            'Inspecionar iluminação noturna',
            'Revisar câmeras de segurança'
        ],
        notes: 'Todos os sistemas de segurança funcionando corretamente. Nenhuma irregularidade detectada.'
    },
    10: {
        id: 10,
        title: 'Avaliação de Produtividade - Viveiro Cerrado Central',
        description: 'Avaliação da produtividade e eficiência na produção de mudas de espécies do Cerrado.',
        createdAt: '2025-02-20',
        status: 'Aprovado',
        location: 'Brasília - DF',
        assignedTo: 'Equipe de Produção',
        items: [
            'Calcular taxa de produção mensal',
            'Avaliar eficiência de uso de insumos',
            'Verificar tempo médio de produção',
            'Analisar custos de produção'
        ],
        notes: 'Produtividade acima da meta estabelecida. Eficiência de 95% no uso de insumos.'
    },
    11: {
        id: 11,
        title: 'Controle de Irrigação - Viveiro Pantanal',
        description: 'Verificação e calibração do sistema de irrigação automatizado para mudas adaptadas ao Pantanal.',
        createdAt: '2025-03-05',
        status: 'Em Andamento',
        location: 'Campo Grande - MS',
        assignedTo: 'Equipe de Irrigação',
        items: [
            'Calibrar sensores de umidade do solo',
            'Verificar vazão dos aspersores',
            'Testar sistema de programação',
            'Avaliar distribuição de água'
        ],
        notes: 'Sistema de irrigação funcionando adequadamente. Ajustes finos em andamento.'
    },
    12: {
        id: 12,
        title: 'Inspeção de Mudas - Viveiro Restauração RJ',
        description: 'Inspeção detalhada da qualidade das mudas destinadas a projetos de restauração florestal.',
        createdAt: '2025-03-11',
        status: 'Aprovado',
        location: 'Rio de Janeiro - RJ',
        assignedTo: 'Equipe Técnica RJ',
        items: [
            'Medir altura e diâmetro das mudas',
            'Avaliar desenvolvimento foliar',
            'Verificar sistema radicular',
            'Inspecionar presença de pragas'
        ],
        notes: 'Mudas em excelente estado. Todas dentro dos padrões de qualidade estabelecidos.'
    },
    13: {
        id: 13,
        title: 'Verificação de Certificação - Viveiro Orgânico MG',
        description: 'Verificação dos requisitos para manutenção da certificação orgânica do viveiro.',
        createdAt: '2025-02-15',
        status: 'Aprovado',
        location: 'Belo Horizonte - MG',
        assignedTo: 'Equipe de Certificação',
        items: [
            'Verificar uso de insumos orgânicos',
            'Avaliar práticas de manejo',
            'Revisar documentação de rastreabilidade',
            'Inspecionar áreas de produção'
        ],
        notes: 'Viveiro em conformidade com todos os requisitos de certificação orgânica.'
    },
    14: {
        id: 14,
        title: 'Monitoramento Climático - Viveiro Alto Vale',
        description: 'Monitoramento das condições climáticas e ajustes no sistema de controle ambiental.',
        createdAt: '2025-03-09',
        status: 'Em Andamento',
        location: 'Blumenau - SC',
        assignedTo: 'Equipe de Climatologia',
        items: [
            'Registrar temperatura e umidade',
            'Verificar sistema de ventilação',
            'Avaliar necessidade de sombreamento',
            'Calibrar sensores climáticos'
        ],
        notes: 'Condições climáticas dentro dos parâmetros ideais. Sistema funcionando corretamente.'
    },
    15: {
        id: 15,
        title: 'Controle de Estoque - Viveiro Sementes Premium',
        description: 'Controle e inventário de estoque de sementes e insumos do viveiro.',
        createdAt: '2025-03-07',
        status: 'Aprovado',
        location: 'Curitiba - PR',
        assignedTo: 'Equipe de Estoque',
        items: [
            'Inventariar sementes por espécie',
            'Verificar validade dos insumos',
            'Contar bandejas e substratos',
            'Atualizar sistema de controle'
        ],
        notes: 'Estoque atualizado. Nenhum item com validade vencida. Quantidades adequadas para produção.'
    },
    16: {
        id: 16,
        title: 'Vistoria de Equipamentos - Viveiro Tecnológico',
        description: 'Vistoria e manutenção preventiva de equipamentos e maquinários do viveiro.',
        createdAt: '2025-02-25',
        status: 'Pendente',
        location: 'Campinas - SP',
        assignedTo: 'Equipe de Manutenção',
        items: [
            'Verificar estado dos equipamentos',
            'Realizar manutenção preventiva',
            'Calibrar máquinas de semeadura',
            'Testar sistema de transporte'
        ],
        notes: 'Aguardando peças de reposição para alguns equipamentos. Manutenção programada para próxima semana.'
    },
    17: {
        id: 17,
        title: 'Avaliação de Espécies - Viveiro Biodiversidade',
        description: 'Avaliação do desenvolvimento de diferentes espécies nativas em produção.',
        createdAt: '2025-03-13',
        status: 'Aprovado',
        location: 'Vitória - ES',
        assignedTo: 'Equipe de Pesquisa',
        items: [
            'Medir crescimento por espécie',
            'Avaliar taxa de sobrevivência',
            'Registrar características fenotípicas',
            'Comparar com padrões de referência'
        ],
        notes: 'Todas as espécies apresentando desenvolvimento adequado. Taxa de sobrevivência acima de 88%.'
    },
    18: {
        id: 18,
        title: 'Controle de Pragas - Viveiro Protegido',
        description: 'Controle integrado de pragas utilizando métodos biológicos e químicos.',
        createdAt: '2025-03-06',
        status: 'Em Andamento',
        location: 'Joinville - SC',
        assignedTo: 'Equipe de Controle Biológico',
        items: [
            'Monitorar população de insetos',
            'Aplicar agentes de controle biológico',
            'Verificar eficácia dos tratamentos',
            'Registrar ocorrências de pragas'
        ],
        notes: 'Controle biológico apresentando bons resultados. Redução de 60% na população de pragas.'
    },
    19: {
        id: 19,
        title: 'Inspeção de Qualidade - Viveiro Certificado',
        description: 'Inspeção geral de qualidade seguindo protocolos de certificação internacional.',
        createdAt: '2025-02-22',
        status: 'Aprovado',
        location: 'São José dos Campos - SP',
        assignedTo: 'Equipe de Certificação Internacional',
        items: [
            'Verificar conformidade com normas',
            'Avaliar processos de produção',
            'Revisar documentação técnica',
            'Inspecionar instalações'
        ],
        notes: 'Viveiro em total conformidade com os padrões internacionais de certificação.'
    },
    20: {
        id: 20,
        title: 'Monitoramento de Água - Viveiro Sustentável',
        description: 'Monitoramento do uso e qualidade da água no sistema de produção do viveiro.',
        createdAt: '2025-03-04',
        status: 'Aprovado',
        location: 'Florianópolis - SC',
        assignedTo: 'Equipe de Recursos Hídricos',
        items: [
            'Medir consumo de água',
            'Analisar qualidade da água',
            'Verificar sistema de reutilização',
            'Avaliar eficiência hídrica'
        ],
        notes: 'Sistema de reutilização de água funcionando perfeitamente. Redução de 40% no consumo.'
    },
    21: {
        id: 21,
        title: 'Vistoria de Segurança - Viveiro Industrial',
        description: 'Vistoria completa de segurança do trabalho e equipamentos de proteção individual.',
        createdAt: '2025-03-14',
        status: 'Aprovado',
        location: 'Sorocaba - SP',
        assignedTo: 'Equipe de Segurança do Trabalho',
        items: [
            'Verificar uso de EPIs',
            'Inspecionar condições de trabalho',
            'Avaliar riscos ambientais',
            'Revisar treinamentos de segurança'
        ],
        notes: 'Todas as normas de segurança sendo seguidas corretamente. Nenhuma irregularidade detectada.'
    },
    22: {
        id: 22,
        title: 'Controle de Temperatura - Viveiro Climatizado',
        description: 'Controle e monitoramento da temperatura em estufas climatizadas para produção de mudas.',
        createdAt: '2025-03-03',
        status: 'Em Andamento',
        location: 'Ribeirão Preto - SP',
        assignedTo: 'Equipe de Climatização',
        items: [
            'Calibrar termostatos',
            'Verificar sistema de aquecimento',
            'Testar sistema de resfriamento',
            'Monitorar variações de temperatura'
        ],
        notes: 'Sistema de climatização funcionando adequadamente. Temperaturas dentro dos parâmetros ideais.'
    },
    23: {
        id: 23,
        title: 'Avaliação de Crescimento - Viveiro Experimental',
        description: 'Avaliação do crescimento e desenvolvimento de mudas em diferentes tratamentos experimentais.',
        createdAt: '2025-02-18',
        status: 'Aprovado',
        location: 'Piracicaba - SP',
        assignedTo: 'Equipe de Pesquisa Experimental',
        items: [
            'Medir altura e diâmetro',
            'Avaliar massa seca',
            'Analisar desenvolvimento radicular',
            'Comparar tratamentos'
        ],
        notes: 'Experimentos apresentando resultados promissores. Dados sendo analisados para publicação.'
    },
    24: {
        id: 24,
        title: 'Inspeção Final - Viveiro Entrega',
        description: 'Inspeção final de qualidade antes da entrega de mudas para projetos de reflorestamento.',
        createdAt: '2025-03-16',
        status: 'Pendente',
        location: 'Londrina - PR',
        assignedTo: 'Equipe de Qualidade Final',
        items: [
            'Verificar conformidade das mudas',
            'Inspecionar embalagens',
            'Validar documentação de entrega',
            'Realizar teste de transporte'
        ],
        notes: 'Aguardando aprovação final do cliente para liberação da entrega.'
    }
};

function fetchChecklists() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(Object.values(checklistsData)), 100);
    });
}

function fetchChecklistById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const checklist = checklistsData[id];
            if (checklist) resolve(checklist);
            else reject(new Error('Checklist não encontrado'));
        }, 100);
    });
}