# MightyChart.io - Complete Application Build Prompt

## Project Overview
Build a complete AI-powered trading chart analysis web application called **MightyChart.io** using React, TypeScript, Vite, Tailwind CSS, Supabase backend, and Stripe payments integration.

## Core Technology Stack
- **Frontend**: React 18.3, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system (HSL colors only), Shadcn UI components
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query, React Hooks
- **Backend**: Supabase (database, auth, edge functions, storage)
- **Payments**: Stripe integration with subscriptions
- **AI**: Lovable AI Gateway (Google Gemini Pro for vision analysis)
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toasts

---

## Design System (CRITICAL)

### Color Palette (All HSL - NEVER use direct colors like bg-white, text-black)
```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 240 10% 4%;
--card: 0 0% 100%;
--card-foreground: 240 10% 4%;
--primary: 280 80% 60%; (Purple)
--primary-foreground: 210 40% 98%;
--primary-glow: 280 80% 70%;
--secondary: 320 80% 60%; (Pink)
--secondary-foreground: 210 40% 98%;
--accent: 180 80% 55%; (Cyan/Teal)
--accent-foreground: 240 10% 4%;
--success: 180 80% 55%;
--destructive: 0 84% 60%; (Red)
--muted: 240 5% 96%;
--muted-foreground: 215 20% 40%;
--border: 240 5% 90%;
--input: 240 5% 90%;
--ring: 280 80% 60%;

/* Dark Mode */
--background: 240 10% 4%;
--foreground: 210 40% 98%;
--card: 240 8% 8%;
/* ... (same pattern for dark mode) */
```

### Visual Effects
- **Purple Overlay Animation**: Fixed purple radial gradient that floats across the page (20s animation)
- **Shadow Effects**: `--shadow-glow` and `--shadow-accent` for glowing effects
- **Backdrop Blur**: Cards use `bg-card/50 backdrop-blur-sm` for glassmorphism
- **Hover Effects**: Borders glow `hover:border-primary/50`, buttons get `hover:shadow-glow`

---

## Application Structure

### Routes (src/App.tsx)
1. `/` - Landing page (Index)
2. `/analyze` - Chart analysis page (requires auth)
3. `/auth` - Sign in/sign up page
4. `/dashboard` - User dashboard (requires auth)
5. `/settings` - User settings (requires auth)
6. `/admin` - Admin panel (requires admin role)
7. `/trades` or `/trade-management` - Trade management (requires auth)
8. `/pricing` - Pricing plans page
9. `/disclaimer` - Legal disclaimer
10. `/tips` - Tips & tricks page
11. `*` - 404 Not Found page

### Core Hooks

#### useAuth.tsx
Manages authentication state:
- `user` - Current user object
- `session` - Current session
- `loading` - Auth loading state
- `signUp(email, password)` - Create account
- `signIn(email, password)` - Sign in
- `signOut()` - Sign out
Uses Supabase auth with localStorage persistence.

#### useSubscription.tsx
Manages subscription state and Stripe integration:
- `subscriptionStatus` - Object with: subscribed, product_id, subscription_end, generations_used, generations_limit, generations_remaining
- `loading` - Loading state
- `error` - Error state
- `checkSubscription()` - Fetches subscription status
- `createCheckout(priceId)` - Creates Stripe checkout session
- `openCustomerPortal()` - Opens Stripe customer portal
- `incrementGenerationUsage()` - Increments usage count
- `canGenerate` - Boolean if user can generate
- `currentTier` - Current subscription tier object

**Subscription Tiers**:
```javascript
{
  Starter: { price: 44, generations: 11, priceId: "price_1SP9GjLs7KD65wZP1vT5W67z", productId: "prod_TLqylNH5iKw3C4" },
  Pro: { price: 77, generations: 33, priceId: "price_1SP9GwLs7KD65wZPiuSlXtBV", productId: "prod_TLqyJvYY90VT8V" },
  Premium: { price: 144, generations: 77, priceId: "price_1SP9HILs7KD65wZPRUZaiGj8", productId: "prod_TLqzRF5osRMCCg" },
  Elite: { price: 255, generations: 133, priceId: "price_1SP9HdLs7KD65wZPt1FdSy9Q", productId: "prod_TLqzip2WAay0tq" }
}
```

**Owner Account**: Email `culpindustriesllc@gmail.com` gets unlimited access with special "Owner Account" badge.

---

## Page Details

### 1. Landing Page (/)
**Components**:
- Navbar (responsive with mobile menu)
- ApprovalBanner (if applicable)
- Hero section with:
  - Large heading: "Trade with AI precision not gut feelings"
  - Subheading about instant AI analysis
  - Three stats: 89% Pattern Accuracy, 8sec Analysis Speed, 44,000+ Active Traders
  - CTAs: "Start Analyzing" (→ /analyze), "View Pricing" (→ /pricing)
- TrustSignals section
- Features section with 5 feature cards:
  1. AI Trade Analysis
  2. Scalp Trading Analysis
  3. Price Action Analysis
  4. Risk Management
  5. Swing Trading Analysis
- ExampleAnalysis section
- Comparison section
- Testimonials section
- Footer with links

### 2. Analyze Page (/analyze)
**Key Features**:
- Auth required (redirects to /auth if not logged in)
- Multi-image upload (max 8 images)
- Trading strategy selector (6 options):
  1. Scalping (1-5m charts)
  2. Day Trading (Intraday)
  3. Swing Trading (Multi-day)
  4. Position Trading (Long-term)
  5. Momentum Trading (Breakouts)
  6. Counter-Trend (Reversals)
- Trade size selector (4 options):
  1. Small (Conservative)
  2. Medium (Balanced)
  3. Big (Larger position)
  4. Massive (Maximum size)
- Subscription status card showing:
  - Current plan
  - Generations used/limit/remaining
  - Low generation warning if ≤3 remaining
- Upload area with drag-and-drop
- Image preview grid (2x4 on mobile, 4x2 on desktop)
- Loading state with spinner and "Generating analysis..." message
- Analysis results with comprehensive sections:
  - Pattern detected (gradient card)
  - AI Recommendation (BUY/SELL badge with reasoning)
  - Not Optimal warning (if optimalEntry is false)
  - Wait condition (if present)
  - Trading setup: Leverage, Risk %, Entry, Stop Loss, Take Profit
  - Trade probability (large percentage)
  - Technical sentiment overview
  - Future implications
  - Market structure & price action
  - Chart status (Trend, Momentum, Volume)
  - Key observations list
  - Analysis confidence (large percentage)
  - "Clear" button to reset
  - "Analyze Another Set" button

**Flow**:
1. User selects strategy and trade size
2. Uploads 1-8 chart screenshots (validates image type)
3. Checks if user can generate (subscription active and generations remaining)
4. Converts images to base64
5. Calls `analyze-chart` edge function with images array, strategy, tradeSize
6. Increments generation usage
7. Displays comprehensive analysis results
8. User can save trade to database or clear and analyze another

### 3. Auth Page (/auth)
**Features**:
- Centered card with MightyChart.io branding
- Tabs: Sign In | Sign Up
- **Sign In**:
  - Email input (validated with Zod email schema)
  - Password input
  - "Sign in" button
- **Sign Up**:
  - Email input (validated with Zod email schema)
  - Password input with validation:
    - Min 8 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 number
    - At least 1 special character
  - "Sign Up" button
- Auto-confirms email signups (configured in Supabase auth)
- Redirects to /dashboard on successful auth
- Shows error toasts for validation failures

### 4. Dashboard (/dashboard)
**Features**:
- Welcome message with user's display name (fetched from profiles table, defaults to "trader")
- Subscription Status Card:
  - Current plan (shows "Owner Account" for special email)
  - Generations used/limit/remaining with visual indicators
  - Next billing date
  - Low generation warning if ≤3 remaining
  - "Manage Subscription" button (opens Stripe customer portal)
  - "View Subscription Plans" button if no subscription
- Analyze Charts Card:
  - Table of all user's trades:
    - Date, Strategy, Entry, SL, TP, P&L, Status, Actions
    - Status badges: Pending (outline), Win (green), Loss (red)
    - Actions: Mark as Win ✓, Mark as Loss ✗, Delete 🗑️
  - Empty state: "No trades yet. Start by analyzing a chart!"
- Trading Insight Card:
  - Warren Buffett quote
  - Disclaimer reminder
  - "Read Full Disclaimer" button

### 5. Settings (/settings)
**Features**:
- Profile Card:
  - Email (disabled input, shows current user email)
  - Display Name (editable, validated with Zod):
    - 1-50 characters
    - Only letters, numbers, spaces, hyphens, underscores, $€£¥*+
  - Language selector (English, Español)
- Appearance Card:
  - Theme selector (Light, Dark, System) with icons
- "Save Settings" button (updates profiles table)

### 6. Admin Panel (/admin)
**Features**:
- Checks admin role using `has_role` RPC function
- Access denied card if not admin
- Admin Stats Cards (3 cards):
  1. Total Users (from profiles table)
  2. Total Trades (from trades table)
  3. Average Win Rate (calculated from trades)
- Admin Actions Card:
  - Coming soon features
  - "Manage Users" button (placeholder)

### 7. Trade Management (/trades, /trade-management)
**Features**:
- "Back to Dashboard" button
- Pending Trades Card:
  - Count of trades with won=null
  - Table with: Date, Strategy, Entry, SL, TP, Expected P&L, Actions
  - Actions: "Win" button (green), "Loss" button (red)
  - Empty state: "No pending trades. All trades have been marked!"
- Updates trade.won field in database
- Refreshes trades after marking

### 8. Pricing Page (/pricing)
**Features**:
- Centered heading: "Choose Your Plan"
- Sort button (toggles price ascending/descending)
- 4 tier cards (Starter, Pro, Premium, Elite):
  - Elite card has "Most Purchased" badge
  - Current plan shows "Your Plan" badge
  - Each card shows:
    - Tier name
    - Description
    - Price/month
    - Generations per month
    - Price per generation
    - "Subscribe" button (or "Current Plan" if active)
  - Features list: AI chart analysis, Trade management, Pattern detection, Risk analysis
- Clicking Subscribe:
  - Redirects to /auth if not logged in
  - Creates Stripe checkout session via edge function
  - Opens checkout in new tab

### 9. Disclaimer Page (/disclaimer)
**Content Sections**:
1. Important Notice (red card): Trading risk warning
2. Understanding Our AI Analysis Tool: How AI provides positions but isn't financial advice
3. Market Volatility & Risk Factors: Lists 6 major risks
4. Proper Use of Our Platform: Best practices for multi-timeframe uploads with indicators
5. Limitation of Liability: Legal disclaimers
6. Your Responsibilities: User obligations
7. No Guarantee of Profits: Final warning

**Key Messages**:
- Upload 6-8 screenshots across multiple timeframes
- Always show Volume, RSI, KDJ, MACD indicators
- Alternate Bollinger Bands and Ichimoku Cloud
- More data = better accuracy
- AI is a confluence tool, not sole decision maker
- Past performance doesn't guarantee future results

### 10. Tips & Tricks Page (/tips)
**Sections**:
1. Multi-Timeframe Magnifying Glass Approach: How AI analyzes from high to low TF
2. Essential: Upload Multiple Timeframes: Works with any TF, explains why multiple TFs matter
3. Critical Indicators: What to Include:
   - Always visible: Volume, RSI, KDJ, MACD
   - Alternate: Bollinger Bands, Ichimoku Cloud, MA, EMA
4. Strategy Selection: Match Your Trading Style (4 strategies explained)
5. Maximize Your Edge: Upgrade Benefits:
   - More generations = more opportunities
   - Multi-position analysis
   - Backtesting power
   - Risk management
   - Market scanning
6. Advanced Tips for Power Users (5 tips)
7. Remember: AI Analysis is a Tool, Not a Crystal Ball

---

## Database Schema (Supabase)

### Tables

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  display_name TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Constraint for display_name validation
ALTER TABLE profiles ADD CONSTRAINT display_name_format CHECK (
  display_name IS NULL OR 
  (display_name ~ '^[a-zA-Z0-9\s\-_$€£¥*+]{1,50}$' AND length(trim(display_name)) > 0)
);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  product_id TEXT,
  subscription_end TIMESTAMPTZ,
  generations_used INTEGER DEFAULT 0,
  generations_limit INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### trades
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  entry_price DECIMAL(20, 8),
  stop_loss DECIMAL(20, 8),
  take_profit DECIMAL(20, 8),
  pnl DECIMAL(20, 8),
  won BOOLEAN,
  timeframe TEXT,
  strategy TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own trades" ON trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trades" ON trades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trades" ON trades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trades" ON trades FOR DELETE USING (auth.uid() = user_id);
```

#### user_roles
```sql
CREATE TYPE app_role AS ENUM ('admin', 'user');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
```

### Database Functions

#### has_role
```sql
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### update_updated_at_column
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Edge Functions (Supabase)

### 1. analyze-chart (supabase/functions/analyze-chart/index.ts)
**Purpose**: Analyzes trading charts using Google Gemini Pro vision AI.

**Request Body**:
```json
{
  "images": ["data:image/png;base64,...", "..."], // 1-8 base64 images
  "strategy": "scalping", // or day, swing, position, momentum, counter
  "tradeSize": "medium" // or small, big, massive
}
```

**Validation**:
- Max 8 images
- Max 5MB per image
- Must be base64 data URIs starting with `data:image/`
- Strategy must be in valid list
- Trade size must be in valid list

**AI System Prompt**: Uses TJR Method (institutional trading analysis):
1. Mark key levels (Daily/4H highs/lows priority)
2. Liquidity sweep sequence (equal highs/lows)
3. Order-flow shift confirmation (BOS/CHoCH)
4. Entry confluence zones (FVG, OB, Breaker Blocks)
5. Fibonacci 79% extension bias
6. Multi-timeframe priority (HTF bias first)

**AI Model**: `google/gemini-2.5-pro` via Lovable AI Gateway

**Response Format** (JSON):
```json
{
  "pattern": "Liquidity Sweep + FVG Retest",
  "recommendation": "BUY" | "SELL" | "WAIT",
  "reasoningShort": "Brief explanation",
  "entry": "$43,127.50",
  "stopLoss": "$42,980.00",
  "target": "$43,450.00",
  "targetGain": "+0.75%",
  "leverage": "3x",
  "riskPercent": "1.2%",
  "probability": "72%",
  "technicalSentiment": "Multi-timeframe analysis...",
  "futureImplications": "Next liquidity targets...",
  "marketStructure": "Detailed TJR breakdown...",
  "trend": "HTF Bullish",
  "momentum": "Strengthening",
  "volume": "Institutional",
  "optimalEntry": true,
  "waitCondition": "Specific criteria missing...",
  "riskFactors": ["Factor 1", "Factor 2"],
  "keyObservations": ["Obs 1", "Obs 2"],
  "confidence": "72%",
  "timeframe": "Entry: 15m | HTF Bias: 4H"
}
```

**Error Handling**:
- Validation errors return 400 with specific message
- Other errors return 500 with generic message
- All errors logged to console for debugging

### 2. check-subscription (supabase/functions/check-subscription/index.ts)
**Purpose**: Checks user's subscription status with Stripe.

**Special Cases**:
- Owner email (`culpindustriesllc@gmail.com`) gets unlimited access
- Returns subscription data from database
- Calculates remaining generations

**Response**:
```json
{
  "subscribed": true,
  "product_id": "prod_TLqzip2WAay0tq",
  "subscription_end": "2025-02-01T00:00:00Z",
  "generations_used": 45,
  "generations_limit": 133,
  "generations_remaining": 88
}
```

### 3. create-checkout (supabase/functions/create-checkout/index.ts)
**Purpose**: Creates Stripe checkout session for subscription.

**Request Body**:
```json
{
  "priceId": "price_1SP9HdLs7KD65wZPt1FdSy9Q"
}
```

**Response**:
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### 4. customer-portal (supabase/functions/customer-portal/index.ts)
**Purpose**: Creates Stripe customer portal session for managing subscription.

**Response**:
```json
{
  "url": "https://billing.stripe.com/..."
}
```

---

## Component Library (Shadcn UI)

### Installed Components
- Accordion, Alert Dialog, Alert, Aspect Ratio, Avatar
- Badge, Breadcrumb, Button, Calendar, Card
- Carousel, Chart, Checkbox, Collapsible, Command
- Context Menu, Dialog, Drawer, Dropdown Menu
- Form, Hover Card, Input OTP, Input, Label
- Menubar, Navigation Menu, Pagination, Popover
- Progress, Radio Group, Resizable, Scroll Area
- Select, Separator, Sheet, Sidebar, Skeleton
- Slider, Sonner, Switch, Tabs, Table
- Textarea, Toast, Toggle, Toggle Group, Tooltip

### Custom Component Patterns
- All colors use semantic tokens (hsl(var(--primary)))
- Cards use `bg-card/50 backdrop-blur-sm` for glassmorphism
- Buttons have hover effects with `hover:shadow-glow`
- Forms use React Hook Form + Zod validation
- Tables are responsive with horizontal scroll on mobile

---

## Authentication Flow

1. **Sign Up**:
   - User enters email + password on /auth
   - Password validated with Zod schema (8+ chars, uppercase, lowercase, number, special char)
   - Calls `supabase.auth.signUp()` with `emailRedirectTo`
   - Email auto-confirmed (configured in Supabase)
   - User can immediately sign in
   - Profile created automatically in profiles table

2. **Sign In**:
   - User enters email + password on /auth
   - Calls `supabase.auth.signInWithPassword()`
   - Session stored in localStorage
   - useAuth hook updates with user/session
   - Redirects to /dashboard

3. **Sign Out**:
   - Calls `supabase.auth.signOut()`
   - Session cleared from localStorage
   - useAuth hook resets user/session to null
   - Redirects to homepage

4. **Protected Routes**:
   - Check `user` and `loading` from useAuth
   - If `!loading && !user`: redirect to /auth
   - Show loading spinner while checking auth

---

## Subscription & Payment Flow

1. **User views pricing** (/pricing):
   - Sees 4 tier cards
   - Current tier highlighted if subscribed

2. **User clicks Subscribe**:
   - If not logged in: redirects to /auth
   - Calls `createCheckout(priceId)` from useSubscription
   - Edge function `create-checkout` calls Stripe API
   - Returns checkout URL
   - Opens URL in new tab
   - User completes payment on Stripe

3. **Stripe webhook** (handled by Stripe):
   - On successful payment: creates subscription record
   - Updates subscriptions table with:
     - stripe_subscription_id
     - stripe_customer_id
     - product_id
     - subscription_end (30 days from now)
     - generations_limit (based on tier)
     - generations_used: 0

4. **User returns to app**:
   - useSubscription calls `checkSubscription()`
   - Fetches subscription data
   - Updates `subscriptionStatus` state
   - Shows current plan on dashboard

5. **User analyzes chart**:
   - Before analysis: checks `canGenerate` from useSubscription
   - If false: shows error toast + redirects to /pricing
   - After analysis: calls `incrementGenerationUsage()`
   - Updates `generations_used` in database

6. **User manages subscription**:
   - Clicks "Manage Subscription" on dashboard
   - Calls `openCustomerPortal()` from useSubscription
   - Edge function `customer-portal` calls Stripe API
   - Returns portal URL
   - Opens URL in new tab
   - User can upgrade, downgrade, cancel

---

## Key User Flows

### Flow 1: New User Sign Up → Analyze Chart
1. User lands on homepage (/)
2. Clicks "Start Analyzing" → redirected to /auth
3. Clicks "Sign Up" tab
4. Enters email + strong password
5. Clicks "Sign Up" → account created
6. Switches to "Sign In" tab
7. Enters credentials → signed in
8. Redirected to /dashboard
9. Sees "No active subscription" message
10. Clicks "View Subscription Plans" → redirected to /pricing
11. Clicks "Subscribe" on Elite tier
12. Completes Stripe checkout
13. Returns to app → subscription active
14. Navigates to /analyze
15. Selects strategy (e.g., "Scalping") and trade size (e.g., "Medium")
16. Uploads 6 chart screenshots
17. Waits for AI analysis (8 seconds)
18. Views comprehensive analysis results
19. Sees BUY/SELL recommendation with entry/SL/TP
20. (Optional) Saves trade to database

### Flow 2: Existing User Checks Dashboard
1. User signs in
2. Lands on /dashboard
3. Views welcome message with display name
4. Sees subscription status:
   - Current plan: Elite
   - Generations: 45/133 used (88 remaining)
   - Next billing: Feb 1, 2025
5. Views trades table with 10 past analyses
6. Marks pending trade as "Win" ✓
7. Trade status updates to green "Win" badge
8. P&L recalculated and displayed

### Flow 3: User Manages Settings
1. User navigates to /settings
2. Updates display name to "CryptoTrader123"
3. Changes language to "Español"
4. Switches theme to "Dark"
5. Clicks "Save Settings"
6. Settings saved to profiles table
7. Dashboard now shows "Welcome back, CryptoTrader123"

---

## Navbar (Responsive)

### Desktop Menu
**Not Logged In**:
- Logo + "MightyChart.io"
- Features (links to /#features)
- Pricing (→ /pricing)
- Tips & Tricks (→ /tips)
- Sign In button (→ /auth)

**Logged In**:
- Logo + "MightyChart.io"
- Dashboard (→ /dashboard)
- Analyze (→ /analyze)
- Pricing (→ /pricing)
- Tips & Tricks (→ /tips)
- Disclaimer (→ /disclaimer)
- Resources dropdown:
  - TradingView (external link)
  - Pine Script Docs (external link)
- User email dropdown:
  - Settings (→ /settings)
  - Admin Panel (→ /admin)
  - Sign Out

### Mobile Menu (Sheet)
- Hamburger icon button
- Slide-out menu from right
- Same links as desktop, vertical layout
- Sign Out button at bottom

---

## Footer
- Left: Logo + "MightyChart.io"
- Center: Links to Home, Pricing, Analyze, Dashboard, Tips & Tricks, Disclaimer
- Right: Copyright © 2024 MightyChart.io

---

## SEO & Meta Tags (index.html)
```html
<title>MightyChart.io - AI-Powered Trading Chart Analysis</title>
<meta name="description" content="AI-powered trading chart analysis providing instant insights, patterns, and actionable recommendations for professional traders." />
<meta property="og:title" content="MightyChart.io - AI-Powered Trading Analysis" />
<meta property="og:description" content="Upload your trading charts and get instant AI-powered analysis with precise entry/exit points and trading intelligence." />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@mightychart" />
```

---

## Environment Variables (.env)
```
VITE_SUPABASE_URL=https://mtwzttfrjptsluulijwf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=mtwzttfrjptsluulijwf
```

---

## Secrets (Supabase Environment)
- `LOVABLE_API_KEY` - Auto-provisioned for AI Gateway
- `STRIPE_SECRET_KEY` - Add via Supabase secrets management

---

## Important Implementation Notes

### 1. Color Usage (CRITICAL)
- NEVER use direct colors: `bg-white`, `text-black`, `bg-blue-500`
- ALWAYS use semantic tokens: `bg-background`, `text-foreground`, `bg-primary`
- All colors in index.css and tailwind.config.ts are HSL format
- Example: `hsl(var(--primary))` not `hsl(280 80% 60%)`

### 2. Authentication
- Auto-confirm email signups (no verification email)
- Password must meet complexity requirements
- Sessions persist in localStorage
- Protected routes check auth on mount

### 3. Subscription Logic
- Owner email gets unlimited: `culpindustriesllc@gmail.com`
- Generation limit enforced before analysis
- Usage incremented after successful analysis
- Low warning at ≤3 remaining

### 4. Chart Analysis
- Max 8 images per analysis
- Max 5MB per image
- Validates image format (must be base64 data URI)
- Supports any timeframe (1m to Weekly)
- Strategy + tradeSize sent to AI for context
- AI uses TJR Method institutional framework
- Results include: pattern, recommendation, entry/SL/TP, probability, confidence, technical analysis

### 5. Error Handling
- Form validation with Zod (email, password, display name)
- Database validation constraints (display name regex)
- API error responses with generic client messages
- Detailed errors logged to console only
- User-friendly toast notifications

### 6. Mobile Responsiveness
- Navbar collapses to hamburger menu
- Cards stack vertically on mobile
- Tables scroll horizontally
- Touch-friendly buttons (min 44x44px)
- Font sizes scale with breakpoints

### 7. Performance
- React Query for data caching
- Memoized subscription checks
- Optimistic UI updates (trade marking)
- Lazy loading images
- Edge functions for serverless scaling

---

## Testing Checklist

### Authentication
- [ ] Sign up with valid email/password
- [ ] Sign up with weak password (should fail)
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong credentials (should fail)
- [ ] Sign out redirects to homepage
- [ ] Protected routes redirect when not authenticated
- [ ] Session persists on page refresh

### Subscription
- [ ] Owner email shows "Owner Account" with unlimited access
- [ ] Non-subscribed user sees "No active subscription" on dashboard
- [ ] Subscribe button redirects to Stripe checkout
- [ ] After payment, subscription shows on dashboard
- [ ] Generation count increments after analysis
- [ ] Low generation warning shows at ≤3
- [ ] Manage Subscription opens Stripe portal
- [ ] Current plan highlighted on pricing page

### Chart Analysis
- [ ] Upload 1-8 images successfully
- [ ] Upload 9+ images shows error
- [ ] Upload non-image file shows error
- [ ] Select strategy and trade size
- [ ] Analysis shows loading state
- [ ] Results display all sections correctly
- [ ] BUY/SELL recommendation clear
- [ ] Entry/SL/TP prices shown
- [ ] Probability and confidence displayed
- [ ] Clear button resets form
- [ ] Cannot analyze without subscription

### Dashboard
- [ ] Display name shown (defaults to "trader")
- [ ] Subscription status accurate
- [ ] Trades table shows all user trades
- [ ] Mark trade as Win updates status
- [ ] Mark trade as Loss updates status
- [ ] Delete trade removes from list
- [ ] Empty state shows when no trades
- [ ] Warren Buffett quote displayed

### Settings
- [ ] Display name updates and saves
- [ ] Invalid display name shows error
- [ ] Language selector works
- [ ] Theme toggle changes appearance
- [ ] Save button shows success toast

### Admin
- [ ] Non-admin sees "Access Denied"
- [ ] Admin sees stats cards
- [ ] Total users count accurate
- [ ] Total trades count accurate
- [ ] Average win rate calculated

### Pricing
- [ ] All 4 tiers displayed
- [ ] Sort button toggles price order
- [ ] Elite tier shows "Most Purchased" badge
- [ ] Current tier shows "Your Plan" badge
- [ ] Subscribe button works for each tier
- [ ] Not logged in redirects to auth

### Disclaimer & Tips
- [ ] All sections render correctly
- [ ] Links work
- [ ] Content readable and formatted
- [ ] Mobile responsive

### Footer & Navbar
- [ ] All links work
- [ ] Logo clickable to homepage
- [ ] Mobile menu opens/closes
- [ ] User dropdown works
- [ ] Resources dropdown works
- [ ] Sign out works

---

## Deployment Checklist

### Supabase Setup
1. Create Supabase project
2. Run migrations for all tables
3. Enable RLS on all tables
4. Create database functions (has_role, update_updated_at_column)
5. Configure auth settings:
   - Enable email/password auth
   - Auto-confirm email signups: ON
   - Disable email confirmations
6. Add secrets: LOVABLE_API_KEY (auto), STRIPE_SECRET_KEY (manual)
7. Deploy edge functions:
   - analyze-chart
   - check-subscription
   - create-checkout
   - customer-portal
8. Test edge functions with curl

### Stripe Setup
1. Create Stripe account
2. Create 4 products with recurring prices:
   - Starter: $44/mo, 11 generations
   - Pro: $77/mo, 33 generations
   - Premium: $144/mo, 77 generations
   - Elite: $255/mo, 133 generations
3. Copy price IDs to code
4. Set up webhook endpoint for checkout.session.completed
5. Test checkout flow in test mode
6. Enable customer portal
7. Switch to live mode for production

### Frontend Deploy
1. Build: `npm run build`
2. Deploy to hosting (Vercel, Netlify, etc.)
3. Set environment variables
4. Test all routes
5. Verify auth flow
6. Test subscription flow end-to-end

### Post-Deploy
1. Test with real account
2. Subscribe to a plan
3. Analyze multiple charts
4. Mark trades as wins/losses
5. Update settings
6. Test on mobile devices
7. Check console for errors
8. Monitor edge function logs
9. Set up error tracking (Sentry, etc.)
10. Enable analytics (optional)

---

## Troubleshooting

### "No active subscription" but user paid
- Check subscriptions table for user_id match
- Verify stripe_subscription_id is populated
- Check subscription_end is in future
- Ensure generations_limit > 0
- Look at Stripe webhook logs

### Chart analysis fails
- Check LOVABLE_API_KEY is set
- Verify images are valid base64
- Check image size < 5MB each
- Ensure strategy is valid
- Look at edge function logs
- Test AI Gateway directly with curl

### RLS policy errors
- Verify user is authenticated (auth.uid() exists)
- Check policy uses correct column (user_id)
- Ensure policy exists for operation (SELECT, INSERT, UPDATE, DELETE)
- Test with SQL: `SET LOCAL role TO authenticated;`

### Display name validation fails
- Check regex: `^[a-zA-Z0-9\s\-_$€£¥*+]{1,50}$`
- Ensure 1-50 characters
- Trim whitespace
- No special characters except: space - _ $ € £ ¥ * +

---

## Future Enhancements (Not Included)

- [ ] Social auth (Google, Twitter)
- [ ] Email notifications for trade results
- [ ] Advanced trade analytics dashboard
- [ ] Export trades to CSV
- [ ] Trade replay/history viewer
- [ ] Portfolio tracking
- [ ] Multiple chart uploads per trade
- [ ] Saved chart templates
- [ ] Collaborative trade sharing
- [ ] Affiliate program
- [ ] Referral rewards
- [ ] Live chat support
- [ ] Video tutorials
- [ ] API for third-party integrations

---

## Credits & Attribution
- **Design System**: Custom Tailwind with purple/cyan theme
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **AI**: Google Gemini Pro via Lovable AI Gateway
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments**: Stripe
- **Hosting**: Lovable (or Vercel/Netlify)

---

## Support & Documentation Links
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Shadcn UI**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **TanStack Query**: https://tanstack.com/query
- **Zod Validation**: https://zod.dev

---

**END OF PROMPT**

This prompt contains every detail needed to rebuild MightyChart.io from scratch. Copy this entire document and use it with any AI coding assistant (like Claude, ChatGPT, or another Lovable instance) to recreate the application identically.
