import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import * as S from './LayoutWithSidebar.styles';

export const LayoutWithSidebar: React.FC = () => {
  return (
    <S.LayoutContainer>
      <Header />
      <S.MainContent>
        <Outlet />
      </S.MainContent>
    </S.LayoutContainer>
  );
};
