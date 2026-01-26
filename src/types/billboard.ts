export interface ROIBreakdown {
  dailyImpressions: number;
  monthlyCost: number;
  cpm: number;
  marketPosition: string;
}

export interface BillboardLocation {
  id: string;
  locationName: string;
  addressLandmark: string;
  latitude?: number;
  longitude?: number;
  roadName: string;
  highwayDesignation?: string;
  district: string;
  boardType: string;
  format: string;
  approxWidthM?: number;
  approxHeightM?: number;
  distanceFromRoadM?: number;
  trafficDirectionVisibility: string;
  speedLimitKmh: string;
  roadType: string;
  lighting: string;
  currentRecentAdvertisers?: string;
  rentalRateOmrMonth?: string;
  permitLicenseInfo?: string;
  installationDate?: string;
  ownershipManagement: string;
  source?: string;
  lastVerifiedDate?: string;
  readabilityDifficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
  roiScore?: number;
  roiBreakdown?: ROIBreakdown;
}

export interface BillboardMetadata {
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