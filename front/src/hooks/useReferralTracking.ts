import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const REFERRAL_CODE_KEY = 'referral_code';
const REFERRAL_TRACKING_KEY = 'referral_tracking';

interface ReferralTracking {
  referralCode: string;
  landingVisited: boolean;
  landingVisitedAt?: string;
  checkoutClicked: boolean;
  checkoutClickedAt?: string;
}

/**
 * Hook para gerenciar código de indicação e rastreamento do fluxo do usuário
 */
export const useReferralTracking = () => {
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [tracking, setTracking] = useState<ReferralTracking | null>(null);

  // Carregar código de indicação do localStorage ou da URL
  useEffect(() => {
    // Primeiro, verificar se há código na URL
    const refFromUrl = searchParams.get('ref');
    
    if (refFromUrl) {
      // Se há código na URL, salvar no localStorage
      localStorage.setItem(REFERRAL_CODE_KEY, refFromUrl);
      setReferralCode(refFromUrl);
      
      // Inicializar tracking se ainda não existe
      const existingTracking = localStorage.getItem(REFERRAL_TRACKING_KEY);
      if (!existingTracking) {
        const newTracking: ReferralTracking = {
          referralCode: refFromUrl,
          landingVisited: true,
          landingVisitedAt: new Date().toISOString(),
          checkoutClicked: false,
        };
        localStorage.setItem(REFERRAL_TRACKING_KEY, JSON.stringify(newTracking));
        setTracking(newTracking);
      }
    } else {
      // Se não há na URL, tentar carregar do localStorage
      const storedCode = localStorage.getItem(REFERRAL_CODE_KEY);
      if (storedCode) {
        setReferralCode(storedCode);
        
        // Carregar tracking existente
        const storedTracking = localStorage.getItem(REFERRAL_TRACKING_KEY);
        if (storedTracking) {
          try {
            setTracking(JSON.parse(storedTracking));
          } catch (e) {
            console.warn('Erro ao parsear tracking:', e);
          }
        }
      }
    }
  }, [searchParams]);

  // Marcar que o checkout foi clicado
  const trackCheckoutClick = useCallback(() => {
    if (referralCode) {
      const updatedTracking: ReferralTracking = {
        referralCode,
        landingVisited: tracking?.landingVisited || true,
        landingVisitedAt: tracking?.landingVisitedAt || new Date().toISOString(),
        checkoutClicked: true,
        checkoutClickedAt: new Date().toISOString(),
      };
      localStorage.setItem(REFERRAL_TRACKING_KEY, JSON.stringify(updatedTracking));
      setTracking(updatedTracking);
    }
  }, [referralCode, tracking]);

  // Obter URL de checkout com código de indicação
  const getCheckoutUrl = useCallback((planId?: string) => {
    // Se não há planId, redireciona para /plans (tela de planos)
    if (!planId) {
      return referralCode ? `/plans?ref=${referralCode}` : '/plans';
    }
    
    // Se há planId, vai direto para checkout
    const baseUrl = `/checkout?plan=${planId}`;
    if (referralCode) {
      return `${baseUrl}&ref=${referralCode}`;
    }
    return baseUrl;
  }, [referralCode]);

  // Limpar código de indicação (útil após processamento)
  const clearReferralCode = useCallback(() => {
    localStorage.removeItem(REFERRAL_CODE_KEY);
    localStorage.removeItem(REFERRAL_TRACKING_KEY);
    setReferralCode(null);
    setTracking(null);
  }, []);

  return {
    referralCode,
    tracking,
    trackCheckoutClick,
    getCheckoutUrl,
    clearReferralCode,
  };
};


