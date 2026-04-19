import { BillboardLocation, BillboardMetadata } from '../types/billboard';
import { MUSCAT_BILLBOARD_LOCATIONS } from './billboardLocations';

// Helper to infer readability difficulty from speed and road type
function inferDifficulty(speedLimit: string, roadType: string): 'easy' | 'medium' | 'hard' | 'extreme' {
  const speedMatch = speedLimit.match(/(\d+)/);
  const speed = speedMatch ? parseInt(speedMatch[1]) : 60;
  if (speed >= 120) return 'extreme';
  if (speed >= 100) return 'hard';
  if (speed >= 80) return 'medium';
  return 'easy';
}

// Map enriched data from billboardLocations.ts to BillboardLocation type
const MUSCAT_BILLBOARD_DATA: BillboardLocation[] = MUSCAT_BILLBOARD_LOCATIONS.map(loc => ({
  id: loc.id,
  locationName: loc.locationName,
  addressLandmark: loc.addressLandmark,
  latitude: loc.latitude,
  longitude: loc.longitude,
  roadName: loc.roadName,
  highwayDesignation: loc.highwayDesignation,
  district: loc.district,
  boardType: loc.boardType,
  format: loc.format,
  approxWidthM: loc.approxWidthM,
  approxHeightM: loc.approxHeightM,
  distanceFromRoadM: loc.distanceFromRoadM,
  trafficDirectionVisibility: loc.trafficDirection,
  speedLimitKmh: loc.speedLimit,
  roadType: loc.roadType,
  lighting: loc.lighting,
  ownershipManagement: loc.ownership,
  rentalRateOmrMonth: loc.rentalRateOMR?.toString(),
  readabilityDifficulty: inferDifficulty(loc.speedLimit, loc.roadType),
}));

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
    if (light.includes('led') || light.includes('digital')) return 'excellent';
    if (light.includes('backlit') || light.includes('illuminated')) return 'good';
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
    // Use enriched data if available
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    if (enrichedLoc?.estimatedMonthlyImpressions) return enrichedLoc.estimatedMonthlyImpressions;

    // Fallback to estimation logic
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
      impressions *= 1.3;
    }

    // Adjust for traffic direction
    if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
      impressions *= 1.8;
    }

    return Math.round(impressions);
  }

  private static calculateCPM(location: BillboardLocation): number {
    // Use enriched rental rate if available
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    const rentalRate = enrichedLoc?.rentalRateOMR || this.parseRentalRate(location.rentalRateOmrMonth) || 2000;

    const impressions = this.estimateImpressions(location);
    return Math.round((rentalRate / impressions) * 1000 * 100) / 100;
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
    // Use enriched traffic type if available
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    if (enrichedLoc?.trafficType) {
      if (enrichedLoc.trafficType === 'Commercial') return 'Business';
      if (enrichedLoc.trafficType === 'Residential') return 'Residential';
      if (enrichedLoc.trafficType === 'Commuter') return 'Mixed';
      if (enrichedLoc.trafficType === 'Tourist') return 'Mixed';
    }

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
    // Use enriched audience data if available
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    if (enrichedLoc?.primaryAudience) {
      if (enrichedLoc.primaryAudience.toLowerCase().includes('professional')) return 'Young Professional';
      if (enrichedLoc.primaryAudience.toLowerCase().includes('famil')) return 'Family';
    }

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
    // Use enriched competition level if available
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    if (enrichedLoc?.competitionLevel) {
      return enrichedLoc.competitionLevel as 'High' | 'Medium' | 'Low';
    }

    const ownership = location.ownershipManagement.toLowerCase();

    if (ownership.includes('multiple') || ownership.includes('exclusive') ||
        location.roadName.toLowerCase().includes('sultan qaboos')) {
      return 'High';
    }

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
    const width = location.approxWidthM || 14;
    const height = location.approxHeightM || 5;
    const area = width * height;
    const sizeScore = Math.min(20, (area / 70) * 20);

    // Cost Score (25% weight) - Lower cost = better value
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    const rentalRate = enrichedLoc?.rentalRateOMR || this.parseRentalRate(location.rentalRateOmrMonth) || 2000;
    const costScore = Math.max(0, Math.min(25, 25 - (rentalRate - 1000) * 0.01));

    const totalScore = Math.round(speedScore + distanceScore + sizeScore + costScore);

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
    // Use enriched data for impressions
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    const monthlyImpressions = enrichedLoc?.estimatedMonthlyImpressions || this.estimateImpressions(location);
    const dailyImpressions = Math.round(monthlyImpressions / 30);

    // Monthly cost from enriched data
    const monthlyCost = enrichedLoc?.rentalRateOMR || this.parseRentalRate(location.rentalRateOmrMonth) || 800;

    // Calculate CPM
    const cpm = (monthlyCost / monthlyImpressions) * 1000;

    // Industry benchmark CPM for outdoor billboards in Oman: 1.5-4.0 OMR
    // Lower CPM = better value. Score based on where this billboard falls in the range.
    const excellentCPM = 1.0;  // Best case scenario
    const poorCPM = 8.0;       // Worst case scenario
    // Linear scale: excellent CPM = 95, poor CPM = 20
    let roiScore = Math.round(95 - ((cpm - excellentCPM) / (poorCPM - excellentCPM)) * 75);
    roiScore = Math.min(95, Math.max(20, roiScore));

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
    let score = 50;

    const speedRange = this.parseSpeedLimit(location.speedLimitKmh);
    const avgSpeed = (speedRange.min + speedRange.max) / 2;
    if (avgSpeed <= 50) score += 25;
    else if (avgSpeed <= 80) score += 15;
    else if (avgSpeed <= 100) score += 5;
    else score -= 10;

    const distance = location.distanceFromRoadM || this.estimateViewingDistance(location.roadType);
    if (distance <= 30) score += 20;
    else if (distance <= 60) score += 10;
    else if (distance <= 100) score += 0;
    else score -= 15;

    const width = location.approxWidthM || 14;
    const height = location.approxHeightM || 5;
    const area = width * height;
    if (area >= 100) score += 15;
    else if (area >= 70) score += 10;
    else score += 5;

    if (location.lighting.toLowerCase().includes('led') ||
        location.lighting.toLowerCase().includes('digital') ||
        location.lighting.toLowerCase().includes('backlit')) {
      score += 10;
    }

    return Math.max(20, Math.min(100, score));
  }

  static calculateSuitabilityScore(location: BillboardLocation): number {
    let score = 50;

    const roadType = location.roadType.toLowerCase();
    if (roadType.includes('expressway')) score += 20;
    else if (roadType.includes('motorway') || roadType.includes('highway')) score += 15;
    else if (roadType.includes('arterial')) score += 10;
    else score += 5;

    if (location.format.toLowerCase().includes('digital')) {
      score += 15;
    }

    const ownership = location.ownershipManagement.toLowerCase();
    if (ownership.includes('jcdecaux') || ownership.includes('mediaone')) {
      score += 10;
    }

    if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
      score += 10;
    }

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
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    const boardType = location.boardType.toLowerCase();
    const distanceM = location.distanceFromRoadM || 100;
    const widthM = location.approxWidthM || 14;
    const heightM = location.approxHeightM || 5;
    // Override for forecourt/service station locations — viewers are stationary, not driving past
    let effectiveSpeed = avgSpeed;
    if (boardType.includes('forecourt') || boardType.includes('service station')) {
      effectiveSpeed = 5; // Walking speed in km/h — viewers are at fuel pumps
    }

    const viewingTime = ((widthM * 2) / (effectiveSpeed / 3.6)).toFixed(1);
    const maxWords = Math.max(3, Math.floor(parseFloat(viewingTime) * 2.5));
    const impressions = enrichedLoc?.estimatedMonthlyImpressions;
    const rental = enrichedLoc?.rentalRateOMR;
    const audience = enrichedLoc?.primaryAudience || 'Mixed demographics';
    const traffic = enrichedLoc?.trafficType || 'Mixed';
    const competition = enrichedLoc?.competitionLevel || 'Medium';

    // Speed recommendation — specific to this billboard's parameters
    let speedRecommendation = '';
    if (avgSpeed >= 100) {
      speedRecommendation = `High-speed location: At ${avgSpeed} km/h, drivers have ${viewingTime} seconds to read a ${widthM}m × ${heightM}m billboard from ${distanceM}m. Maximum ${maxWords} words. Use bold, sans-serif fonts minimum ${Math.round(distanceM * 0.15)}cm tall. No decorative fonts, no fine print.`;
    } else if (avgSpeed >= 60) {
      speedRecommendation = `Medium-speed location: At ${avgSpeed} km/h, viewers have ${viewingTime} seconds from ${distanceM}m distance. Up to ${maxWords} words work on this ${widthM}m × ${heightM}m format. Clear fonts minimum ${Math.round(distanceM * 0.1)}cm tall. Good contrast essential.`;
    } else {
      speedRecommendation = `Low-speed location: At ${avgSpeed} km/h, viewers have ${viewingTime} seconds — enough for detailed messaging on this ${widthM}m × ${heightM}m format. Up to ${maxWords} words. QR codes and detailed CTAs are effective at ${distanceM}m viewing distance.`;
    }

    if (boardType.includes('dooh') || (location.format && location.format.toLowerCase().includes('digital'))) {
      speedRecommendation += ` Digital format: Consider animation, rotating messages, or daypart-specific content to maximize the ${impressions ? (impressions / 1000).toFixed(0) + 'K' : 'available'} monthly impressions.`;
    }

    if (boardType.includes('forecourt')) {
      speedRecommendation += ` Captive audience: Drivers spend 3-5 minutes at fuel stops. Detailed product information, QR codes, and promotional offers work well here.`;
    }

    // Override entire speedRecommendation for forecourt locations
    if (boardType.includes('forecourt') || boardType.includes('service station')) {
      speedRecommendation = `Forecourt location: Captive audience with 3-5 minute average dwell time at this ${widthM}m × ${heightM}m screen, viewed from ${distanceM}m. Extended viewing allows detailed messaging — up to ${maxWords} words, product features, QR codes, and promotional offers are all effective. Digital format enables daypart-specific content and rotating messages to maximize the ${impressions ? (impressions / 1000).toFixed(0) + 'K' : 'available'} monthly impressions.`;
    }

    // Location insight — specific to this location's character
    let locationInsight = `${location.locationName} in ${location.district}: `;

    if (enrichedLoc) {
      locationInsight += `${traffic} traffic area targeting ${audience.toLowerCase()}. `;

      if (impressions && rental) {
        const cpm = ((rental / impressions) * 1000).toFixed(2);
        locationInsight += `Estimated ${(impressions / 1000).toFixed(0)}K monthly impressions at ${rental} OMR/month (${cpm} OMR CPM). `;
      }

      locationInsight += `Competition level: ${competition.toLowerCase()}. `;

      if (location.lighting && location.lighting !== 'TBD') {
        locationInsight += `${location.lighting} lighting — `;
        if (location.lighting.toLowerCase().includes('led') || location.lighting.toLowerCase().includes('premium')) {
          locationInsight += 'excellent visibility day and night.';
        } else if (location.lighting.toLowerCase().includes('street')) {
          locationInsight += 'ensure high-contrast design for evening readability.';
        } else {
          locationInsight += 'verify evening visibility conditions.';
        }
      }
    } else {
      locationInsight += `${location.roadType} location in ${location.district}. Verify local conditions before campaign placement.`;
    }

    // Creative strategy — based on audience and format
    let creativeStrategy = '';

    if (traffic === 'Commuter') {
      creativeStrategy = `Commuter corridor: Viewers see this billboard repeatedly (high repeat rate expected). Use sequential campaign strategy — Week 1: brand only, Week 3: product detail, Week 5: CTA with offer. ${audience.includes('professional') || audience.includes('Professional') ? 'Professional audience responds to clean, minimal design with clear value proposition.' : 'Bold, simple messaging for quick recognition at speed.'}`;
    } else if (traffic === 'Tourist') {
      creativeStrategy = `Tourism corridor: Mixed international and local audience. Bilingual content essential (Arabic primary per Ordinance 25/93, English subtitle for visitors). ${location.lighting?.toLowerCase().includes('weather') ? 'Weather-resistant format supports year-round campaigns.' : ''} Hospitality, F&B, and experience-based messaging performs well here.`;
    } else if (traffic === 'Residential') {
      creativeStrategy = `Residential area: ${audience}. Use warm colors, family imagery, and benefit-focused messaging. Arabic cultural values resonate — emphasize safety, quality, and family well-being. Weekend traffic patterns may differ from weekday; consider daypart messaging if digital format.`;
    } else if (traffic === 'Commercial') {
      creativeStrategy = `Commercial district: ${audience}. Professional design with clear value proposition. B2B messaging, financial services, and technology brands perform well. Peak visibility during weekday rush hours — time-sensitive offers and business services are effective.`;
    } else {
      creativeStrategy = `Mixed-use area: ${audience}. Versatile location supporting both brand awareness and direct response campaigns. Use clear visual hierarchy with Arabic-first messaging. ${competition === 'High' ? 'High competition area — differentiate with bold design and unique creative angles.' : 'Lower competition gives your message more standout potential.'}`;
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
    const competition = this.getCompetitionLevel(location);

    if (avgSpeed <= 60) {
      pros.push('Low speed allows detailed message reading');
    } else if (avgSpeed >= 100) {
      cons.push('High speed requires simple, bold messaging');
    }

    if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
      pros.push('Bidirectional traffic doubles exposure');
    } else {
      cons.push('Unidirectional traffic limits audience reach');
    }

    if (location.format.toLowerCase().includes('digital')) {
      pros.push('Digital format allows dynamic content updates');
    } else {
      cons.push('Static format limits creative flexibility');
    }

    if (competition === 'Low') {
      pros.push('Low competition area with better visibility');
    } else if (competition === 'High') {
      cons.push('High competition may reduce message impact');
    }

    if (location.roadName.toLowerCase().includes('sultan qaboos')) {
      pros.push('Premium highway location with high visibility');
    }

    if (location.boardType.toLowerCase().includes('forecourt')) {
      pros.push('Captive audience at service stations');
      cons.push('Limited to fuel station customers');
    }

    // Add enriched data insights
    const enrichedLoc = MUSCAT_BILLBOARD_LOCATIONS.find(l => l.id === location.id);
    if (enrichedLoc) {
      if ((enrichedLoc.estimatedMonthlyImpressions || 0) >= 1000000) {
        pros.push('High traffic volume with 1M+ monthly impressions');
      }
      if (enrichedLoc.lighting?.toLowerCase().includes('led')) {
        pros.push('LED illumination ensures 24/7 visibility');
      }
    }

    return { pros, cons };
  }
}
