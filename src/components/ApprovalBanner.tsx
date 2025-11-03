export const ApprovalBanner = () => {
  return (
    <div className="bg-primary/10 border-y border-primary/20 py-3 overflow-hidden relative">
      <div className="animate-scroll-left whitespace-nowrap flex items-center gap-8">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-semibold">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-white to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-base">🇺🇸</span>
            </div>
            <span className="text-foreground">
              Now approved to operate in USA jurisdiction
            </span>
            <span className="text-muted-foreground mx-2">•</span>
            <span className="text-foreground/80">
              North American approval in the works
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
