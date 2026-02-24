# 📍 CheckVisit - Sistema de Gestão de Visitas

O **CheckVisit** é uma plataforma de mobilidade para equipes de vendas externas. Este front-end foi desenvolvido para oferecer uma experiência ágil e intuitiva, permitindo que o vendedor gerencie sua rota, visualize clientes no mapa e registre visitas com validação de geolocalização em tempo real.

---

## 🚀 Funcionalidades Principais

- **Dashboard de Clientes:** Listagem dinâmica de carteira de clientes integrada com a API.
- **Mapa Premium (Dark Mode):** Visualização de localização via Leaflet com estilização personalizada e marcadores "glow" neon.
- **Check-in via GPS:** Captura de coordenadas em tempo real (Latitude/Longitude) no momento do registro da visita.
- **Interface Mobile-First:** Design responsivo e moderno utilizando Tailwind CSS e modais centralizados para melhor usabilidade em campo.
- **Feedback em Tempo Real:** Alertas estilizados com SweetAlert2 para sucesso, erros de API ou falhas de GPS.

---

## 🛠️ Stack Tecnológica

* **Core:** [React.js](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Mapas:** [React-Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.com/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes de UI:** [Headless UI](https://headlessui.com/) (Modais e Transições)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Comunicação:** [Axios](https://axios-http.com/)
* **Alertas:** [SweetAlert2](https://sweetalert2.github.io/)

---

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (Versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

## 🔧 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/checkvisit-frontend.git](https://github.com/seu-usuario/checkvisit-frontend.git)
   cd checkvisit-frontend
   ```

2. **Instale as dependências:**
   ```bash
		npm install
   ```
3.Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto (ou ajuste em src/services/api.ts):
   ```bash
		VITE_API_URL=[https://sua-api-dotnet.com.br/api](https://sua-api-dotnet.com.br/api)
   ```

4.Inicie o servidor de desenvolvimento:
   ```bash
   		npm run dev
   ```

   # 📂 Estrutura do Projeto

src/
├── services/        # Configuração do Axios e chamadas à API
├── pages/           
│   └── SellerDashboard/
│       └── index.tsx # Lógica principal de check-in e mapas
├── components/      # Componentes globais reutilizáveis
├── styles/          # index.css com filtros dark do Leaflet
└── App.tsx          # Roteamento e provedores

🔐 Fluxo de Check-in
O vendedor seleciona um cliente na lista.
O sistema abre um modal centralizado com a localização do cliente no mapa.
Ao clicar em Check-in, o navegador solicita permissão de GPS.
O sistema captura latitude, longitude, customerId e sellerId (recuperado do LocalStorage).
Os dados são enviados via POST para /api/Visit/checkin.

📝 Contribuição
Faça um Fork do projeto.
Crie uma Branch para sua funcionalidade (git checkout -b feature/nova-funcionalidade).
Faça o Commit de suas alterações (git commit -m 'feat: nova funcionalidade').
Envie para a Branch principal (git push origin feature/nova-funcionalidade).
Abra um Pull Request.

CheckVisit © 2026 - Desenvolvido para FSI.