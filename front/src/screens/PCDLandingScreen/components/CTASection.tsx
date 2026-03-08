import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Heading2, Text, Button, Card } from '../styles';

const Wrapper = styled(Section)``;

const Content = styled(Container)`
  max-width: 48rem;
  margin: 0 auto;
`;

const CTACard = styled(Card)`
  text-align: center;
  padding: 3rem 2rem;
  border-color: hsl(24, 95%, 53%)33;
  
  @media (min-width: 768px) {
    padding: 4rem;
  }
`;

const Title = styled(Heading2)`
  margin-bottom: 1rem;
  
  .text-gradient {
    background: linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(35, 100%, 60%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled(Text)`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CTASection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Wrapper>
      <Content>
        <CTACard>
          <Title>
            Pronto para acelerar sua{' '}
            <span className="text-gradient">carreira</span>?
          </Title>
          <Description>
            Junte-se a milhares de profissionais PCD que já estão conquistando mais entrevistas com menos esforço.
          </Description>
          <ButtonWrapper>
            <Button as={Link} to="/checkout-pcd" $variant="cta" $size="lg">
              Começar 30 Dias Grátis
              <ArrowRight size={20} />
            </Button>
          </ButtonWrapper>
        </CTACard>
      </Content>
    </Wrapper>
  );
};

