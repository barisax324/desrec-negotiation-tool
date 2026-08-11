import ComparisonPage from "../../../Comparison/ComparisonPage";

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