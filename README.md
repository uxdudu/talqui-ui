# Talqui | Extensões

Interface da tela **Extensões** do Talqui, baseada no design Figma.

## Design de referência

- **Figma:** [Talqui | Interfaces (rev 19.02.26) – Extensões](https://www.figma.com/design/Qi1iovxLj0RvcKbrIk05rk/Talqui-%7C-Interfaces--rev19.02.26-?node-id=2199-9645)
- **Node ID:** `2199-9645`

A tela inclui: sidebar (80px) com navegação e avatar, header com título "Extensões" e busca, submenu (Todas as extensões / Extensões Instaladas), filtros (Todos | Grátis | Pago, dropdown, busca) e grid de cards de extensões (Instagram, Messenger, WhatsApp Paralelo, WhatsApp Oficial) com toggle, badge Grátis/R$ e botões Configurações/Detalhes.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Gera a pasta `dist/` para deploy.
