export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <i className="fas fa-magic text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-foreground">LogoAI</h1>
        </div>
      </div>
    </header>
  );
}
