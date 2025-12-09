# CSS & Tailwind Configuration Reference

This document captures the current CSS and Tailwind settings for the 成語生存指南 project for future reference and troubleshooting.

## Tailwind CSS Version
**v4.1.17** - This uses the new Tailwind v4 syntax which differs from v3.

## Critical: Dark Mode Configuration

Tailwind v4 requires explicit dark mode configuration. Add this at the top of `src/index.css`:

```css
@import "tailwindcss";

/* Tailwind v4: Enable class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));
```

> [!IMPORTANT]
> Without this line, `dark:` classes will NOT work in Tailwind v4.

---

## Theme Variables

### Light Mode (`:root`)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
```

### Dark Mode (`.dark`)
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --border: 217.2 32.6% 17.5%;
}
```

---

## Glass Effect Utilities

```css
.glass-panel {
  @apply bg-white/60 dark:bg-white/10 backdrop-blur-md 
         border border-white/40 dark:border-white/20 
         shadow-xl transition-colors duration-300;
}

.glass-btn {
  @apply bg-white/40 dark:bg-white/10 
         hover:bg-white/60 dark:hover:bg-white/20 
         backdrop-blur-sm border border-white/20 dark:border-white/10 
         transition-all duration-300 active:scale-95 
         text-slate-800 dark:text-slate-100;
}
```

---

## Scrollable Container Pattern

For scrollable areas inside flex/grid containers:

```jsx
{/* Parent container must have height constraints */}
<div className="flex flex-col flex-1 min-h-0">
  
  {/* Grid with overflow handling */}
  <div className="grid grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
    
    {/* Scrollable column */}
    <div className="flex flex-col min-h-0 overflow-hidden">
      <h3 className="flex-shrink-0">Title</h3>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Scrollable content here */}
      </div>
    </div>
    
  </div>
</div>
```

> [!TIP]
> Key classes for scrollable grids:
> - `flex-1` - grow to fill space
> - `min-h-0` - allow shrinking below content height (critical!)
> - `overflow-hidden` - on parent containers
> - `overflow-y-auto` - on scrollable child

---

## Custom Scrollbar

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
```

---

## Portal Components (Radix UI / Shadcn)

> [!WARNING]
> React Portals render OUTSIDE the main DOM tree. This means the `.dark` class on `<html>` may not be inherited.

**Solution:** Use explicit dark classes on portal content:

```jsx
// Instead of semantic tokens that may not inherit:
className="bg-card text-card-foreground"

// Use explicit dark variants:
className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white"
```

---

## Font Sizes Reference

| Element | Mobile | Desktop |
|---------|--------|---------|
| Page titles | `text-4xl` | `text-5xl` |
| Descriptions | `text-lg` | `text-xl` |
| Card titles | `text-2xl` | `text-3xl` |
| Body text | `text-base` | `text-lg` |
| Chat bubbles | `text-xl` | `text-2xl` |
| Labels | `text-sm` | `text-base` |

---

## Background Gradient

```css
body {
  background-image:
    radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%);
  background-attachment: fixed;
}

.dark body {
  background-image:
    radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.15), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%);
}
```

---

## Files Reference

| File | Purpose |
|------|---------|
| [src/index.css](file:///Users/autsintliao/workspace/github/成語學習用法與輔助工具/src/index.css) | Theme variables, utilities, scrollbar |
| [src/context/ThemeContext.jsx](file:///Users/autsintliao/workspace/github/成語學習用法與輔助工具/src/context/ThemeContext.jsx) | Theme toggle logic |
| [src/components/ui/dialog.jsx](file:///Users/autsintliao/workspace/github/成語學習用法與輔助工具/src/components/ui/dialog.jsx) | Modal/portal component |
| [src/components/ui/switch.jsx](file:///Users/autsintliao/workspace/github/成語學習用法與輔助工具/src/components/ui/switch.jsx) | Toggle switch component |
