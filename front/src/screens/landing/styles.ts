import styled from 'styled-components';
import 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const Section = styled.section`
  padding: 4rem 0;
  @media (min-width: 768px) {
    padding: 5rem 0;
  }
`;

export const HeroSection = styled(Section)`
  background-color: ${colors.neutral[100]};
  padding: 5rem 0;
  text-align: center;
`;

export const Title = styled.h1`
  color: ${colors.primary};
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${colors.text};
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const IconWrapper = styled.div`
  width: 8rem; height: 8rem;
  background-color: white;
  border-radius: 50%;
  margin: 0 auto 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 768px) {
    width: 12rem; height: 12rem;
  }
`;

export const Icon = styled.span`
  font-size: 3.75rem;
  @media (min-width: 768px) {
    font-size: 5rem;
  }
`;

export const CtaButton = styled.a`
  display: inline-block;
  background-color: ${colors.primary.main};
  color: ${colors.background.primary};
  font-weight: 600;
  font-size: 1.125rem;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.primary.light};
  }
`;

export const Grid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ChallengeCardContent = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const IconPlaceholder = styled.div`
  flex-shrink: 0;
  width: 40px; height: 40px;
  background-color: ${colors.primary.main};
  color: ${colors.text};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
`;

export const CardTextWrapper = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  p {
    color: ${colors.text};
  }
`;

export const SolutionSection = styled(Section)`
  background-color: ${colors.neutral[100]};
`;

export const GridChallenge = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    }
`;

export const Card = styled.div`
  background-color: ${colors.background.primary};
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const SolutionCard = styled(Card)`
  text-align: center;
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  p {
    color: ${colors.text};
  }
`;
export const IconChallenge = styled.div`
  font-size: 2.25rem;
  margin-bottom: 1rem;
  color: ${colors.primary};
`;

export const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  padding-top: 1rem;
  text-align: center;
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${colors.text};
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

export const StepItemContainer = styled(Card)`
  cursor: pointer;
`;

export const StepHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const StepNumber = styled.div`
  background-color: ${colors.primary};
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 1rem;
`;

export const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
`;

export const StepArrow = styled.span<{ isOpen: boolean }>`
  margin-left: auto;
  font-size: 1.5rem;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
`;

export const StepDetails = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.5s ease-out;
  padding-left: 3.5rem;
  margin-top: 0.5rem;
`;

export const ResourcesSection = styled(Section)`
  background-color: ${colors.neutral[100]};
`;

export const GridResources = styled.div`
  display: grid; gap: 1.5rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const GridDifferentiator = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const DifferentiatorCardContent = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const DifferentiatorIconPlaceholder = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: ${colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
`;

export const DifferentiatorCardTextWrapper = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  p {
    color: ${colors.text};
    }
`;

export const FeatureCard = styled(Card)`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${colors.primary};
  }
  p {
    color: ${colors.text};
    line-height: 1.5;
  }
`;

export const SectionSuccessStories = styled.section`
  background-color: ${colors.neutral[100]};
`;

export const CarouselContainer = styled.div`
  position: relative;
`;

export const Carousel = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-track { background: ${colors.neutral[100]}; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: ${colors.primary}; border-radius: 10px; }
`;

export const TestimonialCard = styled(Card)`
  flex: 0 0 80%;
  scroll-snap-align: start;
  @media (min-width: 768px) {
    flex-basis: 45%;
  }
  @media (min-width: 1024px) {
    flex-basis: 30%;
  }

  .text {
    font-family: 'Readex Pro', sans-serif;
    font-style: italic;
    margin-bottom: 1rem;
    color: #4b5563;
  }

  .name {
    font-weight: 600;
  }
`;

export const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

export const PrevButton = styled(CarouselButton)`
  left: -25px;
`;

export const NextButton = styled(CarouselButton)`
  right: -25px;
`;

export const FutureSection = styled(Section)``;

export const FutureGrid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
export const FutureCard = styled(Card)`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${colors.primary};
  }
  p {
    color: ${colors.text};
  }
`;

export const JoinUsCtaSection = styled.section`
  padding: 5rem 0;
  text-align: center;
  background-color: ${colors.background.primary};
  color: ${colors.text};
`;

export const JoinUsTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const JoinUsSubtitle = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const JoinUsCtaButton = styled.a`
  text-decoration: none;
  display: inline-block;
  background-color: ${colors.primary.main};
  color: ${colors.background.primary};
  font-weight: 600;
  font-size: 1.125rem;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${colors.primary.light};
    transform: translateY(-2px);
  }
`;
export const JoinUsSocials = styled.p`
  margin-top: 2rem;
`;
