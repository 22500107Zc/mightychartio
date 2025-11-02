import { Button } from "@/components/ui/button";
import { TrendingUp, LogOut, Settings as SettingsIcon, Menu, X, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out."
    });
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">MightyChart.io</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/analyze" className="text-sm hover:text-primary transition-colors">
                  Analyze
                </Link>
                <Link to="/trade-management" className="text-sm hover:text-primary transition-colors">
                  Manage Trades
                </Link>
                <Link to="/pricing" className="text-sm hover:text-primary transition-colors">
                  Pricing
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Resources
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background">
                    <DropdownMenuItem asChild>
                      <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        TradingView
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://www.tradingview.com/pine-script-docs/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Pine Script Docs
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background">
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/#features" className="text-sm hover:text-primary transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="text-sm hover:text-primary transition-colors">
                  Pricing
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/analyze" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Analyze
                    </Link>
                    <Link to="/trade-management" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Manage Trades
                    </Link>
                    <Link to="/pricing" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Pricing
                    </Link>
                    <Link to="/settings" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Settings
                    </Link>
                    <Link to="/admin" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Admin Panel
                    </Link>
                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Resources</p>
                      <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors flex items-center gap-2 mb-2">
                        <ExternalLink className="h-4 w-4" />
                        TradingView
                      </a>
                      <a href="https://www.tradingview.com/pine-script-docs/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors flex items-center gap-2 mb-2">
                        <ExternalLink className="h-4 w-4" />
                        Pine Script Docs
                      </a>
                    </div>
                    <Button onClick={handleSignOut} variant="outline" className="mt-4">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/#features" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Features
                    </Link>
                    <Link to="/pricing" className="text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Pricing
                    </Link>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 w-full">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
