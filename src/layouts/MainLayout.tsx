import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          marginBottom: "2rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "1rem",
        }}
      >
        <h1>DesREC Negotiation Tool</h1>
      </header>

      <main>{children}</main>

      <footer
        style={{
          marginTop: "3rem",
          borderTop: "1px solid #ddd",
          paddingTop: "1rem",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        Desert Rope Education Collective
      </footer>
    </div>
  );
}

export default MainLayout;