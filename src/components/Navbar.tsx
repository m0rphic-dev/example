import { useState } from "react";
import { useI18n, useTranslations, Locale } from "../i18n";

const BASE_URL = "https://m0rphic.dev";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
  ja: "日本語",
};

function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "6px 12px",
          backgroundColor: "transparent",
          border: "1px solid #334155",
          borderRadius: "6px",
          color: "#94a3b8",
          fontSize: "13px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {localeLabels[locale]}
        <span style={{ fontSize: "10px" }}>▼</span>
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "6px",
            overflow: "hidden",
            minWidth: "80px",
            zIndex: 100,
          }}
        >
          {(["en", "zh", "ja"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setIsOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                backgroundColor: locale === l ? "#334155" : "transparent",
                border: "none",
                color: locale === l ? "#fff" : "#94a3b8",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={BASE_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: "monospace",
        fontWeight: 600,
        fontSize: "20px",
        color: "#fff",
        textDecoration: "none",
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Static version for layout */}
      <span style={{ visibility: "hidden" }}>m0rphic</span>

      {/* Animated overlay */}
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
        <span>m</span>
        <span style={{ position: "relative", display: "inline-block", width: "0.62em", textAlign: "center" }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
              opacity: isHovered ? 0 : 1,
              transform: isHovered ? "scale(0.5) rotate(90deg)" : "scale(1) rotate(0deg)",
            }}
          >
            0
          </span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)",
            }}
          >
            o
          </span>
        </span>
        <span>rphic</span>
      </span>
    </a>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("features"), href: `${BASE_URL}/#features` },
    { name: t("docs"), href: `${BASE_URL}/docs` },
    { name: t("examples"), href: `${BASE_URL}/docs/examples`, active: true },
  ];

  const navLinkStyle = {
    fontSize: "14px",
    color: "#94a3b8",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    transition: "color 0.2s, background-color 0.2s",
  };

  const navLinkActiveStyle = {
    ...navLinkStyle,
    color: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        right: "16px",
        zIndex: 50,
      }}
    >
      <nav
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "12px 24px",
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div style={{ flex: 1 }}>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          className="desktop-nav"
        >
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={item.active ? navLinkActiveStyle : navLinkStyle}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
          <LocaleSwitcher />
          <a
            href="https://github.com/m0rphic-dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href={`${BASE_URL}/login`}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "8px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            {t("dashboard")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            padding: "8px",
            backgroundColor: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          style={{
            maxWidth: "1400px",
            margin: "8px auto 0",
            padding: "16px",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  padding: "12px",
                  color: item.active ? "#3b82f6" : "#94a3b8",
                  textDecoration: "none",
                  borderRadius: "6px",
                  backgroundColor: item.active ? "rgba(59, 130, 246, 0.1)" : "transparent",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <hr style={{ border: "none", borderTop: "1px solid #334155", margin: "8px 0" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <LocaleSwitcher />
              <a
                href={`${BASE_URL}/login`}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                {t("dashboard")}
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
