# Real Estate Feasibility Study Builder

An AI-powered platform for creating comprehensive real estate feasibility studies. Generate detailed cost estimations, ROI analyses, and material takeoffs for residential, commercial, medical, agricultural, and industrial projects.

## Features

- **AI-Powered Study Generation** - Generate feasibility studies using OpenAI GPT models
- **Multi-Category Support** - Real Estate, Medical, Agricultural, and Industrial project types
- **Dual Accuracy Methods** - Fast approximate estimates (80%+) and detailed BOQ line-by-line analysis
- **Material Price Tracking** - Live construction material pricing with market trends
- **Bilingual Support** - Full Arabic and English localization (RTL/LTR)
- **Document Export** - Download studies as formatted Word documents
- **Supplier Management** - Manage contractor and supplier contacts
- **Reports & Analytics** - Generate project reports and financial projections

## Tech Stack

- **Framework** - Next.js 15 (App Router)
- **Language** - TypeScript
- **Styling** - Tailwind CSS
- **Internationalization** - next-intl
- **AI Integration** - OpenAI API
- **Database** - PostgreSQL with Prisma ORM
- **State Management** - Zustand
- **Form Handling** - React Hook Form + Zod
- **UI Components** - shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/realstate_builder"
OPENAI_API_KEY="your-openai-api-key"
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── [locale]/           # Internationalized routes
│   ├── page.tsx        # Dashboard
│   ├── new-study/      # New study wizard
│   ├── projects/       # Projects list & details
│   ├── prices/         # Material prices
│   ├── suppliers/      # Supplier management
│   ├── reports/        # Project reports
│   ├── chat/           # AI chat assistant
│   └── prompts/        # System prompts config
├── api/                # API routes
│   ├── ai/             # AI endpoints
│   └── prompts/        # Prompt management
└── globals.css         # Global styles

components/
├── dashboard/          # Dashboard components
├── easy-start/        # Main app shell
├── layout/            # Layout components
├── prompts/           # Prompt editor
└── providers/          # React providers

lib/
├── ai/                # AI utilities & prompts
├── db/                # Database client
├── hooks/             # Custom React hooks
└── html/              # Document generation
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard with KPI cards, recent studies, material prices |
| `/new-study` | 3-step wizard for creating new feasibility studies |
| `/projects` | List of all projects |
| `/projects/[id]` | Individual project details |
| `/prices` | Live material prices |
| `/suppliers` | Supplier & contractor management |
| `/reports` | Generate & download reports |
| `/chat` | AI assistant for construction questions |
| `/settings/prompts` | Configure AI system prompts |

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm db:push  # Push database schema
pnpm db:seed  # Seed database with sample data
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl.org)
- [Prisma Documentation](https://prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
