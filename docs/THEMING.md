# Theming & Customization Guide

Complete guide to customizing the visual design of your Notion CMS template.

## Table of Contents

- [Quick Start](#-quick-start)
- [CSS Architecture](#-css-architecture)
- [CSS Custom Properties](#-css-custom-properties)
- [Component Styling](#-component-styling)
- [Class Naming Conventions](#-class-naming-conventions)
- [Creating a Custom Theme](#-creating-a-custom-theme)
- [Dark Mode](#-dark-mode)
- [Typography](#-typography)
- [Colors & Gradients](#c-olors--gradients)
- [Responsive Design](#-responsive-design)

## Quick Start

### Change Primary Color

Edit `src/style.css`:

```css
:root {
  --color-primary: #your-color;     /* Change this */
  --color-primary-dark: #darker-shade;
}
```

### Change Font

```css
:root {
  --font-primary: "Your Font", sans-serif;
  --font-display: "Display Font", serif;
}
```

Don't forget to import your font:

```html
<!-- In index.html <head> -->
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

### Quick Color Scheme

Want a complete color refresh? Update these:

```css
:root {
  --color-primary: #6366f1;        /* Main brand color */
  --color-accent: #f59e0b;         /* Accent/highlight color */
  --color-text-primary: #111827;   /* Main text */
  --color-text-secondary: #6b7280; /* Secondary text */
  --color-bg-primary: #ffffff;     /* Main background */
  --color-bg-secondary: #f9fafb;   /* Section backgrounds */
}
```

---

## CSS Architecture

### File Structure

```
src/
└── style.css          # Main stylesheet (all styles in one file)
```

The template uses a **single CSS file** approach for simplicity. Styles are organized in sections:

1. **CSS Custom Properties** - Variables for theming
2. **Reset & Base** - Browser resets and defaults
3. **Navigation** - Header and navigation styles
4. **Hero Section** - Homepage hero styles
5. **Buttons** - Button component styles
6. **Work Section** - Project gallery styles
7. **Card Components** - Project card styles
8. **Filter Section** - Tag filter styles
9. **About Section** - About section styles
10. **Contact Section** - Contact section styles
11. **Footer** - Footer styles
12. **Generated Pages** - Styles for project detail pages
13. **Responsive Design** - Media queries

### Design System

The template follows these principles:

- **Mobile-first**: Base styles for mobile, enhanced for desktop
- **BEM-inspired**: Block__Element--Modifier naming (loosely)
- **CSS Custom Properties**: For easy theming
- **Open Props**: Utility CSS library for spacing, colors, etc.

---

## CSS Custom Properties

### Available Variables

#### Colors

```css
:root {
  /* Brand Colors */
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-accent: #f59e0b;

  /* Text Colors */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-light: #9ca3af;

  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;

  /* Border */
  --color-border: #e5e7eb;
}
```

#### Typography

```css
:root {
  --font-primary: "Pangolin", cursive;
  --font-display: "Pangolin", cursive;
}
```

#### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

#### Section Sizes

```css
:root {
  --sectionTitleFontSize: clamp(2rem, 3vw, 3rem);
  --sectonTop: var(--size-8, 5rem);
}
```

### Using Variables

```css
/* Use in your styles */
.my-component {
  color: var(--color-primary);
  font-family: var(--font-primary);
  box-shadow: var(--shadow-md);
}
```

---

## Component Styling

### Navigation (.nav)

**Structure:**
```
.nav
  └── .nav__container
      ├── .nav__brand
      │   └── .nav__logo
      └── .nav__links
          ├── .nav__link
          └── .theme-toggle
```

**Key Classes:**
- `.nav` - Fixed navigation container
- `.nav__logo` - Site logo/title
- `.nav__link` - Navigation links
- `.theme-toggle` - Dark mode toggle button

**Customization:**

```css
.nav {
  background: rgba(255, 255, 255, 0.95);  /* Nav background */
  backdrop-filter: blur(10px);             /* Blur effect */
  height: 70px;                            /* Change height */
}

.nav__logo {
  font-size: 1.5rem;      /* Logo size */
  color: var(--color-text-primary);
}

.nav__link {
  color: var(--color-text-secondary);
  transition: color 0.2s;
}

.nav__link:hover {
  color: var(--color-primary);
}
```

### Hero Section (.hero)

**Structure:**
```
.hero
  └── .hero__container
      └── .hero__content
          ├── .hero__title
          │   ├── .index_title
          │   └── .hero__title--accent
          ├── .hero__subtitle
          └── .hero__cta
```

**Key Classes:**
- `.hero` - Hero section container (background image)
- `.index_title` - Main title/logo (from Notion)
- `.hero__title--accent` - Accented title text
- `.hero__subtitle` - Subtitle text
- `.hero__cta` - Call-to-action buttons container

**Customization:**

```css
.hero {
  padding: 140px 0 100px;
  background-image: url('your-image.jpg');
  background-size: cover;
  background-position: center;
}

.index_title {
  font-size: clamp(2.5rem, 5vw, 4rem);  /* Responsive size */
  padding-left: 1rem;
}

.hero__title--accent {
  background: var(--gradient-15);        /* Gradient text */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero__subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  opacity: 0.9;
}
```

### Project Cards (.card)

**Structure:**
```
.card
  └── .card__link
      ├── .card__image-wrapper
      │   ├── .card__image
      │   └── .card__overlay
      │       └── .card__category
      └── .card__content
          ├── .card__title
          ├── .card__description
          └── .card__tags
              └── .tag
```

**Customization:**

```css
.card {
  background: var(--color-bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card__image {
  aspect-ratio: 16/9;
  object-fit: cover;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
```

### Buttons (.btn)

**Available Variants:**
- `.btn` - Base button
- `.btn--primary` - Primary CTA button
- `.btn--secondary` - Secondary button

**Customization:**

```css
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  transform: scale(1.05);
}
```

---

## Class Naming Conventions

The template uses **BEM-inspired** naming:

### Pattern: Block__Element--Modifier

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__image { }

/* Modifier */
.card--featured { }
.btn--primary { }
```

### Common Patterns

**Containers:**
```css
.section { }
.section__container { }
.section__header { }
.section__content { }
```

**Components:**
```css
.component { }
.component__element { }
.component__element--modifier { }
```

**States:**
```css
.component.is-active { }
.component.is-hidden { }
```

### Naming Guidelines

1. **Use semantic names**: `.hero`, `.card`, `.filter` (not `.box1`, `.thing`)
2. **Double underscores** for elements: `.block__element`
3. **Double hyphens** for modifiers: `.block--modifier`
4. **Single hyphens** for multi-word names: `.project-card`

---

## Creating a Custom Theme

### Step 1: Define Your Color Palette

```css
:root {
  /* Choose your brand colors */
  --color-primary: #0ea5e9;        /* Sky blue */
  --color-primary-dark: #0284c7;   /* Darker blue */
  --color-accent: #f97316;          /* Orange */

  /* Text colors (adjust for readability) */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-light: #94a3b8;

  /* Backgrounds */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;

  /* Border */
  --color-border: #e2e8f0;
}
```

### Step 2: Choose Typography

```css
:root {
  --font-primary: "Inter", sans-serif;
  --font-display: "Playfair Display", serif;
}
```

Import in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

### Step 3: Update Component Styles

```css
/* Customize hero */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Customize cards */
.card {
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

/* Customize buttons */
.btn {
  border-radius: 24px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Step 4: Test in Dark Mode

Ensure your theme works in both modes:

```css
[data-theme="dark"] {
  --color-primary: #38bdf8;        /* Lighter in dark mode */
  --color-text-primary: #f8fafc;
  --color-bg-primary: #0f172a;
  /* ... */
}
```

---

## Dark Mode

### How It Works

The template uses:
1. **CSS custom properties** that change with `[data-theme="dark"]`
2. **JavaScript toggle** that sets `data-theme` attribute
3. **localStorage** to persist user preference

### Dark Mode Variables

```css
[data-theme="dark"] {
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-light: #9ca3af;
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-bg-tertiary: #374151;
  --color-border: #4b5563;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  /* ... */
}
```

### Customizing Dark Mode

```css
[data-theme="dark"] {
  /* Override specific components */
  .nav {
    background: rgba(17, 24, 39, 0.95);
  }

  .card {
    background: var(--color-bg-secondary);
    border-color: var(--color-border);
  }
}
```

### Toggle Implementation

In `src/main.js`:

```javascript
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}
```

---

## Typography

### Font Sizes

Use `clamp()` for responsive typography:

```css
.hero__title {
  font-size: clamp(2rem, 5vw, 4.5rem);
  /* min: 2rem, preferred: 5vw, max: 4.5rem */
}

.section__title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
}

.card__title {
  font-size: clamp(1rem, 2vw, 1.25rem);
}
```

### Font Weights

```css
/* Light */
font-weight: 300;

/* Normal */
font-weight: 400;

/* Semi-bold */
font-weight: 600;

/* Bold */
font-weight: 700;
```

### Line Height

```css
/* Headings */
line-height: 1.2;

/* Body text */
line-height: 1.6;

/* Tight (for UI elements) */
line-height: 1.4;
```

---

## Colors & Gradients

### Using Open Props Gradients

The template includes [Open Props](https://open-props.style/) which provides ready-to-use gradients:

```css
.hero__title--accent {
  background: var(--gradient-15);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

Available gradients: `--gradient-1` through `--gradient-30`

### Custom Gradients

```css
.custom-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.radial-gradient {
  background: radial-gradient(circle, #667eea 0%, #764ba2 100%);
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first - base styles are for mobile */

/* Tablet: 768px */
@media (min-width: 768px) {
  .hero__container {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop: 1024px */
@media (min-width: 1024px) {
  .nav__container {
    padding: 0 var(--size-8);
  }
}

/* Large desktop: 1280px */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

### Responsive Utilities

Use `clamp()` for fluid scaling:

```css
/* Fluid font size */
font-size: clamp(1rem, 2vw, 1.5rem);

/* Fluid spacing */
padding: clamp(1rem, 3vw, 3rem);

/* Fluid width */
width: clamp(300px, 50%, 600px);
```

---

## Example: Complete Custom Theme

Here's a complete theme example:

```css
/* ============================================
   CUSTOM THEME: Ocean Breeze
   ============================================ */

:root {
  /* Brand Colors */
  --color-primary: #0891b2;        /* Cyan */
  --color-primary-dark: #0e7490;
  --color-accent: #f59e0b;         /* Amber */

  /* Typography */
  --font-primary: "Inter", sans-serif;
  --font-display: "Lora", serif;

  /* Spacing */
  --heroPLeft: 2rem;
}

/* Dark Mode */
[data-theme="dark"] {
  --color-primary: #22d3ee;
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
}

/* Components */
.hero {
  background: linear-gradient(135deg, #0891b2 0%, #3b82f6 100%);
}

.card {
  border-radius: 16px;
  border: 2px solid var(--color-border);
}

.card:hover {
  border-color: var(--color-primary);
}

.btn {
  border-radius: 24px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

---

## Tips & Best Practices

### 1. Use CSS Variables

✅ **Do:**
```css
.card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

❌ **Don't:**
```css
.card {
  background: #ffffff;
  color: #111827;
}
```

### 2. Keep Specificity Low

✅ **Do:**
```css
.card__title { }
```

❌ **Don't:**
```css
section.work .card-container article.card .content .title { }
```

### 3. Mobile-First Approach

✅ **Do:**
```css
/* Base: mobile */
.hero {
  padding: 60px 0;
}

/* Desktop enhancement */
@media (min-width: 768px) {
  .hero {
    padding: 140px 0;
  }
}
```

### 4. Test in Both Themes

Always test your changes in light AND dark mode!

### 5. Use Semantic Class Names

✅ **Do:** `.hero`, `.card`, `.filter`
❌ **Don't:** `.box1`, `.container-2`, `.thing`

---

## Resources

- [Open Props](https://open-props.style/) - CSS utility library
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [BEM Methodology](http://getbem.com/)
- [Modern CSS Reset](https://piccalil.li/blog/a-modern-css-reset/)

---

Need help with theming? [Open an issue](https://github.com/lilyxia99/LeileiNotionCMS/issues)
