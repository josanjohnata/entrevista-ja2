import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';
import { Section, Container, Heading2, Text, Card } from '../styles';

const Wrapper = styled(Section)`
  id: faq;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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

const FAQList = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FAQCard = styled(Card)<{ $isOpen: boolean }>`
  padding: 0;
  border-radius: 0.75rem;
  overflow: hidden;
`;

const FAQHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  
  &:hover {
    background: hsl(222, 47%, 11%);
  }
`;

const Question = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(210, 40%, 98%);
  flex: 1;
`;

const ChevronIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  color: hsl(215, 20%, 55%);
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
`;

const Answer = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AnswerContent = styled(Text)`
  padding: 0 1.5rem 1.25rem 1.5rem;
  font-size: 0.875rem;
  color: hsl(215, 20%, 55%);
  line-height: 1.6;
`;

const faqs = [
  {
    question: 'O FoxApply funciona com qualquer conta do LinkedIn?',
    answer: 'Sim! O FoxApply funciona com qualquer conta do LinkedIn, gratuita ou Premium. A extensão utiliza o recurso Easy Apply do LinkedIn para enviar candidaturas.',
  },
  {
    question: 'É seguro usar automação no LinkedIn?',
    answer: 'O FoxApply foi desenvolvido para simular o comportamento humano natural, respeitando os limites do LinkedIn. Usamos técnicas avançadas para garantir que sua conta permaneça segura.',
  },
  {
    question: 'Serei cobrado durante o período de teste?',
    answer: 'Não! Durante os 30 dias grátis do programa PCD, você não será cobrado. A cobrança só acontece após o período de teste, e você pode cancelar a qualquer momento.',
  },
  {
    question: 'Como funciona o programa para PCDs?',
    answer: 'Basta se cadastrar e enviar seu laudo médico para validação. Após a aprovação, você terá 30 dias gratuitos com acesso completo a todas as funcionalidades da plataforma.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Absolutamente! Não há compromisso ou multa. Você pode cancelar sua assinatura a qualquer momento diretamente pelo painel, sem burocracia.',
  },
  {
    question: 'Em quanto tempo vou ver resultados?',
    answer: 'A maioria dos usuários começa a receber convites para entrevistas na primeira semana. Quanto mais vagas você aplica, maiores são suas chances de sucesso.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Wrapper id="faq">
      <Container>
        <Header>
          <div>
            <Title>
              Perguntas <span className="text-gradient">Frequentes</span>
            </Title>
          </div>
        </Header>

        <FAQList>
            {faqs.map((faq, i) => (
              <FAQCard key={i} $isOpen={openIndex === i}>
                <FAQHeader onClick={() => toggleFAQ(i)}>
                  <Question>{faq.question}</Question>
                  <ChevronIcon $isOpen={openIndex === i} size={20} />
                </FAQHeader>
                <Answer $isOpen={openIndex === i}>
                  <AnswerContent>{faq.answer}</AnswerContent>
                </Answer>
              </FAQCard>
            ))}
          </FAQList>
      </Container>
    </Wrapper>
  );
};

