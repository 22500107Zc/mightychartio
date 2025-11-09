import { useEffect, useState } from "react";

const tradingQuotes = [
  { text: "The market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
  { text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
  { text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher" },
  { text: "In investing, what is comfortable is rarely profitable.", author: "Robert Arnott" },
  { text: "The four most dangerous words in investing are: 'this time it's different.'", author: "Sir John Templeton" },
  { text: "Markets can remain irrational longer than you can remain solvent.", author: "John Maynard Keynes" },
  { text: "The trend is your friend until the end when it bends.", author: "Ed Seykota" },
  { text: "Plan your trade and trade your plan.", author: "Trading Wisdom" },
  { text: "Cut your losses short and let your winners run.", author: "Trading Principle" },
  { text: "The goal of a successful trader is to make the best trades. Money is secondary.", author: "Alexander Elder" },
  { text: "Don't focus on making money; focus on protecting what you have.", author: "Paul Tudor Jones" },
  { text: "The hard part about trading is that the enemy is within.", author: "Unknown" },
  { text: "Opportunities come infrequently. When it rains gold, put out the bucket, not the thimble.", author: "Warren Buffett" },
  { text: "The key to trading success is emotional discipline.", author: "Victor Sperandeo" },
  { text: "Trading is not about being right or wrong; it's about how much you make when you're right and how much you lose when you're wrong.", author: "George Soros" },
  { text: "Patterns repeat because human nature hasn't changed for thousands of years.", author: "Jesse Livermore" },
  { text: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.", author: "George Soros" },
  { text: "Time is your friend; impulse is your enemy.", author: "John Bogle" },
  { text: "The market is never wrong, but opinions often are.", author: "Jesse Livermore" },
  { text: "Successful trading is about consistently managing risk, not about making profits.", author: "Trading Wisdom" },
  { text: "Buy the rumor, sell the news.", author: "Wall Street Adage" },
  { text: "Never invest in a business you cannot understand.", author: "Warren Buffett" },
  { text: "The best trades are the ones in which you have all three things going for you: fundamentals, technicals, and market tone.", author: "Alexander Elder" },
  { text: "Lose your opinion, not your money.", author: "Trading Principle" },
  { text: "You don't need to be a rocket scientist. Investing is not a game where the guy with the 160 IQ beats the guy with 130 IQ.", author: "Warren Buffett" },
];

export const TrustSignals = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % tradingQuotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentQuote = tradingQuotes[currentQuoteIndex];

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Built by Traders, for Traders
          </h3>
          <p className="text-lg text-muted-foreground">
            A solo founder's vision to democratize technical analysis with AI
          </p>
        </div>

        <div className="text-center space-y-8 animate-fade-in">
          <div className="min-h-[120px] flex items-center justify-center">
            <div key={currentQuoteIndex} className="animate-fade-in">
              <p className="text-xl md:text-2xl italic text-foreground mb-4">
                "{currentQuote.text}"
              </p>
              <p className="text-base text-muted-foreground">
                — {currentQuote.author}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-4 text-sm text-muted-foreground">
            <div>🚀 Early Stage Startup</div>
            <div>🔒 Privacy Focused</div>
            <div>⚡ AI-Powered Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
};
