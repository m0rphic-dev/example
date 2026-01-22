/**
 * Event Debug Panel
 *
 * Displays real-time events being sent to the m0rphic server.
 * Connects via Server-Sent Events (SSE) to the debug stream endpoint.
 *
 * This component is for development/debugging only.
 */

import { useEffect, useState, useRef } from "react";

interface Event {
  eventId: string;
  type: string;
  componentId: string;
  pageId: string;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

const EVENT_COLORS: Record<string, string> = {
  click: "#3b82f6",      // blue
  view: "#22c55e",       // green
  hover: "#eab308",      // yellow
  scroll: "#a855f7",     // purple
  submit: "#06b6d4",     // cyan
  error: "#ef4444",      // red
  session_start: "#10b981", // emerald
  session_end: "#f97316",   // orange
};

interface EventDebugPanelProps {
  apiEndpoint: string;
  appId: string;
}

export function EventDebugPanel({ apiEndpoint, appId }: EventDebugPanelProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Connect to SSE stream on server (not dashboard)
  // Requires E2E_TEST_MODE=true on server for e2e-test-* app IDs
  useEffect(() => {
    // Pass appId as query param since EventSource doesn't support custom headers
    const streamUrl = `${apiEndpoint}/api/v1/events/stream?appId=${encodeURIComponent(appId)}`;

    try {
      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setConnected(true);
        setError(null);
      };

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          // Handle both formats: { type: "events", events: [...] } and { type: "event", event: {...} }
          if (data.type === "events" && Array.isArray(data.events)) {
            setEvents((prev) => [...data.events.reverse(), ...prev].slice(0, 100));
          } else if (data.type === "event" && data.event) {
            setEvents((prev) => [data.event, ...prev].slice(0, 100));
          }
          // Ignore "connected" messages
        } catch {
          // Ignore parse errors
        }
      };

      eventSource.onerror = () => {
        setConnected(false);
        setError("Connection lost. Retrying...");
      };

      return () => {
        eventSource.close();
      };
    } catch {
      setError("Failed to connect to event stream");
    }
  }, [apiEndpoint, appId]);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [events.length]);

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const clearEvents = () => setEvents([]);

  return (
    <div
      style={{
        flex: 4,
        minWidth: "320px",
        maxWidth: "480px",
        backgroundColor: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        position: "sticky",
        top: "96px",
        marginTop: "32px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: connected ? "#22c55e" : "#ef4444",
            }}
          />
          <span style={{ fontWeight: 600, fontSize: "14px" }}>Event Stream</span>
        </div>
        <button
          onClick={clearEvents}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            backgroundColor: "#1e293b",
            color: "#94a3b8",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {/* Connection Status */}
      {error && (
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef444420",
            color: "#f87171",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      {/* Event Count by Type */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {Object.entries(
          events.reduce((acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([type, count]) => (
          <span
            key={type}
            style={{
              padding: "2px 8px",
              fontSize: "11px",
              backgroundColor: EVENT_COLORS[type] + "20",
              color: EVENT_COLORS[type],
              borderRadius: "4px",
            }}
          >
            {type}: {count}
          </span>
        ))}
        {events.length === 0 && (
          <span style={{ color: "#64748b", fontSize: "12px" }}>
            Waiting for events...
          </span>
        )}
      </div>

      {/* Event List */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflow: "auto",
          padding: "8px",
        }}
      >
        {events.map((event) => (
          <div
            key={event.eventId}
            style={{
              padding: "10px 12px",
              marginBottom: "4px",
              backgroundColor: "#1e293b",
              borderRadius: "6px",
              borderLeft: `3px solid ${EVENT_COLORS[event.type] || "#64748b"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: EVENT_COLORS[event.type] || "#e2e8f0",
                }}
              >
                {event.type}
              </span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                {formatTime(event.timestamp)}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              {event.componentId}
            </div>
            {event.metadata && Object.keys(event.metadata).length > 0 && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "6px 8px",
                  backgroundColor: "#0f172a",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "#64748b",
                  wordBreak: "break-all",
                }}
              >
                {JSON.stringify(event.metadata)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #1e293b",
          fontSize: "11px",
          color: "#64748b",
        }}
      >
        <div>Total: {events.length} events</div>
        <div style={{ marginTop: "4px" }}>
          Stream: {apiEndpoint}/api/v1/events/stream
        </div>
      </div>
    </div>
  );
}
