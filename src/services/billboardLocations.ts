import { LocationSuggestion } from './locationService';

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
  trafficDirection: string;
  speedLimit: string;
  roadType: string;
  lighting: string;
  rentalRateOMR?: number;
  ownership: string;
  estimatedMonthlyImpressions?: number;
  trafficType?: string;
  primaryAudience?: string;
  competitionLevel?: string;
}

// Muscat Billboard Locations - Enriched Data
export const MUSCAT_BILLBOARD_LOCATIONS: BillboardLocation[] = [
  {
    id: '1',
    locationName: 'Darsait / CBD main highway (towards Seeb)',
    addressLandmark: 'Sultan Qaboos Rd corridor near CBD/Darsait',
    latitude: 23.6050,
    longitude: 58.5420,
    roadName: 'Sultan Qaboos Road',
    highwayDesignation: 'Route 1',
    district: 'Darsait / CBD',
    boardType: 'Billboard',
    format: 'Static (illuminated)',
    approxWidthM: 14,
    approxHeightM: 5,
    distanceFromRoadM: 80,
    trafficDirection: 'East → West (toward Seeb)',
    speedLimit: '100–120 kmh',
    roadType: 'Urban motorway',
    lighting: 'Backlit',
    rentalRateOMR: 2200,
    ownership: 'MediaOne',
    estimatedMonthlyImpressions: 1200000,
    trafficType: 'Commuter',
    primaryAudience: 'High-income professionals',
    competitionLevel: 'High'
  },
  {
    id: '2',
    locationName: 'Sultan Qaboos Highway corridor',
    addressLandmark: 'Airport → Ghala/Azaiba/Al Khuwair/Madina Qaboos/Qurum',
    latitude: 23.59012,
    longitude: 58.37613,
    roadName: 'Sultan Qaboos Road',
    highwayDesignation: 'Route 1',
    district: 'Multiple',
    boardType: 'Billboard',
    format: 'Static',
    approxWidthM: 14,
    approxHeightM: 5,
    distanceFromRoadM: 75,
    trafficDirection: 'Bidirectional',
    speedLimit: '100–120 kmh',
    roadType: 'Urban motorway',
    lighting: 'LED Illuminated',
    rentalRateOMR: 2500,
    ownership: 'Multiple operators (JCDecaux exclusivity for roadside)',
    estimatedMonthlyImpressions: 1500000,
    trafficType: 'Mixed',
    primaryAudience: 'Mixed demographics',
    competitionLevel: 'High'
  },
  {
    id: '3',
    locationName: 'Quriyat–Amerat Highway',
    addressLandmark: 'Quriyat ↔ Al Amerat corridor',
    latitude: 23.52,
    longitude: 58.55,
    roadName: 'Quriyat–Amerat Highway',
    highwayDesignation: 'Route 17',
    district: 'Al Amerat',
    boardType: 'Billboard',
    format: 'Static',
    approxWidthM: 12,
    approxHeightM: 4,
    distanceFromRoadM: 60,
    trafficDirection: 'Bidirectional',
    speedLimit: '80–100 kmh',
    roadType: 'Inter-urban arterial',
    lighting: 'Backlit',
    rentalRateOMR: 1500,
    ownership: 'MediaOne',
    estimatedMonthlyImpressions: 800000,
    trafficType: 'Commuter',
    primaryAudience: 'Families',
    competitionLevel: 'Low'
  },
  {
    id: '4',
    locationName: 'Muscat Municipality roadside network',
    addressLandmark: 'Across Muscat Governorate',
    latitude: 23.60,
    longitude: 58.45,
    roadName: 'Multiple city arterials',
    district: 'Multiple',
    boardType: 'Roadside / Street Furniture',
    format: 'Classic & Digital',
    approxWidthM: 6,
    approxHeightM: 3,
    distanceFromRoadM: 5,
    trafficDirection: 'Varies',
    speedLimit: 'Varies',
    roadType: 'Urban arterials & streets',
    lighting: 'Backlit',
    rentalRateOMR: 450,
    ownership: 'JCDecaux Oman (exclusive roadside)',
    estimatedMonthlyImpressions: 350000,
    trafficType: 'Mixed',
    primaryAudience: 'Mixed demographics',
    competitionLevel: 'Medium'
  },
  {
    id: '5',
    locationName: 'Al Mouj Muscat (The Wave) - DOOH',
    addressLandmark: 'Marina, retail promenades, internal boulevards',
    latitude: 23.6234,
    longitude: 58.2891,
    roadName: 'Al Mouj internal roads',
    district: 'Al Mawaleh North / Al Hail North area',
    boardType: 'DOOH network',
    format: 'Digital screens',
    approxWidthM: 4,
    approxHeightM: 2.5,
    distanceFromRoadM: 15,
    trafficDirection: 'Pedestrian & low-speed vehicular',
    speedLimit: '30–50 kmh',
    roadType: 'Mixed-use district streets',
    lighting: 'Digital LED',
    rentalRateOMR: 900,
    ownership: 'Mubashir (with Al Mouj)',
    estimatedMonthlyImpressions: 200000,
    trafficType: 'Tourist',
    primaryAudience: 'Tourists & residents',
    competitionLevel: 'Low'
  },
  {
    id: '6',
    locationName: 'Oman Convention & Exhibition Centre',
    addressLandmark: 'OCEC campus near Muscat International Airport',
    latitude: 23.5955,
    longitude: 58.2845,
    roadName: 'OCEC internal roads / Airport heights',
    district: 'Madinat Al-Irfan',
    boardType: 'DOOH & billboards',
    format: 'Digital & static',
    approxWidthM: 5,
    approxHeightM: 3,
    distanceFromRoadM: 20,
    trafficDirection: 'Campus/internal arterials',
    speedLimit: '30–60 kmh',
    roadType: 'District arterials',
    lighting: 'Digital LED',
    rentalRateOMR: 1100,
    ownership: 'Mubashir (network partner); OMRAN (asset owner)',
    estimatedMonthlyImpressions: 250000,
    trafficType: 'Commercial',
    primaryAudience: 'Business professionals',
    competitionLevel: 'Low'
  },
  {
    id: '7',
    locationName: 'OOMCO - Ruwi Valley Service Station',
    addressLandmark: 'Ruwi Valley OOMCO station',
    latitude: 23.59,
    longitude: 58.54,
    roadName: 'Ruwi Valley Road',
    district: 'Ruwi / CBD',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    approxWidthM: 2,
    approxHeightM: 1.5,
    distanceFromRoadM: 10,
    trafficDirection: 'Forecourt traffic',
    speedLimit: '60–80 kmh',
    roadType: 'Urban arterial',
    lighting: 'Integrated LED (24/7)',
    rentalRateOMR: 600,
    ownership: 'Oman Oil Marketing (OOMCO)',
    estimatedMonthlyImpressions: 100000,
    trafficType: 'Commercial',
    primaryAudience: 'Mixed demographics',
    competitionLevel: 'Medium'
  },
  {
    id: '8',
    locationName: 'OOMCO - Amerat Heights Service Station',
    addressLandmark: 'Amerat Heights OOMCO station',
    latitude: 23.52,
    longitude: 58.50,
    roadName: 'Al Amerat corridor',
    district: 'Al Amerat',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    approxWidthM: 2,
    approxHeightM: 1.5,
    distanceFromRoadM: 8,
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban arterial',
    lighting: 'Integrated LED (24/7)',
    rentalRateOMR: 500,
    ownership: 'Oman Oil Marketing (OOMCO)',
    estimatedMonthlyImpressions: 80000,
    trafficType: 'Residential',
    primaryAudience: 'Families',
    competitionLevel: 'Low'
  },
  {
    id: '9',
    locationName: 'OOMCO - Al Khuwair 33 Service Station',
    addressLandmark: 'Al Khuwair 33 OOMCO station',
    latitude: 23.5847,
    longitude: 58.432,
    roadName: 'Al Khuwair 33',
    district: 'Al Khuwair',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    approxWidthM: 3,
    approxHeightM: 2,
    distanceFromRoadM: 12,
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban street',
    lighting: 'Integrated LED (24/7)',
    rentalRateOMR: 700,
    ownership: 'Oman Oil Marketing (OOMCO)',
    estimatedMonthlyImpressions: 120000,
    trafficType: 'Commercial',
    primaryAudience: 'High-income professionals',
    competitionLevel: 'Medium'
  },
  {
    id: '10',
    locationName: 'OOMCO - Azaiba Service Station',
    addressLandmark: 'Azaiba OOMCO station',
    latitude: 23.585613,
    longitude: 58.38108,
    roadName: 'Azaiba',
    district: 'Azaiba',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    approxWidthM: 3,
    approxHeightM: 2,
    distanceFromRoadM: 10,
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban arterial',
    lighting: 'Integrated LED (24/7)',
    rentalRateOMR: 650,
    ownership: 'Oman Oil Marketing (OOMCO)',
    estimatedMonthlyImpressions: 110000,
    trafficType: 'Mixed',
    primaryAudience: 'Mixed demographics',
    competitionLevel: 'Medium'
  },
  {
    id: '11',
    locationName: 'OOMCO - Wadi Hatat Service Stations',
    addressLandmark: 'Wadi Hatat (and Twin) OOMCO stations',
    latitude: 23.47314,
    longitude: 58.49451,
    roadName: 'Wadi Adai–Ruwi link',
    district: 'Wadi Adai / Ruwi',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    approxWidthM: 2,
    approxHeightM: 1.5,
    distanceFromRoadM: 8,
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban arterial',
    lighting: 'Integrated LED (24/7)',
    rentalRateOMR: 550,
    ownership: 'Oman Oil Marketing (OOMCO)',
    estimatedMonthlyImpressions: 90000,
    trafficType: 'Commuter',
    primaryAudience: 'Industrial workers',
    competitionLevel: 'Low'
  },
  {
    // REFERENCE LOCATION - Premium highway billboard with complete data
    id: '12',
    locationName: 'Muscat Expressway corridor',
    addressLandmark: 'Muscat Expressway segment (Halban connector) - Premium highway location',
    latitude: 23.564436,
    longitude: 58.206192,
    roadName: 'Muscat Expressway',
    highwayDesignation: 'Route 1 Extension',
    district: 'Halban / West Muscat',
    boardType: 'Billboard',
    format: 'Static (LED Illuminated)',
    approxWidthM: 14,
    approxHeightM: 5,
    distanceFromRoadM: 100,
    trafficDirection: 'Bidirectional',
    speedLimit: '120 kmh',
    roadType: 'Expressway',
    lighting: 'LED Illuminated',
    rentalRateOMR: 2500,
    ownership: 'JCDecaux Oman (roadside)',
    estimatedMonthlyImpressions: 1400000,
    trafficType: 'Commuter',
    primaryAudience: 'High-income professionals',
    competitionLevel: 'Medium'
  }
];

// Convert to LocationSuggestion format for the location input
export const getBillboardLocationSuggestions = (): LocationSuggestion[] => {
  return MUSCAT_BILLBOARD_LOCATIONS.map(location => ({
    address: `${location.locationName} - ${location.addressLandmark}`,
    coordinates: {
      lat: location.latitude || 23.5880, // Default to Muscat center if no coords
      lng: location.longitude || 58.3829
    },
    type: location.boardType.toLowerCase()
  }));
};

// Get location details by ID
export const getBillboardLocationById = (id: string): BillboardLocation | undefined => {
  return MUSCAT_BILLBOARD_LOCATIONS.find(location => location.id === id);
};

// Search billboard locations
export const searchBillboardLocations = (query: string): BillboardLocation[] => {
  const searchTerm = query.toLowerCase();
  return MUSCAT_BILLBOARD_LOCATIONS.filter(location =>
    location.locationName.toLowerCase().includes(searchTerm) ||
    location.addressLandmark.toLowerCase().includes(searchTerm) ||
    location.roadName.toLowerCase().includes(searchTerm) ||
    location.district.toLowerCase().includes(searchTerm)
  );
};

// Get locations by district
export const getLocationsByDistrict = (district: string): BillboardLocation[] => {
  return MUSCAT_BILLBOARD_LOCATIONS.filter(location =>
    location.district.toLowerCase().includes(district.toLowerCase())
  );
};

// Get locations by road type (for speed/distance analysis)
export const getLocationsByRoadType = (roadType: string): BillboardLocation[] => {
  return MUSCAT_BILLBOARD_LOCATIONS.filter(location =>
    location.roadType.toLowerCase().includes(roadType.toLowerCase())
  );
};

// Get locations by traffic type
export const getLocationsByTrafficType = (trafficType: string): BillboardLocation[] => {
  return MUSCAT_BILLBOARD_LOCATIONS.filter(location =>
    location.trafficType?.toLowerCase() === trafficType.toLowerCase()
  );
};

// Get premium highway locations (for high-visibility campaigns)
export const getPremiumHighwayLocations = (): BillboardLocation[] => {
  return MUSCAT_BILLBOARD_LOCATIONS.filter(location =>
    (location.roadType.toLowerCase().includes('expressway') ||
     location.roadType.toLowerCase().includes('motorway')) &&
    (location.estimatedMonthlyImpressions || 0) >= 1000000
  );
};
