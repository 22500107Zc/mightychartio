import { Shield, Lock, Zap, Users, TrendingUp, Award } from "lucide-react";

export const TrustSignals = () => {
  return (
    <section className="py-16 px-4 md:px-6 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Trusted Platform Features
          </h3>
          <p className="text-muted-foreground">
            Built with security, speed, and accuracy in mind
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="font-semibold text-sm">Bank-Grade</div>
            <div className="text-xs text-muted-foreground">Security</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div className="font-semibold text-sm">256-bit</div>
            <div className="text-xs text-muted-foreground">Encryption</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div className="font-semibold text-sm">8 Second</div>
            <div className="text-xs text-muted-foreground">Analysis</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="font-semibold text-sm">44,000+</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="font-semibold text-sm">89% Success</div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="font-semibold text-sm">ISO Certified</div>
            <div className="text-xs text-muted-foreground">Platform</div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>As used in Australia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Trusted across Eurasia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Featured in Trading Communities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
