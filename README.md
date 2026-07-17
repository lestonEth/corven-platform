# FiberDev Studio Frontend

FiberDev Studio is a browser-based development environment for building, testing, and debugging applications on the Fiber Network and Nervos CKB.

This repository contains the frontend application responsible for the developer dashboard, workspace interface, code editor, terminal, file explorer, project management, and interaction with the FiberDev backend services.

## Features

* User authentication
* Developer dashboard
* Create and manage workspaces
* Browser-based code editor
* Workspace file explorer
* Integrated terminal
* File creation, editing, and deletion
* Automatic file saving
* Project and template selection
* Workspace runtime status
* CKB node status monitoring
* Fiber node controls
* Contract build and test interface
* Logs and runtime output
* Responsive dark-mode interface

## Technology Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* Axios or Fetch API
* React Query
* Zustand
* Monaco Editor
* WebSockets

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── workspace/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── workspace/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── templates/
│   │   └── workspace/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── utils/
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Main Modules

### Authentication

Handles registration, login, logout, access-token storage, protected routes, and authenticated API requests.

### Dashboard

Displays user workspaces, recently opened projects, starter templates, workspace status, and project creation actions.

### Workspace

The workspace provides the main browser IDE interface, including:

* File explorer
* Code editor
* Terminal
* Runtime logs
* Build controls
* Test controls
* Node status
* Project information

### Code Editor

The editor is powered by Monaco Editor and supports:

* Syntax highlighting
* Multiple programming languages
* File editing
* Unsaved-change detection
* Manual and automatic saving
* Loading indicators
* Keyboard shortcuts

### Terminal

The terminal communicates with the backend workspace runtime through WebSockets.

It displays:

* Command output
* Build logs
* Test results
* CKB node logs
* Fiber node logs
* Runtime errors

## Prerequisites

Ensure the following tools are installed:

* Node.js 20 or later
* pnpm
* Git

Check the installed versions:

```bash
node --version
pnpm --version
git --version
```

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/fiberdev-studio.git
```

Move into the frontend directory:

```bash
cd fiberdev-studio/frontend
```

Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create a `.env.local` file in the frontend root directory:

```bash
cp .env.example .env.local
```

Add the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_APP_NAME=FiberDev Studio
```

### Environment Variable Description

| Variable               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Base URL for the FiberDev API Gateway        |
| `NEXT_PUBLIC_WS_URL`   | WebSocket URL for terminals and runtime logs |
| `NEXT_PUBLIC_APP_NAME` | Application display name                     |

Do not store private API keys or backend secrets inside variables prefixed with `NEXT_PUBLIC_`.

## Running the Application

Start the development server:

```bash
pnpm dev
```

Open the application at:

```text
http://localhost:3000
```

## Available Scripts

```bash
pnpm dev
```

Starts the development server.

```bash
pnpm build
```

Creates a production build.

```bash
pnpm start
```

Starts the production server.

```bash
pnpm lint
```

Runs ESLint.

```bash
pnpm type-check
```

Runs TypeScript validation.

```bash
pnpm test
```

Runs frontend tests.

## Backend Integration

The frontend communicates with the FiberDev API Gateway.

Example endpoints include:

```text
POST /auth/register
POST /auth/login
GET  /auth/me

POST /workspaces
GET  /workspaces
GET  /workspaces/:id
PATCH /workspaces/:id
DELETE /workspaces/:id

GET  /workspaces/:id/files
GET  /workspaces/:id/files/content
PUT  /workspaces/:id/files/content

POST /workspaces/:id/start
POST /workspaces/:id/stop
GET  /workspaces/:id/status
```

The exact routes may change as backend services are developed.

## Authentication

After login, the frontend receives an access token from the authentication service.

Authenticated requests should include:

```http
Authorization: Bearer <access-token>
```

Protected pages should verify that a valid session exists before rendering workspace content.

## Workspace Lifecycle

When a workspace is created:

1. The frontend sends a workspace creation request.
2. The workspace service creates the workspace record.
3. The runtime service provisions the workspace environment.
4. A dedicated workspace network and containers are created.
5. The CKB node is initialized and started.
6. The first project is generated from the selected template.
7. The frontend receives workspace and runtime status updates.
8. The user is redirected to the browser IDE.

Possible workspace statuses include:

```text
CREATED
PROVISIONING
STARTING
RUNNING
STOPPING
STOPPED
FAILED
```

## WebSocket Communication

WebSockets are used for real-time features such as:

* Terminal input and output
* Workspace provisioning progress
* Runtime logs
* Build logs
* Test results
* CKB node status
* Fiber node status

Example connection:

```ts
const socket = new WebSocket(
  `${process.env.NEXT_PUBLIC_WS_URL}/workspaces/${workspaceId}/terminal`,
);
```

Always close active WebSocket connections when a workspace page is unmounted.

## State Management

Suggested state separation:

* Authentication state
* Current workspace state
* File explorer state
* Active file state
* Editor content state
* Terminal state
* Runtime state
* Notification state

Avoid storing server state and local UI state in the same store where possible.

Use React Query for backend data and Zustand for local workspace state.

## Code Style

The project follows these conventions:

* TypeScript strict mode
* Functional React components
* Named exports for reusable components
* Feature-based folder organization
* Tailwind CSS for styling
* Reusable shadcn/ui components
* API logic stored in service files
* Shared interfaces stored in type files
* ESLint and Prettier for formatting

Example component:

```tsx
interface WorkspaceHeaderProps {
  name: string;
  status: string;
}

export function WorkspaceHeader({
  name,
  status,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <h1 className="font-semibold">{name}</h1>
      <span className="text-sm text-muted-foreground">
        {status}
      </span>
    </header>
  );
}
```

## Testing

Recommended frontend test coverage includes:

* Authentication forms
* Protected routes
* Workspace creation
* Workspace loading states
* File explorer actions
* File content editing
* Saving files
* Editor dirty-state handling
* Terminal connection states
* Runtime status updates
* API error handling

Suggested tools:

* Vitest
* React Testing Library
* Playwright
* MSW

Run tests with:

```bash
pnpm test
```

## Production Build

Create a production build:

```bash
pnpm build
```

Start the production application:

```bash
pnpm start
```

Before deployment, confirm that:

* Environment variables are configured
* The API Gateway is accessible
* WebSocket connections are allowed
* CORS is configured correctly
* Authentication cookies or tokens work over HTTPS
* Production domains are included in backend configuration

## Deployment

The frontend can be deployed to:

* Vercel
* Netlify
* Cloudflare Pages
* AWS Amplify
* Docker
* Kubernetes

Example Docker build:

```dockerfile
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile

FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN corepack enable && pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]
```

## Troubleshooting

### API requests fail

Confirm that the backend API Gateway is running and that the following variable is correct:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### WebSocket connection fails

Confirm that:

* The runtime service is running
* The API Gateway supports WebSocket upgrades
* The workspace is in the `RUNNING` state
* The WebSocket URL is correct

### Environment variables are undefined

Restart the Next.js development server after changing `.env.local`:

```bash
pnpm dev
```

Only environment variables beginning with `NEXT_PUBLIC_` are available inside browser components.

### Monaco Editor fails during server rendering

Load Monaco Editor dynamically:

```tsx
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  {
    ssr: false,
  },
);
```

## Roadmap

Planned frontend features include:

* Multi-tab editor
* Drag-and-drop file management
* Integrated CKB block explorer
* Smart contract debugger
* Multi-node Fiber testing
* Collaborative editing
* GitHub repository integration
* AI development assistant
* Deployment dashboard
* Workspace resource monitoring
* Keyboard shortcut command palette

## Contributing

1. Create a new branch:

```bash
git checkout -b feature/feature-name
```

2. Make your changes.

3. Run validation:

```bash
pnpm lint
pnpm type-check
pnpm test
```

4. Commit your changes:

```bash
git commit -m "feat: add feature description"
```

5. Push the branch:

```bash
git push origin feature/feature-name
```

6. Open a pull request.

## License

This project is licensed under the MIT License.

## Project Status

FiberDev Studio is currently under active development.

Some APIs, workspace features, node controls, and runtime integrations may change as the platform architecture evolves.
