# 3YN Billboard Analyzer - Complete Technical Documentation

## Project Overview

**3YN Billboard Analyzer** is an AI-powered billboard readability analysis platform designed specifically for the MENA (Middle East and North Africa) market, with specialized features for Oman's advertising landscape. The platform uses OpenAI's GPT-4 Vision API to analyze billboard designs and provide comprehensive readability scores, recommendations, and compliance checks.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Data Models and Type Definitions](#data-models-and-type-definitions)
4. [Core Features and Functionality](#core-features-and-functionality)
5. [Services and API Integration](#services-and-api-integration)
6. [Frontend Components Architecture](#frontend-components-architecture)
7. [Analysis Logic and Algorithms](#analysis-logic-and-algorithms)
8. [Billboard Location Database](#billboard-location-database)
9. [Authentication System](#authentication-system)
10. [Internationalization](#internationalization)
11. [Deployment and Configuration](#deployment-and-configuration)

---

## 1. Project Structure

```
/tmp/cc-agent/54040373/project/
├── .env                                    # Environment variables (API keys)
├── .gitignore                              # Git ignore configuration
├── package.json                            # NPM dependencies and scripts
├── vite.config.ts                          # Vite build configuration
├── tailwind.config.js                      # Tailwind CSS configuration
├── tsconfig.json                           # TypeScript configuration
├── index.html                              # HTML entry point
├── README.md                               # Project documentation
│
├── public/
│   ├── 3yn eye.png                         # Company logo
│   └── README.md                           # Public assets documentation
│
├── src/
│   ├── main.tsx                            # Application entry point
│   ├── App.tsx                             # Root application component
│   ├── index.css                           # Global styles
│   ├── vite-env.d.ts                       # Vite type definitions
│   │
│   ├── types/                              # TypeScript type definitions
│   │   ├── index.ts                        # Core application types
│   │   └── billboard.ts                    # Billboard-specific types
│   │
│   ├── data/                               # Static data
│   │   └── muscat_billboards_enriched.csv  # Real billboard location data
│   │
│   ├── services/                           # Business logic and API services
│   │   ├── auth.ts                         # Authentication service
│   │   ├── openai.ts                       # OpenAI Vision API integration
│   │   ├── billboardDataService.ts         # Billboard data management
│   │   ├── billboardLocations.ts           # Location suggestions
│   │   ├── locationService.ts              # Geolocation and geocoding
│   │   └── pdfGenerator.ts                 # PDF report generation
│   │
│   ├── i18n/                               # Internationalization
│   │   ├── index.ts                        # i18n configuration
│   │   └── locales/
│   │       ├── en.json                     # English translations
│   │       └── ar.json                     # Arabic translations
│   │
│   ├── components/                         # React components
│   │   ├── auth/                           # Authentication components
│   │   │   └── AuthModal.tsx
│   │   │
│   │   ├── common/                         # Reusable UI components
│   │   │   └── LanguageToggle.tsx
│   │   │
│   │   ├── layout/                         # Layout components
│   │   │   └── Header.tsx
│   │   │
│   │   ├── pages/                          # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── sections/                       # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   └── PricingSection.tsx
│   │   │
│   │   ├── dashboard/                      # Dashboard components
│   │   │   ├── UploadSection.tsx           # Image upload interface
│   │   │   ├── LocationInput.tsx           # Location input
│   │   │   ├── IntelligentLocationSelector.tsx
│   │   │   ├── AnalysisProgress.tsx        # Progress indicator
│   │   │   ├── AnalysisResults.tsx         # Results display
│   │   │   ├── AnalysisHistory.tsx         # Past analyses
│   │   │   ├── UsageStats.tsx              # Usage statistics
│   │   │   ├── ScoreCircle.tsx             # Score visualization
│   │   │   ├── DistanceSimulation.tsx      # Distance analysis
│   │   │   ├── AdvancedDistanceSimulator.tsx
│   │   │   ├── BeforeAfterComparison.tsx   # Visual comparison
│   │   │   ├── ProfessionalBeforeAfter.tsx
│   │   │   ├── ComplianceSection.tsx       # MENA compliance
│   │   │   ├── LocationRecommendations.tsx # Location insights
│   │   │   ├── LocationComparison.tsx      # Compare locations
│   │   │   ├── SmartComparison.tsx
│   │   │   ├── ImageAnalysisOverlay.tsx    # Visual annotations
│   │   │   ├── InteractiveImageOverlay.tsx
│   │   │   ├── CompetitiveBenchmarking.tsx # Market analysis
│   │   │   └── BrandAnalysisForm.tsx       # Brand input
│   │   │
│   │   └── enterprise/                     # Enterprise features
│   │       ├── EnterpriseAnalytics.tsx     # Analytics dashboard
│   │       ├── TeamWorkspace.tsx           # Team collaboration
│   │       ├── TeamCollaboration.tsx
│   │       ├── ClientPortal.tsx            # Client access portal
│   │       └── ExecutiveSummary.tsx        # Executive reports
│   │
│   └── utils/                              # Utility functions
│       └── mockData.ts                     # Mock data for development
│
└── .github/
    └── workflows/
        └── deploy.yml                      # CI/CD deployment workflow
```

---

## 2. Technology Stack

### Frontend Framework
- **React 18.3.1** - Core UI library
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### State Management
- React Hooks (useState, useEffect)
- Local component state management
- No external state management library (Redux, Zustand) used

### AI/ML Integration
- **OpenAI GPT-4 Vision API** - Image analysis and scoring
- Model: `gpt-4o`
- Custom prompt engineering for billboard-specific analysis

### Internationalization
- **i18next 25.3.2** - Translation framework
- **react-i18next 15.6.1** - React bindings
- **i18next-browser-languagedetector 8.2.0** - Language detection
- Supports: English, Arabic (with RTL)

### UI Libraries
- **lucide-react 0.344.0** - Icon library
- Custom UI components (no component library like MUI or Ant Design)

### Build Tools
- **ESLint 9.9.1** - Code linting
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - CSS vendor prefixing

### APIs and Services
- OpenStreetMap Nominatim API - Geocoding and reverse geocoding
- OpenAI Vision API - Billboard image analysis
- Browser Geolocation API - User location detection

### Future Integration Points
- Supabase (database available but not currently integrated)
- Stripe (payment processing - not yet implemented)
- PDF generation (pdfGenerator.ts exists but not fully implemented)

---

## 3. Data Models and Type Definitions

### Core Application Types (`src/types/index.ts`)

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  analysesThisMonth: number;
  maxAnalyses: number;
  totalAnalyses: number;
}
```

#### AnalysisResult
```typescript
interface AnalysisResult {
  id: string;
  score: number;                    // Overall readability score (0-100)
  arabicTextDetected?: boolean;     // Arabic text presence
  culturalCompliance?: string;      // MENA compliance status
  fontScore: number;                // Typography score (0-25)
  contrastScore: number;            // Color contrast score (0-25)
  layoutScore: number;              // Layout complexity score (0-25)
  ctaScore: number;                 // Call-to-action score (0-25)
  image: string;                    // Image URL or data URL
  location: string;                 // Billboard location
  distance: number;                 // Viewing distance in meters
  timestamp: Date;                  // Analysis timestamp
  criticalIssues: Issue[];          // Critical problems
  minorIssues: Issue[];             // Minor improvements
  quickWins: Issue[];               // Easy fixes
  distanceAnalysis: {               // Distance-based scores
    '50m': number;
    '100m': number;
    '150m': number;
  };
  aiAnalysis: string;               // Detailed AI analysis text
  menaConsiderations?: string;      // MENA-specific recommendations
  status: 'analyzing' | 'completed' | 'failed';
}
```

#### Issue
```typescript
interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'minor' | 'improvement';
}
```

#### Organization (Enterprise Feature)
```typescript
interface Organization {
  id: string;
  name: string;
  logo: string;
  plan: 'Professional' | 'Enterprise';
  members: TeamMember[];
  projects: Project[];
  settings: OrganizationSettings;
}
```

#### TeamMember
```typescript
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'client';
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastActive: Date;
  permissions: string[];
}
```

### Billboard-Specific Types (`src/types/billboard.ts`)

#### BillboardLocation
```typescript
interface BillboardLocation {
  id: string;
  locationName: string;             // Display name
  addressLandmark: string;          // Detailed address
  latitude?: number;
  longitude?: number;
  roadName: string;                 // Road name (e.g., "Sultan Qaboos Road")
  highwayDesignation?: string;      // Highway code (e.g., "N5")
  district: string;                 // District/neighborhood
  boardType: string;                // Billboard type
  format: string;                   // Static/Digital/LED
  approxWidthM?: number;            // Physical width in meters
  approxHeightM?: number;           // Physical height in meters
  distanceFromRoadM?: number;       // Distance from road in meters
  trafficDirectionVisibility: string; // Unidirectional/Bidirectional
  speedLimitKmh: string;            // Speed limit range
  roadType: string;                 // Road classification
  lighting: string;                 // Lighting conditions
  currentRecentAdvertisers?: string;
  rentalRateOmrMonth?: string;      // Monthly rental rate in OMR
  permitLicenseInfo?: string;
  installationDate?: string;
  ownershipManagement: string;      // Media company
  source?: string;
  lastVerifiedDate?: string;
  readabilityDifficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
  roiScore?: number;                // ROI estimation (0-100)
}
```

#### BillboardMetadata
```typescript
interface BillboardMetadata {
  location: BillboardLocation;
  analysisContext: {
    viewingDistance: number;
    speedContext: {
      kmh: number;
      mph: number;
      category: 'urban' | 'arterial' | 'highway' | 'expressway';
    };
    visibilityFactors: {
      lighting: 'excellent' | 'good' | 'fair' | 'poor';
      trafficFlow: 'unidirectional' | 'bidirectional' | 'complex';
      obstruction: 'none' | 'minimal' | 'moderate' | 'significant';
    };
    businessIntelligence: {
      rentalRate?: number;
      impressionsPerMonth?: number;
      costPerThousandImpressions?: number;
      competitorPresence: string[];
    };
  };
}
```

### Location Service Types

#### LocationData
```typescript
interface LocationData {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  context: {
    type: 'urban' | 'highway' | 'suburban' | 'rural';
    speed: number;  // mph
    trafficDensity: 'low' | 'medium' | 'high';
    region: string;
    country: string;
  };
  valid: boolean;
  error?: string;
}
```

---

## 4. Core Features and Functionality

### 4.1 AI-Powered Billboard Analysis

**Primary Feature**: Upload a billboard image and receive comprehensive readability analysis.

**Analysis Components**:
1. **Overall Score (0-100)**: Combined readability metric
2. **Component Scores** (each 0-25):
   - Font Score: Typography size and readability
   - Contrast Score: Color contrast and visibility
   - Layout Score: Design complexity and hierarchy
   - CTA Score: Call-to-action prominence

3. **Distance Analysis**:
   - 50m viewing distance score
   - 100m viewing distance score
   - 150m viewing distance score

4. **Issue Detection**:
   - Critical Issues: Major readability problems
   - Minor Issues: Suboptimal design elements
   - Quick Wins: Easy improvement suggestions

5. **AI-Generated Analysis**: Detailed written analysis from GPT-4 Vision

### 4.2 MENA Market Specialization

**Oman-Specific Features**:
- MTCIT compliance checking (Arabic text prominence 60%+)
- TRA advertising standards
- Cultural sensitivity guidelines
- Desert lighting considerations
- Arabic typography analysis

**Regional Considerations**:
- Bilingual support (Arabic/English)
- RTL (Right-to-Left) layout support
- Islamic design principles
- GCC market benchmarking

### 4.3 Location Intelligence

**Real Billboard Database**: 12 documented billboard locations in Muscat with:
- Exact coordinates
- Physical dimensions (width × height in meters)
- Viewing distances from road
- Traffic speeds and patterns
- Lighting conditions
- Rental rates (OMR/month)
- Media company ownership
- ROI scores

**Location Features**:
- Geocoding and reverse geocoding
- Current location detection
- Location search and suggestions
- Common billboard locations database
- Context-aware recommendations based on:
  - Road type (expressway, arterial, urban)
  - Traffic speed
  - Viewing distance
  - Traffic density

### 4.4 Enterprise Features

**Team Collaboration**:
- Multi-user workspaces
- Role-based access control (Admin, Analyst, Viewer, Client)
- Project management
- Team member status tracking
- Activity monitoring

**Client Portals**:
- Branded client access
- Custom domain support
- White-label branding
- Client permissions management
- Progress tracking

**Analytics Dashboard**:
- Portfolio performance metrics
- Regional analytics
- ROI tracking
- Competitive benchmarking
- Executive summaries

### 4.5 Subscription Tiers

**Starter Plan ($299/month)**:
- 10 analyses per month
- Basic AI scoring
- PDF reports
- Email support

**Professional Plan ($999/month)**:
- 50 analyses per month
- Advanced AI analysis
- Team collaboration (5 users)
- Priority support
- Custom branding

**Enterprise Plan ($2999/month)**:
- Unlimited analyses
- White-label solution
- API access
- Dedicated account manager
- 24/7 phone support
- Client portals

### 4.6 Analysis History

- Thumbnail previews
- Score history
- Location tracking
- Timestamp records
- Status indicators (completed/failed)
- Quick access to past analyses

---

## 5. Services and API Integration

### 5.1 OpenAI Vision API Service (`src/services/openai.ts`)

**Core Function**: `analyzeBillboardWithAI()`

**Process Flow**:
1. **Image Preprocessing**:
   - Convert image file to base64 encoding
   - Validate file format and size

2. **Location Context Enhancement**:
   - Extract billboard metadata from database
   - Calculate physical constraints:
     - Minimum font height based on viewing distance
     - Viewing time based on speed and billboard width
     - Text-to-billboard ratio requirements
     - Maximum word count for viewing time

3. **API Request Construction**:
   ```typescript
   POST https://api.openai.com/v1/chat/completions
   Model: gpt-4o
   Max Tokens: 1500
   Temperature: 0.1 (for consistent analysis)
   ```

4. **Prompt Engineering**:
   - Location-specific physical constraints
   - Speed-based readability requirements
   - Cultural compliance criteria
   - Distance-based scoring guidelines
   - Validation requirements to prevent generic responses

5. **Response Processing**:
   - JSON extraction from response
   - Quality validation (detects generic/template responses)
   - Retry logic (up to 2 retries)
   - Fallback to enhanced text parsing if JSON fails

6. **Fallback System**:
   - Variable scoring based on file hash and location
   - Location-specific issue generation
   - MENA considerations
   - Prevents identical scores for different inputs

**Key Algorithms**:

**Font Size Calculation**:
```typescript
minimumFontHeightM = (viewingDistance / billboardHeight) * speedFactor * 0.15
speedFactor = speedKmh <= 50 ? 1.0 :
              speedKmh <= 80 ? 1.3 :
              speedKmh <= 100 ? 1.6 : 2.0
```

**Viewing Time Calculation**:
```typescript
viewingTimeSeconds = (billboardWidth * 2) / (speedKmh * 0.277778)
maxWords = Math.floor(viewingTimeSeconds * 2)
```

**Response Validation**:
- Detects generic score ranges (70-75)
- Checks for location-specific references
- Validates visual description quality
- Rejects template language

### 5.2 Billboard Data Service (`src/services/billboardDataService.ts`)

**Main Class**: `BillboardDataService`

**Data Source**: 12 real billboard locations in Muscat from `muscat_billboards_enriched.csv`

**Key Methods**:

1. **getAllLocations()**: Returns all billboard locations
2. **getLocationById(id)**: Fetch specific location
3. **searchLocations(query)**: Search by name, road, district, or type
4. **getLocationsByDifficulty(difficulty)**: Filter by readability difficulty
5. **getLocationsByROI(minScore)**: Filter by ROI threshold

6. **generateMetadata(location)**: Creates comprehensive analysis context:
   - Viewing distance estimation
   - Speed context calculation
   - Visibility factors assessment
   - Business intelligence (rental rates, impressions, CPM)
   - Competitor identification

7. **calculateLocationScore(location)**: Multi-factor scoring:
   - Speed Score (30%): Lower speed = better readability
   - Distance Score (25%): Closer to road = better visibility
   - Size Score (20%): Larger dimensions = more impact
   - Cost Score (25%): Lower cost = better value

8. **calculateROIScore(location)**: ROI estimation (20-100):
   - Traffic volume impact
   - Speed and impression correlation
   - Digital format premium
   - Location premium (Sultan Qaboos Road +20)
   - Cost efficiency

9. **calculateReadabilityScore(location)**: Readability potential (20-100):
   - Speed impact (inverse relationship)
   - Distance impact
   - Board size impact
   - Lighting quality

10. **calculateSuitabilityScore(location)**: Overall suitability (20-100):
    - Location type (expressway +20)
    - Format modernity (digital +15)
    - Ownership reliability
    - Traffic direction advantage
    - District desirability

11. **getLocationRecommendations(location)**: Returns:
    - Speed-based creative strategy
    - Location-specific insights
    - Creative strategy recommendations
    - DOOH/Forecourt optimizations

12. **getLocationProsAndCons(location)**: Generates pros/cons lists

**Estimation Algorithms**:

**Viewing Distance Estimation**:
```typescript
expressway: 150m
urban motorway: 100m
inter-urban arterial: 80m
urban arterial: 60m
urban street: 40m
```

**Monthly Impressions Estimation**:
```typescript
baseImpressions = {
  expressway: 500,000
  urban motorway: 300,000
  inter-urban arterial: 200,000
  urban arterial: 150,000
}
// Adjusted for:
// - Digital format: ×1.3
// - Bidirectional traffic: ×1.8
```

**Cost Per Thousand (CPM)**:
```typescript
CPM = (rentalRate / impressionsPerMonth) * 1000
```

### 5.3 Location Service (`src/services/locationService.ts`)

**Geocoding APIs**:
- OpenStreetMap Nominatim API (free, no API key required)
- User-Agent: 'Billboard-Analyzer/1.0'

**Key Functions**:

1. **getCurrentLocation()**: Browser geolocation API
2. **reverseGeocode(lat, lng)**: Coordinates to address
3. **geocodeAddress(address)**: Address to coordinates
4. **validateLocation(input)**: Comprehensive validation:
   - Coordinate format detection
   - Address geocoding
   - Context determination (urban/highway/suburban/rural)
   - Speed and traffic density estimation

5. **getLocationContext(coordinates, address)**: Determines:
   - Country/region detection (MENA focus)
   - Location type classification
   - Speed estimation
   - Traffic density
   - Automatic context from keywords

6. **getLocationSuggestions(query)**:
   - Searches billboard database first
   - Falls back to OSM search
   - Combines and prioritizes results

7. **Recent Locations**:
   - `saveRecentLocation()`: Store in localStorage
   - `getRecentLocations()`: Retrieve last 5 locations

**Location Detection Logic**:
```typescript
// MENA region detection
if (lat >= 12 && lat <= 42 && lng >= 34 && lng <= 75) {
  // Oman: lat 16-26.5, lng 51.5-59.5
  // UAE: lat 22-26.5, lng 51-56.5
  // Saudi Arabia: lat 16-32, lng 34-55
}

// Type detection from address keywords
highway: includes('highway', 'sultan qaboos', 'sheikh zayed')
rural: includes('rural', 'countryside', 'desert')
suburban: includes('suburb', 'residential')
urban: includes('business', 'downtown', 'city center')
```

### 5.4 Authentication Service (`src/services/auth.ts`)

**Current Implementation**: Client-side mock authentication (no backend)

**Features**:
- JWT-style token generation (simulated)
- Token validation and expiry (7 days)
- localStorage persistence
- Automatic token refresh
- Login/signup simulation

**Security Note**: This is a prototype implementation. Production requires:
- Backend API integration
- Proper JWT signing/verification
- Secure token storage
- Session management
- Password hashing

**Key Functions**:
1. `login(email, password)`: Simulates login, returns User
2. `signup(email, password, name)`: Creates new user (Starter plan)
3. `logout()`: Clears authentication
4. `isAuthenticated()`: Checks authentication status
5. `refreshToken()`: Extends session
6. `getStoredAuth()`: Retrieves and validates stored session

### 5.5 PDF Generator Service (`src/services/pdfGenerator.ts`)

**Status**: Service file exists but not currently implemented

**Planned Features**:
- Professional PDF report generation
- Branded templates
- Analysis visualization
- Export functionality

---

## 6. Frontend Components Architecture

### 6.1 Application Structure

**Root Component**: `App.tsx`
- Authentication state management
- Route handling (landing page vs dashboard)
- Auth modal control
- User session management
- Token refresh logic

**Main Routes**:
1. **Landing Page** (unauthenticated): Marketing and signup
2. **Dashboard** (authenticated): Analysis workspace

### 6.2 Page Components

#### LandingPage (`src/components/pages/LandingPage.tsx`)
**Sections**:
- HeroSection: Value proposition and CTA
- FeaturesSection: Core capabilities showcase
- PricingSection: Subscription tiers

**Key Features**:
- Smooth scroll navigation
- Language toggle (EN/AR)
- Authentication flow
- Responsive design

#### Dashboard (`src/components/pages/Dashboard.tsx`)
**State Management**:
- Current analysis result
- Active view (analysis/analytics/team/client-portal)
- Analysis progress tracking
- Analysis history

**Views**:
1. **Analysis View**: Primary analysis workflow
2. **Enterprise Analytics**: Performance metrics (Pro/Enterprise)
3. **Team Workspace**: Collaboration tools (Enterprise only)
4. **Client Portal**: Client access management

**Workflow**:
```
Upload Image → Location Input → Analysis Progress → Results Display
     ↓              ↓                   ↓                  ↓
UploadSection  LocationInput  AnalysisProgress  AnalysisResults
```

### 6.3 Dashboard Components

#### UploadSection (`src/components/dashboard/UploadSection.tsx`)
**Features**:
- Drag-and-drop file upload
- File type validation (JPEG, PNG, WebP)
- Image preview
- Location input integration
- Distance selector (50m/100m/150m)
- Intelligent location selector
- Real-time validation

**Location Input Types**:
1. Manual address entry
2. Coordinate input (lat, lng)
3. Current location detection
4. Billboard location database selection
5. Recent locations history

#### IntelligentLocationSelector (`src/components/dashboard/IntelligentLocationSelector.tsx`)
**Features**:
- Billboard database search
- Location autocomplete
- Visual location cards with:
  - Physical specifications
  - ROI score
  - Readability difficulty
  - Traffic information
  - Rental rates
- Quick location selection
- Comparison tools

#### AnalysisProgress (`src/components/dashboard/AnalysisProgress.tsx`)
**Stages**:
1. Uploading (0-25%)
2. Analyzing (25-50%)
3. Generating Report (50-75%)
4. Completed (75-100%)

**Visual Elements**:
- Animated progress bar
- Stage indicators
- Loading animations
- Status messages

#### AnalysisResults (`src/components/dashboard/AnalysisResults.tsx`)
**Sections**:
1. **Score Overview**:
   - Overall score (0-100) with color coding
   - Component scores (font, contrast, layout, CTA)
   - Score circle visualizations

2. **Distance Analysis**:
   - 50m, 100m, 150m score variations
   - Visual distance simulator
   - Readability degradation analysis

3. **Issues and Recommendations**:
   - Critical Issues (red)
   - Minor Issues (yellow)
   - Quick Wins (green)

4. **AI Analysis**:
   - Detailed written analysis
   - Visual description
   - Actual text content extraction
   - Color analysis

5. **MENA Compliance**:
   - Arabic text detection
   - Cultural compliance status
   - MTCIT/TRA guidelines
   - Regional recommendations

6. **Location Recommendations**:
   - Speed-based strategy
   - Location insights
   - Creative recommendations
   - Pros and cons

7. **Actions**:
   - Download PDF report
   - Compare with other locations
   - Before/After comparison
   - Share analysis

#### LocationRecommendations (`src/components/dashboard/LocationRecommendations.tsx`)
**Analysis Types**:
- Speed-based recommendations
- Traffic type analysis (Business/Residential/Mixed)
- Audience estimation (Young Professional/Family/Mixed)
- Competition level assessment
- Creative strategy suggestions

**Visualizations**:
- Score breakdown charts
- Traffic flow indicators
- Competition heatmaps
- ROI projections

#### ComplianceSection (`src/components/dashboard/ComplianceSection.tsx`)
**MENA-Specific Checks**:
- Arabic text prominence (60% requirement)
- Cultural appropriateness
- MTCIT compliance
- TRA advertising standards
- Islamic design principles
- Desert lighting optimization

#### BeforeAfterComparison (`src/components/dashboard/BeforeAfterComparison.tsx`)
**Features**:
- Side-by-side image comparison
- Slider for before/after reveal
- Score improvement visualization
- Issue resolution tracking
- Design iteration history

### 6.4 Enterprise Components

#### EnterpriseAnalytics (`src/components/enterprise/EnterpriseAnalytics.tsx`)
**Metrics**:
- Portfolio performance overview
- Analysis volume trends
- Score distribution
- Regional performance (Oman vs GCC)
- ROI tracking
- Team productivity
- Client satisfaction

**Visualizations**:
- Line charts (trends)
- Bar charts (comparisons)
- Pie charts (distribution)
- Heatmaps (regional)
- KPI cards

#### TeamWorkspace (`src/components/enterprise/TeamWorkspace.tsx`)
**Features**:
- Team member management
- Role-based permissions
- Activity feed
- Project assignments
- Status indicators (online/offline/away)
- Collaboration tools
- Comment threads
- Approval workflows

#### ClientPortal (`src/components/enterprise/ClientPortal.tsx`)
**Features**:
- Branded client interface
- Custom domain support
- White-label branding
- Project access control
- Analysis sharing
- Progress tracking
- Comment system
- Revision requests
- Analytics viewing

### 6.5 Layout Components

#### Header (`src/components/layout/Header.tsx`)
**Features**:
- Company logo/branding
- Navigation menu
- Language toggle (EN/AR)
- User profile menu
- Login/Signup buttons (unauthenticated)
- Logout button (authenticated)
- Responsive mobile menu

#### LanguageToggle (`src/components/common/LanguageToggle.tsx`)
**Features**:
- EN/AR language switcher
- Automatic RTL layout toggle
- localStorage persistence
- Smooth transitions
- Icon indicators

### 6.6 Authentication Components

#### AuthModal (`src/components/auth/AuthModal.tsx`)
**Modes**:
1. Login
2. Signup

**Features**:
- Email/password validation
- Form error handling
- Loading states
- Mode switching
- Success/error notifications
- Auto-close on success

---

## 7. Analysis Logic and Algorithms

### 7.1 Overall Score Calculation

**Score Range**: 0-100

**Component Weights**:
```
Overall Score = (Font Score × 1.0) + (Contrast Score × 1.0) +
                (Layout Score × 1.0) + (CTA Score × 1.0)

Maximum = 25 + 25 + 25 + 25 = 100
```

**Score Interpretation**:
- 90-100: Excellent readability
- 80-89: Very good readability
- 70-79: Good readability
- 60-69: Adequate readability
- 50-59: Poor readability
- Below 50: Critical readability issues

### 7.2 Component Scoring

#### Font Score (0-25)
**Factors**:
- Font size relative to viewing distance
- Font weight and boldness
- Font family (serif vs sans-serif)
- Text clarity and legibility
- Minimum size requirements

**Calculation**:
```typescript
minimumFontPx = viewingDistanceM * 0.035 * speedFactor

if (actualFontSize < minimumFontPx):
  fontScore = 5-15 (critical issue)
else if (actualFontSize >= minimumFontPx * 1.5):
  fontScore = 20-25 (excellent)
else:
  fontScore = 15-20 (adequate)
```

#### Contrast Score (0-25)
**Factors**:
- Color contrast ratio (WCAG guidelines)
- Background-foreground separation
- Lighting condition adaptation
- Shadow/highlight balance

**Calculation**:
```typescript
// WCAG contrast ratio formula
L1 = relativeLuminance(foregroundColor)
L2 = relativeLuminance(backgroundColor)
contrastRatio = (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)

if (contrastRatio >= 7.0):
  contrastScore = 22-25 (excellent - AAA)
else if (contrastRatio >= 4.5):
  contrastScore = 18-22 (good - AA)
else if (contrastRatio >= 3.0):
  contrastScore = 12-18 (adequate)
else:
  contrastScore = 5-12 (poor - critical issue)
```

**MENA Adjustments**:
- Desert lighting requires 5.0:1 minimum (vs 4.5:1 standard)
- Bright ambient light penalty

#### Layout Score (0-25)
**Factors**:
- Visual complexity
- Word count vs viewing time
- Hierarchy clarity
- White space usage
- Element alignment

**Calculation**:
```typescript
maxWords = Math.floor(viewingTimeSeconds * 2)

if (actualWordCount > maxWords * 1.5):
  layoutScore = 5-12 (too complex)
else if (actualWordCount <= maxWords):
  layoutScore = 20-25 (optimal)
else:
  layoutScore = 12-20 (acceptable)
```

#### CTA Score (0-25)
**Factors**:
- Call-to-action prominence
- CTA size relative to board
- CTA clarity and simplicity
- Action verb presence
- Contact information legibility

### 7.3 Distance Analysis Algorithm

**Purpose**: Simulate readability at different viewing distances

**Base Score**: Score at specified viewing distance (e.g., 100m)

**Distance Adjustment Formula**:
```typescript
function calculateDistanceScore(baseScore, baseDistance, targetDistance) {
  const distanceFactor = Math.abs(targetDistance - baseDistance) * 0.3

  if (targetDistance < baseDistance) {
    // Closer = easier to read
    return Math.min(baseScore + distanceFactor, 95)
  } else {
    // Farther = harder to read
    return Math.max(baseScore - distanceFactor, 20)
  }
}

// Example:
// Base: 100m distance, score = 72
// At 50m: 72 + (50 * 0.3) = 87
// At 150m: 72 - (50 * 0.3) = 57
```

### 7.4 ROI Score Calculation

**Multi-Factor ROI Estimation** (20-100):

```typescript
function calculateROIScore(location: BillboardLocation): number {
  let score = 50  // Base score

  // Traffic volume impact
  if (bidirectional) score += 20

  // Speed-based impressions
  if (speed >= 100 kmh) score += 15
  else if (speed >= 60 kmh) score += 10
  else score += 5

  // Format premium
  if (digital) score += 15

  // Location premium
  if (premiumHighway) score += 20
  else if (expressway) score += 15

  // Cost efficiency
  if (rentalRate < 1500 OMR) score += 10
  else if (rentalRate > 3000 OMR) score -= 10

  return clamp(score, 20, 100)
}
```

### 7.5 Readability Difficulty Classification

**Algorithm**:
```typescript
function classifyReadabilityDifficulty(location: BillboardLocation): string {
  let difficultyPoints = 0

  // Speed impact (0-40 points)
  if (speed >= 120) difficultyPoints += 40
  else if (speed >= 100) difficultyPoints += 30
  else if (speed >= 80) difficultyPoints += 20
  else difficultyPoints += 10

  // Distance impact (0-30 points)
  if (distance >= 150m) difficultyPoints += 30
  else if (distance >= 100m) difficultyPoints += 20
  else if (distance >= 60m) difficultyPoints += 10

  // Lighting impact (0-20 points)
  if (lighting === 'poor') difficultyPoints += 20
  else if (lighting === 'fair') difficultyPoints += 10

  // Size impact (0-10 points)
  if (area < 50 m²) difficultyPoints += 10

  // Classification
  if (difficultyPoints >= 70) return 'extreme'
  else if (difficultyPoints >= 50) return 'hard'
  else if (difficultyPoints >= 30) return 'medium'
  else return 'easy'
}
```

### 7.6 MENA Compliance Scoring

**Arabic Text Prominence Check**:
```typescript
function checkArabicCompliance(analysis: AIAnalysis): string {
  const arabicPercentage = analysis.arabic_text_percentage

  if (arabicPercentage >= 60) {
    return 'compliant'  // Meets MTCIT requirement
  } else if (arabicPercentage >= 40) {
    return 'needs_review'  // Borderline
  } else {
    return 'non_compliant'  // Critical issue
  }
}
```

**Cultural Compliance Factors**:
- Color appropriateness (Islamic cultural context)
- Imagery appropriateness (modest, respectful)
- Language formality (formal Arabic preferred)
- Gender representation (conservative standards)

---

## 8. Billboard Location Database

### 8.1 Data Structure

**Source File**: `src/data/muscat_billboards_enriched.csv`

**Total Locations**: 12 documented billboard sites in Muscat, Oman

**CSV Columns**:
```
id, location_name, address_landmark, latitude, longitude, road_name,
highway_designation, district, board_type, format, approx_width_m,
approx_height_m, distance_from_road_m, traffic_direction_visibility,
speed_limit_kmh, road_type, lighting, rental_rate_omr_month,
ownership_management, source, last_verified_date
```

### 8.2 Sample Location Entry

**Location ID 1**: Darsait CBD Highway
```csv
1,"Darsait CBD Highway - Seeb Direction",
"Sultan Qaboos Rd corridor near CBD/Darsait",
23.6345,58.5877,
"Sultan Qaboos Road","N5 (Route 1)","Darsait / CBD",
"Billboard","Static (likely illuminated)",
14,9,100,
"East → West (toward Seeb)",120,
"Urban motorway","LED Illuminated",1800,
"MediaOne","https://www.mediaoneoman.com/portfolio/outdoor-advertising-muscat-oman/",
"2025-08-11"
```

**Interpreted Data**:
- Location: Darsait/CBD on Sultan Qaboos Road (Highway N5)
- Size: 14m × 9m (126 m²)
- Distance: 100m from road
- Speed: 120 km/h
- Traffic: Unidirectional (toward Seeb)
- Rental: 1,800 OMR/month
- Operator: MediaOne
- ROI Score: 85 (high)
- Difficulty: Hard

### 8.3 Location Types in Database

1. **Premium Highways** (3 locations):
   - Sultan Qaboos Road corridor
   - Muscat Expressway
   - High speed (100-120 km/h)
   - High rental rates (1,500-1,800 OMR)
   - ROI: 85-95

2. **Urban Arterials** (2 locations):
   - Business districts
   - Medium speed (60-80 km/h)
   - Moderate rental rates
   - ROI: 65-78

3. **DOOH Networks** (2 locations):
   - Al Mouj Muscat (The Wave)
   - OCEC campus
   - Low speed (30-50 km/h)
   - Digital format
   - ROI: 82-88

4. **Service Station Forecourts** (5 locations):
   - OOMCO stations across Muscat
   - Captive audience
   - Digital format
   - Medium rental rates
   - ROI: 68-75

### 8.4 Data Processing

**BillboardDataService** converts CSV data to structured objects:

```typescript
// Example: Sultan Qaboos Highway location
{
  id: '1',
  locationName: 'Darsait / CBD main highway (towards Seeb)',
  addressLandmark: 'Sultan Qaboos Rd corridor near CBD/Darsait',
  latitude: 23.6345,
  longitude: 58.5877,
  roadName: 'Sultan Qaboos Road',
  highwayDesignation: 'N5 (Route 1)',
  district: 'Darsait / CBD',
  boardType: 'Billboard',
  format: 'Static (likely illuminated)',
  approxWidthM: 14,
  approxHeightM: 9,
  distanceFromRoadM: 100,
  trafficDirectionVisibility: 'East → West (toward Seeb)',
  speedLimitKmh: '100–120',
  roadType: 'Urban motorway',
  lighting: 'LED Illuminated',
  rentalRateOmrMonth: '1800',
  ownershipManagement: 'MediaOne',
  readabilityDifficulty: 'hard',
  roiScore: 85
}
```

### 8.5 Location Search and Filtering

**Search Capabilities**:
```typescript
// Full-text search
searchLocations("Sultan Qaboos")  // Returns highway locations
searchLocations("OOMCO")          // Returns service stations
searchLocations("Digital")        // Returns DOOH locations

// Filtered queries
getLocationsByDifficulty("easy")  // Low-speed, short-distance
getLocationsByROI(80)             // High ROI locations only
```

---

## 9. Authentication System

### 9.1 Current Implementation

**Type**: Client-side mock authentication (no backend API)

**Storage**: Browser localStorage

**Token Format**: Simulated JWT (Base64-encoded)

### 9.2 Authentication Flow

**Login Process**:
```
1. User enters email + password
2. authService.login() simulates API call (1s delay)
3. Generate mock JWT token
4. Create User object with plan (default: Professional)
5. Store in localStorage as 'billboard_auth_token'
6. Update App state with User
7. Redirect to Dashboard
```

**Signup Process**:
```
1. User enters email + password + name
2. authService.signup() simulates API call (1s delay)
3. Generate mock JWT token
4. Create User object with Starter plan
5. Store in localStorage
6. Update App state with User
7. Redirect to Dashboard
```

**Session Management**:
```
1. App.tsx checks localStorage on mount
2. Validates token expiry (7 days)
3. Restores user session if valid
4. Auto-refresh token every 30 minutes
5. Logout clears localStorage
```

### 9.3 Mock JWT Structure

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "plan": "Professional",
  "iat": 1736000000,
  "exp": 1736604800
}
```

**Token**: `{header_b64}.{payload_b64}.{signature_b64}`

### 9.4 Production Requirements

**⚠️ CRITICAL**: Current implementation is PROTOTYPE ONLY

**Required for Production**:
1. **Backend API**:
   - User registration endpoint
   - Login endpoint with proper authentication
   - Token refresh endpoint
   - Password reset flow
   - Email verification

2. **Security**:
   - Password hashing (bcrypt/argon2)
   - Proper JWT signing with secret key
   - HTTPS only
   - CSRF protection
   - Rate limiting
   - Account lockout after failed attempts

3. **Token Management**:
   - Server-side token generation
   - Token blacklisting for logout
   - Refresh token rotation
   - Secure token storage (httpOnly cookies or secure storage)

4. **Database Integration**:
   - User table in Supabase
   - Session management
   - Usage tracking (analyses count)
   - Subscription management

---

## 10. Internationalization (i18n)

### 10.1 Configuration

**Library**: i18next with react-i18next

**Supported Languages**:
- English (en) - Default
- Arabic (ar) - Full RTL support

**Detection Order**:
1. localStorage preference
2. Browser language settings
3. HTML lang attribute

### 10.2 Translation Files

**Location**: `src/i18n/locales/`

**Structure**:
```json
{
  "nav": { ... },
  "hero": { ... },
  "features": { ... },
  "pricing": { ... },
  "dashboard": { ... },
  "auth": { ... },
  "analysis": { ... },
  "common": { ... }
}
```

### 10.3 RTL Support

**Arabic Language Features**:
- Automatic RTL layout
- Font family changes (Cairo, Tajawal, Amiri)
- Text alignment adjustments
- Icon mirroring
- Date formatting

**Implementation**:
```typescript
const { i18n } = useTranslation();
const isRTL = i18n.language === 'ar';

<div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
  {/* Content */}
</div>
```

### 10.4 Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <h1>{t('hero.title')}</h1>
  );
}
```

### 10.5 Language Toggle

**Component**: `LanguageToggle.tsx`

**Features**:
- EN/AR switcher button
- Persistent preference (localStorage)
- Smooth transitions
- Real-time layout updates

---

## 11. Deployment and Configuration

### 11.1 Environment Variables

**File**: `.env`

**Required Variables**:
```
VITE_OPENAI_API_KEY=sk-proj-...
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

**⚠️ SECURITY WARNING**: These keys are currently committed to repository. In production:
- Never commit API keys
- Use environment-specific `.env` files
- Use CI/CD secrets management
- Rotate keys regularly

### 11.2 Build Configuration

**Vite Config**: `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'openai-vendor': ['openai']
        }
      }
    }
  }
})
```

### 11.3 Build Commands

**Development**:
```bash
npm run dev        # Start dev server on http://localhost:5173
```

**Production Build**:
```bash
npm run build      # Build to dist/
npm run preview    # Preview production build
```

**Linting**:
```bash
npm run lint       # ESLint check
```

### 11.4 Deployment Options

**Option 1: Netlify (Configured)**
- GitHub Action: `.github/workflows/deploy.yml`
- Auto-deploy on push to main
- Custom domain support
- Environment variables in Netlify dashboard

**Option 2: GoDaddy Hosting**
```bash
npm run build
# Upload dist/ contents via FTP or cPanel File Manager
```

**Option 3: Vercel**
- Connect GitHub repository
- Auto-detection of Vite config
- Environment variables in project settings

**Option 4: AWS S3 + CloudFront**
- Build locally
- Upload to S3 bucket
- Configure CloudFront distribution
- Set up Route53 DNS

### 11.5 GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run build
5. Deploy to Netlify

### 11.6 Performance Optimization

**Implemented**:
- Code splitting (React vendor chunk)
- Image lazy loading
- Tailwind CSS purging
- Minification

**Recommended**:
- Image optimization (next-gen formats)
- CDN for static assets
- Service worker for offline support
- Bundle size monitoring

### 11.7 Monitoring and Analytics

**Not Yet Implemented** - Recommendations:
- Google Analytics or Plausible
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- API usage monitoring
- Cost tracking (OpenAI API)

---

## 12. Integration Points for Future Claude Instances

### 12.1 Database Integration (Supabase - Available but Not Used)

**Current Status**: Supabase credentials available in `.env` but not integrated

**Required Tables**:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('Starter', 'Professional', 'Enterprise')),
  analyses_this_month INTEGER DEFAULT 0,
  max_analyses INTEGER NOT NULL,
  total_analyses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  distance INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  font_score INTEGER NOT NULL,
  contrast_score INTEGER NOT NULL,
  layout_score INTEGER NOT NULL,
  cta_score INTEGER NOT NULL,
  ai_analysis TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Organizations table (Enterprise)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('Professional', 'Enterprise')),
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'analyst', 'viewer', 'client')),
  permissions TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Integration Steps**:
1. Install `@supabase/supabase-js`
2. Create Supabase client in `src/services/supabase.ts`
3. Update `authService.ts` to use Supabase Auth
4. Store analysis results in Supabase
5. Implement real-time collaboration features

### 12.2 Payment Integration (Stripe - Not Yet Implemented)

**Required for Production**:
- Stripe account setup
- Subscription product creation (Starter/Pro/Enterprise)
- Payment flow integration
- Webhook handling for subscription events
- Usage-based billing for overages

**Implementation Files**:
```
src/services/stripe.ts      # Stripe client
src/components/payment/     # Payment UI components
```

### 12.3 PDF Generation (Placeholder Exists)

**Current Status**: Service file exists but not implemented

**Required Libraries**:
```bash
npm install jspdf html2canvas
```

**Implementation**:
- Generate PDF from analysis results
- Include charts and visualizations
- Branded templates
- Multi-language support

### 12.4 Email Notifications

**Not Yet Implemented** - Use cases:
- Welcome email on signup
- Analysis completion notifications
- Monthly usage reports
- Subscription renewal reminders
- Team collaboration notifications

**Recommended Service**: SendGrid or AWS SES

### 12.5 API Development

**Not Yet Implemented** - Enterprise feature

**Endpoints to Create**:
```
POST /api/analyze           # Submit analysis
GET  /api/analyses/:id      # Get analysis result
GET  /api/analyses          # List analyses
GET  /api/locations         # Get billboard locations
GET  /api/usage             # Get usage statistics
```

### 12.6 Advanced Features for Future Development

1. **Image Editing**:
   - In-browser image editing
   - Before/after visual comparisons
   - Mockup generation

2. **Collaboration**:
   - Real-time comments
   - @mentions
   - Approval workflows
   - Version control

3. **AI Enhancements**:
   - GPT-4 Vision for improved analysis
   - Custom training on billboard dataset
   - Competitive analysis automation
   - Design suggestion generation

4. **Analytics**:
   - Dashboard with metrics
   - Performance tracking over time
   - A/B testing results
   - Market insights

5. **Mobile App**:
   - React Native version
   - On-site billboard photography
   - GPS-based location detection
   - Offline analysis queue

---

## 13. Known Issues and Limitations

### 13.1 Current Limitations

1. **Authentication**: Mock implementation only, no real backend
2. **Database**: Supabase available but not integrated
3. **Payment**: No payment processing
4. **PDF Generation**: Not implemented
5. **API Keys**: Hardcoded in repository (security risk)
6. **Image Storage**: Uses browser memory (data URLs)
7. **Analysis History**: Stored in component state (lost on refresh)

### 13.2 OpenAI API Considerations

**Costs**:
- GPT-4 Vision: ~$0.01-0.03 per image analysis
- Monthly cost scales with usage
- Need cost monitoring and alerts

**Rate Limits**:
- Monitor API usage
- Implement request queuing
- Add retry logic with exponential backoff

**Fallback Strategy**:
- Enhanced fallback system already implemented
- Generates location-specific scores without API
- Maintains user experience during API failures

### 13.3 Data Privacy

**Current Status**: No user data stored on server

**Production Requirements**:
- GDPR compliance (data export, deletion)
- PDPL compliance (Oman data protection)
- Terms of service
- Privacy policy
- Cookie consent
- Data retention policies

---

## 14. Development Guidelines for Future Instances

### 14.1 Code Style

**TypeScript**:
- Strict mode enabled
- Explicit return types on functions
- Interface definitions for all data structures
- No `any` types (use `unknown` if necessary)

**React**:
- Functional components only (no class components)
- Hooks for state management
- Props interface for all components
- Descriptive component names

**CSS/Tailwind**:
- Utility-first approach
- Responsive design (mobile-first)
- Dark mode considerations (not yet implemented)
- Consistent spacing (4px, 8px, 16px, 24px, 32px)

### 14.2 Testing Strategy (Not Yet Implemented)

**Recommended Setup**:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Test Coverage Priorities**:
1. Billboard data service calculations
2. Location service geocoding
3. OpenAI service response parsing
4. Authentication service logic
5. Component rendering

### 14.3 File Organization Rules

- One component per file
- Co-locate related components in directories
- Services in `src/services/`
- Types in `src/types/`
- Utilities in `src/utils/`
- Keep files under 700 lines

### 14.4 Git Workflow

**Branch Strategy**:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Emergency fixes

**Commit Messages**:
```
feat: Add location-based analysis recommendations
fix: Resolve authentication token expiry issue
docs: Update API integration documentation
refactor: Simplify billboard scoring algorithm
```

---

## 15. Conclusion

This document provides a comprehensive technical overview of the 3YN Billboard Analyzer platform. Future Claude instances should be able to:

1. Understand the complete project architecture
2. Navigate the codebase effectively
3. Implement new features following established patterns
4. Integrate with external services (Supabase, Stripe)
5. Extend the billboard location database
6. Enhance the AI analysis algorithms
7. Deploy updates to production environments

**Critical Next Steps for Production**:
1. Implement real authentication with Supabase
2. Set up database schema and migrations
3. Integrate payment processing
4. Implement PDF report generation
5. Add comprehensive error tracking
6. Set up monitoring and analytics
7. Implement automated testing
8. Secure API keys in environment
9. Add email notification system
10. Create API endpoints for enterprise features

**Key Differentiators**:
- Real billboard location database with physical specifications
- Location-specific analysis algorithms
- MENA market specialization
- Advanced AI prompt engineering for consistent results
- Comprehensive fallback system for API failures
- Enterprise-ready collaboration features

For questions or clarifications, refer to inline code comments, type definitions, and this documentation.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-11
**Maintained By**: 3YN Development Team
