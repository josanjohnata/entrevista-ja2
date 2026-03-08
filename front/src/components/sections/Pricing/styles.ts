import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';
import BackgroundImage from '../../../assets/Background.png';

export const PricingSection = styled.section`
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 5rem 0;
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 6rem 0;
  }
`;

export const PricingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const PricingCard = styled.div`
  margin-top: 3rem;
  width: 100%;
  max-width: 450px;
  border-radius: 0.75rem;
  border: 1px solid ${theme.colors.border.light};
  background-color: white;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
`;

export const PriceText = styled.p`
  margin-top: 1rem;
  font-size: 3rem;
  font-weight: 700;
  color: ${theme.colors.primary.main};
  
  span {
    font-size: 1.125rem;
    font-weight: 500;
    color: ${theme.colors.text.secondary};
  }
`;