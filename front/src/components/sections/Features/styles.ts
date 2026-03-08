import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';
import { Container } from '../../common/Container';

export const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: #fafafa;
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 6rem 0;
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 3rem;
  margin-top: 2rem;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  img {
    max-width: 60%;
    height: auto;
    border-radius: 0.5rem;
    
    @media (min-width: ${theme.breakpoints.md}) {
      max-width: 70%;
    }
  }
`;

export const FeaturesList = styled.ul`
  margin-top: 2rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  font-size: 1rem;
  color: #404040;

  svg {
    flex-shrink: 0;
    margin-right: 0.75rem;
    margin-top: 0.25rem;
    color: #22c55e;
  }
`;

export const ContainerFeature = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h1 {
    color: #171717;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2.25rem;
    }
  }
`;

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 1rem;
  padding-bottom: 56.25%;
  border-radius: 0.5rem;
  overflow: hidden;
  grid-column: 1 / -1;

  @media (min-width: ${theme.breakpoints.md}) {
    width: 80%;
    margin: 2rem auto 0;
    padding-bottom: 45%;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: #404040;
  margin: 1.5rem auto 2rem;
  max-width: 800px;
  text-align: center;

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.125rem;
    margin: 2rem auto 2.5rem;
  }
`;

export const HighlightedText = styled.span`
  color: #0a0a0a;
  font-weight: 600;
`;

export const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #404040;
  text-align: left;
  margin-bottom: 2rem;

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.125rem;
    margin-bottom: 2.5rem;
  }
`;

export const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (min-width: ${theme.breakpoints.md}) {
    gap: 2rem;
  }
`;

export const StepCard = styled.div`
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    transform: translateY(-2px);
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 2rem;
    gap: 1.5rem;
  }
`;

export const StepContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #171717;
  margin: 0;

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.25rem;
  }
`;

export const StepFunctionality = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #525252;
  margin: 0;
  font-weight: 500;

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

export const StepBenefit = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${theme.colors.success.main};
  margin: 0;
  font-weight: 500;
  padding-left: 0.75rem;
  border-left: 3px solid ${theme.colors.success.main};

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 0.9375rem;
  }
`;