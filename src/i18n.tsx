import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "en" | "zh" | "ja";

const translations = {
  en: {
    nav: {
      features: "Features",
      docs: "Docs",
      examples: "Examples",
      github: "GitHub",
      dashboard: "Dashboard",
    },
    config: {
      title: "Configuration",
      appId: "App ID",
      appIdHint: "Use e2e-test-* prefix for test mode, or your real app ID from dashboard",
      userId: "User ID",
      apiEndpoint: "API Endpoint",
      apply: "Apply & Reload",
    },
    demo: {
      title: "m0rphic React Example",
      subtitle: "Demonstrating automatic event tracking with the m0rphic SDK",
      section1Title: "1. M0rphicComponent (AI-Generated UI)",
      section1Desc: "Renders published components from your component library. Automatically tracks view, click, and handler invocations.",
      componentIdPlaceholder: "Enter component ID (e.g., pricing-card)",
      loadComponent: "Load Component",
      noComponentId: "Enter a component ID above to load an AI-generated component",
      section2Title: "2. useTrackComponent (Manual Tracking)",
      section2Desc: "Use this hook for custom components that need tracking. Tracks clicks, visibility, and hover events.",
      trackedButton: "Click Me (Tracked)",
      section3Title: "3. M0rphicErrorBoundary (Error Tracking)",
      section3Desc: "Catches errors and automatically reports them. Click the button to trigger an error.",
      triggerError: "Trigger Error",
      resetError: "Reset",
      section4Title: "4. useTrackScroll (Scroll Tracking)",
      section4Desc: "Scroll down to trigger scroll depth events (25%, 50%, 75%, 100%)",
      scrollSection: "Section",
      scrollSectionDesc: "This is section {n} of the scroll tracking demo. Keep scrolling to trigger more scroll depth events.",
    },
    eventPanel: {
      title: "Event Stream",
      clear: "Clear",
      total: "Total",
      events: "events",
      waiting: "Waiting for events...",
      stream: "Stream",
    },
  },
  zh: {
    nav: {
      features: "功能特性",
      docs: "文档",
      examples: "范例",
      github: "GitHub",
      dashboard: "控制台",
    },
    config: {
      title: "配置",
      appId: "App ID",
      appIdHint: "使用 e2e-test-* 前缀进入测试模式，或使用控制台中的真实 App ID",
      userId: "用户 ID",
      apiEndpoint: "API 端点",
      apply: "应用并刷新",
    },
    demo: {
      title: "m0rphic React 范例",
      subtitle: "展示 m0rphic SDK 的自动事件追踪功能",
      section1Title: "1. M0rphicComponent（AI 生成 UI）",
      section1Desc: "渲染组件库中已发布的组件。自动追踪浏览、点击和处理函数调用。",
      componentIdPlaceholder: "输入组件 ID（如 pricing-card）",
      loadComponent: "加载组件",
      noComponentId: "在上方输入组件 ID 以加载 AI 生成的组件",
      section2Title: "2. useTrackComponent（手动追踪）",
      section2Desc: "为需要追踪的自定义组件使用此 Hook。追踪点击、可见性和悬停事件。",
      trackedButton: "点击我（已追踪）",
      section3Title: "3. M0rphicErrorBoundary（错误追踪）",
      section3Desc: "捕获错误并自动上报。点击按钮触发错误。",
      triggerError: "触发错误",
      resetError: "重置",
      section4Title: "4. useTrackScroll（滚动追踪）",
      section4Desc: "向下滚动触发滚动深度事件（25%、50%、75%、100%）",
      scrollSection: "章节",
      scrollSectionDesc: "这是滚动追踪演示的第 {n} 节。继续滚动以触发更多滚动深度事件。",
    },
    eventPanel: {
      title: "事件流",
      clear: "清空",
      total: "总计",
      events: "个事件",
      waiting: "等待事件中...",
      stream: "流地址",
    },
  },
  ja: {
    nav: {
      features: "機能",
      docs: "ドキュメント",
      examples: "サンプル",
      github: "GitHub",
      dashboard: "ダッシュボード",
    },
    config: {
      title: "設定",
      appId: "App ID",
      appIdHint: "テストモードには e2e-test-* プレフィックスを使用、または Dashboard の実際の App ID を使用",
      userId: "ユーザー ID",
      apiEndpoint: "API エンドポイント",
      apply: "適用して再読み込み",
    },
    demo: {
      title: "m0rphic React サンプル",
      subtitle: "m0rphic SDK の自動イベントトラッキングのデモ",
      section1Title: "1. M0rphicComponent（AI生成UI）",
      section1Desc: "コンポーネントライブラリから公開されたコンポーネントをレンダリング。ビュー、クリック、ハンドラー呼び出しを自動追跡。",
      componentIdPlaceholder: "コンポーネントIDを入力（例：pricing-card）",
      loadComponent: "コンポーネントを読み込む",
      noComponentId: "上にコンポーネントIDを入力して、AI生成コンポーネントを読み込む",
      section2Title: "2. useTrackComponent（手動トラッキング）",
      section2Desc: "トラッキングが必要なカスタムコンポーネントにこのフックを使用。クリック、可視性、ホバーイベントを追跡。",
      trackedButton: "クリック（トラッキング中）",
      section3Title: "3. M0rphicErrorBoundary（エラートラッキング）",
      section3Desc: "エラーをキャッチして自動的にレポート。ボタンをクリックしてエラーをトリガー。",
      triggerError: "エラーをトリガー",
      resetError: "リセット",
      section4Title: "4. useTrackScroll（スクロールトラッキング）",
      section4Desc: "下にスクロールしてスクロール深度イベントをトリガー（25%、50%、75%、100%）",
      scrollSection: "セクション",
      scrollSectionDesc: "これはスクロールトラッキングデモのセクション {n} です。さらにスクロールしてイベントをトリガーしてください。",
    },
    eventPanel: {
      title: "イベントストリーム",
      clear: "クリア",
      total: "合計",
      events: "イベント",
      waiting: "イベント待機中...",
      stream: "ストリーム",
    },
  },
} as const;

type Translations = typeof translations.en;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && ["en", "zh", "ja"].includes(saved)) return saved;
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === "zh") return "zh";
    if (browserLang === "ja") return "ja";
    return "en";
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations[locale];
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

export function useTranslations(prefix?: string) {
  const { t } = useI18n();
  return useCallback((key: string) => {
    return t(prefix ? `${prefix}.${key}` : key);
  }, [t, prefix]);
}
