import React from 'react';
import { LoadingContainer, Spinner } from './styles';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color,
  fullScreen = false
}) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <Spinner size={size} color={color} />
    </LoadingContainer>
  );
};

export default Loading;
