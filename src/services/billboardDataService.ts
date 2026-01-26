import { BillboardLocation, BillboardMetadata } from '../types/billboard';

// Parse the CSV data into structured billboard locations
const MUSCAT_BILLBOARD_DATA: BillboardLocation[] = [
  {
    id: '1',
    locationName: 'Darsait / CBD main highway (towards Seeb)',
    addressLandmark: 'Sultan Qaboos Rd corridor near CBD/Darsait',
    roadName: 'Sultan Qaboos Road',
    highwayDesignation: 'N5 (Route 1)',
    district: 'Darsait / CBD',
    boardType: 'Billboard',
    format: 'Static (likely illuminated)',
    trafficDirectionVisibility: 'East → West (toward Seeb)',
    speedLimitKmh: '100–120',
    roadType: 'Urban motorway',
    lighting: 'TBD',
    ownershipManagement: 'MediaOne',
    readabilityDifficulty: 'hard'
  },
  {
    id: '2',
    locationName: 'Sultan Qaboos Highway corridor – reference site',
    addressLandmark: 'Airport → Ghala/Azaiba/Al Khuwair/Madina Qaboos/Qurum',
    latitude: 23.59012,
    longitude: 58.37613,
    roadName: 'Sultan Qaboos Road',
    highwayDesignation: 'N5 (Route 1)',
    district: 'Multiple',
    boardType: 'Billboard',
    format: 'Static',
    trafficDirectionVisibility: 'Bidirectional',
    speedLimitKmh: '100–120',
    roadType: 'Urban motorway',
    lighting: 'TBD',
    ownershipManagement: 'Multiple operators (JCDecaux exclusivity)',
    readabilityDifficulty: 'hard'
  },
  {
    id: '3',
    locationName: 'Quriyat–Amerat Highway – reference site',
    addressLandmark: 'Quriyat ↔ Al Amerat corridor',
    roadName: 'Quriyat–Amerat Highway',
    district: 'Al Amerat',
    boardType: 'Billboard',
    format: 'Static',
    trafficDirectionVisibility: 'Bidirectional',
    speedLimitKmh: '80–100',
    roadType: 'Inter-urban arterial',
    lighting: 'TBD',
    ownershipManagement: 'MediaOne',
    readabilityDifficulty: 'medium'
  },
  {
    id: '4',
    locationName: 'Muscat Municipality roadside & street furniture network',
    addressLandmark: 'Across Muscat Governorate',
    roadName: 'Multiple city arterials',
    district: 'Multiple',
    boardType: 'Roadside / Street Furniture',
    format: 'Classic & Digital',
    trafficDirectionVisibility: 'Varies',
    speedLimitKmh: 'Varies',
    roadType: 'Urban arterials & streets',
    lighting: 'Varies',
    ownershipManagement: 'JCDecaux Oman (exclusive roadside)',
    readabilityDifficulty: 'easy'
  },
  {
    id: '5',
    locationName: 'Al Mouj Muscat (The Wave) – community DOOH',
    addressLandmark: 'Marina, retail promenades, internal boulevards',
    roadName: 'Al Mouj internal roads',
    district: 'Al Mawaleh North / Al Hail North area',
    boardType: 'DOOH network',
    format: 'Digital screens',
    trafficDirectionVisibility: 'Pedestrian & low-speed vehicular',
    speedLimitKmh: '30–50',
    roadType: 'Mixed-use district streets',
    lighting: 'Digital backlit',
    ownershipManagement: 'Mubashir (with Al Mouj)',
    readabilityDifficulty: 'easy'
  },
  {
    id: '6',
    locationName: 'Oman Convention & Exhibition Centre / Madinat Al-Irfan',
    addressLandmark: 'OCEC campus near Muscat International Airport',
    roadName: 'OCEC internal roads / Airport heights',
    district: 'Madinat Al-Irfan',
    boardType: 'DOOH & billboards',
    format: 'Digital & static',
    trafficDirectionVisibility: 'Campus/internal arterials',
    speedLimitKmh: '30–60',
    roadType: 'District arterials',
    lighting: 'Digital backlit / illuminated static',
    ownershipManagement: 'Mubashir (network partner); OMRAN (asset owner)',
    readabilityDifficulty: 'easy'
  },
  {
    id: '7',
    locationName: 'OOMCO – Ruwi Valley Service Station',
    addressLandmark: 'Ruwi Valley OOMCO station',
    roadName: 'Ruwi Valley Road',
    district: 'Ruwi / CBD',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    trafficDirectionVisibility: 'Forecourt traffic',
    speedLimitKmh: '60–80',
    roadType: 'Urban arterial',
    lighting: 'Digital',
    ownershipManagement: 'Oman Oil Marketing (OOMCO)',
    readabilityDifficulty: 'medium'
  },
  {
    id: '8',
    locationName: 'OOMCO – Amerat Heights Service Station',
    addressLandmark: 'Amerat Heights OOMCO station',
    roadName: 'Al Amerat corridor',
    district: 'Al Amerat',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    trafficDirectionVisibility: 'Forecourt traffic',
    speedLimitKmh: '80',
    roadType: 'Urban arterial',
    lighting: 'Digital',
    ownershipManagement: 'Oman Oil Marketing (OOMCO)',
    readabilityDifficulty: 'medium'
  },
  {
    id: '9',
    locationName: 'OOMCO – Al Khuwair 33 Service Station',
    addressLandmark: 'Al Khuwair 33 OOMCO station',
    latitude: 23.5847,
    longitude: 58.432,
    roadName: 'Al Khuwair 33',
    district: 'Al Khuwair',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    trafficDirectionVisibility: 'Forecourt traffic',
    speedLimitKmh: '80',
    roadType: 'Urban street',
    lighting: 'Digital',
    ownershipManagement: 'Oman Oil Marketing (OOMCO)',
    readabilityDifficulty: 'medium'
  },
  {
    id: '10',
    locationName: 'OOMCO – Azaiba Service Station',
    addressLandmark: 'Azaiba OOMCO station',
    latitude: 23.585613,
    longitude: 58.38108,
    roadName: 'Azaiba',
    district: 'Azaiba',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    trafficDirectionVisibility: 'Forecourt traffic',
    speedLimitKmh: '80',
    roadType: 'Urban arterial',
    lighting: 'Digital',
    ownershipManagement: 'Oman Oil Marketing (OOMCO)',
    readabilityDifficulty: 'medium'
  },
  {
    id: '11',
    locationName: 'OOMCO – Wadi Hatat / Wadi Adai Service Stations',
    addressLandmark: 'Wadi Hatat (and Twin) OOMCO stations',
    latitude: 23.47314,
    longitude: 58.49451,
    roadName: 'Wadi Adai–Ruwi link',
    district: 'Wadi Adai / Ruwi',
    boardType: 'Forecourt digital',
    format: 'Digital (DOOH)',
    trafficDirectionVisibility: 'Forecourt traffic',
    speedLimitKmh: '80',
    roadType: 'Urban arterial',
    lighting: 'Digital',
    ownershipManagement: 'Oman Oil Marketing (OOMCO)',
    readabilityDifficulty: 'medium'
  },
  {
    id: '12',
    locationName: 'Muscat Expressway corridor – reference site',
    addressLandmark: 'Muscat Expressway segment (Halban connector)',
    latitude: 23.564436,
    longitude: 58.206192,
    roadName: 'Muscat Expressway',
    district: 'Halban / West Muscat',
    boardType: 'Billboard',
    format: 'Static',
    trafficDirectionVisibility: 'Bidirectional',
    speedLimitKmh: '120',
    roadType: 'Expressway',
    lighting: 'TBD',
    ownershipManagement: 'Likely JCDecaux (roadside)',
    readabilityDifficulty: 'extreme'
  }
];

export class BillboardDataService {
  static getAllLocations(): BillboardLocation[] {
    return MUSCAT_BILLBOARD_DATA.map(location => {
      const roiData = this.calculateROIScore(location);
      return {
        ...location,
        roiScore: roiData.score,
        roiBreakdown: roiData.breakdown
      };
    });
  }

  static getLocationById(id: string): BillboardLocation | undefined {
    const location = MUSCAT_BILLBOARD_DATA.find(loc => loc.id === id);
    if (location) {
      const roiData = this.calculateROIScore(location);
      return {
        ...location,
        roiScore: roiData.score,
        roiBreakdown: roiData.breakdown
      };
    }
    return undefined;
  }

  static searchLocations(query: string): BillboardLocation[] {
    const searchTerm = query.toLowerCase();
    return this.getAllLocations().filter(location =>
      location.locationName.toLowerCase().includes(searchTerm) ||
      location.addressLandmark.toLowerCase().includes(searchTerm) ||
      location.roadName.toLowerCase().includes(searchTerm) ||
      location.district.toLowerCase().includes(searchTerm) ||
      location.boardType.toLowerCase().includes(searchTerm)
    );
  }

  static getLocationsByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): BillboardLocation[] {
    return MUSCAT_BILLBOARD_DATA.filter(location => location.readabilityDifficulty === difficulty);
  }

  static getLocationsByROI(minScore: number): BillboardLocation[] {
    return this.getAllLocations().filter(location => (location.roiScore || 0) >= minScore);
  }

  static generateMetadata(location: BillboardLocation): BillboardMetadata {
    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    
    return {
      location,
      analysisContext: {
        viewingDistance: location.distanceFromRoadM || this.estimateViewingDistance(location.roadType),
        speedContext: {
          kmh: avgSpeed,
          mph: Math.round(avgSpeed * 0.621371),
          category: this.categorizeRoadType(location.roadType)
        },
        visibilityFactors: {
          lighting: this.categorizeLighting(location.lighting),
          trafficFlow: this.categorizeTrafficFlow(location.trafficDirectionVisibility),
          obstruction: this.estimateObstruction(location.boardType, location.roadType)
        },
        businessIntelligence: {
          rentalRate: this.parseRentalRate(location.rentalRateOmrMonth),
          impressionsPerMonth: this.estimateImpressions(location),
          costPerThousandImpressions: this.calculateCPM(location),
          competitorPresence: this.identifyCompetitors(location.ownershipManagement)
        }
      }
    };
  }

  private static parseSpeedLimit(speedLimit: string): { min: number; max: number } {
    const matches = speedLimit.match(/(\d+)(?:–(\d+))?/);
    if (!matches) return { min: 50, max: 50 };
    
    const min = parseInt(matches[1]);
    const max = matches[2] ? parseInt(matches[2]) : min;
    return { min, max };
  }

  private static estimateViewingDistance(roadType: string): number {
    switch (roadType.toLowerCase()) {
      case 'expressway': return 150;
      case 'urban motorway': return 100;
      case 'inter-urban arterial': return 80;
      case 'urban arterial': return 60;
      case 'urban street': return 40;
      case 'district arterials': return 50;
      case 'mixed-use district streets': return 30;
      default: return 75;
    }
  }

  private static categorizeRoadType(roadType: string): 'urban' | 'arterial' | 'highway' | 'expressway' {
    const type = roadType.toLowerCase();
    if (type.includes('expressway')) return 'expressway';
    if (type.includes('motorway') || type.includes('highway')) return 'highway';
    if (type.includes('arterial')) return 'arterial';
    return 'urban';
  }

  private static categorizeLighting(lighting: string): 'excellent' | 'good' | 'fair' | 'poor' {
    const light = lighting.toLowerCase();
    if (light.includes('digital') || light.includes('backlit')) return 'excellent';
    if (light.includes('illuminated')) return 'good';
    if (light === 'tbd' || light === 'varies') return 'fair';
    return 'poor';
  }

  private static categorizeTrafficFlow(visibility: string): 'unidirectional' | 'bidirectional' | 'complex' {
    const vis = visibility.toLowerCase();
    if (vis.includes('bidirectional')) return 'bidirectional';
    if (vis.includes('varies') || vis.includes('campus') || vis.includes('forecourt')) return 'complex';
    return 'unidirectional';
  }

  private static estimateObstruction(boardType: string, roadType: string): 'none' | 'minimal' | 'moderate' | 'significant' {
    if (boardType.toLowerCase().includes('forecourt')) return 'moderate';
    if (roadType.toLowerCase().includes('expressway')) return 'none';
    if (roadType.toLowerCase().includes('urban')) return 'minimal';
    return 'minimal';
  }

  private static parseRentalRate(rate?: string): number | undefined {
    if (!rate) return undefined;
    const matches = rate.match(/(\d+)/);
    return matches ? parseInt(matches[1]) : undefined;
  }

  private static estimateImpressions(location: BillboardLocation): number {
    const baseImpressions = {
      'expressway': 500000,
      'urban motorway': 300000,
      'inter-urban arterial': 200000,
      'urban arterial': 150000,
      'urban street': 80000,
      'district arterials': 100000,
      'mixed-use district streets': 60000
    };

    const roadTypeKey = location.roadType.toLowerCase().replace(/\s+/g, ' ');
    let impressions = baseImpressions[roadTypeKey as keyof typeof baseImpressions] || 100000;

    // Adjust for digital vs static
    if (location.format.toLowerCase().includes('digital')) {
      impressions *= 1.3; // Digital gets more attention
    }

    // Adjust for traffic direction
    if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
      impressions *= 1.8;
    }

    return Math.round(impressions);
  }

  private static calculateCPM(location: BillboardLocation): number {
    const impressions = this.estimateImpressions(location);
    const rentalRate = this.parseRentalRate(location.rentalRateOmrMonth) || 2000; // Default OMR 2000
    
    return Math.round((rentalRate / impressions) * 1000 * 100) / 100; // CPM in OMR
  }

  private static identifyCompetitors(ownership: string): string[] {
    const competitors: string[] = [];
    
    if (ownership.toLowerCase().includes('mediaone')) competitors.push('MediaOne');
    if (ownership.toLowerCase().includes('jcdecaux')) competitors.push('JCDecaux');
    if (ownership.toLowerCase().includes('mubashir')) competitors.push('Mubashir');
    if (ownership.toLowerCase().includes('oomco')) competitors.push('OOMCO');
    if (ownership.toLowerCase().includes('omran')) competitors.push('OMRAN');
    
    return competitors;
  }

  // Strategic analysis methods
  static getTrafficType(location: BillboardLocation): 'Business' | 'Residential' | 'Mixed' {
    const roadName = location.roadName.toLowerCase();
    const district = location.district.toLowerCase();
    const landmark = location.addressLandmark.toLowerCase();

    if (roadName.includes('business') || district.includes('cbd') || 
        landmark.includes('business') || landmark.includes('commercial') ||
        location.locationName.toLowerCase().includes('ocec')) {
      return 'Business';
    }
    
    if (district.includes('qurum') || district.includes('azaiba') || 
        district.includes('al khuwair') || district.includes('residential') ||
        landmark.includes('residential')) {
      return 'Residential';
    }
    
    return 'Mixed';
  }

  static getAudienceEstimate(location: BillboardLocation): 'Young Professional' | 'Family' | 'Mixed' {
    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    const trafficType = this.getTrafficType(location);
    
    if (avgSpeed >= 80 && trafficType === 'Business') {
      return 'Young Professional';
    }
    
    if (avgSpeed <= 60 && trafficType === 'Residential') {
      return 'Family';
    }
    
    return 'Mixed';
  }

  static getCompetitionLevel(location: BillboardLocation): 'High' | 'Medium' | 'Low' {
    const ownership = location.ownershipManagement.toLowerCase();
    
    // High competition areas (multiple operators or exclusive deals)
    if (ownership.includes('multiple') || ownership.includes('exclusive') ||
        location.roadName.toLowerCase().includes('sultan qaboos')) {
      return 'High';
    }
    
    // Medium competition (established operators)
    if (ownership.includes('jcdecaux') || ownership.includes('mediaone')) {
      return 'Medium';
    }
    
    return 'Low';
  }

  static calculateLocationScore(location: BillboardLocation): {
    speedScore: number;
    distanceScore: number;
    sizeScore: number;
    costScore: number;
    totalScore: number;
    roiScore: number;
    readabilityScore: number;
    suitabilityScore: number;
  } {
    // Speed Score (30% weight) - Lower speed = better readability
    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    const speedScore = Math.max(0, Math.min(30, 30 - (avgSpeed - 30) * 0.3));
    
    // Distance Score (25% weight) - Closer to road = better visibility
    const distance = location.distanceFromRoadM || this.estimateViewingDistance(location.roadType);
    const distanceScore = Math.max(0, Math.min(25, 25 - (distance - 20) * 0.2));
    
    // Size Score (20% weight) - Larger dimensions = more impact
    const width = location.approxWidthM || 14; // Standard billboard width
    const height = location.approxHeightM || 5; // Standard billboard height
    const area = width * height;
    const sizeScore = Math.min(20, (area / 70) * 20); // 70 sqm as baseline
    
    // Cost Score (25% weight) - Lower cost = better value
    const rentalRate = this.parseRentalRate(location.rentalRateOmrMonth) || 2000;
    const costScore = Math.max(0, Math.min(25, 25 - (rentalRate - 1000) * 0.01));
    
    const totalScore = Math.round(speedScore + distanceScore + sizeScore + costScore);
    
    // Calculate separate specialized scores
    const roiData = this.calculateROIScore(location);
    const readabilityScore = this.calculateReadabilityScore(location);
    const suitabilityScore = this.calculateSuitabilityScore(location);

    return {
      speedScore: Math.round(speedScore),
      distanceScore: Math.round(distanceScore),
      sizeScore: Math.round(sizeScore),
      costScore: Math.round(costScore),
      totalScore,
      roiScore: roiData.score,
      readabilityScore,
      suitabilityScore
    };
  }

  static calculateROIScore(location: BillboardLocation): {
    score: number;
    breakdown: {
      dailyImpressions: number;
      monthlyCost: number;
      cpm: number;
      marketPosition: string;
    };
  } {
    // Traffic volume estimation based on road type
    const trafficMultipliers: Record<string, number> = {
      'Expressway': 45000,
      'Urban motorway': 35000,
      'Inter-urban arterial': 25000,
      'Urban arterial': 20000,
      'Urban street': 15000,
      'District arterials': 18000,
      'Mixed-use district streets': 12000
    };

    const baseTraffic = trafficMultipliers[location.roadType] || 20000;

    // Speed factor - higher speeds = more traffic volume
    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    const speedFactor = avgSpeed >= 100 ? 1.3 : avgSpeed >= 80 ? 1.15 : 1.0;

    // Direction factor - bidirectional doubles exposure
    const directionFactor = location.trafficDirectionVisibility?.toLowerCase().includes('bidirectional') ? 2.0 : 1.0;

    // Calculate daily impressions
    const dailyImpressions = Math.round(baseTraffic * speedFactor * directionFactor);

    // Monthly cost
    const monthlyCost = this.parseRentalRate(location.rentalRateOmrMonth) || 800;

    // Calculate CPM (Cost Per 1000 impressions)
    const monthlyImpressions = dailyImpressions * 30;
    const cpm = (monthlyCost / monthlyImpressions) * 1000;

    // Industry benchmark CPM in Oman: 0.08-0.15 OMR
    const benchmarkCPM = 0.12;

    // Calculate ROI score (lower CPM = better ROI)
    // Score 100 = matches benchmark, >100 would be better than benchmark
    let roiScore = Math.round((benchmarkCPM / cpm) * 85);

    // Cap at realistic maximum
    roiScore = Math.min(95, Math.max(20, roiScore));

    // Determine market position
    let marketPosition: string;
    if (roiScore >= 80) marketPosition = 'Premium Value';
    else if (roiScore >= 60) marketPosition = 'Good Value';
    else if (roiScore >= 40) marketPosition = 'Fair Value';
    else marketPosition = 'Budget Option';

    return {
      score: roiScore,
      breakdown: {
        dailyImpressions,
        monthlyCost,
        cpm: parseFloat(cpm.toFixed(4)),
        marketPosition
      }
    };
  }

  static calculateReadabilityScore(location: BillboardLocation): number {
    let score = 50; // Base score
    
    // Speed impact on readability (inverse relationship)
    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    if (avgSpeed <= 50) score += 25; // Excellent for reading
    else if (avgSpeed <= 80) score += 15; // Good for reading
    else if (avgSpeed <= 100) score += 5; // Challenging
    else score -= 10; // Very challenging
    
    // Distance impact
    const distance = location.distanceFromRoadM || this.estimateViewingDistance(location.roadType);
    if (distance <= 30) score += 20;
    else if (distance <= 60) score += 10;
    else if (distance <= 100) score += 0;
    else score -= 15;
    
    // Board size impact
    const width = location.approxWidthM || 14;
    const height = location.approxHeightM || 5;
    const area = width * height;
    if (area >= 100) score += 15; // Large board
    else if (area >= 70) score += 10; // Standard
    else score += 5; // Small
    
    // Lighting impact
    if (location.lighting.toLowerCase().includes('digital') || 
        location.lighting.toLowerCase().includes('backlit')) {
      score += 10;
    }
    
    return Math.max(20, Math.min(100, score));
  }

  static calculateSuitabilityScore(location: BillboardLocation): number {
    let score = 50; // Base score
    
    // Location type suitability
    const roadType = location.roadType.toLowerCase();
    if (roadType.includes('expressway')) score += 20; // Premium placement
    else if (roadType.includes('motorway') || roadType.includes('highway')) score += 15;
    else if (roadType.includes('arterial')) score += 10;
    else score += 5;
    
    // Format suitability
    if (location.format.toLowerCase().includes('digital')) {
      score += 15; // Modern, flexible
    }
    
    // Ownership reliability
    const ownership = location.ownershipManagement.toLowerCase();
    if (ownership.includes('jcdecaux') || ownership.includes('mediaone')) {
      score += 10; // Established operators
    }
    
    // Traffic direction advantage
    if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
      score += 10;
    }
    
    // District desirability
    const district = location.district.toLowerCase();
    if (district.includes('cbd') || district.includes('business')) {
      score += 10;
    }
    
    return Math.max(20, Math.min(100, score));
  }

  static getLocationRecommendations(location: BillboardLocation): {
    speedRecommendation: string;
    locationInsight: string;
    creativeStrategy: string;
  } {
    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    const roadType = location.roadType.toLowerCase();
    const district = location.district.toLowerCase();
    const boardType = location.boardType.toLowerCase();
    
    // Speed-based recommendations
    let speedRecommendation = '';
    if (avgSpeed > 100) {
      speedRecommendation = 'High-speed location: Use large fonts (minimum 200px), maximum contrast colors, and limit to 6 words or less. Consider bold, sans-serif fonts for optimal highway readability.';
    } else if (avgSpeed >= 60) {
      speedRecommendation = 'Medium-speed location: Balanced approach works well. Use clear fonts (minimum 150px), good contrast, and keep messaging concise (8-10 words maximum).';
    } else {
      speedRecommendation = 'Low-speed location: Detailed messaging acceptable. Can use smaller fonts (100px+), more text elements, and complex layouts as viewers have more time to read.';
    }
    
    // Add DOOH/Forecourt specific recommendations
    if (boardType.includes('dooh') || location.format.toLowerCase().includes('digital')) {
      speedRecommendation += ' Digital advantages: Consider animation, video content, or rotating messages to maximize engagement.';
    }
    
    if (boardType.includes('forecourt')) {
      speedRecommendation += ' Captive audience advantage: Detailed product information, QR codes, and promotional offers work well here.';
    }
    
    // Location-specific insights
    let locationInsight = '';
    if (roadType.includes('expressway')) {
      locationInsight = 'Premium expressway location: Maximum reach with high-income demographics. Requires simple, bold messaging due to high speeds. Excellent for brand awareness campaigns.';
    } else if (district.includes('cbd') || district.includes('business') || location.addressLandmark.toLowerCase().includes('business')) {
      locationInsight = 'Business district location: Professional audience during weekdays. Ideal for B2B messaging, financial services, and corporate communications. Peak traffic during rush hours.';
    } else if (district.includes('qurum') || district.includes('azaiba') || district.includes('al khuwair')) {
      locationInsight = 'Residential area location: Family-oriented demographics. Perfect for consumer products, family services, and lifestyle brands. Consider weekend traffic patterns.';
    } else if (location.addressLandmark.toLowerCase().includes('airport') || location.addressLandmark.toLowerCase().includes('ocec')) {
      locationInsight = 'Tourism/business hub: Mixed international and local audience. Consider bilingual content (Arabic/English). High-value demographics with travel/business focus.';
    } else if (location.addressLandmark.toLowerCase().includes('marina') || location.addressLandmark.toLowerCase().includes('al mouj')) {
      locationInsight = 'Luxury lifestyle location: Affluent demographics with leisure focus. Ideal for premium brands, real estate, and luxury services. Pedestrian-friendly environment.';
    } else {
      locationInsight = 'Mixed-use location: Diverse audience with varied demographics. Flexible messaging approach recommended. Good for general consumer brands and services.';
    }
    
    // Creative strategy recommendations
    let creativeStrategy = '';
    const trafficType = this.getTrafficType(location);
    const audience = this.getAudienceEstimate(location);
    
    if (trafficType === 'Business' && audience === 'Young Professional') {
      creativeStrategy = 'Target young professionals: Use modern design, tech-forward messaging, and professional color schemes. Consider LinkedIn-style aesthetics and career-focused benefits.';
    } else if (trafficType === 'Residential' && audience === 'Family') {
      creativeStrategy = 'Target families: Use warm colors, family imagery, and benefit-focused messaging. Emphasize safety, value, and family well-being. Consider Arabic cultural values.';
    } else if (avgSpeed >= 100) {
      creativeStrategy = 'Highway strategy: Bold, simple design with maximum contrast. Use primary colors, minimal text, and strong call-to-action. Focus on brand recognition over detailed information.';
    } else {
      creativeStrategy = 'Balanced strategy: Combine brand awareness with informational content. Use clear hierarchy, readable fonts, and strategic color psychology for MENA market preferences.';
    }
    
    return {
      speedRecommendation,
      locationInsight,
      creativeStrategy
    };
  }
  static getLocationProsAndCons(location: BillboardLocation): {
    pros: string[];
    cons: string[];
  } {
    const pros: string[] = [];
    const cons: string[] = [];
    
    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    const trafficType = this.getTrafficType(location);
    const competition = this.getCompetitionLevel(location);
    
    // Speed-based pros/cons
    if (avgSpeed <= 60) {
      pros.push('Low speed allows detailed message reading');
    } else if (avgSpeed >= 100) {
      cons.push('High speed requires simple, bold messaging');
    }
    
    // Traffic direction pros/cons
    if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
      pros.push('Bidirectional traffic doubles exposure');
    } else {
      cons.push('Unidirectional traffic limits audience reach');
    }
    
    // Format pros/cons
    if (location.format.toLowerCase().includes('digital')) {
      pros.push('Digital format allows dynamic content updates');
    } else {
      cons.push('Static format limits creative flexibility');
    }
    
    // Competition pros/cons
    if (competition === 'Low') {
      pros.push('Low competition area with better visibility');
    } else if (competition === 'High') {
      cons.push('High competition may reduce message impact');
    }
    
    // Location-specific pros/cons
    if (location.roadName.toLowerCase().includes('sultan qaboos')) {
      pros.push('Premium highway location with high visibility');
    }
    
    if (location.boardType.toLowerCase().includes('forecourt')) {
      pros.push('Captive audience at service stations');
      cons.push('Limited to fuel station customers');
    }
    
    return { pros, cons };
  }
}