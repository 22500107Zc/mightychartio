export const ApprovalBanner = () => {
  return (
    <div className="w-full overflow-hidden py-4 bg-background/50 backdrop-blur-sm border-b border-border">
      <div className="animate-scroll-left whitespace-nowrap inline-flex">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="inline-flex items-center gap-4 mx-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 via-white to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-sm">🇺🇸</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                Now approved to operate in USA jurisdiction — North American approval in the works
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
