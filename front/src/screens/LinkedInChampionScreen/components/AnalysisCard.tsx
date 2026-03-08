import React, { ReactNode } from 'react';
import { Card } from '../../../presentation/components/Card';
import * as S from './AnalysisCard.styles';

interface AnalysisCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  variant: 'success' | 'warning';
  className?: string;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ 
  title, 
  icon, 
  children, 
  variant,
  className 
}) => {
  return (
    <S.CardWrapper $variant={variant} className={className}>
      <Card>
        <S.CardHeader>
          <S.CardTitle $variant={variant}>
          {icon}
          {title}
          </S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
        {children}
        </S.CardContent>
    </Card>
    </S.CardWrapper>
  );
};
