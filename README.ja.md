# m0rphic React サンプル

[English](./README.md) | [中文](./README.zh.md) | **[日本語](./README.ja.md)**

---

このサンプルは、`@m0rphic/react` SDK を React アプリケーションに統合し、AI 駆動の UI 最適化と自動イベントトラッキングを実現する方法を示しています。

## クイックスタート

```bash
# 依存関係をインストール
pnpm install

# E2E テストモードで m0rphic サーバーを起動（ポート 3021）
E2E_TEST_MODE=true pnpm --filter @m0rphic/server dev

# サンプルアプリを起動（ポート 3025）
pnpm --filter m0rphic-react-example dev
```

http://localhost:3025 を開いてサンプルを確認してください。

**注意：** サンプルアプリはデフォルトで `e2e-test-example-app` を appId として使用します。認証をバイパスするため、サーバーで `E2E_TEST_MODE=true` が必要です。これにより、データベース設定なしでテストできます。

## 機能デモ

### 1. M0rphicProvider

アプリをラップして SDK を初期化します：

```tsx
import { M0rphicProvider } from '@m0rphic/react';

function App() {
  return (
    <M0rphicProvider
      appId="your-app-id"
      userId="user-123"
      apiEndpoint="https://api.m0rphic.dev"
    >
      {/* アプリ */}
    </M0rphicProvider>
  );
}
```

**自動イベント：**
- `session_start` - Provider マウント時に送信
- `session_end` - ページを閉じる時またはタブ切り替え時に送信

### 2. M0rphicComponent

コンポーネントライブラリから AI 生成コンポーネントをレンダリング：

```tsx
import { M0rphicComponent } from '@m0rphic/react';

<M0rphicComponent
  componentId="pricing-card"
  data={{
    title: "プロプラン",
    price: "¥2,900/月",
  }}
  handlers={{
    onBuyClick: () => handlePurchase(),
    onLearnMore: () => navigate('/pricing'),
  }}
/>
```

**自動イベント：**
- `view` - コンポーネントが表示された時
- `click` - ユーザーがコンポーネント内をクリックした時
- `submit` - ハンドラーが呼び出された時（例：`onBuyClick`）

### 3. useTrackComponent

トラッキングが必要なカスタムコンポーネント用：

```tsx
import { useTrackComponent } from '@m0rphic/react';

function CustomButton({ id, children }) {
  const { ref } = useTrackComponent(id, {
    trackClicks: true,      // デフォルト：true
    trackVisibility: true,  // デフォルト：true
    trackHover: true,       // デフォルト：false
    hoverThreshold: 500,    // ホバーイベント発火までの最小ミリ秒
  });

  return <button ref={ref}>{children}</button>;
}
```

**イベント：**
- `view` - 要素が表示された時（IntersectionObserver）
- `click` - ユーザーが要素をクリックした時
- `hover` - ユーザーが閾値以上ホバーした時

### 4. useTrackScroll

ページのスクロール深度をトラッキング：

```tsx
import { useTrackScroll } from '@m0rphic/react';

function ArticlePage() {
  useTrackScroll({
    pageId: '/blog/article-1',
    thresholds: [25, 50, 75, 100], // これらのパーセンテージをトラッキング
  });

  return <article>長いコンテンツ...</article>;
}
```

**イベント：**
- `scroll` - 各閾値に達した時に送信（閾値ごとに1回のみ）

### 5. M0rphicErrorBoundary

エラーをキャッチしてトラッキング：

```tsx
import { M0rphicErrorBoundary } from '@m0rphic/react';

<M0rphicErrorBoundary
  appId="your-app-id"
  apiEndpoint="https://api.m0rphic.dev"
  componentId="checkout-form"
  fallback={(error, reset) => (
    <div>
      <p>エラーが発生しました：{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  )}
>
  <CheckoutForm />
</M0rphicErrorBoundary>
```

**イベント：**
- `error` - エラーがキャッチされた時に送信（スタックトレース含む）

## イベントタイプ一覧

| タイプ | トリガー | 自動? |
|------|---------|-------|
| `session_start` | Provider マウント | はい |
| `session_end` | ページを閉じる/タブ切り替え | はい |
| `view` | 要素が表示（50%以上） | はい* |
| `click` | ユーザークリック | はい* |
| `submit` | ハンドラー呼び出し | はい** |
| `hover` | マウスホバーが閾値超過 | 設定必要 |
| `scroll` | スクロール深度マイルストーン | 設定必要 |
| `error` | エラー境界内でエラー | 設定必要 |

\* M0rphicComponent では自動有効、カスタム要素には `useTrackComponent` が必要
\** M0rphicComponent の handlers 内のみ

## URL パラメータ

URL パラメータでサンプルをカスタマイズ：

```
http://localhost:3025?appId=my-app&userId=user-456&api=http://localhost:3021
```

- `appId` - m0rphic アプリ ID
- `userId` - ユーザー識別子
- `api` - API エンドポイント URL

## デバッグパネル

右サイドバーにサーバーに送信されるリアルタイムイベントが表示されます。Server-Sent Events (SSE) でサーバーの `/api/v1/events/stream` エンドポイントに接続しています。

**要件：**
- サーバーが `E2E_TEST_MODE=true` で実行されている必要があります
- App ID は `e2e-test-` で始まる必要があります（デフォルト：`e2e-test-example-app`）

## もっと詳しく

- [SDK ドキュメント](https://m0rphic.dev/docs/sdk)
- [API リファレンス](https://m0rphic.dev/docs/api)
- [入門ガイド](https://m0rphic.dev/docs/getting-started)
