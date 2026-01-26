import { LocationSuggestion } from './locationService';

export interface BillboardLocation {
  id: string;
  locationName: string;
  addressLandmark: string;
  latitude?: number;
  longitude?: number;
  roadName: string;
  district: string;
  boardType: string;
  format: string;
  trafficDirection: string;
  speedLimit: string;
  roadType: string;
  rentalRate?: string;
  ownership: string;
}

// Muscat Billboard Locations from your provided data
export const MUSCAT_BILLBOARD_LOCATIONS: BillboardLocation[] = [
  {
    id: '1',
    locationName: 'Darsait / CBD main highway (towards Seeb)',
    addressLandmark: 'Sultan Qaboos Rd corridor near CBD/Darsait',
    roadName: 'Sultan Qaboos Road',
    district: 'Darsait / CBD',
    boardType: 'Billboard',
    format: 'Static (likely illuminated)',
    trafficDirection: 'East → West (toward Seeb)',
    speedLimit: '100–120 kmh',
    roadType: 'Urban motorway',
    ownership: 'MediaOne'
  },
  {
    id: '2',
    locationName: 'Sultan Qaboos Highway corridor',
    addressLandmark: 'Airport → Ghala/Azaiba/Al Khuwair/Madina Qaboos/Qurum',
    latitude: 23.59012,
    longitude: 58.37613,
    roadName: 'Sultan Qaboos Road',
    district: 'Multiple',
    boardType: 'Billboard',
    format: 'Static',
    trafficDirection: 'Bidirectional',
    speedLimit: '100–120 kmh',
    roadType: 'Urban motorway',
    ownership: 'Multiple operators (JCDecaux exclusivity for roadside)'
  },
  {
    id: '3',
    locationName: 'Quriyat–Amerat Highway',
    addressLandmark: 'Quriyat ↔ Al Amerat corridor',
    roadName: 'Quriyat–Amerat Highway',
    district: 'Al Amerat',
    boardType: 'Billboard',
    format: 'Static',
    trafficDirection: 'Bidirectional',
    speedLimit: '80–100 kmh',
    roadType: 'Inter-urban arterial',
    ownership: 'MediaOne'
  },
  {
    id: '4',
    locationName: 'Muscat Municipality roadside network',
    addressLandmark: 'Across Muscat Governorate',
    roadName: 'Multiple city arterials',
    district: 'Multiple',
    boardType: 'Roadside / Street Furniture',
    format: 'Classic & Digital',
    trafficDirection: 'Varies',
    speedLimit: 'Varies',
    roadType: 'Urban arterials & streets',
    ownership: 'JCDecaux Oman (exclusive roadside)'
  },
  {
    id: '5',
    locationName: 'Al Mouj Muscat (The Wave) - DOOH',
    addressLandmark: 'Marina, retail promenades, internal boulevards',
    roadName: 'Al Mouj internal roads',
    district: 'Al Mawaleh North / Al Hail North area',
    boardType: 'DOOH network',
    format: 'Digital screens',
    trafficDirection: 'Pedestrian & low-speed vehicular',
    speedLimit: '30–50 kmh',
    roadType: 'Mixed-use district streets',
    ownership: 'Mubashir (with Al Mouj)'
  },
  {
    id: '6',
    locationName: 'Oman Convention & Exhibition Centre',
    addressLandmark: 'OCEC campus near Muscat International Airport',
    roadName: 'OCEC internal roads / Airport heights',
    district: 'Madinat Al-Irfan',
    boardType: 'DOOH & billboards',
    format: 'Digital & static',
    trafficDirection: 'Campus/internal arterials',
    speedLimit: '30–60 kmh',
    roadType: 'District arterials',
    ownership: 'Mubashir (network partner); OMRAN (asset owner)'
  },
  {
    id: '7',
    locationName: 'OOMCO - Ruwi Valley Service Station',
    addressLandmark: 'Ruwi Valley OOMCO station',
    roadName: 'Ruwi Valley Road',
    district: 'Ruwi / CBD',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    trafficDirection: 'Forecourt traffic',
    speedLimit: '60–80 kmh',
    roadType: 'Urban arterial',
    ownership: 'Oman Oil Marketing (OOMCO)'
  },
  {
    id: '8',
    locationName: 'OOMCO - Amerat Heights Service Station',
    addressLandmark: 'Amerat Heights OOMCO station',
    roadName: 'Al Amerat corridor',
    district: 'Al Amerat',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban arterial',
    ownership: 'Oman Oil Marketing (OOMCO)'
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
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban street',
    ownership: 'Oman Oil Marketing (OOMCO)'
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
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban arterial',
    ownership: 'Oman Oil Marketing (OOMCO)'
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
    trafficDirection: 'Forecourt traffic',
    speedLimit: '80 kmh',
    roadType: 'Urban arterial',
    ownership: 'Oman Oil Marketing (OOMCO)'
  },
  {
    id: '12',
    locationName: 'Muscat Expressway corridor',
    addressLandmark: 'Muscat Expressway segment (Halban connector)',
    latitude: 23.564436,
    longitude: 58.206192,
    roadName: 'Muscat Expressway',
    district: 'Halban / West Muscat',
    boardType: 'Billboard',
    format: 'Static',
    trafficDirection: 'Bidirectional',
    speedLimit: '120 kmh',
    roadType: 'Expressway',
    ownership: 'Likely JCDecaux (roadside)'
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