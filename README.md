# Signal Grid

Signal Grid is a retro-industrial split-flap display built with React, TypeScript, and Vite. It renders a mechanical board with per-cell flip animation, synchronized flap audio, themeable console styling, and a control deck for routing feeds.

The app currently supports:

- custom manual messages
- live NewsAPI headlines
- live NewsAPI sports headlines
- live Twelve Data market quotes
- mock news, stocks, and weather feeds
- playlist rotation between feeds
- fullscreen mode
- persisted board, audio, theme, and routing settings
- reduced motion and mute support

## Stack

- React 18
- TypeScript
- Vite
- Zustand
- CSS 3D transforms
- Web Audio API

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure local env vars

Copy `.env.example` to `.env.local` and add any keys you want to use.

```bash
cp .env.example .env.local
```

Available env vars:

```bash
VITE_NEWS_API_KEY=
VITE_NEWS_API_COUNTRY=us
VITE_TWELVE_DATA_API_KEY=
VITE_TWELVE_DATA_SYMBOLS=AAPL,MSFT,NVDA
```

Notes:

- `VITE_NEWS_API_KEY` enables `Live News` and `Live Sports`
- `VITE_TWELVE_DATA_API_KEY` enables `Live Markets`
- `VITE_TWELVE_DATA_SYMBOLS` controls the live market watchlist

### 3. Run the app

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

## Live Feed Behavior

Live adapters are only registered when the corresponding env vars are present.

Current live feeds:

- `Live News`: NewsAPI `top-headlines` for general news
- `Live Sports`: NewsAPI `top-headlines` with the sports category
- `Live Markets`: Twelve Data quotes for the configured symbols

Current mock feeds:

- `Custom Message`
- `Mock News`
- `Mock Stocks`
- `Mock Weather`

## Important API Key Caveat

This app is a client-rendered Vite app. Any `VITE_*` variable is exposed to the browser at runtime.

That means:

- `.env.local` must stay local and should never be committed
- browser-visible API keys are acceptable for local prototyping only
- a deployed version should move live feed requests behind a proxy, edge function, or backend

The included `.gitignore` already keeps `.env.local` out of version control.

## Controls

The left-side control deck lets you:

- switch the on-air feed immediately
- edit the manual message
- choose which feeds are included in playlist rotation
- change rotation cadence
- adjust board timing and animation behavior
- tune audio volume, density, and mute state
- change the visual theme
- enter fullscreen mode

## Architecture

### Display

- `src/components/SplitFlapBoard.tsx`
- `src/components/SplitFlapRow.tsx`
- `src/components/SplitFlapCell.tsx`

These files handle the visual board, row composition, and per-cell split-flap animation.

### Engine

- `src/engine/flapEngine.ts`
- `src/engine/animationScheduler.ts`
- `src/engine/audioEngine.ts`

These files drive character stepping, animation timing, and flap sound playback.

### Adapters

- `src/adapters`
- `src/services/newsApi.ts`
- `src/services/twelveData.ts`

Adapters transform feed data into a shared board payload shape. Provider-specific HTTP code lives in `src/services`, while board-friendly normalization stays inside the adapters.

### State

- `src/store/useSplitFlapStore.ts`
- `src/hooks/useDisplayController.ts`

Zustand stores board config, feed routing, audio settings, theme choice, fullscreen state, and persisted UI preferences. The display controller polls adapters, updates snapshots, and rotates the active playlist.

### Styling

- `src/styles/index.css`
- `src/theme/themes.ts`

These files define the split-flap look, console shell, theme palette, and motion polish.

## Board Payload Contract

Every adapter normalizes to the same display payload:

```ts
interface DisplayPayload {
  title: string;
  lines: string[];
  timestamp: string;
  status: 'ready' | 'loading' | 'offline' | 'error';
  themeHint?: 'default' | 'alert' | 'success' | 'cool';
}
```

This keeps the board engine independent from the data source.

## Current Limitations

- live weather is not wired yet
- NewsAPI Developer is suitable for local development, not a public production deployment
- Twelve Data is currently polled on an interval rather than streamed over WebSocket
- sports scores and schedules are not implemented yet

## Next Good Steps

- add a live weather adapter
- move all live feed requests behind a serverless proxy
- add sports schedule and score adapters
- add provider selection in the control deck
- add richer playlist programming and per-feed formatting options
