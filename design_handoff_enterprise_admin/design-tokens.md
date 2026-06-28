# Design Tokens

All CSS custom properties defined in the prototype. Map these to Tailwind config / shadcn/ui CSS vars.

---

## Color Tokens

### Dark Theme (default)

```css
:root, [data-theme="dark"] {
  /* Backgrounds */
  --bg:    #06090f;   /* app background */
  --sb:    #080c15;   /* sidebar + header */
  --sur:   #0e1420;   /* card surface */
  --sur2:  #141c2c;   /* elevated surface (table hover, toolbar) */
  --sur3:  #1b2538;   /* control backgrounds (badge, kbd, skeleton) */
  --sur4:  #232f45;   /* deeply elevated */

  /* Borders */
  --bdr:   #1a2540;   /* default border */
  --bdr2:  #243352;   /* emphasized border (input, button outline) */

  /* Text */
  --t1:    #e8edf5;   /* primary text */
  --t2:    #8896aa;   /* secondary text */
  --t3:    #4f6075;   /* tertiary / placeholder */

  /* Brand / Primary */
  --pri:   #1e8ec8;   /* primary actions, links, active states */
  --prih:  #2399d8;   /* primary hover */
  --pris:  rgba(30,142,200,.10);  /* primary subtle bg (active nav, modals) */

  /* Nav active state */
  --nab:   rgba(30,142,200,.12);  /* nav item active background */
  --naf:   #3aaee0;               /* nav item active text/icon */
  --nhb:   rgba(255,255,255,.04); /* nav item hover background */

  /* Semantic */
  --ok:    #22c55e;  --oks:  rgba(34,197,94,.12);   /* success */
  --warn:  #f59e0b;  --warns: rgba(245,158,11,.12); /* warning */
  --err:   #ef4444;  --errs:  rgba(239,68,68,.12);  /* error */
  --info:  #3b82f6;  --infos: rgba(59,130,246,.12); /* info */

  /* Elevation */
  --shd: 0 8px 32px rgba(0,0,0,.48), 0 2px 8px rgba(0,0,0,.32);

  color-scheme: dark;
}
```

### Light Theme

```css
[data-theme="light"] {
  --bg:    #f0f4f8;
  --sb:    #ffffff;
  --sur:   #ffffff;
  --sur2:  #f8f9fb;
  --sur3:  #f0f2f5;
  --sur4:  #e8ecf0;
  --bdr:   #e2e8f0;
  --bdr2:  #cbd5e1;

  --t1:    #0f1117;
  --t2:    #475569;
  --t3:    #94a3b8;

  --pri:   #005184;
  --prih:  #006aa8;
  --pris:  rgba(0,81,132,.08);
  --nab:   rgba(0,81,132,.08);
  --naf:   #005184;
  --nhb:   rgba(0,0,0,.03);

  --ok:    #16a34a;  --oks:  rgba(22,163,74,.10);
  --warn:  #d97706;  --warns: rgba(217,119,6,.10);
  --err:   #dc2626;  --errs:  rgba(220,38,38,.10);
  --info:  #2563eb;  --infos: rgba(37,99,235,.10);

  --shd: 0 8px 24px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06);

  color-scheme: light;
}
```

---

## Tailwind Config Mapping

Add to `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        bg:     'var(--bg)',
        sb:     'var(--sb)',
        sur:    'var(--sur)',
        sur2:   'var(--sur2)',
        sur3:   'var(--sur3)',
        sur4:   'var(--sur4)',
        bdr:    'var(--bdr)',
        bdr2:   'var(--bdr2)',
        t1:     'var(--t1)',
        t2:     'var(--t2)',
        t3:     'var(--t3)',
        pri:    'var(--pri)',
        'pri-h': 'var(--prih)',
        'pri-s': 'var(--pris)',
        ok:     'var(--ok)',
        warn:   'var(--warn)',
        err:    'var(--err)',
        info:   'var(--info)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'micro':  ['11px', { lineHeight: '1.4' }],
        'label':  ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-sm': ['12.5px', { lineHeight: '1.5' }],
        'body':   ['13px',   { lineHeight: '1.5' }],
        'body-md': ['13.5px', { lineHeight: '1.5' }],
        'title':  ['22px',   { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.025em' }],
      },
      boxShadow: {
        'panel': '0 8px 32px rgba(0,0,0,.48), 0 2px 8px rgba(0,0,0,.32)',
        'panel-light': '0 8px 24px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06)',
      },
      keyframes: {
        dropin: {
          from: { opacity: '0', transform: 'translateY(-5px) scale(.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideup: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1',  transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(.82)' },
        },
      },
      animation: {
        'dropin':  'dropin 150ms ease-out',
        'slideup': 'slideup 180ms ease',
        'shimmer': 'shimmer 1.4s ease-in-out infinite',
        'pulse-dot': 'pulse 2s ease-in-out infinite',
      },
    },
  },
}

export default config
```

---

## shadcn/ui CSS Variable Mapping

The shadcn/ui system uses `--background`, `--foreground`, etc. in `hsl()` format. Override them in `globals.css`:

```css
/* Dark */
.dark {
  --background:   215 47% 4%;    /* #06090f */
  --foreground:   214 38% 92%;   /* #e8edf5 */
  --card:         215 40% 9%;    /* #0e1420 */
  --card-foreground: 214 38% 92%;
  --border:       218 42% 17%;   /* #1a2540 */
  --input:        218 40% 20%;   /* #243352 */
  --primary:      204 72% 45%;   /* #1e8ec8 */
  --primary-foreground: 0 0% 100%;
  --muted:        216 35% 14%;   /* #141c2c */
  --muted-foreground: 212 24% 48%; /* #8896aa */
  --accent:       215 40% 16%;   /* #1b2538 */
  --destructive:  0 84% 60%;     /* #ef4444 */
  --ring:         204 72% 45%;
}

/* Light */
:root {
  --background:   210 20% 95%;   /* #f0f4f8 */
  --foreground:   222 41% 7%;    /* #0f1117 */
  --card:         0 0% 100%;
  --card-foreground: 222 41% 7%;
  --border:       214 32% 91%;   /* #e2e8f0 */
  --input:        214 25% 83%;   /* #cbd5e1 */
  --primary:      204 100% 25%;  /* #005184 */
  --primary-foreground: 0 0% 100%;
  --muted:        210 17% 97%;
  --muted-foreground: 215 16% 59%; /* #94a3b8 */
  --accent:       210 15% 95%;
  --destructive:  0 72% 51%;     /* #dc2626 */
  --ring:         204 100% 25%;
}
```

---

## Badge Variants

```tsx
// Extend shadcn/ui Badge with these variants:
const badgeVariants = cva('...base...', {
  variants: {
    variant: {
      default:     'bg-[var(--pris)] text-[var(--pri)]',        // bl — blue
      success:     'bg-[var(--oks)] text-[var(--ok)]',          // bg — green
      destructive: 'bg-[var(--errs)] text-[var(--err)]',        // br — red
      warning:     'bg-[var(--warns)] text-[var(--warn)]',      // ba — amber
      neutral:     'bg-[var(--sur3)] text-[var(--t2)]',         // bx — gray
      muted:       'bg-[var(--sur3)] text-[var(--t3)] text-[10.5px] py-px px-1.5', // bn — tiny
    },
  },
  defaultVariants: { variant: 'neutral' },
})
```

---

## Spacing Scale

All used values extracted from the prototype:

```
4px   — tight gap (icon to text in small components)
6px   — badge padding, small gaps
8px   — standard button gap, list item padding
9px   — nav item gap
10px  — medium padding, table cell horizontal
12px  — card inner gap, modal section gap
14px  — table cell, button padding-x
16px  — standard card gap, grid gap, modal field gap
18px  — chat bubble horizontal padding
20px  — card padding, page section gap
22px  — card padding-x (wider)
24px  — page heading margin-bottom, modal padding
28px  — page content padding-top
32px  — page content padding (desktop)
```

---

## Icon Sizes

```
12px — breadcrumb chevron, inline micro icons
13px — header search icon, small action icons
14px — dropdown item icons, button icons
15px — nav item icons (.ni), KPI card icons
16px — collapsed nav icons
18px — chat bubble send icon
```

Use `lucide-react` with `size={N}` prop or `className="w-4 h-4"` Tailwind sizing.

---

## Chart Colors (Recharts)

```ts
const CHART_COLORS = {
  primary:   '#1e8ec8',
  secondary: '#8b5cf6',
  success:   '#22c55e',
  warning:   '#f59e0b',
  error:     '#ef4444',
  info:      '#3b82f6',
  neutral:   '#4f6075',
}

// Revenue chart gradient
const revenueGradient = {
  id: 'revenueGrad',
  stops: [
    { offset: '0%',   stopColor: '#1e8ec8', stopOpacity: 0.35 },
    { offset: '100%', stopColor: '#1e8ec8', stopOpacity: 0.02 },
  ],
}

// User growth chart — bars
const userBarColor = '#3b82f6'

// Donut chart (Analytics — traffic sources)
const sourcePalette = ['#1e8ec8', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444']
```

---

## Avatar Color Palette

Used for user initials avatars — assign by index or hash of name:

```ts
const AVATAR_COLORS = [
  '#1e8ec8', // Jordan Davis (JD) — primary
  '#8b5cf6', // Sarah Chen (SC)
  '#f59e0b', // Mark Rivera (MR)
  '#14b8a6', // Raj Kumar (RK)
  '#0ea5e9', // Theodore Nakamura (TN)
  '#84cc16', // Chris Wang (CW)
  '#a855f7', // Lena Müller (LM)
  '#ef4444', // Elena Petrova (EP)
  '#22c55e', // Aiko Kobayashi (AK)
]
```
