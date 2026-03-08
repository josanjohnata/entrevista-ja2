import React, { useEffect, useState } from 'react';
import * as S from './ScoreCircle.styles';

interface ScoreCircleProps {
  score: number;
  size?: number;
  label?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  score, 
  size = 180, 
  label = 'Score' 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return '#10b981'; // success
    if (score >= 60) return '#f59e0b'; // warning
    return '#ef4444'; // error
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excelente!';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa melhorar';
  };

  return (
    <S.Container>
      <S.SvgContainer $size={size}>
        <S.BackgroundCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <S.ProgressCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          $color={getScoreColor()}
        />
      </S.SvgContainer>
      <S.ScoreContent>
        <S.ScoreNumber>{animatedScore}</S.ScoreNumber>
        <S.ScoreLabel>{label}</S.ScoreLabel>
        <S.ScoreStatus $color={getScoreColor()}>
          {getScoreLabel()}
        </S.ScoreStatus>
      </S.ScoreContent>
    </S.Container>
  );
};

