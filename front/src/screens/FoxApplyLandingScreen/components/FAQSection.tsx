import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Section, Container, Card, Heading2 } from '../styles';

const Wrapper = styled(Section)``;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(Heading2)`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const FAQList = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQCard = styled(Card)`
  padding: 1.5rem;
`;

const Question = styled.h3`
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const Answer = styled.p`
  color: var(--text-tertiary);
  line-height: 1.6;
`;

export const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  
  const faqs = [1, 2, 3, 4, 5].map((num) => ({
    question: t(`foxApplyLanding.faq.q${num}.question`),
    answer: t(`foxApplyLanding.faq.q${num}.answer`),
  }));
  
  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>{t('foxApplyLanding.faq.title')}</Title>
        </Header>
        
        <FAQList>
          {faqs.map((faq, index) => (
            <FAQCard key={index}>
              <Question>{faq.question}</Question>
              <Answer>{faq.answer}</Answer>
            </FAQCard>
          ))}
        </FAQList>
      </Container>
    </Wrapper>
  );
};

