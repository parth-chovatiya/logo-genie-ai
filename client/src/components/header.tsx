export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <i className="fas fa-magic text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-foreground">LogoAI</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors font-medium">
            Sign In
          </button>
        </nav>
        
        <button className="md:hidden text-muted-foreground">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
}
