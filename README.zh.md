# m0rphic React 示例

[English](./README.md) | **[中文](./README.zh.md)** | [日本語](./README.ja.md)

---

本示例演示如何将 `@m0rphic/react` SDK 集成到您的 React 应用中，实现 AI 驱动的 UI 优化和自动事件追踪。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动 m0rphic 服务器（启用 E2E 测试模式，端口 3021）
E2E_TEST_MODE=true pnpm --filter @m0rphic/server dev

# 启动示例应用（端口 3025）
pnpm --filter m0rphic-react-example dev
```

打开 http://localhost:3025 查看示例。

**注意：** 示例应用默认使用 `e2e-test-example-app` 作为 appId，需要服务器启用 `E2E_TEST_MODE=true` 以跳过认证。这允许在无需数据库配置的情况下进行测试。

## 功能演示

### 1. M0rphicProvider

包裹您的应用并初始化 SDK：

```tsx
import { M0rphicProvider } from '@m0rphic/react';

function App() {
  return (
    <M0rphicProvider
      appId="your-app-id"
      userId="user-123"
      apiEndpoint="https://api.m0rphic.dev"
    >
      {/* 您的应用 */}
    </M0rphicProvider>
  );
}
```

**自动事件：**
- `session_start` - Provider 挂载时发送
- `session_end` - 页面关闭或切换标签页时发送

### 2. M0rphicComponent

渲染组件库中 AI 生成的组件：

```tsx
import { M0rphicComponent } from '@m0rphic/react';

<M0rphicComponent
  componentId="pricing-card"
  data={{
    title: "专业版",
    price: "¥199/月",
  }}
  handlers={{
    onBuyClick: () => handlePurchase(),
    onLearnMore: () => navigate('/pricing'),
  }}
/>
```

**自动事件：**
- `view` - 组件可见时
- `click` - 用户点击组件任意位置时
- `submit` - 任何处理器被调用时（如 `onBuyClick`）

### 3. useTrackComponent

为需要追踪的自定义组件使用：

```tsx
import { useTrackComponent } from '@m0rphic/react';

function CustomButton({ id, children }) {
  const { ref } = useTrackComponent(id, {
    trackClicks: true,      // 默认：true
    trackVisibility: true,  // 默认：true
    trackHover: true,       // 默认：false
    hoverThreshold: 500,    // 触发悬停事件的最小毫秒数
  });

  return <button ref={ref}>{children}</button>;
}
```

**事件：**
- `view` - 元素可见时（IntersectionObserver）
- `click` - 用户点击元素时
- `hover` - 用户悬停超过阈值时间时

### 4. useTrackScroll

追踪页面滚动深度：

```tsx
import { useTrackScroll } from '@m0rphic/react';

function ArticlePage() {
  useTrackScroll({
    pageId: '/blog/article-1',
    thresholds: [25, 50, 75, 100], // 追踪这些百分比
  });

  return <article>长内容...</article>;
}
```

**事件：**
- `scroll` - 达到每个阈值时发送（每个阈值仅一次）

### 5. M0rphicErrorBoundary

捕获并追踪错误：

```tsx
import { M0rphicErrorBoundary } from '@m0rphic/react';

<M0rphicErrorBoundary
  appId="your-app-id"
  apiEndpoint="https://api.m0rphic.dev"
  componentId="checkout-form"
  fallback={(error, reset) => (
    <div>
      <p>出错了：{error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  )}
>
  <CheckoutForm />
</M0rphicErrorBoundary>
```

**事件：**
- `error` - 捕获到错误时发送（包含堆栈跟踪）

## 事件类型汇总

| 类型 | 触发条件 | 自动? |
|------|---------|-------|
| `session_start` | Provider 挂载 | 是 |
| `session_end` | 页面关闭/切换标签页 | 是 |
| `view` | 元素可见（50%+） | 是* |
| `click` | 用户点击 | 是* |
| `submit` | 处理器被调用 | 是** |
| `hover` | 鼠标悬停超过阈值 | 需配置 |
| `scroll` | 滚动深度里程碑 | 需配置 |
| `error` | 错误边界内出错 | 需配置 |

\* 在 M0rphicComponent 中自动启用，自定义元素需使用 `useTrackComponent`
\** 仅在 M0rphicComponent 的 handlers 中

## URL 参数

通过 URL 参数自定义示例：

```
http://localhost:3025?appId=my-app&userId=user-456&api=http://localhost:3021
```

- `appId` - 您的 m0rphic 应用 ID
- `userId` - 用户标识符
- `api` - API 端点 URL

## 调试面板

右侧边栏显示实时发送到服务器的事件。它通过 Server-Sent Events (SSE) 连接到服务器的 `/api/v1/events/stream` 端点。

**要求：**
- 服务器必须以 `E2E_TEST_MODE=true` 运行
- App ID 必须以 `e2e-test-` 开头（默认：`e2e-test-example-app`）

## 了解更多

- [SDK 文档](https://m0rphic.dev/docs/sdk)
- [API 参考](https://m0rphic.dev/docs/api)
- [入门指南](https://m0rphic.dev/docs/getting-started)
