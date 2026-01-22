/**
 * m0rphic React Example
 *
 * This example demonstrates all features of the @m0rphic/react SDK:
 *
 * 1. M0rphicProvider - Initializes the SDK with your app configuration
 * 2. M0rphicComponent - Renders AI-generated components with automatic tracking
 * 3. M0rphicErrorBoundary - Catches and tracks errors in your components
 * 4. useTrackComponent - Manual tracking for custom components
 * 5. useTrackScroll - Track scroll depth on pages
 *
 * Events tracked automatically:
 * - session_start/session_end: When user starts/ends session
 * - view: When components become visible
 * - click: When user clicks on tracked elements
 * - submit: When handlers are invoked (e.g., onBuyClick)
 * - scroll: When user scrolls to depth milestones (25%, 50%, 75%, 100%)
 * - error: When errors occur in error boundaries
 * - hover: When user hovers over elements (optional)
 */

import {
  M0rphicProvider,
  M0rphicComponent,
  M0rphicErrorBoundary,
  useTrackComponent,
  useTrackScroll,
} from "@m0rphic/react";
import { EventDebugPanel } from "./components/EventDebugPanel";
import { Navbar } from "./components/Navbar";
import { I18nProvider, useTranslations } from "./i18n";
import { useState, useCallback } from "react";

// ============================================================================
// Configuration
// ============================================================================

const params = new URLSearchParams(window.location.search);
const CONFIG = {
  appId: params.get("appId") || "e2e-test-example-app",
  userId: params.get("userId") || "example-user-" + Math.random().toString(36).slice(2, 8),
  apiEndpoint: params.get("api") || "http://localhost:3021",
};

// ============================================================================
// Config Panel Component
// ============================================================================

function ConfigPanel({ config }: { config: typeof CONFIG }) {
  const t = useTranslations("config");
  const [isOpen, setIsOpen] = useState(false);
  const [appId, setAppId] = useState(config.appId);
  const [userId, setUserId] = useState(config.userId);
  const [apiEndpoint, setApiEndpoint] = useState(config.apiEndpoint);

  const applyConfig = useCallback(() => {
    const params = new URLSearchParams();
    if (appId !== "e2e-test-example-app") params.set("appId", appId);
    if (userId !== config.userId) params.set("userId", userId);
    if (apiEndpoint !== "http://localhost:3021") params.set("api", apiEndpoint);
    const queryString = params.toString();
    window.location.href = queryString ? `?${queryString}` : "/";
  }, [appId, userId, apiEndpoint, config.userId]);

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#e2e8f0",
    fontSize: "13px",
    fontFamily: "monospace",
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "6px",
          color: "#94a3b8",
          fontSize: "13px",
          cursor: "pointer",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <span>
          <span style={{ color: "#3b82f6" }}>{config.appId}</span>
          <span style={{ margin: "0 8px", color: "#475569" }}>|</span>
          <span style={{ color: "#64748b" }}>{config.apiEndpoint}</span>
        </span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{
          marginTop: "8px",
          padding: "16px",
          backgroundColor: "#1e293b",
          borderRadius: "8px",
          border: "1px solid #334155",
        }}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
              {t("appId")}
            </label>
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              style={inputStyle}
            />
            <p style={{ marginTop: "4px", fontSize: "11px", color: "#64748b" }}>
              {t("appIdHint")}
            </p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
              {t("userId")}
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#94a3b8" }}>
              {t("apiEndpoint")}
            </label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            onClick={applyConfig}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#3b82f6",
              border: "none",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("apply")}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example Components
// ============================================================================

function TrackedButton({ id, children }: { id: string; children: React.ReactNode }) {
  const { ref } = useTrackComponent(id, {
    trackClicks: true,
    trackVisibility: true,
    trackHover: true,
    hoverThreshold: 500,
  });

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      style={{
        padding: "12px 24px",
        fontSize: "14px",
        fontWeight: 600,
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
    >
      {children}
    </button>
  );
}

function BuggyComponent({ shouldError }: { shouldError: boolean }) {
  if (shouldError) {
    throw new Error("This is a test error for demonstrating error tracking!");
  }
  return (
    <div style={{ padding: "16px", backgroundColor: "#22c55e20", borderRadius: "8px" }}>
      Component rendered successfully
    </div>
  );
}

function LongContent() {
  const t = useTranslations("demo");
  useTrackScroll({
    pageId: "/example",
    thresholds: [25, 50, 75, 100],
  });

  return (
    <div style={{ marginTop: "24px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            padding: "40px",
            marginBottom: "16px",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            border: "1px solid #334155",
          }}
        >
          <h4 style={{ marginBottom: "8px" }}>{t("scrollSection")} {i}</h4>
          <p style={{ color: "#64748b" }}>
            {t("scrollSectionDesc").replace("{n}", String(i))}
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Main Content
// ============================================================================

function MainContent() {
  const t = useTranslations("demo");
  const [showError, setShowError] = useState(false);
  const [componentId, setComponentId] = useState("");

  return (
    <div style={{ flex: 6, padding: "32px 0" }}>
      {/* Header */}
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
          {t("title")}
        </h1>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          {t("subtitle")}
        </p>
        <ConfigPanel config={CONFIG} />
      </header>

      {/* Section 1: M0rphicComponent */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          {t("section1Title")}
        </h2>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          {t("section1Desc")}
        </p>

        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder={t("componentIdPlaceholder")}
            value={componentId}
            onChange={(e) => setComponentId(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "14px",
            }}
          />
        </div>

        {componentId ? (
          <div
            style={{
              padding: "24px",
              backgroundColor: "#1e293b",
              borderRadius: "8px",
              border: "1px solid #334155",
            }}
          >
            <M0rphicComponent
              componentId={componentId}
              data={{
                title: "Example Product",
                price: "$99.99",
                description: "This is dynamic data passed to the component",
              }}
              handlers={{
                onBuyClick: () => alert("Buy clicked! (submit event tracked)"),
                onAddToCart: () => alert("Add to cart clicked! (submit event tracked)"),
              }}
              fallback={<div style={{ color: "#64748b" }}>Loading component...</div>}
            />
          </div>
        ) : (
          <div
            style={{
              padding: "24px",
              backgroundColor: "#1e293b",
              borderRadius: "8px",
              border: "1px dashed #334155",
              color: "#64748b",
              textAlign: "center",
            }}
          >
            {t("noComponentId")}
          </div>
        )}
      </section>

      {/* Section 2: Manual Tracking */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          {t("section2Title")}
        </h2>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          {t("section2Desc")}
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <TrackedButton id="btn-primary">{t("trackedButton")}</TrackedButton>
          <TrackedButton id="btn-secondary">{t("trackedButton")}</TrackedButton>
        </div>
      </section>

      {/* Section 3: Error Tracking */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          {t("section3Title")}
        </h2>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          {t("section3Desc")}
        </p>

        <button
          onClick={() => setShowError(!showError)}
          style={{
            padding: "12px 24px",
            fontSize: "14px",
            backgroundColor: showError ? "#22c55e" : "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          {showError ? t("resetError") : t("triggerError")}
        </button>

        <M0rphicErrorBoundary
          appId={CONFIG.appId}
          apiEndpoint={CONFIG.apiEndpoint}
          userId={CONFIG.userId}
          componentId="buggy-component"
          pageId="/example"
          fallback={(error, reset) => (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#ef444420",
                borderRadius: "8px",
                border: "1px solid #ef4444",
              }}
            >
              <p style={{ color: "#ef4444", marginBottom: "8px" }}>
                Error caught and tracked!
              </p>
              <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>
                {error.message}
              </p>
              <button
                onClick={() => {
                  setShowError(false);
                  reset();
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {t("resetError")}
              </button>
            </div>
          )}
        >
          <BuggyComponent shouldError={showError} />
        </M0rphicErrorBoundary>
      </section>

      {/* Section 4: Scroll Tracking */}
      <section>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          {t("section4Title")}
        </h2>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          {t("section4Desc")}
        </p>
        <LongContent />
      </section>
    </div>
  );
}

// ============================================================================
// App Root
// ============================================================================

export default function App() {
  return (
    <I18nProvider>
      <M0rphicProvider
        appId={CONFIG.appId}
        userId={CONFIG.userId}
        apiEndpoint={CONFIG.apiEndpoint}
      >
        <div style={{ minHeight: "100vh", paddingTop: "80px" }}>
          <Navbar />
          <div
            style={{
              display: "flex",
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 24px",
              gap: "24px",
            }}
          >
            <MainContent />
            <EventDebugPanel apiEndpoint={CONFIG.apiEndpoint} appId={CONFIG.appId} />
          </div>
        </div>
      </M0rphicProvider>
    </I18nProvider>
  );
}
