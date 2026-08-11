import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import Badge from "../badge";
import "./PageLayout.css";

type ParticipantRole = "A" | "B";

interface PageLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  participantRole?: ParticipantRole;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

function PageLayout({
  title,
  subtitle,
  participantRole,
  headerActions,
  footer,
  className = "",
  children,
  ...props
}: PageLayoutProps) {
  const pageClasses = [
    "desrec-page",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={pageClasses}
      {...props}
    >
      <header className="desrec-page-header">
        <div className="desrec-page-header-inner">
          <a
            href="/"
            className="desrec-page-brand"
            aria-label="DesREC Negotiation Tool home"
          >
            <span className="desrec-page-brand-name">
              DesREC
            </span>

            <span className="desrec-page-brand-label">
              Negotiation Tool
            </span>
          </a>

          {(participantRole || headerActions) && (
            <div className="desrec-page-header-actions">
              {participantRole && (
                <Badge
                  variant={
                    participantRole === "A"
                      ? "primary"
                      : "secondary"
                  }
                >
                  Participant {participantRole}
                </Badge>
              )}

              {headerActions}
            </div>
          )}
        </div>
      </header>

      <main className="desrec-page-main">
        <div className="desrec-page-content">
          {(title || subtitle) && (
            <div className="desrec-page-introduction">
              {title && (
                <h1 className="desrec-page-title">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="desrec-page-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </main>

      <footer className="desrec-page-footer">
        <div className="desrec-page-footer-inner">
          {footer ?? (
            <p>
              DesREC cannot view your private negotiation responses.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

export default PageLayout;