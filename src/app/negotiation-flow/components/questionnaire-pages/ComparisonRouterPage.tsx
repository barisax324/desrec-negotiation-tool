import ComparisonPage from "@/pages/06-results/02-comparison";

interface ComparisonRouterPageProps {
  recoveryCredential: string;
  onBackToSummary: () => void;
}

function ComparisonRouterPage({
  recoveryCredential,
  onBackToSummary,
}: ComparisonRouterPageProps) {
  return (
    <ComparisonPage
      recoveryToken={recoveryCredential}
      onBackToSummary={onBackToSummary}
    />
  );
}

export default ComparisonRouterPage;