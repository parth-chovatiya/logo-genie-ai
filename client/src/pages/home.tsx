import { useState } from "react";
import HeroForm from "../components/hero-form";
import LoadingState from "../components/loading-state";
import LogoGrid from "../components/logo-grid";
import ErrorState from "../components/error-state";
import { GeneratedLogo } from "@shared/schema";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [error, setError] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const handleGenerateLogos = async (logos: GeneratedLogo[]) => {
    setGeneratedLogos(logos);
    setShowResults(true);
    setError("");
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {!isLoading && !showResults && !error && (
          <HeroForm
            onGenerate={handleGenerateLogos}
            onLoading={setIsLoading}
            onError={handleError}
          />
        )}

        {isLoading && <LoadingState />}

        {showResults && generatedLogos.length > 0 && (
          <LogoGrid
            logos={generatedLogos}
            onGenerateMore={handleGenerateMore}
          />
        )}

        {error && <ErrorState message={error} onRetry={handleRetry} />}
      </main>
    </div>
  );
};

export default Home;
