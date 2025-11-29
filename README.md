# GermoplasmaHub - Dashboard

Um sistema de dashboard para banco de germoplasma com modelo de marketplace, desenvolvido com HTML, CSS e JavaScript.

## 🚀 Funcionalidades

- **Dashboard Principal**: Visão geral do sistema com estatísticas e atividades recentes
- **Marketplace**: Plataforma para compra e venda de sementes e mudas
- **Carrinho de Compras**: Sistema funcional com persistência de dados
- **Checkout Completo**: Sistema de finalização de compra com validações avançadas
- **Estoque**: Gerenciamento de estoque com controle de quantidade e status
- **Checklist**: Sistema de checklists para controle de qualidade
- **Fale Conosco**: Formulário de contato com validação completa

## 📁 Estrutura do Projeto

```
phase_4_frontend/
├── index.html              # Página principal do dashboard
├── marketplace.html         # Página do marketplace
├── stock.html            # Página de gerenciamento de estoque
├── checklist.html          # Página de checklists
├── contact.html            # Página de contato
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos personalizados
│   └── js/
│       └── main.js         # JavaScript principal
└── README.md               # Documentação do projeto
```

## 🎨 Design e Tecnologias

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos personalizados com animações e responsividade
- **Bootstrap 5**: Framework CSS para componentes e grid system
- **JavaScript ES6+**: Funcionalidades interativas e validações
- **Font Awesome**: Ícones para interface

## ✨ Características Principais

### Design Responsivo

- Layout adaptável para desktop, tablet e mobile
- Sidebar colapsível em dispositivos móveis
- Cards com efeitos hover e animações suaves

### Validação de Formulários

- Validação em tempo real com HTML5
- Mensagens de erro personalizadas
- Validação de e-mail, telefone e campos obrigatórios

### Interatividade

- Animações de números nos cards de estatísticas
- Efeitos hover nos elementos interativos
- Confirmações antes de ações destrutivas
- Loading states nos botões

### Acessibilidade

- Estrutura semântica HTML5
- Contraste adequado de cores
- Navegação por teclado
- Labels descritivos nos formulários

## 🚀 Como Usar

1. Clone ou baixe o projeto
2. Abra o arquivo `index.html` em um navegador web
3. Navegue pelas diferentes páginas usando o menu lateral
4. Teste as funcionalidades de validação no formulário de contato

## 📱 Páginas Disponíveis

### 1. Dashboard (`index.html`)

- Estatísticas gerais do sistema
- Atividades recentes
- Espécies mais populares
- Cards informativos com animações

### 2. Marketplace (`marketplace.html`)

- Grid de produtos com imagens
- Sistema de busca e filtros
- Cards de produtos com preços e avaliações
- Paginação

### 3. Estoque (`stock.html`)

- Resumo do estoque com alertas
- Tabela de produtos com status
- Modal para adicionar novos produtos
- Ações de edição e exclusão

### 4. Checklist (`checklist.html`)

- Lista de checklists com status
- Resumo de checklists por categoria
- Modal para criar novos checklists
- Sistema de prioridades

### 5. Fale Conosco (`contact.html`)

- Formulário de contato completo
- Validação de todos os campos
- Informações de contato da empresa
- FAQ com accordion

### 6. Checkout (`checkout.html`) 🆕

Sistema completo de finalização de compra com 3 etapas:

**Etapa 1 - Endereço:**

- Busca automática de CEP (API ViaCEP)
- Validação de todos os campos
- Máscaras de entrada

**Etapa 2 - Pagamento:**

- **PIX:** QR Code + Copia e Cola com aprovação instantânea
- **Cartão de Crédito/Débito:**
  - Validação de cartão (Algoritmo de Luhn)
  - Detecção automática de bandeira
  - Parcelamento em até 3x SEM JUROS (valores acima de R$ 250)
  - Parcelamento de 4x a 12x COM JUROS de 3% ao mês
  - Cálculo automático com Tabela Price

**Etapa 3 - Confirmação:**

- Revisão completa do pedido
- Resumo de endereço e pagamento
- Finalização do pedido

**Regras de Negócio:**

- ✅ Frete GRÁTIS para compras acima de R$ 500
- ✅ **Parcelamento Inteligente:**
  - **Abaixo de R$ 250:** Até 12x COM JUROS de 3% ao mês
  - **Acima de R$ 250:** Até 3x SEM JUROS + 4x a 12x COM JUROS
- ✅ Frete padrão: R$ 25,00

### 7. Confirmação de Pedido (`order-confirmation.html`) 🆕

- Número único do pedido
- Resumo completo da compra
- Timeline de acompanhamento
- Opções de compartilhamento (WhatsApp, Email)
- Impressão de comprovante
- Previsão de entrega

## 🔧 Personalização

### Cores

As cores principais podem ser alteradas no arquivo `style.css`:

- Primária: `#007bff` (azul)
- Sucesso: `#28a745` (verde)
- Aviso: `#ffc107` (amarelo)
- Perigo: `#dc3545` (vermelho)

### Animações

As animações podem ser ajustadas modificando:

- Duração das transições
- Efeitos hover
- Animações de números
- Loading states

## 📋 Validações Implementadas

### Formulário de Contato

- **Nome**: Campo obrigatório
- **Sobrenome**: Campo obrigatório
- **E-mail**: Formato válido obrigatório
- **Telefone**: Formato válido (10-11 dígitos) opcional
- **Assunto**: Seleção obrigatória
- **Mensagem**: Mínimo 10 caracteres obrigatório

### Sistema de Checkout 🆕

- **CEP**: Validação de formato (00000-000) e busca via API ViaCEP
- **Cartão de Crédito**: Algoritmo de Luhn para validação do número
- **Bandeira do Cartão**: Detecção automática (Visa, Mastercard, Elo, etc.)
- **Data de Validade**: Verificação de expiração
- **CVV**: Validação de 3-4 dígitos
- **Todos os campos**: Validação em tempo real com feedback visual

### Cartões de Teste Válidos

Para testar o sistema, use estes números (válidos pelo Algoritmo de Luhn):

```
Visa: 4532015112830366
Mastercard: 5425233430109903
American Express: 374245455400126
```

## 🌟 Funcionalidades Recentes

- [x] ✅ **Sistema de Checkout Completo** (Implementado!)

  - Validação de CEP via API ViaCEP
  - Validação de cartão de crédito (Algoritmo de Luhn)
  - Cálculo automático de frete
  - Parcelamento inteligente
  - Página de confirmação de pedido

- [x] ✅ **Carrinho de Compras Funcional**
  - Persistência com localStorage
  - Controle de estoque
  - Notificações visuais

## 🎯 Próximas Melhorias Sugeridas

- [ ] Integração com backend real
- [ ] Sistema de autenticação de usuários
- [ ] Dashboard com gráficos interativos (Chart.js)
- [ ] Sistema de notificações push
- [ ] Modo escuro (Dark Mode)
- [ ] PWA (Progressive Web App)
- [ ] Histórico de pedidos do usuário
- [ ] Sistema de avaliações detalhadas
- [ ] Filtros avançados no marketplace
- [ ] Wishlist/Favoritos

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

---

Desenvolvido com ❤️ para o banco de germoplasma
