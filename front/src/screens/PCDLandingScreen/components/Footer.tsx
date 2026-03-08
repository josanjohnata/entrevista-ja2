import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../styles';

const FooterWrapper = styled.footer`
  padding: 2rem 0;
  border-top: 1px solid hsl(222, 30%, 16%);
`;

const FooterContent = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.875rem;
  color: hsl(215, 20%, 55%);
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: hsl(210, 40%, 98%);
  font-weight: 600;
  
  .highlight {
    color: hsl(24, 95%, 53%);
  }
`;

export const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <Logo to="/">
          <span>🦊</span>
          <span>
            Fox<span className="highlight">Apply</span>
          </span>
        </Logo>
        <div>© {new Date().getFullYear()} Entrevista Já. Todos os direitos reservados.</div>
      </FooterContent>
    </FooterWrapper>
  );
};

