src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   │
│   └── common/
│       └── LoadingScreen.tsx
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.api.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── pages/
│   │   │   └── AuthPage.tsx
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── workspace/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── types/
│   │
│   ├── node/
│   │   ├── api/
│   │   └── hooks/
│   │
│   └── terminal/
│       ├── components/
│       ├── hooks/
│       └── services/
│
├── pages/
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   ├── IdePage.tsx
│   ├── NodesPage.tsx
│   └── NotFoundPage.tsx
│
├── lib/
│   ├── api-client.ts
│   └── token-storage.ts
│
├── config/
│   └── env.ts
│
├── data/
│   └── defaultFiles.ts
│
├── types/
│   └── index.ts
│
├── index.css
└── main.tsx