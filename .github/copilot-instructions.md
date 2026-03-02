# Jedroplus Booking System - AI Coding Agent Instructions

## Project Overview

This is a **Next.js 15 appointment booking system** with **dynamic seasonal themes** and **n8n API integration**. It enables businesses to accept bookings through a multi-step wizard interface with real-time availability checking.

**Core Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion, n8n webhook backend

---

## Architecture & Data Flow

### 1. **Three-Layer Request Flow**

```
Frontend (Next.js) → n8n Webhooks → External Backend (likely HR/booking system)
```

All API calls route through **single n8n endpoint** (`https://tikej.app.n8n.cloud/webhook/booking`) with `action` parameter:
- `action: "init"` (GET) - Fetch business config, employees, services, theme colors
- `action: "slots"` (POST) - Get available time slots for a service/employee/date combination
- `action: "create"` (POST) - Persist booking (client handles payment/confirmation flow)

**Key Implementation**: See `lib/api.ts` - **Double-JSON parsing** required because n8n sometimes returns stringified JSON (`typeof raw === 'string'`). This is a quirk to preserve when calling API functions.

### 2. **Booking State Machine** (`app/booking/[slug]/page.tsx`)

Five-step sequential workflow stored in `BookingSelection`:
1. **Employee** - Select specialist (or "any person")
2. **Service** - Choose service type
3. **DateTime** - Pick date + available time slot
4. **Info** - Gather client details (name, email, phone, gender, notes, consent)
5. **Confirmation** - Review & submit

Each step component (`StepService`, `StepEmployee`, etc.) is controlled by parent's `currentStep` state. **Validation is implicit** - next step only appears when selection is complete.

### 3. **Seasonal Theme System** (`lib/seasonDetector.ts`)

**Dynamic theme selection** based on current date with **holiday override**:

```
detectSeason(date) → Season (spring/summer/autumn/winter)
detectHoliday(date) → Holiday (christmas/easter/halloween/valentine/thanksgiving/newyear)
getCurrentSeasonalTheme() → SeasonalTheme with visual effects enabled
```

**Theme Config** (`lib/types.ts`):
- `SeasonalThemeConfig` defines enabled decorations (snowflakes, flowers, ornaments, hearts, etc.)
- Each holiday has hardcoded date ranges (e.g., Christmas Dec 15–26, Easter ±7 days)
- Easter date computed via **Gregorian algorithm** - see `getEasterDate()`
- Themes include `accentColor`, `overlayColor`, `particleColor`, `fontClass` for UI styling

**Rendering**: `SeasonalDecorations` component dynamically imports decoration components (snowflakes, leaves, etc.) with SSR disabled (`dynamic` import with `ssr: false`).

### 4. **Multi-Language Field Mapping** (Slovenian ↔ English)

API returns Slovenian field names; code handles fallback chains:
- Company: `naziv` → `name` → `booking_name`
- Service: `naziv` (name) + `opis` (description) + `trajanjeMin` (duration) + `cena` (price)
- Always check both Slovenian and English variants in types marked with comments

---

## Key Developer Workflows

### Build & Run
```bash
npm run dev        # Next.js dev server with Turbopack
npm run build      # Production build
npm run start      # Run production server
npm run lint       # ESLint check (ignores during builds in next.config.js)
```

### TypeScript & Configuration
- **Strict mode enabled** - no implicit `any`
- **Path alias** `@/*` maps to root (`tsconfig.json`)
- **Target**: ES2017 for broad browser support
- **Turbopack enabled** in dev for faster builds

### Testing Locally
1. Booking page accessible at `/booking/[slug]` where slug is company identifier from API
2. Test API initialization by checking Network tab → verify `initBooking()` response includes `company`, `employees`, `services`, `theme`
3. Seasonal themes update automatically based on system date (use browser dev tools to mock dates if needed)

---

## Critical Patterns & Conventions

### 1. **Component Organization**
- **Page components** (`app/`) are `'use client'` since they use hooks, state, and browser APIs
- **Booking steps** (`components/booking/Step*.tsx`) are presentational, receive selections via props and emit via callbacks
- **Seasonal decorations** (`components/seasonal/`) use **Framer Motion** for animations with SSR disabled

### 2. **Error Handling**
- API errors caught at call sites and set in component state (see `catch` in `useEffect` at booking page)
- UI shows fallback message: *"Business not found or unable to load configuration."*
- **No global error boundary** for API errors - each request responsible for its own error state

### 3. **Naming Conventions**
- **Step IDs**: snake_case (`employee`, `service`, `datetime`, `info`, `confirmation`)
- **Types**: PascalCase with descriptive suffixes (e.g., `BookingSelection`, `SeasonalTheme`, `EmployeeUI`)
- **Functions**: camelCase, prefixed with verb (`initBooking`, `getAvailableSlots`, `detectHoliday`)

### 4. **Responsive Design**
- **Tailwind CSS** responsive utilities: `max-w-xl`, `sm:`, `md:` breakpoints in components
- Mobile-first approach: base classes apply to mobile, media queries override for larger screens
- Form inputs use consistent spacing: `p-4`, `gap-4`

### 5. **Theme Integration**
- All color-sensitive UI pulls from `primaryColor` (main brand) and `secondaryColor` (accents)
- Seasonal theme colors override defaults: `accentColor` for highlights, `overlayColor` for backgrounds
- Font variants specified in theme: `fontClass` (e.g., `font-playfair` for elegant headings)

---

## Integration Points & External Dependencies

### n8n Webhook Backend
- **URL**: `https://tikej.app.n8n.cloud/webhook/booking`
- **Authentication**: None (public webhook)
- **Quirk**: Double-JSON serialization in some responses requires `JSON.parse(JSON.parse(...))`
- **Payload structure**: All requests include `action` + context-specific parameters

### Framer Motion
- Used for: step indicators (pulsing scale), seasonal decorations (particle animations), modal transitions
- Convention: use `motion.div` for animatable elements, `AnimatePresence` for mounting/unmounting
- Transition durations: typically 300ms for UI elements, 2000ms+ for background animations

### Tailwind CSS 4 (Latest)
- **PostCSS integration** via `postcss.config.js`
- **Custom colors** embedded in component styles: `` style={{ color: primaryColor }} ``
- Dynamic class binding for seasonal themes (`fontClass` from theme config)

### date-fns
- Imported but not heavily used in visible code; likely for date formatting in booking steps
- Used for: parsing dates, formatting display strings

---

## Common Development Tasks

### Adding a New Seasonal Theme/Holiday
1. Add `Holiday` type variant to `lib/types.ts`
2. Implement `detectHoliday()` logic in `lib/seasonDetector.ts` (date range or algorithm)
3. Create `SeasonalThemeConfig` entry with decoration flags
4. Create visual component in `components/seasonal/` (e.g., `NewYearElements.tsx`)
5. Import + conditionally render in `SeasonalDecorations.tsx`

### Modifying Booking Workflow
1. Edit `DEFAULT_STEPS` array in `app/booking/[slug]/page.tsx` to add/remove/reorder steps
2. Create new step component in `components/booking/Step*.tsx` matching interface expectations
3. Update `BookingSelection` type in `lib/types.ts` to hold new data
4. Wire step to stepper and parent component state

### Updating API Integration
1. Modify `lib/api.ts` functions (signatures, error handling, response parsing)
2. Update `lib/types.ts` response interfaces to match n8n backend changes
3. Update calling code in page component or step components
4. Test in Network tab to verify double-JSON handling still works if needed

---

## File Structure Quick Reference

```
lib/
  ├─ api.ts              # n8n webhook calls (init, slots, create)
  ├─ types.ts            # All TypeScript interfaces (Season, Holiday, Booking, Theme)
  ├─ seasonDetector.ts   # Holiday detection + theme selection logic
  └─ useMediaQuery.ts    # (Utility - responsive hook)

components/booking/
  ├─ BookingStepper.tsx  # Visual progress indicator
  ├─ StepService.tsx     # Service selection UI
  ├─ StepEmployee.tsx    # Employee selection UI
  ├─ StepDateTime.tsx    # Date/time picker
  ├─ StepInfo.tsx        # Client info form
  └─ StepConfirmation.tsx # Review & submit

components/seasonal/
  ├─ SeasonalDecorations.tsx       # Conditional renderer
  ├─ FallingSnowflakes.tsx         # Winter animation
  ├─ ChristmasOrnaments.tsx        # Christmas animation
  └─ ... (other seasonal effects)

app/
  ├─ layout.tsx          # Root layout, Google Fonts, metadata
  ├─ page.tsx            # Homepage (landing + feature showcase)
  └─ booking/[slug]/     # Dynamic booking page for each company
```

---

## Debugging Tips

1. **API parsing fails** → Check browser Network tab for response format; add `console.log(raw)` before JSON parse
2. **Theme not applying** → Verify `initBooking()` returns theme object; check `primaryColor` prop is passed to child components
3. **Seasonal decorations not visible** → Ensure `SeasonalDecorations` is rendered with `theme` prop; verify `ssr: false` in dynamic imports
4. **Booking state stuck** → Check `currentStep` state isn't being incremented; trace onClick handlers in step components

---

## Performance Notes

- **Dynamic imports** for seasonal components reduce initial bundle (each decoration loads only if needed)
- **Turbopack** in dev mode speeds hot module reload significantly
- **Framer Motion** animations use GPU acceleration; avoid animating layout properties directly

---

## Next Steps for New Contributors

1. Review `app/booking/[slug]/page.tsx` to understand overall booking flow
2. Explore a booking step component (e.g., `StepService.tsx`) to see state passing pattern
3. Check `lib/seasonDetector.ts` for calendar math and theme application
4. Test locally by accessing `/booking/test-slug` and opening Network tab to observe API flow

