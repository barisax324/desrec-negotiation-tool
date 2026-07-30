import type { ReactNode } from "react";
import "./OnboardingLayout.css";
import PageLayout from "../../ui/PageLayout";
import ProgressBar from "../../ui/ProgressBar";

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