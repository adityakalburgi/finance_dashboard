# Finance dashboard assignment 🚀

A modern, responsive finance dashboard built with React, TypeScript, Tailwind CSS, and shadcn/ui components. Features interactive charts, transaction management with localStorage persistence, role-based access, filtering, and dark mode.

## ✨ Features

- 📊 Interactive balance trend charts and spending breakdowns
- 💳 Transaction list with add/edit/delete (admin role)
- 🔍 Advanced filtering and sorting
- 📱 Fully responsive design
- 🌙 Dark/Light mode toggle
- 💾 Local storage persistence for transactions
- 📈 Summary cards with totals
- 🎨 Modern UI with shadcn/ui components and Framer Motion animations

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite (bun compatible)
- Tailwind CSS
- shadcn/ui
- Recharts
- React Router
- Lucide React icons
- Framer Motion
- localStorage for data persistence

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

```bash
git clone <repository-url>
cd finance-insights-hub-main
npm install
```

### Development

```bash
npm run dev
```

Opens at http://localhost:5173

### Build for Production

```bash
bun run build
bun run preview
```

### Testing

```bash
bun run test
bun run test:watch
```

## 📝 Usage

1. Switch to **Admin** role to add/delete transactions
2. Add expenses/income - data persists on refresh thanks to localStorage
3. Use filters, search, and sorting
4. Toggle dark mode
5. Export data via CSV button

## 🎯 Roles

- **Admin**: Full CRUD on transactions
- **Viewer**: Read-only access

## 🐛 Troubleshooting

- **No data persistence**: Check browser console for localStorage errors
- **Styles missing**: Ensure Tailwind CSS is processing correctly
- **Bun issues**: Try `npm install` and `npm run dev`

## 📁 Project Structure

```
src/
├── components/     # UI components & shadcn/ui
├── context/        # FinanceContext.tsx (state management)
├── data/           # Types & mock data
├── hooks/          # Custom hooks
├── pages/          # Page components
└── lib/            # Utilities
```

## 🤝 Contributing

1. Fork & clone
2. Create feature branch
3. Commit changes
4. Open PR

## 📄 License

MIT
