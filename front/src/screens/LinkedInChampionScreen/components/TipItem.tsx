import React from 'react';
import { CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import * as S from './TipItem.styles';

interface TipItemProps {
  text: string;
  type: 'positive' | 'improvement' | 'tip';
}

export const TipItem: React.FC<TipItemProps> = ({ text, type }) => {
  const icons = {
    positive: <CheckCircle2 size={20} />,
    improvement: <AlertCircle size={20} />,
    tip: <Lightbulb size={20} />,
  };

  return (
    <S.TipItemContainer $type={type}>
      <S.IconWrapper $type={type}>
      {icons[type]}
      </S.IconWrapper>
      <S.Text>{text}</S.Text>
    </S.TipItemContainer>
  );
};
