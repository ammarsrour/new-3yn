import { AnalysisResult, Issue } from '../types';

export const generateMockAnalysis = (file: File, location: string, distance: number): AnalysisResult => {
  // Generate a realistic score based on file name or random
  const baseScore = Math.floor(Math.random() * 40) + 50; // 50-90 range
  const distanceModifier = distance > 100 ? -5 : distance < 100 ? 5 : 0;
  const finalScore = Math.max(30, Math.min(95, baseScore + distanceModifier));

  const criticalIssues: Issue[] = [];
  const minorIssues: Issue[] = [];
  const quickWins: Issue[] = [];

  // Generate issues based on score
  if (finalScore < 70) {
    criticalIssues.push({
      id: '1',
      title: 'Font size too small for viewing distance',
      description: `Text appears too small to read clearly from ${distance}m. Minimum recommended font size is ${Math.ceil(distance / 5)}px for this distance.`,
      severity: 'critical'
    });

    criticalIssues.push({
      id: '2',
      title: 'Poor color contrast ratio',
      description: 'Color contrast ratio of 2.8:1 falls below WCAG AA standards (4.5:1). This significantly impacts readability.',
      severity: 'critical'
    });
  }

  if (finalScore < 80) {
    minorIssues.push({
      id: '3',
      title: 'Layout complexity',
      description: 'Too many visual elements compete for attention. Consider simplifying the design to improve message clarity.',
      severity: 'minor'
    });

    minorIssues.push({
      id: '4',
      title: 'Text clutter',
      description: 'Multiple text blocks may overwhelm viewers. Focus on 1-2 key messages for maximum impact.',
      severity: 'minor'
    });
  }

  // Always include some quick wins
  quickWins.push({
    id: '5',
    title: 'Increase font size by 40%',
    description: 'Enlarging the main headline will significantly improve readability from the target viewing distance.',
    severity: 'improvement'
  });

  quickWins.push({
    id: '6',
    title: 'Use darker text or lighter background',
    description: 'Improving contrast will make your message more legible and professional-looking.',
    severity: 'improvement'
  });

  if (finalScore > 60) {
    quickWins.push({
      id: '7',
      title: 'Optimize call-to-action placement',
      description: 'Moving the CTA to the right side of the billboard will follow natural reading patterns.',
      severity: 'improvement'
    });
  }

  return {
    id: Date.now().toString(),
    score: finalScore,
    image: URL.createObjectURL(file),
    location,
    distance,
    timestamp: new Date(),
    criticalIssues,
    minorIssues,
    quickWins
  };
};