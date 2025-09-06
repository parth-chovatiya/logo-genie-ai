import { useState } from "react";
import Header from "../components/header";
import HeroForm from "../components/hero-form";
import LoadingState from "../components/loading-state";
import LogoGrid from "../components/logo-grid";
import ErrorState from "../components/error-state";
import { GeneratedLogo } from "@shared/schema";

export default function Home() {
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
      <Header />
      
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

        {error && (
          <ErrorState 
            message={error}
            onRetry={handleRetry}
          />
        )}
      </main>

      <footer className="border-t border-border bg-card mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <i className="fas fa-magic text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-foreground">LogoAI</h1>
            </div>
            <p className="text-muted-foreground max-w-md">
              Create professional logos with AI-powered design technology. Perfect for Figma, websites, and print.
            </p>
            <div className="border-t border-border w-full max-w-md pt-6">
              <p className="text-muted-foreground">&copy; 2024 LogoAI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
