import { ImageResponse } from "next/og";

// Branded social card, generated to a static PNG at build time (works with
// output: "export"). Also used by Twitter/X as the og:image fallback.
export const dynamic = "force-static";
export const alt =
  "InnoCooks · Websites, Internal Systems & AI Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#121112",
          padding: "64px 72px",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* kinetic top rail */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            backgroundColor: "#c45b35",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#918b8c",
          }}
        >
          SYSTEMS STUDIO // COOKING INNOVATION
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            <span>INNO</span>
            <span style={{ color: "#c45b35" }}>COOKS</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              marginTop: 28,
              color: "#e6e1e2",
              maxWidth: 920,
              lineHeight: 1.25,
            }}
          >
            Websites, internal systems &amp; AI automation your business runs on.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#918b8c",
          }}
        >
          <span>innocooks.com</span>
          <span style={{ color: "#c45b35" }}>///</span>
        </div>
      </div>
    ),
    size
  );
}
