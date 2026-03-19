import React from 'react';

interface ScoreCircleProps {
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Quieter color scheme - navy primary, danger only for poor scores
  const getColor = (score: number) => {
    if (score >= 70) return '#0f2942'; // navy-950
    if (score >= 50) return '#334e68'; // navy-700
    return '#dc2626'; // danger-600 - only for truly poor
  };

  return (
    <div className="relative w-28 h-28 mx-auto lg:mx-0">
      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#e2e8f0"
          strokeWidth="6"
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={getColor(score)}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
    </div>
  );
};

export default ScoreCircle;