# m0rphic React Example

This example demonstrates how to integrate the `@m0rphic/react` SDK into your React application for AI-powered UI optimization and automatic event tracking.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the m0rphic server with E2E test mode enabled (port 3021)
E2E_TEST_MODE=true pnpm --filter @m0rphic/server dev

# Start the example app (port 3025)
pnpm --filter m0rphic-react-example dev
```

Open http://localhost:3025 to see the example.

**Note:** The example app uses `e2e-test-example-app` as the default appId, which requires `E2E_TEST_MODE=true` on the server to bypass authentication. This allows testing without database setup.

## Features Demonstrated

### 1. M0rphicProvider

Wraps your app and initializes the SDK:

```tsx
import { M0rphicProvider } from '@m0rphic/react';

function App() {
  return (
    <M0rphicProvider
      appId="your-app-id"
      userId="user-123"
      apiEndpoint="https://api.m0rphic.dev"
    >
      {/* Your app */}
    </M0rphicProvider>
  );
}
```

**Automatic Events:**
- `session_start` - Sent when provider mounts
- `session_end` - Sent when page closes or tab switches

### 2. M0rphicComponent

Renders AI-generated components from your component library:

```tsx
import { M0rphicComponent } from '@m0rphic/react';

<M0rphicComponent
  componentId="pricing-card"
  data={{
    title: "Pro Plan",
    price: "$29/mo",
  }}
  handlers={{
    onBuyClick: () => handlePurchase(),
    onLearnMore: () => navigate('/pricing'),
  }}
/>
```

**Automatic Events:**
- `view` - When component becomes visible
- `click` - When user clicks anywhere in the component
- `submit` - When any handler is invoked (e.g., `onBuyClick`)

### 3. useTrackComponent

For custom components that need tracking:

```tsx
import { useTrackComponent } from '@m0rphic/react';

function CustomButton({ id, children }) {
  const { ref } = useTrackComponent(id, {
    trackClicks: true,      // Default: true
    trackVisibility: true,  // Default: true
    trackHover: true,       // Default: false
    hoverThreshold: 500,    // Minimum ms before hover event
  });

  return <button ref={ref}>{children}</button>;
}
```

**Events:**
- `view` - When element becomes visible (IntersectionObserver)
- `click` - When user clicks the element
- `hover` - When user hovers for longer than threshold

### 4. useTrackScroll

Track scroll depth on pages:

```tsx
import { useTrackScroll } from '@m0rphic/react';

function ArticlePage() {
  useTrackScroll({
    pageId: '/blog/article-1',
    thresholds: [25, 50, 75, 100], // Track these percentages
  });

  return <article>Long content...</article>;
}
```

**Events:**
- `scroll` - Sent when each threshold is reached (once per threshold)

### 5. M0rphicErrorBoundary

Catch and track errors:

```tsx
import { M0rphicErrorBoundary } from '@m0rphic/react';

<M0rphicErrorBoundary
  appId="your-app-id"
  apiEndpoint="https://api.m0rphic.dev"
  componentId="checkout-form"
  fallback={(error, reset) => (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
  <CheckoutForm />
</M0rphicErrorBoundary>
```

**Events:**
- `error` - Sent when an error is caught (includes stack trace)

## Event Types Summary

| Type | Trigger | Auto? |
|------|---------|-------|
| `session_start` | Provider mounts | Yes |
| `session_end` | Page closes/tab switch | Yes |
| `view` | Element visible (50%+) | Yes* |
| `click` | User clicks | Yes* |
| `submit` | Handler invoked | Yes** |
| `hover` | Mouse hover > threshold | Opt-in |
| `scroll` | Scroll depth milestone | Opt-in |
| `error` | Error in boundary | Opt-in |

\* Automatic in M0rphicComponent, requires `useTrackComponent` for custom elements
\** Only in M0rphicComponent handlers

## URL Parameters

Customize the example with URL parameters:

```
http://localhost:3025?appId=my-app&userId=user-456&api=http://localhost:3021
```

- `appId` - Your m0rphic app ID
- `userId` - User identifier
- `api` - API endpoint URL

## Debug Panel

The right sidebar shows real-time events being sent to the server. It connects via Server-Sent Events (SSE) to the server's `/api/v1/events/stream` endpoint.

**Requirements:**
- Server must be running with `E2E_TEST_MODE=true`
- App ID must start with `e2e-test-` (default: `e2e-test-example-app`)

## Learn More

- [SDK Documentation](https://m0rphic.dev/docs/sdk)
- [API Reference](https://m0rphic.dev/docs/api)
- [Getting Started Guide](https://m0rphic.dev/docs/getting-started)
