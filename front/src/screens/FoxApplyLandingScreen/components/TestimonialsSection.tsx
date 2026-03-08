import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Section, Container, Card, Heading2, Badge } from '../styles';

const Wrapper = styled(Section)`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url('/images/automation-visual.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.3;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: oklch(0.08 0.01 260 / 0.9);
  }
`;

const Content = styled(Container)`
  position: relative;
  z-index: 10;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const BadgeText = styled(Badge)`
  color: var(--neon-orange);
  margin-bottom: 0.5rem;
  display: block;
`;

const Title = styled(Heading2)`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  .highlight {
    color: var(--neon-orange);
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  max-width: 42rem;
  margin: 0 auto;
  color: var(--text-tertiary);
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 0 4rem;
  
  @media (max-width: 768px) {
    padding: 0 3rem;
  }
`;

const CarouselContainer = styled.div<{ $translateX: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => props.$translateX}%);
  gap: 1.5rem;
  will-change: transform;
`;

const CarouselItem = styled.div`
  flex-shrink: 0;
  flex-basis: 100%;
  min-width: 100%;
  
  @media (min-width: 768px) {
    flex-basis: calc(50% - 0.75rem);
    min-width: calc(50% - 0.75rem);
  }
  
  @media (min-width: 1024px) {
    flex-basis: calc(33.333% - 1rem);
    min-width: calc(33.333% - 1rem);
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid oklch(0.72 0.19 45);
  background: oklch(0.12 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  color: oklch(0.72 0.19 45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 640px) {
    width: 2.5rem;
    height: 2.5rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  &:hover:not(:disabled) {
    background: oklch(0.72 0.19 45);
    color: black;
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  &.prev {
    left: 0;
    
    @media (max-width: 768px) {
      left: 0.5rem;
    }
    
    @media (max-width: 640px) {
      left: 0.25rem;
    }
  }
  
  &.next {
    right: 0;
    
    @media (max-width: 768px) {
      right: 0.5rem;
    }
    
    @media (max-width: 640px) {
      right: 0.25rem;
    }
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: none;
  background: ${props => props.$active ? 'oklch(0.72 0.19 45)' : 'oklch(0.3 0.02 260)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: oklch(0.72 0.19 45 / 0.7);
  }
`;

const TestimonialCard = styled(Card)`
  height: 100%;
  padding: 1.5rem;
  background: oklch(0.15 0.015 260 / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(1 0 0 / 0.1);
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-orange), var(--neon-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--dark-bg);
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const UserRole = styled.div`
  font-size: 0.875rem;
  color: var(--text-tertiary);
`;

const TestimonialText = styled.p`
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const Company = styled.div`
  font-size: 0.875rem;
  color: var(--neon-cyan);
  font-weight: 500;
`;

const testimonials = [
  {
    name: "Ana Carolina",
    role: "Dev Frontend Júnior",
    company: "8 entrevistas em 2 semanas",
    content: "Estava há 6 meses sem receber nenhum retorno. Com o FoxApply, apliquei para mais de 200 vagas e recebi 8 convites para entrevistas em apenas 2 semanas! Consegui minha primeira vaga.",
    avatar: "AC",
  },
  {
    name: "Pedro Silva",
    role: "Dev Backend Júnior",
    company: "5 entrevistas na primeira semana",
    content: "Não acreditava que funcionaria, mas na primeira semana já recebi 5 convites para entrevistas! O FoxApply multiplicou minhas chances de ser visto pelos recrutadores.",
    avatar: "PS",
  },
  {
    name: "Mariana Santos",
    role: "Dev Full Stack Júnior",
    company: "12 entrevistas em 1 mês",
    content: "Sai da faculdade sem experiência e estava desanimada. Usei o FoxApply por 1 mês, apliquei para 300+ vagas e recebi 12 convites! Hoje estou empregada.",
    avatar: "MS",
  },
  {
    name: "João Oliveira",
    role: "Dev React Júnior",
    company: "Primeira entrevista em 3 dias",
    content: "Depois de meses sem resposta, usei o FoxApply e em apenas 3 dias recebi meu primeiro convite para entrevista! A sensação de finalmente ser chamado é indescritível.",
    avatar: "JO",
  },
  {
    name: "Lucas Mendes",
    role: "Desenvolvedor Full Stack",
    company: "Contratado por empresa dos EUA",
    content: "Em 2 semanas usando o FoxApply, recebi 5 convites para entrevistas. Consegui uma vaga remota pagando em dólar. Mudou minha vida!",
    avatar: "LM",
  },
  {
    name: "Camila Ferreira",
    role: "Dev Frontend Júnior",
    company: "6 entrevistas simultâneas",
    content: "Estava há 8 meses procurando minha primeira vaga. Com o FoxApply, consegui 6 entrevistas ao mesmo tempo! Finalmente consegui escolher a melhor proposta.",
    avatar: "CF",
  },
  {
    name: "Gabriel Alves",
    role: "Dev Python Júnior",
    company: "10 entrevistas em 3 semanas",
    content: "Aplicava manualmente e nunca recebia retorno. Com o FoxApply, apliquei para centenas de vagas e recebi 10 convites! A diferença é absurda.",
    avatar: "GA",
  },
  {
    name: "Isabella Costa",
    role: "Dev Mobile Júnior",
    company: "Primeira vaga em 20 dias",
    content: "Transição de carreira é difícil, mas o FoxApply me ajudou a receber várias entrevistas rapidamente. Em 20 dias já estava empregada na área que sempre sonhei!",
    avatar: "IC",
  },
  {
    name: "James Wilson",
    role: "Junior Full Stack Developer",
    company: "7 interviews in 2 weeks",
    content: "I was struggling to get any responses for months. With FoxApply, I applied to 250+ jobs and got 7 interview invitations in just 2 weeks! Finally landed my first tech job.",
    avatar: "JW",
  },
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "10 interviews in 1 month",
    content: "As a career changer, I was worried about my lack of experience. FoxApply helped me get 10 interviews in my first month! The automated applications saved me so much time.",
    avatar: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "Backend Developer",
    company: "Remote job in 3 weeks",
    content: "I wanted to work remotely for a US company. FoxApply applied to hundreds of international positions and I got multiple interviews. Now I'm working remotely earning in dollars!",
    avatar: "MR",
  },
];

export const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Inicializar com base no tamanho da tela
  const getInitialItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        return 3;
      } else if (window.innerWidth >= 768) {
        return 2;
      }
    }
    return 1;
  };
  
  const [itemsPerView, setItemsPerView] = useState(getInitialItemsPerView());
  
  const titleText = t('foxApplyLanding.testimonials.title');
  const receivingText = t('foxApplyLanding.testimonials.receiving');
  const parts = titleText.split('{receiving}');
  
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);
  
  // Loop infinito - navegar por todos os depoimentos
  const totalItems = testimonials.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);
  
  // Calcular translateX baseado no número de cards por visualização
  const translateX = -(currentIndex * (100 / itemsPerView));
  
  const next = () => {
    setCurrentIndex(prev => {
      let nextIndex = prev + 1;
      // Se passou do último conjunto visível, volta para o início (loop infinito)
      if (nextIndex > maxIndex) {
        return 0;
      }
      return nextIndex;
    });
  };
  
  const prev = () => {
    setCurrentIndex(prev => {
      let prevIndex = prev - 1;
      // Se está no início, vai para o último conjunto (loop infinito)
      if (prevIndex < 0) {
        return maxIndex;
      }
      return prevIndex;
    });
  };
  
  const goToSlide = (slideIndex: number) => {
    const targetIndex = slideIndex * itemsPerView;
    // Garantir que não ultrapasse o máximo
    setCurrentIndex(Math.min(targetIndex, maxIndex));
  };
  
  const totalSlides = Math.ceil(totalItems / itemsPerView);
  const currentSlide = Math.floor(currentIndex / itemsPerView);
  
  return (
    <Wrapper id="depoimentos">
      <Content>
        <Header>
          <BadgeText>{t('foxApplyLanding.testimonials.badge')}</BadgeText>
          <Title>
            {parts[0]}
            <span className="highlight">{receivingText}</span>
            {parts[1] || ''}
          </Title>
          <Subtitle>{t('foxApplyLanding.testimonials.subtitle')}</Subtitle>
        </Header>
        
        <CarouselWrapper>
          <CarouselContainer data-carousel-container $translateX={translateX}>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} data-carousel-item>
                <TestimonialCard>
                  <UserInfo>
                    <Avatar>{testimonial.avatar}</Avatar>
                    <UserDetails>
                      <UserName>{testimonial.name}</UserName>
                      <UserRole>{testimonial.role}</UserRole>
                    </UserDetails>
                  </UserInfo>
                  <TestimonialText>"{testimonial.content}"</TestimonialText>
                  <Company>{testimonial.company}</Company>
                </TestimonialCard>
              </CarouselItem>
            ))}
          </CarouselContainer>
          
          <CarouselButton 
            className="prev" 
            onClick={prev}
            aria-label="Depoimento anterior"
          >
            <ChevronLeft size={20} />
          </CarouselButton>
          
          <CarouselButton 
            className="next" 
            onClick={next}
            aria-label="Próximo depoimento"
          >
            <ChevronRight size={20} />
          </CarouselButton>
          
          <DotsContainer>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <Dot
                key={index}
                $active={currentSlide === index}
                onClick={() => goToSlide(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </DotsContainer>
        </CarouselWrapper>
      </Content>
    </Wrapper>
  );
};

