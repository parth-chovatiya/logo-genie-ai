import { useState } from "react";
import Header from "../components/header";
import HeroForm from "../components/hero-form";
import LoadingState from "../components/loading-state";
import LogoGrid from "../components/logo-grid";
import ErrorState from "../components/error-state";
import HistoryPanel from "../components/history-panel";
import { useLogoHistory, type HistoryEntry } from "@/hooks/use-logo-history";
import {
  GeneratedLogo,
  LogoGenerationRequest,
} from "@shared/schema";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [request, setRequest] = useState<LogoGenerationRequest | null>(null);
  const [error, setError] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { history, addEntry, removeEntry, clearHistory } = useLogoHistory();

  const handleGenerateLogos = (
    logos: GeneratedLogo[],
    req: LogoGenerationRequest,
  ) => {
    setGeneratedLogos(logos);
    setRequest(req);
    setShowResults(true);
    setShowHistory(false);
    setError("");
    addEntry(req, logos);
  };

  const handleReplaceLogo = (oldId: string, updated: GeneratedLogo) => {
    setGeneratedLogos((prev) =>
      prev.map((logo) => (logo.id === oldId ? updated : logo)),
    );
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    setShowResults(false);
  };

  const handleRetry = () => {
    setError("");
    setShowResults(false);
    setIsLoading(false);
  };

  const handleGenerateMore = () => {
    setShowResults(false);
    setGeneratedLogos([]);
    setError("");
  };

  const handleRestore = (entry: HistoryEntry) => {
    setGeneratedLogos(entry.logos);
    setRequest(entry.request);
    setShowResults(true);
    setShowHistory(false);
    setError("");
    setIsLoading(false);
  };

  const showForm =
    !isLoading && !showResults && !error && !showHistory;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onToggleHistory={() => setShowHistory((v) => !v)}
        historyCount={history.length}
      />
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        {showHistory && (
          <HistoryPanel
            history={history}
            onRestore={handleRestore}
            onRemove={removeEntry}
            onClear={clearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}

        {!showHistory && showForm && (
          <HeroForm
            onGenerate={handleGenerateLogos}
            onLoading={setIsLoading}
            onError={handleError}
          />
        )}

        {!showHistory && isLoading && <LoadingState />}

        {!showHistory && showResults && generatedLogos.length > 0 && (
          <LogoGrid
            logos={generatedLogos}
            request={request}
            onGenerateMore={handleGenerateMore}
            onReplaceLogo={handleReplaceLogo}
          />
        )}

        {!showHistory && error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}
      </main>
    </div>
  );
};

export default Home;
