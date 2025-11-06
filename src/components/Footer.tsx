import { Link } from "react-router-dom";
import logo from "@/assets/mightychart-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-card/80 backdrop-blur-lg border-t border-border py-8 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="MightyChart.io" className="w-6 h-6" />
            <span className="text-xl font-bold">MightyChart.io</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/analyze" className="text-muted-foreground hover:text-foreground transition-colors">
              Analyze
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/tips" className="text-muted-foreground hover:text-foreground transition-colors">
              Tips & Tricks
            </Link>
            <Link to="/feedback" className="text-muted-foreground hover:text-foreground transition-colors">
              Feedback
            </Link>
            <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
              Disclaimer
            </Link>
          </nav>
          
          <div className="text-sm text-muted-foreground">
            © 2024 MightyChart.io. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
