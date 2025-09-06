export default function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-pulse-slow">
          <i className="fas fa-magic text-white text-xl animate-spin"></i>
        </div>
        <h3 className="text-2xl font-semibold text-foreground">Creating Your Logos</h3>
        <p className="text-muted-foreground">Our AI is working its magic to create unique designs for your brand...</p>
        
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full shimmer-effect" style={{ width: '65%' }}></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg h-32 shimmer-effect"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
