---
name: frontend-engineer
description: >
  Use this skill whenever the user asks for help with frontend development tasks.
  Trigger on phrases like "build a component", "create a page", "fix the UI",
  "style this", "add a form", "handle state", "create a hook", "write a layout",
  "make it responsive", or any request involving React, HTML, CSS, JavaScript,
  TypeScript, or Tailwind. Also trigger when the user shares frontend code and
  asks for improvements, reviews, or explanations. For full-stack features, use
  this skill alongside the backend-engineer skill.
---

# Frontend Engineer Skill

This skill ensures Claude follows consistent, professional frontend engineering
standards for all UI and client-side development tasks.

---

## Activation Confirmation

When this skill is activated, begin your response with:

> **Frontend Engineer skill active.**

This confirms the skill loaded and its standards are being applied.

---

## General Principles

- Write clean, readable, and maintainable code
- Keep components small and focused — one component, one responsibility
- Prefer simple solutions over clever ones
- Always handle loading, error, and empty states in every UI component
- Use meaningful, descriptive names for components, hooks, and variables
- Never hardcode values that belong in config, constants, or environment variables

---

## Stack Defaults

If the user hasn't specified a stack, use these defaults and confirm if unsure:

- **Framework:** React 19 (functional components + hooks only)
- **Language:** TypeScript (preferred), JavaScript (acceptable)
- **Styling:** Tailwind CSS utility classes
- **Build Tool:** Vite
- **Testing:** Vitest + React Testing Library

---

## Project Structure

```
src/
├── components/        # Reusable, stateless UI components
├── pages/             # Route-level components (one per page/view)
├── hooks/             # Custom React hooks (use[Name].ts)
├── services/          # API call functions (no fetch() inside components)
├── context/           # React Context providers and consumers
├── types/             # TypeScript interfaces and type definitions
├── utils/             # Pure helper/utility functions
├── constants/         # App-wide constants and config values
└── test/
    └── setup.js       # Testing setup file
```

---

## Component Standards

### Rules
- Use **functional components only** — no class components
- Define components with `const`: `const MyComponent = () => {}`
- One component per file; filename matches component name
- Export as **default export** for pages, **named export** for shared components
- Split components if they exceed ~150 lines or handle more than one concern
- Keep JSX clean — extract complex logic into variables or helper functions above the return

### Props
- Always define prop types using TypeScript interfaces
- Place the interface directly above the component definition
- Use destructuring in the function signature

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-medium ${
        variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" :
        variant === "secondary" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" :
        "bg-red-600 text-white hover:bg-red-700"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
};

export { Button };
```

---

## Hooks Standards

### Built-in Hooks
- `useState` — local UI state only
- `useEffect` — side effects; always clean up subscriptions and timers
- `useMemo` — only for genuinely expensive computations, not by default
- `useCallback` — only when passing stable function references to memoized children
- `useRef` — for DOM references and mutable values that don't trigger re-renders

### Custom Hooks
- Place all custom hooks in `src/hooks/`
- Name must start with `use`: `useAuth`, `useFormValidation`, `usePagination`
- A hook should do one thing — split if it handles multiple concerns
- Always return a consistent shape: `{ data, loading, error }` for async hooks

```tsx
// src/hooks/useFetch.ts
import { useState, useEffect } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
```

---

## Styling Standards (Tailwind CSS)

- Use Tailwind utility classes directly in JSX — no inline styles
- For complex conditional classes, use a `cx()` helper or template literals
- Group Tailwind classes in this order: layout → spacing → sizing → typography → color → border → effects
- Extract repeated class combinations into a component, not a custom CSS class
- Use responsive prefixes consistently: `sm:` `md:` `lg:` `xl:`
- Dark mode: use `dark:` prefix if the project supports it

```tsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 w-full max-w-md text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">

// ❌ Avoid
<div style={{ display: 'flex', padding: '24px' }}>
```

---

## State Management

- **Local UI state** → `useState` inside the component
- **Shared state across a few components** → lift state up to parent
- **App-wide state** → React Context (`src/context/`)
- **Server state / async data** → custom hook with `useFetch` or React Query
- Avoid prop drilling more than 2 levels deep — use Context instead

---

## API Calls

- **Never** use raw `fetch()` inside a component
- All API calls go through `src/services/`
- Services return typed responses and handle HTTP errors

```tsx
// src/services/userService.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export const getUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
  return res.json();
};

export const createUser = async (payload: { name: string; email: string }) => {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create user: ${res.status}`);
  return res.json();
};
```

---

## Accessibility (a11y)

- Use semantic HTML: `<button>`, `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`
- Every `<img>` must have a descriptive `alt` attribute
- All interactive elements must be keyboard-navigable and focusable
- Use `aria-label` on icon-only buttons
- Maintain sufficient color contrast (WCAG AA minimum)
- Never remove focus outlines without replacing them with a visible alternative

---

## Forms

- Controlled inputs only — always bind value to state
- Validate on submit and optionally on blur, never on every keystroke
- Show clear, inline error messages next to the relevant field
- Disable the submit button while a request is in progress
- Clear errors when the user starts correcting a field

```tsx
const [email, setEmail] = useState("");
const [error, setError] = useState("");

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!email.includes("@")) {
    setError("Please enter a valid email address.");
    return;
  }
  // proceed
};
```

---

## Testing Standards

### Setup (if not already present)
```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add to `vite.config.js`:
```js
test: {
  environment: "jsdom",
  setupFiles: "./src/test/setup.js",
  globals: true,
}
```

`src/test/setup.js`:
```js
import "@testing-library/jest-dom";
```

### What to Test
- ✅ Renders correctly with given props
- ✅ User interactions (click, type, submit) via `userEvent`
- ✅ Conditional rendering (loading, error, empty, populated states)
- ✅ Custom hooks via `renderHook`
- ✅ All utility function branches (100% coverage)
- ❌ Do not test implementation details or internal state directly

### Example Component Test
```tsx
// Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the label", () => {
    render(<Button label="Submit" onClick={() => {}} />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    await userEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button label="Submit" onClick={() => {}} disabled />);
    expect(screen.getByText("Submit")).toBeDisabled();
  });
});
```

---

## Output Format

When Claude generates frontend code using this skill:

1. **State the design decision** — what pattern is used and why (2–3 sentences)
2. **Provide complete, ready-to-paste code** — no placeholders or TODOs
3. **Include the test file** for every component or hook written
4. **Call out any optimization opportunities** spotted during implementation
5. **List any assumptions** made (e.g., assumed folder structure, API shape)