# 🚀 TypeScript & Node.js Backend Practice Academy

Welcome! This workspace is designed as an interactive, hands-on learning roadmap for TypeScript and modern Node.js backend development.

Whether you are transitioning from vanilla JavaScript or looking to master production-grade backend design patterns, this repository serves as your structured practice guide — from absolute basics to professional-level architecture.

---

## Prerequisites

Before starting, make sure you have installed:

- **Node.js** v18+ — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **VS Code** or any TypeScript-aware editor
- **Git** (for version control)

---

## How to Use This Course

1. **Install Dependencies**: Open your terminal in this directory and run:
   ```bash
   npm install
   ```

2. **Explore in Order**: The directories are numbered `01` to `05`. Start at the beginning.

3. **Read the Explanations**: Inside each file, you will find extremely clear comments explaining the concepts, accompanied by real-life analogies.

4. **Practice**: Scroll down to the `// PRACTICE EXERCISE` section in each file. You'll find a scenario and partial code with `TODO` instructions.

5. **Run the Code**: Execute any TypeScript file directly to verify your implementation:
   ```bash
   npx ts-node <path-to-file>
   ```
   *Example:*
   ```bash
   npx ts-node 01-typescript-basics/01-primitive-types.ts
   ```

6. **Check Your Work**: Each file has a built-in validator that prints ✅ or ❌ for your solutions.

7. **Review Interview Questions**: At the bottom of every file, there is a 🎯 **Interview Questions** section with questions and detailed answers.

---

## 📋 Progress Tracker

Use this checklist to track your journey:

### Module 01: TypeScript Basics
- [ ] `01-primitive-types.ts` — string, number, boolean, any, unknown, void, null, undefined, never
- [ ] `02-interfaces-and-types.ts` — Interfaces, type aliases, extends, intersections
- [ ] `03-enums-and-tuples.ts` — Numeric/string enums, tuples
- [ ] `04-generics.ts` — Generic functions, interfaces, constraints
- [ ] `05-utility-types.ts` — Partial, Pick, Omit, Readonly, Record
- [ ] `06-classes-and-oop.ts` — Classes, access modifiers, abstract, extends, implements
- [ ] `07-type-narrowing-and-guards.ts` — typeof, instanceof, discriminated unions, as const, type predicates

### Module 02: Node.js Fundamentals
- [ ] `01-file-system.ts` — Path resolution, async file read/write/delete
- [ ] `02-async-patterns.ts` — Promises, async/await, Promise.all, error handling
- [ ] `03-events-and-streams.ts` — EventEmitters, readable/writable streams
- [ ] `04-http-module.ts` — Raw HTTP server, request lifecycle, manual routing
- [ ] `05-environment-variables.ts` — process.env, .env files, typed config loaders

### Module 03: Express Framework
- [ ] Read through `src/` (app.ts, routes, controllers, middlewares, validation)
- [ ] `exercises/buildYourOwnRoutes.ts` — Build a complete CRUD API from scratch

### Module 04: Database & ORMs (Prisma)
- [ ] Review `schema.prisma` — Understand schema definitions
- [ ] `prisma-practice.ts` — Type-safe CRUD queries with Prisma Client

### Module 05: Advanced Backend Concepts
- [ ] `01-dependency-injection.ts` — Clean architecture, coding to interfaces
- [ ] `02-jwt-authentication.ts` — Password hashing (bcrypt), JWT tokens
- [ ] `03-testing-jest.ts/.test.ts` — Unit testing with Jest, mocking
- [ ] `04-error-handling-patterns.ts` — Custom error hierarchy, centralized handling

---

## Course Syllabus

### 01. TypeScript Basics
Master the type system to write self-documenting code and catch bugs early.

| File | Topics Covered |
|------|---------------|
| `01-primitive-types.ts` | string, number, boolean, any, unknown, void, null, undefined, never |
| `02-interfaces-and-types.ts` | Interfaces, type aliases, extends, intersections, structural typing |
| `03-enums-and-tuples.ts` | Numeric/string enums, const enums, tuples |
| `04-generics.ts` | Generic functions, interfaces, classes, constraints |
| `05-utility-types.ts` | Partial, Pick, Omit, Readonly, Record, Required |
| `06-classes-and-oop.ts` | Classes, access modifiers, abstract, inheritance, implements |
| `07-type-narrowing-and-guards.ts` | typeof, instanceof, in, discriminated unions, type predicates, as const |

### 02. Node.js Fundamentals
Build standard backend utilities using the native Node.js API with TypeScript wrappers.

| File | Topics Covered |
|------|---------------|
| `01-file-system.ts` | fs module, path module, async I/O |
| `02-async-patterns.ts` | Promises, async/await, Promise.all, try-catch |
| `03-events-and-streams.ts` | EventEmitter pattern, readable/writable streams |
| `04-http-module.ts` | Raw HTTP server, request/response lifecycle |
| `05-environment-variables.ts` | process.env, dotenv, typed config loading |

### 03. Express Framework
Build RESTful APIs conforming to clean architecture standards.

- **Reference App** (`src/`): Entry point, modular routing, controllers, middlewares, Zod validation.
- **Hands-on Exercise** (`exercises/`): Build a complete Product CRUD API from scratch.

### 04. Database & ORMs (Prisma)
Integrate databases with complete type-safety.

- Prisma schema definitions and type-safe CRUD query practice.

### 05. Advanced Backend Concepts
Elevate your skills to senior developer level.

| File | Topics Covered |
|------|---------------|
| `01-dependency-injection.ts` | DI pattern, coding to interfaces, mock injection |
| `02-jwt-authentication.ts` | Bcrypt hashing, JWT sign/verify, auth flow |
| `03-testing-jest.ts` | Jest framework, mocking, AAA pattern |
| `04-error-handling-patterns.ts` | Custom AppError hierarchy, operational vs programmer errors |

---

## 🎯 Interview Prep

Every file contains a **🎯 Interview Questions** section at the bottom with:
- Common interview questions for that topic
- Detailed answers with real-world context
- "What will this output?" brain teasers
- Industry best practices and gotchas

Total: **70+ interview questions with answers** across all modules.

---

## License

This project is open source and available for learning purposes.
