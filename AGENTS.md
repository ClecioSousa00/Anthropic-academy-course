# AGENTS.md - Developer Guide for UIGen

This file provides guidelines and commands for agents working on the UIGen codebase.

## Project Overview

AI-powered React component generator with live preview using Next.js 15, React 19, TypeScript, Tailwind CSS v4, Prisma with SQLite, and Anthropic Claude AI.

## Build/Lint/Test Commands

```bash
# Install dependencies and initialize database
npm run setup

# Development server (requires NODE_OPTIONS for node-compat)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run single test file
npm test -- src/lib/__tests__/file-system.test.ts

# Run single test by name
npm test -- -t "creates files in root directory"

# Database
npm run db:reset  # Reset database migrations
```

## Code Style Guidelines

### TypeScript

- Strict mode is enabled in `tsconfig.json`
- Use explicit types for function parameters and return types
- Use `interface` for object shapes, `type` for unions/intersections
- Prefer `import { type Foo }` for type-only imports

### Comments

- Use comments sparingly. Only comment complex or non-obvious code
- Don't add comments for self-explanatory code
- Don't explain what the code does - explain why it does it when necessary

### Imports and Path Aliases
- Correct: `import { cn } from "@/lib/utils"`
- Correct: `import { Button } from "@/components/ui/button"`
- Group imports: external → internal → relative
- Add empty line between import groups

### Component Patterns

- Use named exports for all components: `export function ComponentName()`
- Client components must have `"use client"` at the very top of the file
- Server components don't need any directive (default in App Router)
- Server actions must have `"use server"` at the top of the file
- Use React 19 syntax (no need for `use client` for context in some cases)

Example client component:
```tsx
"use client";

import { useState } from "react";
import { useChat } from "@/lib/contexts/chat-context";

export function ChatInterface() {
  const { messages } = useChat();
  // ...
}
```

Example server action:
```tsx
"use server";

import { prisma } from "@/lib/prisma";

export async function createProject(input: CreateProjectInput) {
  // ...
}
```

### Tailwind CSS

- Use Tailwind v4 syntax (CSS-first configuration)
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Use Radix UI primitives for interactive components
- Use class-variance-authority (cva) for component variants

Example with cva:
```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva("inline-flex items-center justify-center...", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
})
```

### Error Handling

- Throw descriptive errors in server actions: `throw new Error("Unauthorized")`
- Context providers should throw when used outside provider:
```tsx
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
```

### Testing

- Use Vitest with jsdom environment (configured in vitest.config.mts)
- Place tests in `__tests__` directories alongside source files
- Use `test` and `expect` from vitest
- Mock Next.js modules and React dependencies as needed
- Test files should match pattern: `*.test.ts` or `*.test.tsx`

Example test:
```tsx
import { test, expect } from "vitest";
import { VirtualFileSystem } from "@/lib/file-system";

test("creates files in root directory", () => {
  const fs = new VirtualFileSystem();
  const file = fs.createFile("/test.txt", "Hello World");
  expect(file).toBeDefined();
  expect(file?.name).toBe("test.txt");
});
```

### File Organization

```
src/
├── actions/           # Server actions
│   ├── create-project.ts
│   └── get-projects.ts
├── app/               # Next.js App Router pages/routes
│   ├── api/          # API routes
│   ├── [projectId]/ # Dynamic routes
│   └── layout.tsx
├── components/
│   ├── chat/        # Chat-related components
│   ├── editor/      # Code editor components
│   ├── preview/    # Preview components
│   ├── ui/         # Reusable UI components (shadcn-style)
│   └── auth/       # Authentication components
├── hooks/           # Custom React hooks
├── lib/
│   ├── contexts/   # React contexts
│   ├── __tests__/  # Unit tests
│   ├── transform/  # Code transformation utilities
│   ├── prisma.ts   # Database client
│   └── utils.ts    # Shared utilities
└── generated/       # Generated code (Prisma client)
```

### Naming Conventions

- Files: kebab-case for utilities (`file-system.ts`), PascalCase for components (`ChatInterface.tsx`)
- Functions: camelCase
- Components: PascalCase
- Types/Interfaces: PascalCase
- Constants: SCREAMING_SNAKE_CASE for config values

### Code Quality

- Run `npm run lint` before committing
- Ensure TypeScript compiles without errors
- All tests should pass before committing
- Use descriptive commit messages
