# Snippet Saver

This is a full-stack application built with React Router, Express, and Prisma. It uses PostgreSQL as the database and includes modern tooling for development.

## Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL (Latest version)
- pnpm (recommended) or npm

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV="development"
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

Replace the DATABASE_URL with your PostgreSQL connection string.

## Database Setup

1. Install dependencies:

```bash
pnpm install
```

2. Generate Prisma client:

```bash
pnpm db:generate
```

3. Run database migrations:

```bash
pnpm db:migrate
```

4. (Optional) View and manage your database using Prisma Studio:

```bash
pnpm db:studio
```

## Development

1. Start the development server:

```bash
pnpm dev
```

The server will start on `http://localhost:3000` by default.

## Tech Stack

- **Frontend**: React 19, React Router 7
- **Backend**: Express, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: TanStack Query
- **Development**: TypeScript, Vite

## Project Structure

```
├── prisma/           # Database schema and migrations
├── src/             # Source code
│   ├── components/  # React components
│   ├── routes/      # Route definitions
│   └── server.js    # Express server
├── .env            # Environment variables
└── package.json    # Project dependencies
```

## Troubleshooting

1. If you encounter database connection issues:

   - Verify your PostgreSQL server is running
   - Check your DATABASE_URL in .env file
   - Ensure the database exists

2. If Prisma commands fail:
   - Run `pnpm db:generate` to regenerate the Prisma client
   - Check for any pending migrations
