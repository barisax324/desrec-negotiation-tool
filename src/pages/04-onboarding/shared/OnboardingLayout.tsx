import type { ReactNode } from "react";
import "./OnboardingLayout.css";
import PageLayout from "../../../shared/ui/page-layout";
import ProgressBar from "../../../shared/ui/progress-bar";

interface OnboardingLayoutProps {
  title: string;
  subtitle?: string;
  progress: number;
  children: ReactNode;
}

function OnboardingLayout({
  title,
  subtitle,
  progress,
  children,
}: OnboardingLayoutProps) {
  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      footer={
        <ProgressBar
          value={progress}
          label="Getting Started"
        />
      }
    >
      {children}
    </PageLayout>
  );
}

export default OnboardingLayout;